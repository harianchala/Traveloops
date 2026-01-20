import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
<<<<<<< HEAD
  let response = NextResponse.next()

=======
  // Prepare response
  const response = NextResponse.next()

  // ✅ Create Supabase server client using request cookies
>>>>>>> 7e186a3 (updates)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  )

<<<<<<< HEAD
=======
  // Get the current session
>>>>>>> 7e186a3 (updates)
  const { data } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

<<<<<<< HEAD
  const pathname = request.nextUrl.pathname

  // ✅ ALLOW auth-related routes ALWAYS
=======
  // ✅ Allow auth-related routes, API routes, and static assets always
>>>>>>> 7e186a3 (updates)
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return response
  }

<<<<<<< HEAD
  // ✅ Protect dashboard only AFTER session exists
=======
  // ✅ Protect dashboard routes: redirect to login if no session
>>>>>>> 7e186a3 (updates)
  if (pathname.startsWith("/dashboard") && !data.session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Allow everything else
  return response
}

// Specify which routes to protect
export const config = {
  matcher: ["/dashboard/:path*"],
}
