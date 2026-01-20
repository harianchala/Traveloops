import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  )

  const { data } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // Allow auth, API, and _next routes
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return response
  }

  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !data.session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = { matcher: ["/dashboard/:path*"] }
