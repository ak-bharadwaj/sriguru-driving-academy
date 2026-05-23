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
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">Instructor Management</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          Create new instructors, manage their profiles, and view their utilization.
        </p>
      </div>

      <InstructorManagerClient />

      <div className="mt-12">
        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] mb-6">Active Instructors</h3>
        
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((ins) => (
              <div key={ins.id} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {ins.user.avatarUrl ? (
                    <img src={ins.user.avatarUrl} alt={ins.user.name} className="w-14 h-14 rounded-full object-cover border border-[rgb(var(--color-border))]" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] flex items-center justify-center font-bold text-lg text-[rgb(var(--color-text-3))]">
                      {ins.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-[rgb(var(--color-text-1))]">{ins.user.name}</h4>
                    <p className="text-xs text-[rgb(var(--color-text-3))]">{ins.user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-[rgb(var(--color-border))]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-[rgb(var(--color-text-2))]">Experience</span>
                    <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{ins.experienceYears} Years</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-[rgb(var(--color-text-2))]">Total Sessions</span>
                    <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{ins.sessions.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-[rgb(var(--color-text-2))]">No instructors found in the database.</p>
            <p className="text-xs font-mono text-[rgb(var(--color-text-3))] mt-2">Use the form above to add your first instructor.</p>
          </div>
        )}
      </div>

    </div>
  )
}
