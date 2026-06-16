export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

import { DEFAULT_SYLLABUS } from '@/lib/data/syllabusData'


export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const trainingType = (url.searchParams.get('type') || 'BEGINNER').toUpperCase()

    const days = await db.syllabusDay.findMany({
      where: { trainingType: trainingType as any },
      orderBy: { dayNumber: 'asc' }
    })

    if (days.length > 0) {
      return NextResponse.json(days)
    }

    // Fallback to defaults if DB empty for this type
    const fallback = DEFAULT_SYLLABUS[trainingType as keyof typeof DEFAULT_SYLLABUS] || DEFAULT_SYLLABUS.BEGINNER
    return NextResponse.json(fallback.map((d, i) => ({ id: `default-${i}`, ...d, trainingType })))
  } catch (error) {
    console.error('Public Syllabus GET Error:', error)
    // Always return something usable
    const fallback = DEFAULT_SYLLABUS['BEGINNER']
    return NextResponse.json(fallback.map((d, i) => ({ id: `default-${i}`, ...d, trainingType: 'BEGINNER' })))
  }
}
