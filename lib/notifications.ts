export interface NotificationData {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
}

export class NotificationService {
  private static instance: NotificationService
  private notifications: NotificationData[] = []
  private subscribers: ((notifications: NotificationData[]) => void)[] = []

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Request permission for browser notifications
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission === "denied") {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  // Show browser notification
  showBrowserNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      })

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }

  // Add notification to the list
  addNotification(notification: Omit<NotificationData, "id" | "timestamp" | "read">): string {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    this.notifySubscribers()

    // Show browser notification if permission granted
    this.showBrowserNotification(notification.title, {
      body: notification.message,
      tag: newNotification.id,
    })

    return newNotification.id
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifySubscribers()
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.notifySubscribers()
  }

  // Remove notification
  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.notifySubscribers()
  }

  // Clear all notifications
  clearAll() {
    this.notifications = []
    this.notifySubscribers()
  }

  // Get all notifications
  getNotifications(): NotificationData[] {
    return [...this.notifications]
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  // Subscribe to notification changes
  subscribe(callback: (notifications: NotificationData[]) => void) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback([...this.notifications]))
  }

  // Predefined notification types
  showTripReminder(tripName: string, date: string) {
    this.addNotification({
      title: "Trip Reminder",
      message: `Your trip to ${tripName} is coming up on ${date}!`,
      type: "info",
      actionUrl: "/dashboard/trips",
      actionText: "View Trip",
    })
  }

  showWeatherAlert(city: string, condition: string) {
    this.addNotification({
      title: "Weather Alert",
      message: `Weather update for ${city}: ${condition}`,
      type: "warning",
      actionUrl: "/dashboard/weather",
      actionText: "Check Weather",
    })
  }

  showEventReminder(eventName: string, time: string) {
    this.addNotification({
      title: "Event Reminder",
      message: `${eventName} starts at ${time}`,
      type: "info",
      actionUrl: "/dashboard/events",
      actionText: "View Events",
    })
  }

  showPriceAlert(destination: string, newPrice: string) {
    this.addNotification({
      title: "Price Alert",
      message: `Price drop for ${destination}! Now ${newPrice}`,
      type: "success",
      actionUrl: "/dashboard/destinations",
      actionText: "Book Now",
    })
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()
