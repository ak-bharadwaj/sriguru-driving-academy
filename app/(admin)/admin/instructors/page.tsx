import React from 'react'
import InstructorManagerClient from './InstructorManagerClient'
import { db } from '@/lib/db'

export const metadata = {
  title: 'Instructor Management | Admin Dashboard',
}

export default async function AdminInstructorsPage() {
  let instructors: any[] = []
  
  try {
    instructors = await db.instructor.findMany({
      include: {
        user: true,
        sessions: true
      },
      orderBy: { user: { createdAt: 'desc' } }
    })
  } catch (e) {
    console.error('Failed to fetch instructors', e)
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <InstructorManagerClient initialInstructors={instructors} />
    </div>
  )
}
