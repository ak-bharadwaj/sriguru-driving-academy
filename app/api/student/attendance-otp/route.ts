import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!session || user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden. Student credentials required.' }, { status: 403 })
    }

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized. User ID not found.' }, { status: 401 })
    }

    const student = await db.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 })
    }

    // Generate random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

    await db.student.update({
      where: { id: student.id },
      data: {
        attendanceOtp: otp,
        attendanceOtpExpires: expiresAt
      }
    })

    return NextResponse.json({ success: true, otp, expiresAt: expiresAt.toISOString() }, { status: 200 })
  } catch (error) {
    console.error('Generate OTP Error:', error)
    return NextResponse.json({ error: 'Failed to generate attendance OTP.' }, { status: 500 })
  }
}
