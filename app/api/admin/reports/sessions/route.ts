import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format')

  const sessions = await db.session.findMany({
    include: {
      student: { include: { user: { select: { name: true } } } },
      instructor: { include: { user: { select: { name: true } } } }
    },
    orderBy: { scheduledAt: 'desc' }
  })

  if (format === 'csv') {
    const headers = ['StudentName', 'InstructorName', 'LessonType', 'ScheduledAt', 'Status', 'Duration']
    const rows = sessions.map(s => [
      `"${s.student.user.name}"`,
      `"${s.instructor.user.name}"`,
      `"${s.lessonType}"`,
      new Date(s.scheduledAt).toISOString().split('T')[0],
      s.status,
      s.duration
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="sessions_report.csv"'
      }
    })
  }

  return NextResponse.json(sessions)
}
