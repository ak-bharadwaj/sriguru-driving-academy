export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden. Student credentials required.' }, { status: 403 })
    }

    // Fetch top 50 students ordered by XP
    const students = await db.student.findMany({
      select: {
        id: true,
        xp: true,
        level: true,
        streakDays: true,
        user: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        xp: 'desc'
      },
      take: 50
    })

    const formattedLeaderboard = students.map((s, index) => ({
      rank: index + 1,
      id: s.id,
      name: s.user.name,
      avatar: s.user.avatarUrl || null,
      xp: s.xp,
      level: s.level,
      streak: s.streakDays,
      trend: 'stable'
    }))

    return NextResponse.json(formattedLeaderboard, { status: 200 })
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
