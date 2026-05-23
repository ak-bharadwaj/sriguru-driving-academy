import React from 'react'
import SlotManagerClient from './SlotManagerClient'

export const metadata = {
  title: 'Slot Management | Admin Dashboard',
}

export default function AdminSlotsPage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">Weekly Slot Management</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          Configure available training hours, set maximum capacities, and allocate seats for legacy offline students.
        </p>
      </div>

      <SlotManagerClient />
    </div>
  )
}
