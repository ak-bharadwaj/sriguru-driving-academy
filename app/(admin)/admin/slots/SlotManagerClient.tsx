"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Users, Edit2, Check, Clock, Shield, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']

interface Slot {
  id: string
  dayOfWeek: string
  time: string
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string
}

interface BookingUser {
  id: string
  name: string
  phone: string
  email: string
}

export default function SlotManagerClient() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('course-beginner')
  
  // Modal State
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [slotBookings, setSlotBookings] = useState<BookingUser[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  const [modalForm, setModalForm] = useState({
    maxCapacity: 5,
    currentBooked: 0,
    status: 'ACTIVE'
  })
  const [isSaving, setIsSaving] = useState(false)

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/public/slots?type=${selectedType}`)
      if (res.ok) {
        const data = await res.json()
        setSlots(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [selectedType])

  const openSlotModal = async (day: string, hour: string) => {
    setSlotBookings([])
    
    const existing = slots.find(s => s.dayOfWeek === day && s.time === hour)
    if (existing) {
      setEditingSlot(existing)
      setModalForm({
        maxCapacity: existing.maxCapacity,
        currentBooked: existing.currentBooked,
        status: existing.status
      })
      
      // Fetch bookings for this slot
      setLoadingBookings(true)
      try {
        const res = await fetch(`/api/admin/slots/bookings?slotId=${existing.id}`)
        if (res.ok) {
          const data = await res.json()
          setSlotBookings(data.map((b: any) => ({
            id: b.id,
            name: b.name,
            phone: b.phone,
            email: b.email
          })))
        }
      } catch (e) {
        console.error("Failed to fetch bookings")
      } finally {
        setLoadingBookings(false)
      }
      
    } else {
      setEditingSlot({
        id: 'new',
        dayOfWeek: day,
        time: hour,
        trainingType: selectedType,
        maxCapacity: 5,
        currentBooked: 0,
        status: 'ACTIVE'
      })
      setModalForm({
        maxCapacity: 5,
        currentBooked: 0,
        status: 'ACTIVE'
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveSlot = async () => {
    if (!editingSlot) return
    setIsSaving(true)
    try {
      const isNew = editingSlot.id === 'new'
      const endpoint = '/api/public/slots' // The public slots endpoint currently handles admin POST/PUT in this codebase
      const method = isNew ? 'POST' : 'PUT'
      
      const payload = isNew ? {
        dayOfWeek: editingSlot.dayOfWeek,
        time: editingSlot.time,
        trainingType: selectedType,
        maxCapacity: modalForm.maxCapacity,
        currentBooked: modalForm.currentBooked,
        status: modalForm.status
      } : {
        id: editingSlot.id,
        maxCapacity: modalForm.maxCapacity,
        currentBooked: modalForm.currentBooked,
        status: modalForm.status
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(isNew ? 'Slot activated!' : 'Slot updated!')
        fetchSlots()
        setIsModalOpen(false)
      } else {
        toast.error('Failed to save slot')
      }
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[rgb(var(--color-surface))] p-5 rounded-2xl border border-[rgb(var(--color-border))]">
        <div>
          <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">Weekly Schedule Master</h2>
          <p className="text-xs text-[rgb(var(--color-text-3))] font-mono mt-1">Activate slots and override capacities for offline students</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[rgb(var(--color-void))] text-xs font-bold text-[rgb(var(--color-text-1))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 outline-none"
          >
            <option value="course-beginner">BEGINNER (21 Days)</option>
            <option value="course-advanced">ADVANCED (14 Days)</option>
            <option value="course-rto">RTO BOOTCAMP (7 Days)</option>
          </select>
        </div>
      </div>

      <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl overflow-hidden shadow-app">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="w-8 h-8 text-[rgb(var(--color-primary))] animate-spin" />
            <span className="text-[10px] font-mono text-[rgb(var(--color-text-3))]">LOADING SCHEDULE GRID...</span>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none p-4">
            <div className="min-w-[800px] grid grid-cols-[80px_repeat(7,1fr)] gap-3">
              {/* Header */}
              <div className="h-10 flex items-center justify-center text-[10px] font-bold font-mono text-[rgb(var(--color-text-3))]">TIME</div>
              {DAYS.map(day => (
                <div key={day} className="h-10 flex items-center justify-center text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] border-b border-[rgb(var(--color-border))] uppercase tracking-wider">
                  {day}
                </div>
              ))}

              {/* Grid Rows */}
              {HOURS.map(hour => (
                <React.Fragment key={hour}>
                  <div className="h-16 flex items-center justify-center text-[10px] font-bold font-mono text-[rgb(var(--color-text-3))] bg-[rgb(var(--color-void))] rounded-xl border border-[rgb(var(--color-border))]">
                    {hour}
                  </div>
                  {DAYS.map(day => {
                    const slot = slots.find(s => s.dayOfWeek === day && s.time === hour)
                    const isActive = !!slot
                    const available = slot ? slot.maxCapacity - slot.currentBooked : 0

                    return (
                      <div 
                        key={day}
                        onClick={() => openSlotModal(day, hour)}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-[rgb(var(--color-primary))]/10 border-[rgb(var(--color-primary))]/30 hover:border-[rgb(var(--color-primary))] group' 
                            : 'bg-[rgb(var(--color-void))]/50 border-dashed border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))]/50'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <span className="text-[10px] font-bold text-[rgb(var(--color-primary))] uppercase">{slot.status}</span>
                            <span className="text-[9px] font-mono text-[rgb(var(--color-text-2))] mt-1 group-hover:text-[rgb(var(--color-text-1))]">
                              {available} / {slot.maxCapacity} Avail
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] font-mono text-[rgb(var(--color-text-3))] uppercase tracking-wider opacity-50">+ Activate</span>
                        )}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && editingSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-md rounded-[24px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))] font-display">Configure Slot</h3>
                <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-1 uppercase tracking-wider">
                  {editingSlot.dayOfWeek} @ {editingSlot.time}
                </p>
              </div>
              <Shield className="w-6 h-6 text-[rgb(var(--color-text-3))]" />
            </div>

            <div className="p-6 flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase">Total Max Capacity</label>
                <input 
                  type="number"
                  min="1"
                  value={modalForm.maxCapacity}
                  onChange={(e) => setModalForm({...modalForm, maxCapacity: parseInt(e.target.value) || 1})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                />
                <span className="text-[9px] text-[rgb(var(--color-text-3))]">Maximum number of cars/instructors available for this hour.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase flex items-center gap-1">
                  Offline Students Count <AlertCircle className="w-3 h-3 text-[rgb(var(--color-accent))]" />
                </label>
                <input 
                  type="number"
                  min="0"
                  value={modalForm.currentBooked}
                  onChange={(e) => setModalForm({...modalForm, currentBooked: parseInt(e.target.value) || 0})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-accent))]"
                />
                <span className="text-[9px] text-[rgb(var(--color-accent))]">Use this to block seats for legacy students who registered offline.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase">Slot Status</label>
                <select
                  value={modalForm.status}
                  onChange={(e) => setModalForm({...modalForm, status: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                >
                  <option value="ACTIVE">ACTIVE (Accepting web bookings)</option>
                  <option value="CLOSED">CLOSED (Hidden / Unavailable)</option>
                </select>
              </div>

            </div>

            <div className="p-5 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/30 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSlot}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>

            {/* Bookings Section */}
            {editingSlot.id !== 'new' && (
              <div className="p-6 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
                <h4 className="text-sm font-bold text-[rgb(var(--color-text-1))] mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                  Enrolled Students (Web Bookings)
                </h4>
                
                {loadingBookings ? (
                  <div className="text-xs font-mono text-[rgb(var(--color-text-3))]">Loading students...</div>
                ) : slotBookings.length > 0 ? (
                  <div className="flex flex-col gap-3 max-h-[150px] overflow-y-auto pr-2 scrollbar-thin">
                    {slotBookings.map(student => (
                      <div key={student.id} className="flex justify-between items-center bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] p-3 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[rgb(var(--color-text-1))]">{student.name}</span>
                          <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono">{student.email}</span>
                        </div>
                        <span className="text-[10px] text-[rgb(var(--color-text-2))] font-mono bg-[rgb(var(--color-surface))] px-2 py-1 rounded-md border border-[rgb(var(--color-border))]">{student.phone}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-[rgb(var(--color-text-3))] bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] p-4 rounded-xl text-center">
                    No web students booked for this slot yet.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
