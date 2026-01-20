"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function LoginPage() {
  const { user, loading: authLoading, signIn } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect logged-in users
  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard")
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn(email, password)
    if (result.error) setError(result.error)
    else router.replace("/dashboard")

    setLoading(false)
  }

  if (authLoading) return <p>Loading...</p>

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  )
}
