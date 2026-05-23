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

    // 1. Fetch Global Gamification XP
    const stats = await db.student.aggregate({ _sum: { xp: true } })
    const totalXP = stats._sum.xp || 0

    // 2. Fetch Leaderboard (top 5) with actual badges
    const topStudents = await db.student.findMany({
      select: {
        xp: true,
        level: true,
        streakDays: true,
        user: { select: { name: true } },
        badges: { select: { id: true } }
      },
      orderBy: { xp: 'desc' },
      take: 5
    })

    const leaderboard = topStudents.map((s, idx) => ({
      rank: idx + 1,
      name: s.user.name || 'Unknown',
      xp: s.xp,
      level: s.level,
      badges: s.badges.length,
      streak: s.streakDays
    }))

    // 3. Real Badge Distribution
    const dbBadges = await db.badge.findMany({
      include: {
        _count: {
          select: { students: true }
        }
      },
      orderBy: {
        students: { _count: 'desc' }
      },
      take: 4
    })

    let badgeDistribution = dbBadges.map(b => ({
      name: b.name,
      count: b._count.students,
      icon: b.icon,
      color: 'text-primary' // We can expand color logic if we add it to the schema
    }))

    if (badgeDistribution.length === 0) {
      // Fallback empty state if no badges exist in DB
      badgeDistribution = [
        { name: 'No Badges Yet', count: 0, icon: 'ShieldCheck', color: 'text-text-3' }
      ]
    }

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
