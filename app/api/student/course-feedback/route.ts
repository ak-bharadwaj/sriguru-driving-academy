import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BadgeType } from '@prisma/client'
import { getBranding } from '@/lib/data/academyStore'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const student = await db.student.findUnique({
      where: { userId }
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const { rating, comment } = await req.json()

    // 1. Create Feedback
    const feedback = await db.courseFeedback.create({
      data: {
        studentId: student.id,
        rating,
        comment
      }
    })

    // 2. Check if they already have the COURSE_GRADUATE badge
    const existingBadge = await db.studentBadge.findFirst({
      where: {
        studentId: student.id,
        badge: {
          type: 'COURSE_GRADUATE'
        }
      }
    })

    // 3. Award Badge if they don't have it
    let badgeAwarded = null
    if (!existingBadge) {
      // Find or create the badge
      let badge = await db.badge.findUnique({
        where: { type: 'COURSE_GRADUATE' }
      })
      if (!badge) {
        badge = await db.badge.create({
          data: {
            type: 'COURSE_GRADUATE',
            name: 'Course Graduate',
            description: 'Successfully completed the driving course and provided feedback.',
            icon: 'award', // Default fallback
            xpReward: 500
          }
        })
      }

      await db.studentBadge.create({
        data: {
          studentId: student.id,
          badgeId: badge.id
        }
      })

      // Add XP for graduation
      await db.student.update({
        where: { id: student.id },
        data: { xp: { increment: badge.xpReward } }
      })

      const branding = getBranding()
      badgeAwarded = {
        ...badge,
        customImage: branding.logoUrl || null
      }
    }

    return NextResponse.json({ success: true, feedback, badgeAwarded })

  } catch (error) {
    console.error("Course feedback error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
