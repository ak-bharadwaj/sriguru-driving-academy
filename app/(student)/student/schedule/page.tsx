import React from 'react'
import { Calendar } from 'lucide-react'

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Calendar className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-4xl font-display font-bold mb-4 text-center">Schedule & Bookings</h1>
      <p className="text-text-3 max-w-md text-center">
        Your interactive lesson calendar and booking management system is currently being set up. Please check back soon to schedule your next behind-the-wheel session.
      </p>
    </div>
  )
}
