export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

async function getInstructorId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'INSTRUCTOR') return null
  const userId = (session.user as any).id
  const instructor = await db.instructor.findUnique({
    where: { userId },
    select: { id: true }
  })
  return instructor?.id ?? null
}

export async function GET() {
  const instructorId = await getInstructorId()
  if (!instructorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notes = await db.coachingNote.findMany({
    where: { instructorId },
    select: {
      id: true,
      note: true,
      createdAt: true,
      sessionId: true,
      session: {
        select: {
          scheduledAt: true,
          lessonType: true,
          student: {
            select: { user: { select: { name: true } } }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  const response = NextResponse.json({
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
  response.headers.set('Cache-Control', 'private, max-age=15, stale-while-revalidate=60')
  return response
}

export async function POST(req: Request) {
  const instructorId = await getInstructorId()
  if (!instructorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { sessionId, note } = body

  if (!note?.trim()) {
    return NextResponse.json({ error: 'Note is required' }, { status: 400 })
  }

  let resolvedSessionId = sessionId
  if (!resolvedSessionId) {
    const latestSession = await db.session.findFirst({
      where: { instructorId },
      orderBy: { scheduledAt: 'desc' },
      select: { id: true }
    })
    if (!latestSession) {
      return NextResponse.json({ error: 'No sessions found to attach note to' }, { status: 400 })
    }
    resolvedSessionId = latestSession.id
  }

  const coaching = await db.coachingNote.create({
    data: {
      sessionId: resolvedSessionId,
      instructorId,
      note: note.trim()
    },
    select: {
      id: true,
      note: true,
      createdAt: true,
      sessionId: true,
      session: {
        select: {
          scheduledAt: true,
          lessonType: true,
          student: { select: { user: { select: { name: true } } } }
        }
      }
    }
  })

  return NextResponse.json({ success: true, note: coaching })
}
