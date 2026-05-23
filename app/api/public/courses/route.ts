import { NextResponse } from 'next/server'
import { getCourses } from '@/lib/data/academyStore'

export async function GET() {
  try {
    const activeCourses = getCourses().filter(c => c.active)
    return NextResponse.json(activeCourses, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to retrieve courses', details: message }, { status: 500 })
  }
}
