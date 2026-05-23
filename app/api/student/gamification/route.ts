import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStudentState, saveStudentState } from '@/lib/data/academyStore'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const state = getStudentState()
    return NextResponse.json(state)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gamification state' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const currentState = getStudentState()
    
    // We expect the body to pass any updates (like adding a badge, updating xp, completing a skill node)
    const updatedState = { ...currentState, ...body }
    
    saveStudentState(updatedState)
    return NextResponse.json(updatedState)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gamification state' }, { status: 500 })
  }
}
