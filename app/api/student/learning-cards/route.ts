import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Query learning cards from the database using strict select projection
    const cards = await db.learningCard.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        phase: true,
        xpReward: true,
        steps: true,
        commonMistakes: true,
        instructorTips: true,
        safetyWarnings: true,
        quizQuestion: true,
        quizOptions: true,
        quizAnswer: true,
        orderIndex: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(cards, { status: 200 })
  } catch (error: any) {
    console.error('Learning cards API Error:', error)
    return NextResponse.json({ error: 'Failed to retrieve learning cards', details: error.message }, { status: 500 })
  }
}
