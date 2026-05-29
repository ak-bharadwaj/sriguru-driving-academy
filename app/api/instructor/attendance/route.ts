import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AttendanceStatus } from '@prisma/client'

export async function POST(request: Request) {
  try {
    // 0. Security Audit check: verify INSTRUCTOR role in active session
    const authSession = await getServerSession(authOptions)
    const user = authSession?.user as { id?: string; role?: string } | undefined
    if (!authSession || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }
 
    const userId = user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. User ID not found.' }, { status: 401 })
    }
    const instructor = await db.instructor.findUnique({
      where: { userId }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Forbidden. Instructor profile not found.' }, { status: 403 })
    }

    const { studentId, sessionId, status } = await request.json()
    if (!studentId || !sessionId || !status) {
      return NextResponse.json({ error: 'Missing mandatory attendance parameters' }, { status: 400 })
    }

    // Map string status to AttendanceStatus enum
    let attendanceStatus: AttendanceStatus = AttendanceStatus.PRESENT
    const upperStatus = status.toUpperCase()
    if (upperStatus === 'ABSENT') {
      attendanceStatus = AttendanceStatus.ABSENT
    } else if (upperStatus === 'LATE') {
      attendanceStatus = AttendanceStatus.LATE
    }

    // 1. Locate the session to verify existence and check ownership
    const session = await db.session.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json({ error: 'Target session slot not found' }, { status: 404 })
    }

    // Security Check: Enforce that the instructor must be assigned to this session
    if (session.instructorId !== instructor.id) {
      return NextResponse.json({ error: 'Unauthorized. This session is assigned to another instructor.' }, { status: 403 })
    }

    // 2. Create or Update attendance registry record
    const attendance = await db.attendance.upsert({
      where: { sessionId },
      update: {
        status: attendanceStatus,
        markedBy: instructor.id
      },
      create: {
        sessionId,
        studentId,
        status: attendanceStatus,
        markedBy: instructor.id
      }
    })

    // 3. Mark session status as completed
    await db.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' }
    })

    // 4. Create Notification for the student
    await db.notification.create({
      data: {
        userId: studentId,
        title: 'Attendance Marked',
        message: `Your instructor marked you as ${attendanceStatus} for the recent session.`,
        type: 'SESSION_REMINDER',
        isRead: false
      }
    })

    return NextResponse.json({ success: true, attendance }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Mark attendance API Error:', error)
    return NextResponse.json({ error: 'Failed to record attendance', details: message }, { status: 500 })
  }
}
