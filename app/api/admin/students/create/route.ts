import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { name, email, phone, trainingType, password } = await request.json()
    
    if (!name || !email || !password || !trainingType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Base course fees
    let courseFee = 0
    if (trainingType === 'BEGINNER') courseFee = 8999
    if (trainingType === 'ADVANCED') courseFee = 6500
    if (trainingType === 'RTO_FAST_TRACK') courseFee = 4999

    const newUser = await db.user.create({
      data: {
        email,
        phone: phone || null,
        name,
        role: 'STUDENT',
        passwordHash,
        student: {
          create: {
            trainingType: trainingType as any,
            status: 'ACTIVE',
            courseFee
          }
        }
      }
    })

    return NextResponse.json({ success: true, studentUserId: newUser.id }, { status: 200 })
  } catch (error) {
    console.error('Student creation error:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
