"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Calendar, AlertTriangle, UserCheck, 
  TrendingUp, Award, Activity, Database,
  CheckCircle, Plus, Bell, Clock, Sliders, Edit3, Check
} from 'lucide-react'

// Interfaces matching the Server-provided data
interface CommandStats {
  totalStudents: number
  activeStudents: number
  sessionsToday: number
  sessionsThisWeek: number
  pendingBookings: number
  activeInstructors: number
}

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  trainingType: string
  status: string
  createdAt: string
}

interface InstructorLoad {
  id: string
  name: string
  studentCount: number
  sessionsThisWeek: number
  feedbackRate: number
}

interface TopStudent {
  id: string
  name: string
  level: number
  xp: number
}

interface ActivityEvent {
  id: string
  type: string
  message: string
  timeAgo: string
}

interface AdminDashboardClientProps {
  stats: CommandStats
  pendingBookings: Booking[]
  instructors: InstructorLoad[]
  topStudents: TopStudent[]
  recentActivity: ActivityEvent[]
  engagementData: { day: string; activeStudents: number; xpAwarded: number }[]
}

export default function AdminDashboardClient({
  stats,
  pendingBookings: initialBookings,
  instructors,
  topStudents,
  recentActivity,
  engagementData
}: AdminDashboardClientProps) {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  
  // Onboarding Form State
  const [assignedInstructor, setAssignedInstructor] = useState('')
  const [onboardingStatus, setOnboardingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [onboardMessage, setOnboardMessage] = useState('')

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking || !assignedInstructor) return
    
    setOnboardingStatus('loading')
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          name: selectedBooking.name,
          email: selectedBooking.email,
          phone: selectedBooking.phone,
          trainingType: selectedBooking.trainingType,
          instructorId: assignedInstructor
        })
      })

      if (res.ok) {
        setOnboardingStatus('success')
        setOnboardMessage('Account created and login sent to student!')
        setPendingBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
        setTimeout(() => {
          setSelectedBooking(null)
          setOnboardingStatus('idle')
        }, 2000)
      } else {
        const err = await res.json()
        setOnboardingStatus('error')
        setOnboardMessage(err.error || 'Failed to create account')
      }
    } catch (e) {
      setOnboardingStatus('error')
      setOnboardMessage('Network error occurred.')
    }
  }

  // Zone 3: Engagement Graph SVG (Minimal sparkline style)
  const maxActive = Math.max(...engagementData.map(d => d.activeStudents), 1)
  
  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] relative pb-20 overflow-x-hidden pt-28">
      {/* -----------------------------
          BLUE CURVED HEADER
          ----------------------------- */}
      <div className="bg-[rgb(var(--color-primary))] rounded-b-[40px] pt-12 pb-32 px-6 relative overflow-hidden text-white shadow-md -mx-6 -mt-28">
        {/* Decorative background curves */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-white/80 font-medium text-lg">Admin Workspace</p>
              <h1 className="text-3xl font-bold font-display mt-1">Academy HQ</h1>
              <p className="text-white/60 text-sm mt-1 max-w-xl">Command center for operations, student onboarding, and engagement analytics.</p>
            </div>
            <div className="px-5 py-2.5 bg-white text-[rgb(var(--color-primary))] rounded-2xl text-sm font-bold shadow-lg">
              System Online
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8 -mt-20 relative z-10">

        {/* ZONE 1: Command Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2 backdrop-blur-md">
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" /> Total Students
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.totalStudents}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">{stats.activeStudents} active</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2 backdrop-blur-md">
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Sessions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.sessionsToday}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">today ({stats.sessionsThisWeek} /wk)</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2 backdrop-blur-md relative overflow-hidden">
            {stats.pendingBookings > 0 && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/10 rounded-bl-3xl flex justify-center items-start p-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              </div>
            )}
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Enquiries
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.pendingBookings}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">pending review</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2 backdrop-blur-md">
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-amber-500" /> Instructors
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.activeInstructors}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">active today</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Zone 2 & Zone 6 */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            
            {/* ZONE 2: Pending Actions (Bookings) */}
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 backdrop-blur-md relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Pending Actions
                </h3>
                <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-500 px-2 py-1 rounded-lg">{pendingBookings.length} waiting</span>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="text-center py-8 text-[rgb(var(--color-text-3))] text-sm italic font-mono bg-[rgb(var(--color-void))] rounded-2xl border border-[rgb(var(--color-border))]/50">
                  Inbox zero! All bookings processed.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingBookings.map((bk) => (
                    <div key={bk.id} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/60 p-4 rounded-2xl flex flex-col gap-3 transition-colors hover:border-[rgb(var(--color-primary))]/50">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{bk.name}</span>
                          <span className="text-xs text-[rgb(var(--color-text-3))] font-mono">{bk.phone}</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] px-2 py-0.5 rounded-lg border border-[rgb(var(--color-primary))]/20">
                          {bk.trainingType}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedBooking(bk)}
                        className="w-full py-2 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[rgb(var(--color-primary))]/20"
                      >
                        Review & Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ZONE 6: Recent Activity (System Logs) */}
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 backdrop-blur-md flex-1">
              <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[rgb(var(--color-text-3))]" /> Recent Activity
              </h3>
              
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
                {recentActivity.map((evt) => (
                  <div key={evt.id} className="flex gap-3 items-start border-l-2 border-[rgb(var(--color-border))] pl-3 relative">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[rgb(var(--color-text-3))]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[rgb(var(--color-text-1))] leading-snug">{evt.message}</span>
                      <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {evt.timeAgo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Zones 3, 4, 5 */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* ZONE 3: Engagement Graph */}
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[rgb(var(--color-primary))]" /> Engagement Trends
                </h3>
                <span className="text-xs text-[rgb(var(--color-text-3))] font-mono">Last 7 Days</span>
              </div>

              <div className="h-40 w-full flex items-end gap-2 px-2 pb-2 mt-4 relative">
                {/* Horizontal guide lines */}
                <div className="absolute left-0 right-0 top-0 border-t border-[rgb(var(--color-border))]/30 border-dashed" />
                <div className="absolute left-0 right-0 top-1/2 border-t border-[rgb(var(--color-border))]/30 border-dashed" />
                <div className="absolute left-0 right-0 bottom-6 border-t border-[rgb(var(--color-border))]/60" />
                
                {engagementData.map((d, i) => {
                  const hPercent = (d.activeStudents / maxActive) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative z-10">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] text-[10px] py-1 px-2 rounded-lg font-mono whitespace-nowrap shadow-lg">
                        {d.activeStudents} students, {d.xpAwarded} XP
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className="w-full max-w-[24px] bg-[rgb(var(--color-primary))] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"
                        style={{ height: `calc(${hPercent}% - 24px)` }}
                      />
                      
                      {/* Label */}
                      <span className="text-[10px] font-mono text-[rgb(var(--color-text-3))]">{d.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ZONE 4: Top Students (Leaderboard) */}
              <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 backdrop-blur-md">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Top Students
                </h3>
                
                <div className="flex flex-col gap-3">
                  {topStudents.map((stu, i) => (
                    <div key={stu.id} className="flex items-center gap-3 p-3 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/50 rounded-2xl">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? 'bg-amber-500/20 text-amber-500' :
                        i === 1 ? 'bg-slate-400/20 text-slate-400' :
                        i === 2 ? 'bg-amber-700/20 text-amber-700' :
                        'bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-3))]'
                      }`}>
                        #{i + 1}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-sm font-bold text-[rgb(var(--color-text-1))] truncate">{stu.name}</span>
                        <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono">Level {stu.level}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[rgb(var(--color-primary))] font-mono">{stu.xp} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ZONE 5: Instructor Load */}
              <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 backdrop-blur-md">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" /> Instructor Load
                </h3>
                
                <div className="flex flex-col gap-4">
                  {instructors.map((ins) => (
                    <div key={ins.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[rgb(var(--color-text-1))]">{ins.name}</span>
                        <span className="text-[rgb(var(--color-text-3))] font-mono">{ins.studentCount} students</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-[rgb(var(--color-border))] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500"
                            style={{ width: `${Math.min(ins.sessionsThisWeek * 5, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[rgb(var(--color-text-2))]">{ins.sessionsThisWeek} sess/wk</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] font-mono mt-1 border-t border-[rgb(var(--color-border))]/50 pt-1">
                        <span className="text-[rgb(var(--color-text-3))]">Feedback completion:</span>
                        <span className={ins.feedbackRate < 80 ? 'text-amber-500' : 'text-emerald-500'}>{ins.feedbackRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Approve Booking Modal overlay */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">Onboard Student</h2>
                <button 
                  onClick={() => { setSelectedBooking(null); setOnboardingStatus('idle'); setOnboardMessage(''); }}
                  className="w-8 h-8 rounded-full bg-[rgb(var(--color-void))] flex items-center justify-center text-[rgb(var(--color-text-3))] hover:text-white border border-[rgb(var(--color-border))]"
                >
                  &times;
                </button>
              </div>

              {onboardingStatus === 'success' ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-emerald-500">
                  <CheckCircle className="w-16 h-16" />
                  <p className="text-sm font-bold text-center">{onboardMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleApprove} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[rgb(var(--color-text-3))]">Name</label>
                      <input type="text" readOnly value={selectedBooking.name} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-2 text-sm text-[rgb(var(--color-text-2))] outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[rgb(var(--color-text-3))]">Training Type</label>
                      <input type="text" readOnly value={selectedBooking.trainingType} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-2 text-sm text-[rgb(var(--color-text-2))] outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-xs font-bold text-[rgb(var(--color-text-3))]">Email (for login)</label>
                      <input type="text" readOnly value={selectedBooking.email} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-2 text-sm text-[rgb(var(--color-text-2))] outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-[rgb(var(--color-border))]/50 mt-2">
                    <label className="text-xs font-bold text-[rgb(var(--color-primary))]">Assign Primary Instructor</label>
                    <select
                      required
                      value={assignedInstructor}
                      onChange={(e) => setAssignedInstructor(e.target.value)}
                      className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] rounded-xl px-3 py-3 text-sm font-medium text-[rgb(var(--color-text-1))] outline-none transition-colors"
                    >
                      <option value="" disabled>Select an instructor...</option>
                      {instructors.map(ins => (
                        <option key={ins.id} value={ins.id}>
                          {ins.name} ({ins.studentCount} students currently)
                        </option>
                      ))}
                    </select>
                  </div>

                  {onboardingStatus === 'error' && (
                    <div className="p-3 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-xl border border-rose-500/20 text-center">
                      {onboardMessage}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => { setSelectedBooking(null); setOnboardingStatus('idle'); setOnboardMessage(''); }}
                      className="flex-1 py-3 bg-[rgb(var(--color-void))] hover:bg-[rgb(var(--color-border))]/40 border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] rounded-xl text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={onboardingStatus === 'loading' || !assignedInstructor}
                      className="flex-1 py-3 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {onboardingStatus === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Approve & Create Account</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
