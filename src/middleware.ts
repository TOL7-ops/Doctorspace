import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()

    // Handle auth state
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api/')

    // Allow public routes and API routes
    if (isPublicRoute || isAuthRoute || isApiRoute) {
      // If user is logged in and trying to access auth pages, redirect to dashboard
      if (session && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return response
    }

    // Protected routes - redirect to login if not authenticated
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // User is authenticated, allow access to protected routes
    return response
  } catch (e) {
    console.error('Middleware error:', e)
    // On error, allow the request to continue
    return response
  }
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 