"use client"

import React, { useState } from 'react'
import { Check, X, UserCheck, AlertTriangle, Clock, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface BookingData {
  id: string
  name: string
  email: string
  phone: string
  trainingType: string
  status: string
  createdAt: string
  slotId?: string | null
  slot?: {
    date: Date
    startTime: string
    endTime: string
  } | null
}

interface InstructorOption {
  id: string
  name: string
}

export default function BookingsManagerClient({ 
  initialBookings,
  instructors
}: { 
  initialBookings: BookingData[],
  instructors: InstructorOption[]
}) {
  const router = useRouter()
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [selectedInstructor, setSelectedInstructor] = useState<Record<string, string>>({})
  
  const handleApprove = async (bookingId: string) => {
    setApprovingId(bookingId)
    try {
      const res = await fetch('/api/admin/bookings/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          instructorId: selectedInstructor[bookingId] || undefined
        })
      })

      if (res.ok) {
        toast.success('Booking Approved! Student account created.')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to approve booking')
      }
    } catch (e) {
      toast.error('An error occurred.')
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (bookingId: string) => {
    if (!confirm('Are you sure you want to reject this booking?')) return
    
    try {
      const res = await fetch('/api/public/bookings', { // This endpoint supports PUT status
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'REJECTED' })
      })

      if (res.ok) {
        toast.success('Booking Rejected.')
        router.refresh()
      } else {
        toast.error('Failed to reject booking')
      }
    } catch (e) {
      toast.error('An error occurred.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {initialBookings.length === 0 ? (
        <div className="bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-[rgb(var(--color-text-2))]">No pending bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBookings.map((b) => (
            <div key={b.id} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[rgb(var(--color-text-1))]">{b.name}</h4>
                  <p className="text-xs text-[rgb(var(--color-text-3))] font-medium">{b.email}</p>
                  <p className="text-xs text-[rgb(var(--color-text-3))] font-medium">{b.phone}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider flex items-center gap-1 border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> {b.status}
                </span>
              </div>

              <div className="bg-[rgb(var(--color-void))] p-3 rounded-xl border border-[rgb(var(--color-border))] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-2))] font-bold">Course:</span>
                  <span className="text-[rgb(var(--color-text-1))] font-medium">{b.trainingType}</span>
                </div>
                {b.slot && (
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--color-text-2))] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Slot:
                    </span>
                    <span className="text-[rgb(var(--color-text-1))] font-medium">{new Date(b.slot.date).toLocaleDateString()} at {b.slot.startTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-2))] font-bold">Date Applied:</span>
                  <span className="text-[rgb(var(--color-text-1))] font-medium">{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[10px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">Assign Instructor</label>
                <select 
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-2 text-xs font-medium outline-none w-full"
                  value={selectedInstructor[b.id] || ''}
                  onChange={(e) => setSelectedInstructor(prev => ({...prev, [b.id]: e.target.value}))}
                >
                  <option value="">No Instructor (Assign Later)</option>
                  {instructors.map(ins => (
                    <option key={ins.id} value={ins.id}>{ins.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => handleReject(b.id)}
                  disabled={approvingId === b.id}
                  className="flex-1 py-2 bg-[rgb(var(--color-void))] border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(b.id)}
                  disabled={approvingId === b.id}
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {approvingId === b.id ? 'Approving...' : 'Approve'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
