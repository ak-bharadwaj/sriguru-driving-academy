import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TrainingType } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { amount } = await clientParseJson(request)
    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'XP amount must be a number' }, { status: 400 })
    }

    // Retrieve the first student as the active session profile
    let student = await db.student.findFirst()
    if (!student) {
      // Seed a default student if none exist
      const defaultUser = await db.user.create({
        data: {
          email: 'cadet@sriguru.com',
          name: 'Cadet Driver',
          passwordHash: 'srigurustudent123',
          role: 'STUDENT'
        }
      })
      student = await db.student.create({
        data: {
          id: 'stu-session-1',
          userId: defaultUser.id,
          xp: 0,
          level: 1,
          streakDays: 3,
          trainingType: TrainingType.BEGINNER
        }
      })
    }

    const currentXP = student.xp + amount
    const neededXP = student.level * 1000
    let levelUp = false
    let newLevel = student.level

    if (currentXP >= neededXP) {
      levelUp = true
      newLevel = student.level + 1
      
      // Update student level and reset excess XP
      student = await db.student.update({
        where: { id: student.id },
        data: {
          level: newLevel,
          xp: currentXP - neededXP
        }
      })
    } else {
      // Just update current XP
      student = await db.student.update({
        where: { id: student.id },
        data: { xp: currentXP }
      })
    }

    // Log the XP transaction event
    await db.xPEvent.create({
      data: {
        studentId: student.id,
        amount,
        reason: 'CONSOLE_RECONCILED'
      }
    })

    return NextResponse.json({
      levelUp,
      newLevel,
      currentXP: student.xp,
      neededXP: newLevel * 1000
    }, { status: 200 })
  } catch (error: any) {
    console.error('XP reconcile API Error:', error)
    return NextResponse.json({ error: 'XP reconciliation failed', details: error.message }, { status: 500 })
  }
}

// Helper to parse JSON safely
async function clientParseJson(request: Request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}
