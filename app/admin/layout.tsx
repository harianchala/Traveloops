"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plane, Menu, X } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          showSidebar ? "w-64" : "w-0"
        } bg-slate-900 text-white transition-all duration-300 overflow-hidden border-r`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Plane className="h-5 w-5" />
            </div>
            <span>Traveloop</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Management</h3>
            <Link href="/admin">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/destinations">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
              >
                Destinations
              </Button>
            </Link>
            <Link href="/admin/hotels">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
              >
                Hotels
              </Button>
            </Link>

            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6">Platform</h3>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
              >
                View Platform
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
                onClick={() => {
                  localStorage.removeItem("demo_user")
                }}
              >
                Logout
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="md:hidden">
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{user.name}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900">{children}</main>
      </div>
    </div>
  )
}
