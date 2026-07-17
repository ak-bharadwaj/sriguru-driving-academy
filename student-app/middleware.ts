import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const isSecure = process.env.NODE_ENV === 'production'
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
    secureCookie: isSecure
  })

  const { pathname } = request.nextUrl

  // Define public paths
  const isPublicPath = pathname === '/' ||
                       pathname === '/login' || 
                       pathname === '/forgot-password' || 
                       pathname === '/unauthorized' ||
                       pathname.startsWith('/api/auth') ||
                       pathname.startsWith('/api/public') ||
                       pathname.startsWith('/downloads')

  if (!token && !isPublicPath) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect root path to dashboard only if user is already logged in
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, icons etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.json|workbox-.*\\.js|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)',
  ]
}
