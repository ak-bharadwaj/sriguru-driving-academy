import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    const sessionId = params.id
    const payload = await request.json()
    const { scheduledAt, duration, lessonType, status, notes } = payload

    const target = await db.session.findUnique({
      where: { id: sessionId }
    })

    if (!target) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (target.instructorId !== instructor.id) {
      return NextResponse.json({ error: 'Unauthorized. Session not assigned to instructor.' }, { status: 403 })
    }

    const updateData: {
      scheduledAt?: Date
      duration?: number
      lessonType?: string
      status?: any
      notes?: string | null
      completedAt?: Date | null
    } = {}

    if (scheduledAt) {
      const parsed = new Date(scheduledAt)
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: 'Invalid scheduled date' }, { status: 400 })
      }
      updateData.scheduledAt = parsed
    }

    if (typeof duration === 'number') updateData.duration = duration
    if (lessonType) updateData.lessonType = lessonType
    if (typeof notes === 'string') updateData.notes = notes
    if (notes === null) updateData.notes = null

    if (status) {
      updateData.status = status
      updateData.completedAt = status === 'COMPLETED' ? new Date() : null
    }

    const updated = await db.session.update({
      where: { id: sessionId },
      data: updateData
    })

    return NextResponse.json({ success: true, session: updated }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Update session API Error:', error)
    return NextResponse.json({ error: 'Failed to update session', details: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
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

    const sessionId = params.id
    const target = await db.session.findUnique({
      where: { id: sessionId }
    })

    if (!target) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (target.instructorId !== instructor.id) {
      return NextResponse.json({ error: 'Unauthorized. Session not assigned to instructor.' }, { status: 403 })
    }

    const deleted = await db.session.delete({
      where: { id: sessionId }
    })

    return NextResponse.json({ success: true, session: deleted }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Delete session API Error:', error)
    return NextResponse.json({ error: 'Failed to delete session', details: message }, { status: 500 })
  }
}
