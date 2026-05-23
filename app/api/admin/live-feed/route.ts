import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Live feed records simulated with relative timings
export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }
  const alerts = [
    {
      id: `alert-${Date.now()}-1`,
      type: 'BOOKING',
      message: 'New admission slot filed by Preeti Patel (MCWG)',
      relativeTime: '2 mins ago',
      pulse: true
    },
    {
      id: `alert-${Date.now()}-2`,
      type: 'BADGE',
      message: 'Student Aarav Mehta awarded the "Highway Master" gold badge',
      relativeTime: '8 mins ago',
      pulse: false
    },
    {
      id: `alert-${Date.now()}-3`,
      type: 'SESSION',
      message: 'Clutch Control operations marked completed under Rajesh Sharma',
      relativeTime: '15 mins ago',
      pulse: false
    },
    {
      id: `alert-${Date.now()}-4`,
      type: 'QUIZ',
      message: 'Theoretical mock test cleared by Kabir Sen (96% Accuracy)',
      relativeTime: '24 mins ago',
      pulse: false
    },
    {
      id: `alert-${Date.now()}-5`,
      type: 'SYSTEM',
      message: 'Backup pgBouncer synchronized with Neon cloud transaction logs',
      relativeTime: '45 mins ago',
      pulse: false
    }
  ]

  return NextResponse.json(alerts, { status: 200 })
}

