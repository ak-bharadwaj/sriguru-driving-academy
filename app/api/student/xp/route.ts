import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { TrainingType } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await clientParseJson(request)
    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'XP amount must be a number' }, { status: 400 })
    }

    // Retrieve the student based on the authenticated user ID
    const userId = (session.user as any).id
    let student = await db.student.findUnique({
      where: { userId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student record not found for this user' }, { status: 404 })
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('XP reconcile API Error:', error)
    return NextResponse.json({ error: 'XP reconciliation failed', details: message }, { status: 500 })
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

