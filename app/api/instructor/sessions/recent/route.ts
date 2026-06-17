export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = (session.user as any).id
  const instructor = await db.instructor.findUnique({
    where: { userId },
    select: { id: true }
  })
  if (!instructor) return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })

  const sessions = await db.session.findMany({
    where: { instructorId: instructor.id },
    select: {
      id: true,
      lessonType: true,
      scheduledAt: true,
      status: true,
      student: {
        select: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { scheduledAt: 'desc' },
    take: 20
  })

  return NextResponse.json(
    sessions.map(s => ({
      id: s.id,
      lessonType: s.lessonType,
      scheduledAt: s.scheduledAt,
      status: s.status,
      studentName: s.student.user.name
    })),
    {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
      }
    }
  )
}
