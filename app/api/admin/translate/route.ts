export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text, targetLang } = await request.json()
    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 })
    }

    const langCodeMap: Record<string, string> = {
      EN: 'en',
      HI: 'hi',
      TE: 'te',
      en: 'en',
      hi: 'hi',
      te: 'te'
    }

    const targetCode = langCodeMap[targetLang] || 'en'
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(
        text
      )}`
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Translation request failed' }, { status: 500 })
    }

    const data = await res.json()
    const translation = data?.[0]?.[0]?.[0] || text

    return NextResponse.json({ translation })
  } catch (err) {
    console.error('Translation Error:', err)
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 })
  }
}
