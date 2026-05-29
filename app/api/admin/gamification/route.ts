export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!session || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
    }

    // 1. Fetch Global Gamification XP (Sum of all student XP)
    const stats = await db.student.aggregate({
      _sum: {
        xp: true
      }
    })
    const totalXP = stats._sum.xp || 0

    // 2. Fetch Leaderboard (top 5)
    const topStudents = await db.student.findMany({
      select: {
        id: true,
        xp: true,
        level: true,
        streakDays: true,
        user: {
          select: { name: true }
        }
      },
      orderBy: { xp: 'desc' },
      take: 5
    })

    const leaderboard = topStudents.map((s, idx) => ({
      rank: idx + 1,
      name: s.user.name || 'Unknown',
      xp: s.xp,
      level: s.level,
      badges: 0, // Badge count is loaded dynamically if needed
      streak: s.streakDays
    }))

    // 3. Dynamic Badge Distribution from the real database
    const [earnedBadges, badgeDetails] = await Promise.all([
      db.studentBadge.groupBy({
        by: ['badgeId'],
        _count: { studentId: true }
      }),
      db.badge.findMany()
    ])

    const badgeDistribution = badgeDetails.map(b => {
      const match = earnedBadges.find(eb => eb.badgeId === b.id)
      const count = match ? match._count.studentId : 0
      
      let color = 'text-primary'
      if (b.icon === 'ShieldCheck') color = 'text-success'
      if (b.icon === 'Star') color = 'text-accent'
      if (b.icon === 'Trophy') color = 'text-text-1'
      
      return {
        name: b.name,
        count,
        icon: b.icon,
        color
      }
    })

    return NextResponse.json({
      globalXP: totalXP >= 1000000 ? `${(totalXP / 1000000).toFixed(2)}M` : totalXP >= 1000 ? `${(totalXP / 1000).toFixed(1)}K` : totalXP.toString(),
      leaderboard,
      badgeDistribution
    }, { status: 200 })

  } catch (error) {
    console.error('Gamification Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch gamification stats' }, { status: 500 })
  }
}
