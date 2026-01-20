"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChatWidget } from "@/components/chat/chat-widget"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => toggleSidebar()} className="lg:hidden">
              <PanelLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-sm md:text-base">Welcome to Traveloop</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800">
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your travel experience...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
      <ChatWidget />
    </SidebarProvider>
  )
}
