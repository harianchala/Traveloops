"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { notificationService, type NotificationData } from "@/lib/notifications"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  notifications: NotificationData[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  requestPermission: () => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function EnhancedNotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications)
      setUnreadCount(notificationService.getUnreadCount())
    })

    // Initialize with existing notifications
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    // Request notification permission on mount
    notificationService.requestPermission()

    // Simulate some initial notifications for demo
    setTimeout(() => {
      notificationService.showTripReminder("Tokyo Adventure", "March 15, 2024")
    }, 2000)

    setTimeout(() => {
      notificationService.showWeatherAlert("Paris", "Rain expected tomorrow")
    }, 5000)

    return unsubscribe
  }, [])

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id)
  }

  const markAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const removeNotification = (id: string) => {
    notificationService.removeNotification(id)
  }

  const clearAll = () => {
    notificationService.clearAll()
  }

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission()
    if (granted) {
      toast({
        title: "Notifications enabled",
        description: "You'll now receive browser notifications for important updates.",
      })
    } else {
      toast({
        title: "Notifications blocked",
        description: "Please enable notifications in your browser settings to receive updates.",
        variant: "destructive",
      })
    }
    return granted
  }

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
