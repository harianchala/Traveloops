import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // 🚫 Logged-in users should NOT see auth pages
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 🔒 Protect dashboard
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
}
