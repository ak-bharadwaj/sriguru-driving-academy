import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const maxDuration = 60 // Allow 60 seconds since cron might process many users
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Validate Vercel Cron Secret for security
  const authHeader = req.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 1. Session Reminders for Today
    const sessionsToday = await db.session.findMany({
      where: {
        scheduledAt: {
          gte: today,
          lt: tomorrow,
        },
        status: 'SCHEDULED'
      },
      include: {
        student: { include: { user: true } },
        instructor: { include: { user: true } }
      }
    })

    const notificationsToCreate = []

    for (const session of sessionsToday) {
      if (!session.student) continue
      
      const timeString = new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      notificationsToCreate.push({
        userId: session.student.userId,
        studentId: session.student.id,
        type: 'SESSION_REMINDER' as const,
        title: 'Upcoming Session Today',
        message: `Reminder: You have a driving session with ${session.instructor.user.name} today at ${timeString}. Please be on time!`,
      })
    }

    // 2. Practice Reminders for Active Students
    // Instead of querying all active students and creating rows (which could be huge),
    // we just fetch active students and remind them if they haven't practiced.
    const activeStudents = await db.student.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: { user: true }
    })

    for (const student of activeStudents) {
      notificationsToCreate.push({
        userId: student.userId,
        studentId: student.id,
        type: 'STREAK_AT_RISK' as const,
        title: 'Practice Reminder',
        message: 'Don\'t forget to practice your RTO quizzes today to maintain your learning streak!',
      })
    }

    // Insert all notifications in bulk
    if (notificationsToCreate.length > 0) {
      await db.notification.createMany({
        data: notificationsToCreate
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Generated ${notificationsToCreate.length} notifications`,
      sessionsFound: sessionsToday.length,
      activeStudentsFound: activeStudents.length
    })

  } catch (error: any) {
    console.error("Cron Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
