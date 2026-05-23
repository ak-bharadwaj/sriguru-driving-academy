import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

async function getInstructor() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'INSTRUCTOR') return null
  const userId = (session.user as any).id
  return db.instructor.findUnique({ where: { userId } })
}

export async function GET() {
  const instructor = await getInstructor()
  if (!instructor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notes = await db.coachingNote.findMany({
    where: { instructorId: instructor.id },
    include: {
      session: {
        include: {
          student: { include: { user: { select: { name: true } } } }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return NextResponse.json({
    notes: notes.map(n => ({
      id: n.id,
      note: n.note,
      createdAt: n.createdAt,
      sessionId: n.sessionId,
      session: {
        scheduledAt: n.session.scheduledAt,
        lessonType: n.session.lessonType
      },
      student: {
        name: n.session.student.user.name
      }
    }))
  })
}

export async function POST(req: Request) {
  const instructor = await getInstructor()
  if (!instructor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { sessionId, note } = body

  if (!note?.trim()) {
    return NextResponse.json({ error: 'Note is required' }, { status: 400 })
  }

  let resolvedSessionId = sessionId
  if (!resolvedSessionId) {
    const latestSession = await db.session.findFirst({
      where: { instructorId: instructor.id },
      orderBy: { scheduledAt: 'desc' }
    })
    if (!latestSession) {
      return NextResponse.json({ error: 'No sessions found to attach note to' }, { status: 400 })
    }
    resolvedSessionId = latestSession.id
  }

  const coaching = await db.coachingNote.create({
    data: {
      sessionId: resolvedSessionId,
      instructorId: instructor.id,
      note: note.trim()
    },
    include: {
      session: {
        include: {
          student: { include: { user: { select: { name: true } } } }
        }
      }
    }
  })

  return NextResponse.json({ success: true, note: coaching })
}
