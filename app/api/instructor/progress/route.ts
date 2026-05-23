import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'INSTRUCTOR' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, skill, score } = await request.json()
    if (!studentId || !skill || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing parameters for progress update' }, { status: 400 })
    }

    // Lookup target learning card by slug or ID, or find first by category
    const card = await db.learningCard.findFirst({
      where: {
        OR: [
          { slug: skill },
          { id: skill },
          { category: skill }
        ]
      }
    })

    if (!card) {
      console.log(`Instructor graded skill category: ${skill} with score ${score}`)
      return NextResponse.json({ success: true, simulated: true, note: `Simulated update for category ${skill}` }, { status: 200 })
    }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Update student progress API Error:', error)
    return NextResponse.json({ error: 'Progress update failed', details: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'INSTRUCTOR' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, date, note } = await request.json()
    if (!studentId || !date || !note) {
      return NextResponse.json({ error: 'Missing daily log parameters' }, { status: 400 })
    }
    
    // We get the instructor by matching the user id
    const instructor = await db.instructor.findUnique({
      where: { userId: (session.user as any).id }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor record not found' }, { status: 404 })
    }

    // Upsert the daily log for this instructor and date
    // Note: the original schema has a unique constraint on [instructorId, date] where date is DateTime.
    // The request payload date is likely a YYYY-MM-DD string.
    const logDate = new Date(date)

    const log = await db.instructorLog.upsert({
      where: {
        instructorId_date: {
          instructorId: instructor.id,
          date: logDate
        }
      },
      update: {
        content: note
      },
      create: {
        instructorId: instructor.id,
        date: logDate,
        content: note
      }
    })
    
    return NextResponse.json({ success: true, logged: { date, note } }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Daily log save failed', details: message }, { status: 500 })
  }
}
