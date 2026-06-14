import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const isSecure = request.url.startsWith('https://') || request.headers.get('x-forwarded-proto') === 'https'
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
    secureCookie: isSecure
  })
  
  const { pathname } = request.nextUrl

  // If there's no token, redirect to login
  if (!token) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/login', request.url)
    // Save the original intended destination
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = (token.role as string) || 'STUDENT'

  // Enforce role authorization for pages & APIs
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (pathname.startsWith('/instructor') || pathname.startsWith('/api/instructor')) {
    if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (pathname.startsWith('/student') || pathname.startsWith('/api/student')) {
    if (role !== 'STUDENT' && role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Redirect root role paths to their respective dashboards
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  if (pathname === '/instructor') {
    return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
  }
  if (pathname === '/student') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url))
  }

  return NextResponse.next()
}

// Map the routes that must trigger this middleware
export const config = {
  matcher: [
    '/student/:path*',
    '/instructor/:path*',
    '/admin/:path*',
    '/api/student/:path*',
    '/api/instructor/:path*',
    '/api/admin/:path*',
    '/dashboard'
  ]
}
