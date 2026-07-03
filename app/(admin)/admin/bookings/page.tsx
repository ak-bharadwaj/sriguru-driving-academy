import React from 'react'
import BookingsManagerClient from './BookingsManagerClient'
import { db } from '@/lib/db'

export const metadata = {
  title: 'Booking Review | Admin Dashboard',
}

export default async function AdminBookingsPage() {
  let pendingBookings: any[] = []
  
  try {
    pendingBookings = await db.booking.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    console.error('Failed to fetch data for bookings review', e)
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <BookingsManagerClient 
        initialBookings={pendingBookings}
        instructors={[]}
      />
    </div>
  )
}
