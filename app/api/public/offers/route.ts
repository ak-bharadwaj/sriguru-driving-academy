import { NextResponse } from 'next/server'
import { getOffers } from '@/lib/data/academyStore'

export async function GET() {
  try {
    const activeOffers = getOffers().filter(o => o.active)
    return NextResponse.json(activeOffers, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to retrieve promotional offers', details: message }, { status: 500 })
  }
}
