// src/middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { rbacMiddleware } from "./middleware/rbac"

const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up", "/reset-password"]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  // Get the session
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthPage = request.nextUrl.pathname === "/sign-in" || 
                     request.nextUrl.pathname === "/sign-up" || 
                     request.nextUrl.pathname.startsWith("/reset-password")
  const isPublicPath = PUBLIC_PATHS.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  )

  // Apply RBAC middleware for protected routes
  if (!isPublicPath && !isAuthPage) {
    const rbacResponse = await rbacMiddleware(request);
    if (rbacResponse) {
      return rbacResponse;
    }
  }

  // Redirect to dashboard if user is signed in and tries to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect to sign-in if user is not signed in and tries to access protected pages
  if (!session && !isPublicPath) {
    const redirectUrl = new URL("/sign-in", request.url)
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}