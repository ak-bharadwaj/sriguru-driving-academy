import { NextResponse } from 'next/server'
import { db } from '@/lib/db'



export async function GET(req: Request) {
  try {
    // Vercel Cron sends a Bearer token matching CRON_SECRET
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reset streak if last active/streak time was more than 48 hours ago
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

    const updated = await db.student.updateMany({
      where: {
        lastStreakAt: {
          lt: twoDaysAgo
        },
        streakDays: {
          gt: 0
        }
      },
      data: {
        streakDays: 0
      }
    })

    return NextResponse.json({ success: true, resetCount: updated.count })
  } catch (error: any) {
    console.error('Streak reset error:', error)
    return NextResponse.json({ error: 'Failed to reset streaks' }, { status: 500 })
  }
}
