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
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/login', request.url)
    // Save the original intended destination
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
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
