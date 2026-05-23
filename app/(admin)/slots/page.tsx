


"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Plus, 
  Check, 
  X, 
  Phone, 
  Mail, 
  CheckCircle, 
  Award
} from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']
const TRAINING_TYPES = ['Beginner', 'Advanced', 'RTO Fast Track']

interface SlotItem {
  id: string
  dayOfWeek: string
  time: string
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string // DRAFT, ACTIVE, FULL, CLOSED
  instructorId: string
}

interface BookingRequest {
  id: string
  name: string
  email: string
  phoneNumber: string
  preferredDate: string
  licenseCategory: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export default function AdminSlotManagement() {
  const [slots, setSlots] = useState<SlotItem[]>([])
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [selectedType, setSelectedType] = useState('Beginner')
  const [loading, setLoading] = useState(true)

  // Creation popover state
  const [activePopover, setActivePopover] = useState<{ day: string; hour: string } | null>(null)
  const [newSlotCapacity, setNewSlotCapacity] = useState(5)
  const [newSlotInstructor, setNewSlotInstructor] = useState('ins-1')
  const [newSlotStatus, setNewSlotStatus] = useState('ACTIVE')

  // Detailed slot inspection state
  const [inspectedSlot, setInspectedSlot] = useState<SlotItem | null>(null)

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch slots for the current selected type
      const slotsRes = await fetch(`/api/public/slots?type=${selectedType}`)
      if (slotsRes.ok) {
        const slotsData = await slotsRes.json()
        setSlots(slotsData)
      }

      // 2. Fetch all bookings
      const bookingsRes = await fetch('/api/public/bookings')
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      }
    } catch (e) {
      console.error(e)
    }
  }, [selectedType])

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true)
      await fetchData()
      setLoading(false)
    }
    initFetch()
  }, [fetchData])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // ----------------------------------------------------
  // SLOT CREATION ACTION
  // ----------------------------------------------------
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePopover) return

    try {
      const res = await fetch('/api/public/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: activePopover.day,
          time: activePopover.hour,
          trainingType: selectedType,
          maxCapacity: newSlotCapacity,
          instructorId: newSlotInstructor,
          status: newSlotStatus
        })
      })

      if (res.ok) {
        triggerToast('New operational coaching slot created successfully!')
        setActivePopover(null)
        fetchData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ----------------------------------------------------
  // SLOT STATUS UPDATE (PATCH/PUT) ACTION
  // ----------------------------------------------------
  const handleUpdateSlotStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/public/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (res.ok) {
        triggerToast(`Slot status modified to ${status.toUpperCase()}!`)
        setInspectedSlot(null)
        fetchData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ----------------------------------------------------
  // BOOKING APPROVALS WORKSPACE ACTIONS
  // ----------------------------------------------------
  const handleBookingResolution = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    // 1. Snapshot previous state for rollback
    const previousBookings = [...bookings]
    
    // 2. Optimistic UI update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

    try {
      const res = await fetch('/api/public/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (res.ok) {
        // Trigger notification alert to the student
        triggerToast(`Booking ${id.substring(3)} ${status.toUpperCase()}! Notification dispatched to student.`)
        fetchData()
      } else {
        // Rollback on failure
        setBookings(previousBookings)
        triggerToast(`Failed to update booking status.`)
      }
    } catch (e) {
      console.error(e)
      // Rollback on network error
      setBookings(previousBookings)
      triggerToast(`Network error. Booking update reverted.`)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body py-24 px-6 relative">
      
      {/* Glow elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Roster Container */}
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Hub Header */}
        <header className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Operations Command</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5">
              Slot & Approval Center
            </h1>
            <p className="text-xs text-text-2 mt-1">
              Configure active hours grid calendars, align instructor rosters, and approve incoming trials.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-mono bg-white/[0.03] border border-border px-3 py-1.5 rounded-full text-text-2 uppercase">
              ADMIN CONTROL PANEL
            </span>
          </div>
        </header>

        {/* Dynamic Toast Feed */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-primary/95 border border-primary/30 text-white px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-lg shadow-primary/15"
            >
              <CheckCircle className="w-4 h-4 text-accent fill-accent/10" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category filtering tab bar */}
        <div className="flex gap-2 border-b border-border/40 pb-2">
          {TRAINING_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedType === type 
                  ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                  : 'bg-surface border border-border text-text-3 hover:text-text-2'
              }`}
            >
              {type} Grid
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            <Clock className="w-8 h-8 text-primary animate-spin" />
            <span className="text-[10px] text-text-3 font-mono">LOADING OPERATIONS CALENDAR Dashboard...</span>
          </div>
        ) : (
          
          /* OPERATIONS GRID WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 items-start">
            
            {/* ----------------------------------------------------
                A. WEEK GRID VIEW (65%)
                ---------------------------------------------------- */}
            <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col gap-4 shadow-lg overflow-hidden">
              
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-text-1 uppercase font-display">Calendar grid slot scheduler</span>
                <span className="text-[9px] font-mono text-text-3 uppercase">Click empty cell to seed</span>
              </div>

              <div className="overflow-x-auto p-1 scrollbar-none">
                <div className="min-w-[640px] grid grid-cols-[100px_repeat(7,1fr)] gap-2">
                  
                  {/* Top Day Headers */}
                  <div className="h-8 flex items-center justify-center text-[9px] font-mono text-text-3 uppercase font-bold">HOURS</div>
                  {DAYS.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-[9px] font-mono text-text-2 uppercase font-bold border-b border-border/40">
                      {day.substring(0, 3)}
                    </div>
                  ))}

                  {/* Calendar Hour rows */}
                  {HOURS.map(hour => {
                    return (
                      <React.Fragment key={hour}>
                        
                        {/* Time block */}
                        <div className="h-10 flex items-center justify-center text-[9px] font-mono font-bold bg-white/[0.02] border border-border/60 rounded-lg text-text-3">
                          {hour}
                        </div>

                        {/* Day block cells */}
                        {DAYS.map(day => {
                          const matchingSlot = slots.find(s => s.dayOfWeek === day && s.time === hour)
                          
                          if (matchingSlot) {
                            // Check slot status colors
                            // Draft (gray), Active (green), Full (amber), Closed (red)
                            let statusStyle = 'border-border bg-void/30 text-text-3'
                            let statusLabel = 'DRAFT'

                            if (matchingSlot.status === 'ACTIVE') {
                              statusStyle = 'bg-success/10 border-success/30 text-success'
                              statusLabel = 'ACTIVE'
                            } else if (matchingSlot.status === 'FULL') {
                              statusStyle = 'bg-accent/10 border-accent/30 text-accent'
                              statusLabel = 'FULL'
                            } else if (matchingSlot.status === 'CLOSED') {
                              statusStyle = 'bg-danger/10 border-danger/30 text-danger'
                              statusLabel = 'CLOSED'
                            }

                            return (
                              <div
                                key={day}
                                onClick={() => setInspectedSlot(matchingSlot)}
                                className={`h-10 border rounded-lg text-[8px] font-mono font-bold flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${statusStyle}`}
                              >
                                <span>{statusLabel}</span>
                                <span className="text-[7px] opacity-75 mt-0.5">{matchingSlot.currentBooked}/{matchingSlot.maxCapacity}</span>
                              </div>
                            )
                          }

                          // Empty cell -> click to reveal new slot popover
                          const isPopoverActive = activePopover?.day === day && activePopover?.hour === hour

                          return (
                            <div
                              key={day}
                              onClick={() => setActivePopover({ day, hour })}
                              className={`h-10 border border-dashed border-border/50 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 group relative ${
                                isPopoverActive ? 'border-primary bg-primary/5' : 'hover:border-primary/80 hover:bg-white/[0.01]'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5 text-text-3 group-hover:text-primary transition-colors duration-200" />
                            </div>
                          )
                        })}

                      </React.Fragment>
                    )
                  })}

                </div>
              </div>

              {/* SLOT CREATION FORM POPOVER */}
              <AnimatePresence>
                {activePopover && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    className="bg-void/40 border border-border p-4 rounded-2xl text-left flex flex-col gap-4 mt-2"
                  >
                    <div className="flex justify-between items-center border-b border-border/40 pb-2">
                      <span className="text-[10px] font-mono text-primary font-bold uppercase">
                        SEED NEW SLOT: {activePopover.day} AT {activePopover.hour}
                      </span>
                      <button 
                        onClick={() => setActivePopover(null)} 
                        className="p-1 hover:bg-white/[0.04] rounded-lg text-text-3"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[8px] font-mono text-text-3 uppercase">Max Capacity</label>
                        <input
                          type="number"
                          min="1"
                          max="15"
                          value={newSlotCapacity}
                          onChange={(e) => setNewSlotCapacity(parseInt(e.target.value))}
                          className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs outline-none focus:border-primary"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[8px] font-mono text-text-3 uppercase">Instructor Profile</label>
                        <select
                          value={newSlotInstructor}
                          onChange={(e) => setNewSlotInstructor(e.target.value)}
                          className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs outline-none focus:border-primary text-text-1"
                        >
                          <option value="ins-1">Harpreet Singh (Manual LMV)</option>
                          <option value="ins-2">Vikramjit Rathore (Defensive LMV)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[8px] font-mono text-text-3 uppercase">Initial status</label>
                        <select
                          value={newSlotStatus}
                          onChange={(e) => setNewSlotStatus(e.target.value)}
                          className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs outline-none focus:border-primary text-text-1"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="DRAFT">DRAFT</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setActivePopover(null)}
                          className="px-4 py-2 bg-surface hover:bg-white/[0.01] border border-border text-text-2 text-[10px] font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg"
                        >
                          Publish Slot
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DETAILED SLOT INSPECTION PANEL */}
              <AnimatePresence>
                {inspectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    className="bg-void/40 border border-border p-4 rounded-2xl text-left flex flex-col gap-4 mt-2"
                  >
                    <div className="flex justify-between items-center border-b border-border/40 pb-2">
                      <span className="text-[10px] font-mono text-accent font-bold uppercase">
                        INSPECT ACTIVE HOURS: {inspectedSlot.dayOfWeek} AT {inspectedSlot.time}
                      </span>
                      <button 
                        onClick={() => setInspectedSlot(null)} 
                        className="p-1 hover:bg-white/[0.04] rounded-lg text-text-3"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-text-3">CURRICULUM PROGRAM:</span>
                        <span className="text-text-1 font-bold">{inspectedSlot.trainingType}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-text-3">ROSTER ASSIGNMENT:</span>
                        <span className="text-text-1 font-bold">{inspectedSlot.instructorId}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-text-3">CURRENT REGISTERS:</span>
                        <span className="text-text-1 font-bold">{inspectedSlot.currentBooked} / {inspectedSlot.maxCapacity} ENROLLED</span>
                      </div>

                      {/* Status quick switch buttons */}
                      <div className="flex gap-1">
                        {['ACTIVE', 'DRAFT', 'CLOSED'].map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateSlotStatus(inspectedSlot.id, st)}
                            className={`px-3 py-1 text-[8px] font-bold border rounded-lg ${
                              inspectedSlot.status === st 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-surface border-border text-text-3 hover:text-text-2'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* ----------------------------------------------------
                B. BOOKING APPROVALS WORKSPACE (35%)
                ---------------------------------------------------- */}
            <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col gap-4 shadow-lg">
              
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-text-1 uppercase font-display">Pending Student approvals</span>
                <span className="text-[9px] font-mono text-text-3 uppercase">Real-Time</span>
              </div>

              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-none">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-text-3 text-[10px] font-mono">
                    NO PENDING BOOKINGS FILED FOR APPROVALS.
                  </div>
                ) : (
                  bookings.map((book) => {
                    const isPending = book.status === 'PENDING'
                    const isApproved = book.status === 'APPROVED'

                    return (
                      <div 
                        key={book.id}
                        className="bg-void/40 border border-border p-3.5 rounded-2xl text-left flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-1 font-display">{book.name}</span>
                            <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                              isApproved ? 'bg-success/15 border-success/25 text-success' :
                              book.status === 'REJECTED' ? 'bg-danger/15 border-danger/25 text-danger' :
                              'bg-primary/15 border-primary/25 text-primary animate-pulse'
                            }`}>
                              {book.status}
                            </span>
                          </div>
                          <span className="text-[7.5px] font-mono text-text-3 uppercase">{book.id.substring(3, 11)}</span>
                        </div>

                        <div className="flex flex-col gap-1 text-[9px] font-mono text-text-2 leading-none border-b border-border/40 pb-2">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-text-3" />
                            {book.phoneNumber}
                          </span>
                          <span className="flex items-center gap-1 mt-1 truncate">
                            <Mail className="w-3 h-3 text-text-3" />
                            {book.email}
                          </span>
                          <span className="flex items-center gap-1 mt-1 text-accent uppercase font-bold">
                            <Award className="w-3 h-3 text-accent" />
                            {book.licenseCategory} Program
                          </span>
                        </div>

                        {/* Approvals actions */}
                        {isPending && (
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => handleBookingResolution(book.id, 'APPROVED')}
                              className="flex-1 py-1.5 bg-success text-white font-bold text-[9px] rounded-lg flex items-center justify-center gap-1 shadow shadow-success/10 hover:bg-success/90 transition-all duration-200"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleBookingResolution(book.id, 'REJECTED')}
                              className="flex-1 py-1.5 bg-danger text-white font-bold text-[9px] rounded-lg flex items-center justify-center gap-1 shadow shadow-danger/10 hover:bg-danger/90 transition-all duration-200"
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        )}

                        {!isPending && (
                          <span className="text-[8px] text-text-3 font-mono text-center block">
                            Slot resolved: No pending operations remaining.
                          </span>
                        )}

                      </div>
                    )
                  })
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

