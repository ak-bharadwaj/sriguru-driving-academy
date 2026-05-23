import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'



export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const student = await db.student.findUnique({
      where: { userId },
      select: { id: true }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    // Find all incorrect quiz attempts for this student, including the question details
    const weakAttempts = await db.quizAttempt.findMany({
      where: {
        studentId: student.id,
        correct: false
      },
      include: {
        question: true
      }
    })

    // Aggregate by category
    const categoryMistakes: Record<string, { count: number, recentMistakes: string[] }> = {}
    
    for (const attempt of weakAttempts) {
      const cat = attempt.question.category
      if (!categoryMistakes[cat]) {
        categoryMistakes[cat] = { count: 0, recentMistakes: [] }
      }
      categoryMistakes[cat].count += 1
      
      // Store the last few distinct questions they got wrong in this category
      if (!categoryMistakes[cat].recentMistakes.includes(attempt.question.question)) {
        categoryMistakes[cat].recentMistakes.push(attempt.question.question)
      }
    }

    // Format output as array
    const weakTopics = Object.entries(categoryMistakes).map(([category, data]) => ({
      category,
      mistakeCount: data.count,
      sampleQuestions: data.recentMistakes.slice(-3) // Just up to 3 samples
    }))

    // Sort by most mistakes first
    weakTopics.sort((a, b) => b.mistakeCount - a.mistakeCount)

    return NextResponse.json({ weakTopics }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Weak topics API Error:', message)
    return NextResponse.json({ error: 'Failed to retrieve weak topics' }, { status: 500 })
  }
}
