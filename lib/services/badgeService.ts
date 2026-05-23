import { db } from '@/lib/db'
import { BadgeType } from '@prisma/client'

export const checkAndAwardBadges = async (studentId: string) => {
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      badges: {
        include: { badge: true }
      },
      xpEvents: true,
      quizAttempts: true,
      progress: true,
    }
  })

  if (!student) throw new Error('Student not found')

  const earnedBadgeTypes = new Set(student.badges.map(sb => sb.badge.type))
  const newAwards: string[] = []

  // Check ROAD_PRO (example condition: level >= 5)
  if (student.level >= 5 && !earnedBadgeTypes.has('ROAD_PRO')) {
    const badge = await db.badge.findUnique({ where: { type: 'ROAD_PRO' } })
    if (badge) {
      await db.studentBadge.create({
        data: {
          studentId,
          badgeId: badge.id
        }
      })
      newAwards.push(badge.name)
    }
  }

  // Check CONSISTENT_LEARNER (example condition: streakDays >= 7)
  if (student.streakDays >= 7 && !earnedBadgeTypes.has('CONSISTENT_LEARNER')) {
    const badge = await db.badge.findUnique({ where: { type: 'CONSISTENT_LEARNER' } })
    if (badge) {
      await db.studentBadge.create({
        data: {
          studentId,
          badgeId: badge.id
        }
      })
      newAwards.push(badge.name)
    }
  }

  // Check QUIZ_MASTER (example condition: 5 successful quiz attempts)
  const successfulQuizzes = student.quizAttempts.filter(q => q.correct).length
  if (successfulQuizzes >= 5 && !earnedBadgeTypes.has('QUIZ_MASTER')) {
    const badge = await db.badge.findUnique({ where: { type: 'QUIZ_MASTER' } })
    if (badge) {
      await db.studentBadge.create({
        data: {
          studentId,
          badgeId: badge.id
        }
      })
      newAwards.push(badge.name)
    }
  }

  // Additional badges can be implemented here...
  
  // Create notifications for newly earned badges
  if (newAwards.length > 0) {
    for (const award of newAwards) {
      await db.notification.create({
        data: {
          userId: student.userId,
          studentId: student.id,
          type: 'BADGE_EARNED',
          title: 'New Badge Unlocked!',
          message: `Congratulations! You've earned the ${award} badge. Keep up the great work!`,
        }
      })
    }
  }

  return newAwards
}
