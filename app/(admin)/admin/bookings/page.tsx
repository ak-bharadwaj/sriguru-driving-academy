import React from 'react'
import BookingsManagerClient from './BookingsManagerClient'
import { db } from '@/lib/db'

export const metadata = {
  title: 'Booking Review | Admin Dashboard',
}



export default async function AdminBookingsPage() {
  let pendingBookings: any[] = []
  let instructors: any[] = []
  
  try {
    pendingBookings = await db.booking.findMany({
      where: { status: 'PENDING' },
      include: {
        slot: { select: { date: true, startTime: true, endTime: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    const dbInstructors = await db.instructor.findMany({
      include: { user: { select: { name: true } } }
    })
    instructors = dbInstructors.map(i => ({ id: i.id, name: i.user.name }))
  } catch (e) {
    console.error('Failed to fetch data for bookings review', e)
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">Booking Review (Manual Mode)</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          Review incoming student registrations. Assign an instructor and approve to officially create their account.
        </p>
      </div>

      <BookingsManagerClient 
        initialBookings={pendingBookings}
        instructors={instructors}
      />
    </div>
  )
}
