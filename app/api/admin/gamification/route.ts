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
      badges: 0, // Badge relation not fully fleshed out in schema yet
      streak: s.streakDays
    }))

    // 3. Badge Distribution Mock (Since we don't have Badge tracking table seeded)
    const badgeDistribution = [
      { name: 'Perfect Attendance', count: 142, icon: 'ShieldCheck', color: 'text-success' },
      { name: 'Theory Expert', count: 89, icon: 'Award', color: 'text-primary' },
      { name: 'Steering Maestro', count: 45, icon: 'Star', color: 'text-accent' },
      { name: 'Slope Conqueror', count: 12, icon: 'Trophy', color: 'text-text-1' }
    ]

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
