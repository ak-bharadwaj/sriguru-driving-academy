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

    const { name, email, phone, experienceYears, avatarUrl, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await db.user.create({
      data: {
        email,
        phone: phone || null,
        name,
        role: 'INSTRUCTOR',
        passwordHash,
        avatarUrl: avatarUrl || null,
        instructor: {
          create: {
            experienceYears: experienceYears ? parseInt(experienceYears) : 0,
            specialties: 'General Driving' // Default, can be expanded later
          }
        }
      }
    })

    return NextResponse.json({ success: true, instructorId: newUser.id }, { status: 200 })
  } catch (error) {
    console.error('Instructor creation error:', error)
    return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 })
  }
}
