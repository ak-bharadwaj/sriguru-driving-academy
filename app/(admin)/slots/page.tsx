import React from 'react'
import SlotManagerClient from '../admin/slots/SlotManagerClient'

export const metadata = {
  title: 'Slot Registries | Sri Guru Driving Academy',
}

export default function AdminSlotsPage() {
  return (
    <div className="max-w-6xl mx-auto w-full py-10">
      <SlotManagerClient />
    </div>
  )
}
