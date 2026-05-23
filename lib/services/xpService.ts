import { db } from '@/lib/db'
import { checkAndAwardBadges } from './badgeService'

// Thresholds for each level (example: level 1 = 0 XP, level 2 = 100 XP, level 3 = 300 XP, etc.)
export const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1
  if (xp < 300) return 2
  if (xp < 600) return 3
  if (xp < 1000) return 4
  if (xp < 1500) return 5
  return Math.floor((Math.sqrt(2 * xp - 75) + 5) / 10) + 2 // A basic curve for higher levels
}

export const addXP = async (studentId: string, amount: number, reason: string) => {
  if (amount <= 0) return null

  return await db.$transaction(async (tx) => {
    // 1. Create XP Event
    await tx.xPEvent.create({
      data: {
        studentId,
        amount,
        reason
      }
    })

    // 2. Fetch current student stats
    const student = await tx.student.findUnique({
      where: { id: studentId }
    })

    if (!student) throw new Error('Student not found')

    const newXP = student.xp + amount
    const newLevel = calculateLevel(newXP)

    // 3. Update student XP and level
    const updatedStudent = await tx.student.update({
      where: { id: studentId },
      data: {
        xp: newXP,
        level: newLevel
      }
    })

    // 4. Trigger badge checks (we don't await the transaction to finish if badges do their own)
    // Actually it's better to run checkAndAwardBadges after the transaction.
    return {
      updatedStudent,
      levelUp: newLevel > student.level
    }
  })
}

export const deductXP = async (studentId: string, amount: number, reason: string) => {
  if (amount <= 0) return null

  return await db.$transaction(async (tx) => {
    await tx.xPEvent.create({
      data: {
        studentId,
        amount: -amount,
        reason
      }
    })

    const student = await tx.student.findUnique({
      where: { id: studentId }
    })

    if (!student) throw new Error('Student not found')

    const newXP = Math.max(0, student.xp - amount)
    const newLevel = calculateLevel(newXP)

    const updatedStudent = await tx.student.update({
      where: { id: studentId },
      data: {
        xp: newXP,
        level: newLevel
      }
    })

    return updatedStudent
  })
}
