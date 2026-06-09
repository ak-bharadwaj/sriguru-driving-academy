export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { BadgeType } from '@prisma/client'
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
        level: true,
        user: {
          select: {
            name: true
          }
        }
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

    const RARITY_MAP: Record<string, string> = {
      PARKING_EXPERT: 'Rare',
      SIGNAL_MASTER: 'Common',
      ELITE_DRIVER: 'Legendary',
      PERFECT_ATTENDANCE: 'Common',
      ROAD_PRO: 'Rare',
      CONSISTENT_LEARNER: 'Common',
      SAFETY_CHAMPION: 'Rare',
      QUIZ_MASTER: 'Rare',
      COURSE_GRADUATE: 'Legendary'
    }
    
    const earnedBadges = studentBadges.map(sb => ({
      id: sb.badge.id,
      type: sb.badge.type,
      name: sb.badge.name,
      description: sb.badge.description,
      iconName: sb.badge.icon,
      rarity: RARITY_MAP[sb.badge.type] || 'Common',
      unlockedAt: sb.earnedAt
    }))

    let lockedBadges = allDbBadges
      .filter(b => !earnedBadgeIds.includes(b.id))
      .map(b => ({
        id: b.id,
        type: b.type,
        name: b.name,
        description: b.description,
        iconName: b.icon,
        rarity: RARITY_MAP[b.type] || 'Common'
      }))

    // Provide some defaults if the DB is empty, so the UI doesn't look empty
    if (allDbBadges.length === 0) {
      const mockBadges = [
        { id: 'b1', type: BadgeType.PARKING_EXPERT, name: 'Parking Expert', description: 'Mastered all parking techniques.', iconName: 'parking', rarity: 'Rare' },
        { id: 'b2', type: BadgeType.SIGNAL_MASTER, name: 'Signal Master', description: 'Scored 100% on signal quiz.', iconName: 'traffic-light', rarity: 'Common' },
        { id: 'b3', type: BadgeType.ELITE_DRIVER, name: 'Elite Driver', description: 'Reached Level 10.', iconName: 'star', rarity: 'Legendary' },
        { id: 'b4', type: BadgeType.PERFECT_ATTENDANCE, name: 'Perfect Attendance', description: '10 sessions without absence.', iconName: 'calendar-check', rarity: 'Common' }
      ]
      lockedBadges = mockBadges
    }

    return NextResponse.json({
      studentName: student.user.name,
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
