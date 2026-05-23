"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR from 'swr'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Plus
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function InstructorSchedulePage() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState<{sessionId: string, studentId: string} | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState('PRESENT')
  
  const [newSessionData, setNewSessionData] = useState({
    studentId: '',
    scheduledAt: '',
    duration: 60,
    lessonType: '',
    notes: ''
  })
  
  const { data, error, isLoading, mutate } = useSWR('/api/instructor/sessions', fetcher)
  const { data: studentsData } = useSWR('/api/instructor/students', fetcher)

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/instructor/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      mutate()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/instructor/sessions/${id}`, {
        method: 'DELETE',
      })
      mutate()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/instructor/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSessionData,
          scheduledAt: new Date(newSessionData.scheduledAt).toISOString()
        }),
      })
      setShowCreateModal(false)
      setNewSessionData({ studentId: '', scheduledAt: '', duration: 60, lessonType: '', notes: '' })
      mutate()
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showAttendanceModal) return
    try {
      await fetch('/api/instructor/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: showAttendanceModal.studentId,
          sessionId: showAttendanceModal.sessionId,
          status: attendanceStatus
        }),
      })
      setShowAttendanceModal(null)
      mutate()
    } catch (e) {
      console.error(e)
    }
  }

  // Format and filter
  const sessions = data?.sessions || []
  
  const formattedSchedule = sessions.map((s: any) => {
    const d = new Date(s.scheduledAt)
    const now = new Date()
    let dateStr = d.toLocaleDateString()
    if (d.toDateString() === now.toDateString()) dateStr = 'Today'
    else {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      if (d.toDateString() === tomorrow.toDateString()) dateStr = 'Tomorrow'
    }
    
    return {
      id: s.id,
      studentId: s.student?.id || '',
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: dateStr,
      student: s.student?.name || 'Unknown',
      type: s.lessonType,
      status: s.status,
      location: 'Default Track' // Backend doesn't store this directly yet
    }
  })

  const filteredSchedule = formattedSchedule.filter((session: any) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'TODAY') return session.date === 'Today'
    if (activeFilter === 'TOMORROW') return session.date === 'Tomorrow'
    return session.status === activeFilter
  })

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-2">Schedule Management</h1>
            <p className="text-sm sm:text-base text-text-2">View upcoming slots, mark attendance, and manage your daily roadmap.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.4)] whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
            <div className="flex flex-wrap gap-2 bg-surface p-1.5 rounded-2xl border border-border">
              {['ALL', 'TODAY', 'TOMORROW', 'COMPLETED'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeFilter === filter 
                      ? 'bg-primary text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)]' 
                      : 'text-text-3 hover:text-white hover:bg-surface-2'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-5 sm:pl-6 md:pl-8 border-l-2 border-border/50">
          
          {isLoading && (
            <div className="py-20 text-center text-text-3">Loading sessions...</div>
          )}

          {!isLoading && filteredSchedule.map((session: any, idx: number) => {
            
            // Status-based styling
            let statusColor = 'text-text-3'
            let statusBg = 'bg-surface'
            let StatusIcon = AlertCircle
            let borderAccent = 'border-border'

            if (session.status === 'COMPLETED') {
              statusColor = 'text-success'
              statusBg = 'bg-success/10'
              StatusIcon = CheckCircle2
              borderAccent = 'border-success'
            } else if (session.status === 'IN_PROGRESS') {
              statusColor = 'text-accent'
              statusBg = 'bg-accent/10'
              StatusIcon = Clock
              borderAccent = 'border-accent'
            } else if (session.status === 'SCHEDULED') {
              statusColor = 'text-primary'
              statusBg = 'bg-primary/10'
              StatusIcon = CalendarIcon
              borderAccent = 'border-primary'
            }

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                className="mb-8 relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[30px] sm:-left-[35px] md:-left-[43px] top-6 w-4 sm:w-5 h-4 sm:h-5 rounded-full border-4 border-void ${statusBg.replace('/10','')} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full bg-void`} />
                </div>

                {/* Session Card */}
                <div className={`bg-surface border-l-4 ${borderAccent} border-y border-r border-y-border border-r-border p-4 sm:p-6 rounded-2xl hover:bg-surface-2 transition-colors group flex flex-col lg:flex-row gap-6 lg:items-center justify-between`}>
                  
                  {/* Left Info: Time & Type */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-data-mono flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {session.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-data-mono text-text-3">{session.date}</span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                      {session.time} — {session.type}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-text-3 font-data-mono mt-3">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> {session.student}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {session.location}</span>
                    </div>
                  </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                  {session.status === 'SCHEDULED' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(session.id, 'IN_PROGRESS')}
                        className="px-4 sm:px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary hover:text-white transition-all w-full lg:w-auto"
                      >
                        Start Session
                      </button>
                      <button 
                        onClick={() => handleDelete(session.id)}
                        className="p-2.5 text-text-3 hover:text-danger bg-surface border border-border rounded-xl transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {session.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => setShowAttendanceModal({ sessionId: session.id, studentId: session.studentId })}
                      className="px-4 sm:px-5 py-2.5 bg-success/20 text-success border border-success/30 rounded-xl text-xs sm:text-sm font-semibold hover:bg-success hover:text-void shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all w-full lg:w-auto flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Completed
                    </button>
                  )}
                  {session.status === 'COMPLETED' && (
                    <button className="px-4 sm:px-5 py-2.5 bg-surface text-text-2 border border-border rounded-xl text-xs sm:text-sm font-semibold hover:text-white transition-all w-full lg:w-auto">
                      View Log
                    </button>
                  )}
                </div>

                </div>
              </motion.div>
            )
          })}
          
          {!isLoading && filteredSchedule.length === 0 && (
            <div className="py-20 text-center border border-border border-dashed rounded-2xl bg-surface/50 ml-4">
              <CalendarIcon className="w-12 h-12 text-text-3 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-text-1 mb-2">No Slots Scheduled</h3>
              <p className="text-text-3">You have a free block for this filter.</p>
            </div>
          )}

        </div>

      </div>

      {/* Create Session Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 text-text-3 hover:text-white bg-surface-2 rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">Schedule New Session</h2>
              
              <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">Student</label>
                  <select 
                    required
                    value={newSessionData.studentId}
                    onChange={e => setNewSessionData({...newSessionData, studentId: e.target.value})}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="" disabled>Select a student</option>
                    {studentsData && Array.isArray(studentsData) && studentsData.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newSessionData.scheduledAt}
                    onChange={e => setNewSessionData({...newSessionData, scheduledAt: e.target.value})}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-2 mb-2">Duration (mins)</label>
                    <input 
                      type="number" 
                      required
                      min="15"
                      step="15"
                      value={newSessionData.duration}
                      onChange={e => setNewSessionData({...newSessionData, duration: parseInt(e.target.value)})}
                      className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-2 mb-2">Lesson Type</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Parallel Parking"
                      value={newSessionData.lessonType}
                      onChange={e => setNewSessionData({...newSessionData, lessonType: e.target.value})}
                      className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">Notes (Optional)</label>
                  <textarea 
                    rows={2}
                    value={newSessionData.notes}
                    onChange={e => setNewSessionData({...newSessionData, notes: e.target.value})}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none"
                    placeholder="Any specific focus areas..."
                  />
                </div>

                <div className="mt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-2 hover:bg-surface-2 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
                  >
                    Schedule Slot
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAttendanceModal(null)}
                className="absolute top-4 right-4 p-2 text-text-3 hover:text-white bg-surface-2 rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">Mark Attendance</h2>
              
              <form onSubmit={handleMarkAttendance} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">Status</label>
                  <select 
                    value={attendanceStatus}
                    onChange={e => setAttendanceStatus(e.target.value)}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>

                <div className="mt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowAttendanceModal(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-2 hover:bg-surface-2 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-success text-void rounded-xl text-sm font-bold hover:bg-success/90 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.4)] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
