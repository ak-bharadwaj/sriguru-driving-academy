// Learning cards are 100% static content — no DB query needed.
// Student progress (completed/quizPassed) is tracked separately in /api/student/gamification.
// This eliminates ~1 Neon query per student page visit.
import { NextResponse } from 'next/server'
import { LEARNING_CARDS } from '@/lib/data/learning-cards-data'

export async function GET() {
  return NextResponse.json(LEARNING_CARDS, {
    status: 200,
    headers: {
      // Cache for 7 days at CDN level — content never changes without a redeploy
      'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400'
    }
  })
}
