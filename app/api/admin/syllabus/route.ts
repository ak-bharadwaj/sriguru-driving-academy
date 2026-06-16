export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

import { DEFAULT_SYLLABUS } from '@/lib/data/syllabusData'


export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const trainingType = url.searchParams.get('type') as keyof typeof DEFAULT_SYLLABUS | null

    // Auto-seed defaults if the table is empty
    const totalCount = await db.syllabusDay.count()
    if (totalCount === 0) {
      const seedData = []
      for (const [type, days] of Object.entries(DEFAULT_SYLLABUS)) {
        for (const day of days) {
          seedData.push({ trainingType: type as any, ...day })
        }
      }
      await db.syllabusDay.createMany({ data: seedData, skipDuplicates: true })
    }

    const where = trainingType ? { trainingType: trainingType as any } : {}
    const days = await db.syllabusDay.findMany({
      where,
      orderBy: [{ trainingType: 'asc' }, { dayNumber: 'asc' }]
    })

    return NextResponse.json(days)
  } catch (error) {
    console.error('Syllabus GET Error:', error)
    return NextResponse.json({ error: 'Failed to load syllabus' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Bulk seed / reset for a course type
    if (body.reset && body.trainingType) {
      const defaults = DEFAULT_SYLLABUS[body.trainingType as keyof typeof DEFAULT_SYLLABUS]
      if (!defaults) return NextResponse.json({ error: 'Unknown training type' }, { status: 400 })
      await db.syllabusDay.deleteMany({ where: { trainingType: body.trainingType } })
      await db.syllabusDay.createMany({
        data: defaults.map(d => ({ trainingType: body.trainingType, ...d })),
        skipDuplicates: true
      })
      const result = await db.syllabusDay.findMany({
        where: { trainingType: body.trainingType },
        orderBy: { dayNumber: 'asc' }
      })
      return NextResponse.json(result)
    }

    const { trainingType, dayNumber, title, description } = body
    if (!trainingType || !dayNumber || !title) {
      return NextResponse.json({ error: 'trainingType, dayNumber and title are required' }, { status: 400 })
    }

    const created = await db.syllabusDay.create({
      data: { trainingType, dayNumber: parseInt(dayNumber), title, description: description || '' }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Syllabus POST Error:', error)
    return NextResponse.json({ error: 'Failed to create syllabus day' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, dayNumber } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const updated = await db.syllabusDay.update({
      where: { id },
      data: { title, description, ...(dayNumber ? { dayNumber: parseInt(dayNumber) } : {}) }
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Syllabus PUT Error:', error)
    return NextResponse.json({ error: 'Failed to update syllabus day' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await db.syllabusDay.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Syllabus DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to delete syllabus day' }, { status: 500 })
  }
}
