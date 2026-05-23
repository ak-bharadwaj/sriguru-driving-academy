import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized. User ID not found.' }, { status: 401 })
    }

    const instructor = await db.instructor.findUnique({
      where: { userId: user.id }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
    }

    const sessions = await db.session.findMany({
      where: { instructorId: instructor.id },
      include: {
        student: {
          select: {
            id: true,
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { scheduledAt: 'asc' }
    })

    const formatted = sessions.map((item) => ({
      id: item.id,
      scheduledAt: item.scheduledAt.toISOString(),
      duration: item.duration,
      status: item.status,
      lessonType: item.lessonType,
      notes: item.notes,
      student: {
        id: item.student.id,
        name: item.student.user.name,
        email: item.student.user.email
      }
    }))

    return NextResponse.json({ sessions: formatted }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Instructor sessions query Error:', error)
    return NextResponse.json({ error: 'Failed to load sessions', details: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized. User ID not found.' }, { status: 401 })
    }

    const instructor = await db.instructor.findUnique({
      where: { userId: user.id }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { studentId, scheduledAt, duration, lessonType, notes } = body

    if (!studentId || !scheduledAt || !lessonType) {
      return NextResponse.json({ error: 'Missing required session fields' }, { status: 400 })
    }

    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { instructorId: true }
    })

    if (!student || student.instructorId !== instructor.id) {
      return NextResponse.json({ error: 'Unauthorized. Student not assigned to instructor.' }, { status: 403 })
    }

    const scheduledDate = new Date(scheduledAt)
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduled date' }, { status: 400 })
    }

    const sessionRecord = await db.session.create({
      data: {
        studentId,
        instructorId: instructor.id,
        scheduledAt: scheduledDate,
        duration: typeof duration === 'number' ? duration : 60,
        lessonType,
        notes: notes || null
      }
    })

    return NextResponse.json({ success: true, session: sessionRecord }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Create session API Error:', error)
    return NextResponse.json({ error: 'Failed to create session', details: message }, { status: 500 })
  }
}
