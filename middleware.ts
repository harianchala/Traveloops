// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: req.cookies }
  )

  const { data } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname

  // Only protect /dashboard
  if (path.startsWith("/dashboard") && !data.session) {
    const url = req.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
