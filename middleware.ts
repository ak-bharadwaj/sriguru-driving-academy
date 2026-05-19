import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890' 
  })
  
  const { pathname } = request.nextUrl

  // If there's no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    // Save the original intended destination
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role as string

  // Protect /admin routes -> ADMIN role required
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Protect /instructor routes -> INSTRUCTOR or ADMIN required
  if (pathname.startsWith('/instructor') && role !== 'INSTRUCTOR' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Protect /student routes & /dashboard -> STUDENT or ADMIN required
  if ((pathname.startsWith('/student') || pathname === '/dashboard') && role !== 'STUDENT' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

// Map the routes that must trigger this middleware
export const config = {
  matcher: [
    '/student/:path*',
    '/instructor/:path*',
    '/admin/:path*',
    '/dashboard'
  ]
}
