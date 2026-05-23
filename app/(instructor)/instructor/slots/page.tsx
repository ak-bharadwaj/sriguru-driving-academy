import React from 'react'
import SlotManagerClient from '@/app/(admin)/admin/slots/SlotManagerClient'

export const metadata = {
  title: 'Batch Management | Instructor Dashboard',
}

export default function InstructorSlotsPage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">Batch & Capacity Override</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          Control the availability of your batches and block capacity for legacy offline students.
        </p>
      </div>

      <SlotManagerClient />
    </div>
  )
}
