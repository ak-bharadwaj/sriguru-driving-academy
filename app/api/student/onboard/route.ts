import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined

    if (!session || user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden. Student credentials required.' }, { status: 403 })
    }

    const userId = user?.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 })
    }

    // Parse the preferences sent by the client
    const body = await req.json()
    const { experience, goals } = body

    // Optional: We can map the selected 'goals' to a specific trainingType in the DB
    let trainingType = 'BEGINNER'
    if (goals === 'fast') {
      trainingType = 'RTO_FAST_TRACK'
    } else if (goals === 'defensive') {
      trainingType = 'DEFENSIVE'
    } else if (goals === 'license' && experience === 'refresher') {
      trainingType = 'REFRESHER'
    }

    // Find the student profile
    const student = await db.student.findUnique({
      where: { userId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    if (student.hasOnboarded) {
      return NextResponse.json({ error: 'Student has already onboarded.' }, { status: 400 })
    }

    // Update the student profile
    await db.student.update({
      where: { userId },
      data: {
        hasOnboarded: true,
        trainingType: trainingType as any,
        xp: { increment: 50 } // Grant initial XP!
      }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Onboarding update failed:', error)
    return NextResponse.json({ error: 'Failed to update onboarding status', details: message }, { status: 500 })
  }
}
