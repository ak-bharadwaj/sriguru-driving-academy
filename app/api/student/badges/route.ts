export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        xp: true,
        level: true
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch actual badges from DB
    const studentBadges = await db.studentBadge.findMany({
      where: { studentId: student.id },
      include: { badge: true }
    })
    
    const allDbBadges = await db.badge.findMany()
    
    const earnedBadgeIds = studentBadges.map(sb => sb.badgeId)
    
    let earnedBadges = studentBadges.map(sb => ({
      id: sb.badge.id,
      name: sb.badge.name,
      description: sb.badge.description,
      iconName: sb.badge.icon,
      rarity: 'Legendary',
      unlockedAt: sb.earnedAt
    }))

    let lockedBadges = allDbBadges
      .filter(b => !earnedBadgeIds.includes(b.id))
      .map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        iconName: b.icon,
        rarity: 'Rare'
      }))

    // Provide some defaults if the DB is empty, so the UI doesn't look empty
    if (allDbBadges.length === 0) {
      const mockBadges = [
        { id: 'b1', name: 'First Ignition', description: 'Complete your first drive session.', iconName: 'Star', rarity: 'Common' },
        { id: 'b2', name: 'Flawless Parker', description: 'Execute a perfect parallel park 3 times.', iconName: 'Car', rarity: 'Epic' },
        { id: 'b4', name: 'Night Owl', description: 'Complete 5 night driving sessions.', iconName: 'Moon', rarity: 'Uncommon' },
        { id: 'b5', name: 'Steering Master', description: 'Demonstrate advanced steering control.', iconName: 'Shield', rarity: 'Legendary' }
      ]
      lockedBadges = mockBadges
    }

    return NextResponse.json({
      earnedBadges,
      lockedBadges,
      progress: {
        xp: student.xp,
        nextBadgeXp: (earnedBadges.length + 1) * 2000
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Badge Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}
