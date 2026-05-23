import React from 'react'
import SlotManagerClient from './SlotManagerClient'

export const metadata = {
  title: 'Slot Management | Admin Dashboard',
}

export default function AdminSlotsPage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <SlotManagerClient />
    </div>
  )
}
