import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const isSecure = req.url.startsWith('https://') || req.headers.get('x-forwarded-proto') === 'https'
  
  // Extract all cookies to see what is sent
  const cookiesList: Record<string, string> = {}
  req.cookies.getAll().forEach(c => {
    cookiesList[c.name] = c.value
  })

  // Try to get token with secureCookie auto-detection
  const tokenAuto = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
    secureCookie: isSecure
  })

  // Try to get token with secureCookie forced to true
  const tokenSecure = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
    secureCookie: true
  })

  // Try to get token with secureCookie forced to false
  const tokenInsecure = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
    secureCookie: false
  })

  return NextResponse.json({
    url: req.url,
    isSecure,
    envNextAuthUrl: process.env.NEXTAUTH_URL || 'undefined',
    cookiesPresent: Object.keys(cookiesList),
    tokenAuto,
    tokenSecure,
    tokenInsecure
  })
}
