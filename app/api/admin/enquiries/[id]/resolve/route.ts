import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getToken } from 'next-auth/jwt'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const isSecure = req.url.startsWith('https://') || req.headers.get('x-forwarded-proto') === 'https'
    const token = await getToken({ 
      req: req as any, 
      secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890',
      secureCookie: isSecure
    })
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const inquiry = await db.inquiry.update({
      where: { id },
      data: { resolved: true }
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error('Failed to resolve inquiry:', error)
    return NextResponse.json({ error: 'Failed to resolve inquiry' }, { status: 500 })
  }
}
