"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ✅ Sign in function
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }

    // Update state immediately after login
    setUser(data.user ?? null)

    // Redirect after successful login
    router.replace("/dashboard")

    return {}
  }

  // ✅ Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) return { error: error.message }

    setUser(data.user ?? null)
    return {}
  }

  // ✅ Sign out function
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.replace("/auth/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
