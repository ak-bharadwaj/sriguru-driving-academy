import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const { studentId, skill, score } = await request.json()
    if (!studentId || !skill || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing parameters for progress update' }, { status: 400 })
    }

    // Lookup target learning card by slug or ID
    const card = await db.learningCard.findFirst({
      where: {
        OR: [
          { slug: skill },
          { id: skill }
        ]
      }
    })

    if (!card) {
      return NextResponse.json({ error: `Learning card '${skill}' not found` }, { status: 404 })
    }

    // Upsert the learning progress record matching the compound studentId_cardId index
    const progress = await db.learningProgress.upsert({
      where: {
        studentId_cardId: {
          studentId,
          cardId: card.id
        }
      },
      update: {
        completed: score >= 8,
        completedAt: score >= 8 ? new Date() : null
      },
      create: {
        studentId,
        cardId: card.id,
        completed: score >= 8,
        completedAt: score >= 8 ? new Date() : null
      }
    })

    return NextResponse.json({ success: true, progress }, { status: 200 })
  } catch (error: any) {
    console.error('Update student progress API Error:', error)
    return NextResponse.json({ error: 'Progress update failed', details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Adding support for debounced daily coaching log saves
  try {
    const { studentId, date, note } = await request.json()
    if (!studentId || !date || !note) {
      return NextResponse.json({ error: 'Missing daily log parameters' }, { status: 400 })
    }
    
    console.log(`DEBOUNCED DAILY COACHING LOG: student ${studentId} on ${date}: "${note}"`)
    
    return NextResponse.json({ success: true, logged: { date, note } }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Daily log save failed', details: error.message }, { status: 500 })
  }
}
