import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getBranding } from '@/lib/data/academyStore'



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

    // Real DB Queries for badges
    const allBadges = await db.badge.findMany()
    const studentBadges = await db.studentBadge.findMany({
      where: { studentId: student.id },
      include: { badge: true }
    })

    const earnedBadgeIds = new Set(studentBadges.map(sb => sb.badgeId))

    const branding = getBranding()

    const earnedBadges = studentBadges.map(sb => ({
      id: sb.badge.id,
      name: sb.badge.name,
      description: sb.badge.description,
      iconName: sb.badge.icon,
      rarity: 'Common', // Currently not in schema, default to Common
      earnedAt: sb.earnedAt,
      customImage: sb.badge.type === 'COURSE_GRADUATE' ? branding.logoUrl : null
    }))

    const lockedBadges = allBadges
      .filter(b => !earnedBadgeIds.has(b.id))
      .map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        iconName: b.icon,
        rarity: 'Common',
        xpRequired: b.xpRequired,
        customImage: b.type === 'COURSE_GRADUATE' ? branding.logoUrl : null
      }))

    // Calculate progression towards next badge (simplistic based on XP required)
    let nextBadgeXp = 0
    const unearnedWithXp = lockedBadges.filter((b: any) => b.xpRequired > student.xp)
    if (unearnedWithXp.length > 0) {
      unearnedWithXp.sort((a: any, b: any) => a.xpRequired - b.xpRequired)
      nextBadgeXp = unearnedWithXp[0].xpRequired
    } else {
      nextBadgeXp = student.xp + 1000 // Fallback if no next badge is XP-based
    }

    return NextResponse.json({
      earnedBadges,
      lockedBadges,
      progress: {
        xp: student.xp,
        nextBadgeXp
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Badge Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}
