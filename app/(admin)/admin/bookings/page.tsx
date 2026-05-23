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
      <BookingsManagerClient 
        initialBookings={pendingBookings}
        instructors={instructors}
      />
    </div>
  )
}
