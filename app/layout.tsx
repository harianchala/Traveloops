import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { TripProvider } from "@/lib/trip-context"
import { DatabaseProvider } from "@/lib/database-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Traveloop - AI-Powered Travel Planning",
  description: "Plan your perfect trip with AI assistance, real-time weather, and local events.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DatabaseProvider>
            <AuthProvider>
              <TripProvider>
                <NotificationProvider>
                  {children}
                  <Toaster />
                </NotificationProvider>
              </TripProvider>
            </AuthProvider>
          </DatabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
