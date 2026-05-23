"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Sliders,
  UserCheck,
  Users,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface SkillItem {
  name: string
  score: number
}

interface DailyLogItem {
  date: string
  note: string
}

interface StudentSession {
  id: string
  studentId: string
  dateTime: string
  durationHours: number
  topic: string
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

interface AssignedStudent {
  id: string
  name: string
  email: string
  license: string
  enrollmentDate: string
  totalSessions: number
  completionPercent: number
  skills: SkillItem[]
  dailyLog: DailyLogItem[]
  feeStatus?: string
  drivingTests?: any[]
  todaySession: StudentSession | null
}

interface InstructorDashboardProps {
  instructor: {
    id: string
    name: string
  }
  initialStudents: AssignedStudent[]
}

export default function InstructorDashboardClient({ instructor, initialStudents }: InstructorDashboardProps) {
  const [students, setStudents] = useState<AssignedStudent[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [attendanceAlert, setAttendanceAlert] = useState<string | null>(null)
  const [dailyNote, setDailyNote] = useState('')
  const [activeDate] = useState(() => new Date().toISOString().split('T')[0])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentStudent = students.find(s => s.id === selectedStudentId)

  // Roster fetch helper to refresh student list after operations
  const fetchRoster = async () => {
    try {
      const res = await fetch('/api/instructor/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (currentStudent) {
      const todayLog = currentStudent.dailyLog.find(l => l.date === activeDate)
      setDailyNote(todayLog ? todayLog.note : '')
    } else {
      setDailyNote('')
    }
  }, [selectedStudentId, currentStudent, activeDate])

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDailyNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDailyNote(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (!selectedStudentId) return
      
      try {
        const res = await fetch('/api/instructor/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: selectedStudentId,
            date: activeDate,
            note: value
          })
        })
        if (res.ok) {
          setStudents(prev => prev.map(s => {
            if (s.id !== selectedStudentId) return s
            const logs = [...s.dailyLog]
            const existingIdx = logs.findIndex(l => l.date === activeDate)
            if (existingIdx !== -1) {
              logs[existingIdx] = { date: activeDate, note: value }
            } else {
              logs.unshift({ date: activeDate, note: value })
            }
            return { ...s, dailyLog: logs }
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }, 1000)
  }

  const handleAttendance = async (studentId: string, sessionId: string, status: 'Present' | 'Absent') => {
    try {
      const res = await fetch('/api/instructor/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, sessionId, status })
      })

      if (res.ok) {
        setAttendanceAlert(`Attendance marked: student was ${status.toUpperCase()}!`)
        fetchRoster()
        
        setTimeout(() => {
          setAttendanceAlert(null)
        }, 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleProgressChange = async (studentId: string, skill: string, score: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s
      return {
        ...s,
        skills: s.skills.map(sk => sk.name === skill ? { ...sk, score } : sk)
      }
    }))

    try {
      await fetch('/api/instructor/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, skill, score })
      })
    } catch (e) {
      console.error(e)
    }
  }

  // Zone 1 Helper: filter students who have scheduled sessions today
  const todaySchedules = students
    .filter(s => s.todaySession)
    .map(s => ({
      studentId: s.id,
      studentName: s.name,
      session: s.todaySession!
    }))

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] relative pb-20 overflow-x-hidden pt-28">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[rgb(var(--color-primary))]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-[rgb(var(--color-accent))]/5 rounded-full blur-[90px] pointer-events-none -z-10" />

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
              <p className="text-white/80 font-medium text-lg">Instructor Workspace</p>
              <h1 className="text-3xl font-bold font-display mt-1">Coaching Console</h1>
              <p className="text-white/60 text-sm mt-1 max-w-xl">Review active slots, log attendance, and grade students on practical skills.</p>
            </div>
            <Link 
              href="/instructor/schedule"
              className="px-5 py-2.5 bg-white text-[rgb(var(--color-primary))] hover:bg-white/90 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Calendar className="w-5 h-5" />
              View Full Calendar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8 -mt-20 relative z-10">

        {/* Attendance Notification Toast */}
        <AnimatePresence>
          {attendanceAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-500 text-white px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{attendanceAlert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          
          {/* LEFT PANEL: ZONE 1 (Active Slots/Roster) & Search */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-bold flex items-center justify-center">1</div>
              <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">Active Slots</h2>
            </div>
            
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-5 shadow-sm flex flex-col gap-4 backdrop-blur-md">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-3))]" />
                <input
                  type="text"
                  placeholder="Search roster..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] pl-11 pr-4 py-3 rounded-2xl text-sm font-medium text-[rgb(var(--color-text-1))] placeholder-[rgb(var(--color-text-3))] transition-all outline-none"
                />
              </div>

              {/* Roster Listings */}
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-widest pt-2">
                  Today's Slots ({filteredStudents.length})
                </span>
                
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-[rgb(var(--color-text-3))] text-xs italic">
                    No matching students found.
                  </div>
                ) : (
                  filteredStudents.map((stu) => {
                    const isActive = selectedStudentId === stu.id
                    const r = 14
                    const circ = 2 * Math.PI * r
                    const strokeOffset = circ - (circ * stu.completionPercent) / 100

                    return (
                      <div
                        key={stu.id}
                        onClick={() => setSelectedStudentId(stu.id)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isActive 
                            ? 'bg-[rgb(var(--color-void))] border-[rgb(var(--color-primary))] ring-1 ring-[rgb(var(--color-primary))]/20 shadow-inner' 
                            : 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]/60 hover:border-[rgb(var(--color-border))]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center font-bold text-lg">
                            {stu.name[0]}
                          </div>
                          
                          <div className="flex flex-col text-left">
                            <span className={`text-sm font-bold ${isActive ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-1))]'}`}>
                              {stu.name}
                            </span>
                            <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono">
                              {stu.todaySession ? '📅 Session Today' : 'No Today Session'}
                            </span>
                          </div>
                        </div>

                        <div className="relative w-9 h-9 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r={r} stroke="currentColor" className="text-[rgb(var(--color-border))]" strokeWidth="3" fill="none" />
                            <circle
                              cx="18"
                              cy="18"
                              r={r}
                              stroke="currentColor"
                              className="text-[rgb(var(--color-primary))]"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray={circ}
                              strokeDashoffset={strokeOffset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-[rgb(var(--color-text-2))]">
                            {stu.completionPercent}%
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: ACTIONS FOR SELECTED STUDENT */}
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {currentStudent ? (
                <motion.div
                  key={currentStudent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  
                  {/* ZONE 2: Selected Student Profile */}
                  <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center font-bold text-3xl">
                        {currentStudent.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2 flex-wrap">
                          {currentStudent.name}
                          <span className="bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                            {currentStudent.license}
                          </span>
                          
                          {/* Course Fee Alert */}
                          {currentStudent.feeStatus === 'PENDING' && (
                            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                              ⚠️ Fee Due
                            </span>
                          )}
                        </h2>
                        <div className="text-xs text-[rgb(var(--color-text-3))] mt-1 flex flex-wrap items-center gap-3 font-mono">
                          <span>{currentStudent.email}</span>
                          <span>•</span>
                          <span>Joined {currentStudent.enrollmentDate}</span>
                          <span>•</span>
                          <span>{currentStudent.totalSessions} Sessions done</span>
                          
                          {/* Driving Test Alert */}
                          {currentStudent.drivingTests?.some(t => t.result === 'SCHEDULED') && (
                            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Upcoming Test
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedStudentId(null)}
                      className="px-4 py-2 bg-[rgb(var(--color-void))] hover:bg-[rgb(var(--color-border))]/40 border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] rounded-xl text-xs font-bold transition-all"
                    >
                      Deselect
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* ZONE 3: Attendance Buttons */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center">2</div>
                        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">Verify Attendance</h3>
                      </div>

                      {currentStudent.todaySession ? (
                        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl flex flex-col gap-5 h-full backdrop-blur-md justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-primary))] uppercase tracking-widest block">TODAY'S TOPIC</span>
                            <h4 className="text-lg font-bold text-[rgb(var(--color-text-1))] mt-1">{currentStudent.todaySession.topic}</h4>
                            <p className="text-xs text-[rgb(var(--color-text-3))] mt-1 font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> Duration: {currentStudent.todaySession.durationHours} Hours
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAttendance(currentStudent.id, currentStudent.todaySession!.id, 'Present')}
                              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-wider font-mono"
                            >
                              <UserCheck className="w-4 h-4" />
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendance(currentStudent.id, currentStudent.todaySession!.id, 'Absent')}
                              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/10 uppercase tracking-wider font-mono"
                            >
                              <XCircle className="w-4 h-4" />
                              Absent
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-8 rounded-3xl text-center text-[rgb(var(--color-text-3))] flex flex-col items-center justify-center h-full gap-2 backdrop-blur-md">
                          <CheckCircle2 className="w-10 h-10 text-[rgb(var(--color-text-3))] opacity-60" />
                          <span className="text-sm italic font-mono">No active session scheduled today.</span>
                        </div>
                      )}
                    </div>

                    {/* ZONE 4: Logbook (Daily Quick Log) */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-2xl bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))] font-bold flex items-center justify-center">3</div>
                        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">Logbook</h3>
                      </div>

                      <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl flex flex-col gap-4 shadow-sm h-full backdrop-blur-md">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[rgb(var(--color-text-2))]">Daily Quick Log</span>
                          <span className="text-[9px] font-mono font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Auto-saving</span>
                        </div>
                        <textarea
                          placeholder="Write driving observations (mirror checks, clutch balance, lane position, etc.)..."
                          value={dailyNote}
                          onChange={handleDailyNoteChange}
                          className="w-full h-32 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] p-4 rounded-2xl text-xs font-medium text-[rgb(var(--color-text-1))] resize-none outline-none transition-all leading-relaxed"
                        />
                      </div>
                    </div>

                  </div>

                  {/* ZONE 5: Skill Sliders */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-bold flex items-center justify-center">4</div>
                      <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">Skill Sliders</h3>
                    </div>

                    <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl flex flex-col gap-6 backdrop-blur-md">
                      <h4 className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-widest flex items-center gap-2 border-b border-[rgb(var(--color-border))]/60 pb-2">
                        <Sliders className="w-4 h-4 text-[rgb(var(--color-primary))]" /> Practical Scoring (Scale 1-10)
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentStudent.skills.map((sk) => (
                          <div key={sk.name} className="flex flex-col gap-2 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/50 p-4 rounded-2xl">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-[rgb(var(--color-text-2))]">{sk.name}</span>
                              <span className="text-[rgb(var(--color-primary))] font-mono bg-[rgb(var(--color-primary))]/10 px-2 py-0.5 rounded">{sk.score}/10</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={sk.score}
                              onChange={(e) => handleProgressChange(currentStudent.id, sk.name, parseInt(e.target.value))}
                              className="w-full h-2 bg-[rgb(var(--color-border))] rounded-lg appearance-none cursor-pointer accent-[rgb(var(--color-primary))]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="bg-[rgb(var(--color-surface))] border-2 border-dashed border-[rgb(var(--color-border))] rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] backdrop-blur-md">
                    <div className="w-16 h-16 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-2xl flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 text-[rgb(var(--color-primary))]" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">No Student Selected</h2>
                    <p className="text-[rgb(var(--color-text-3))] mt-2 text-sm max-w-sm">
                      Select a student from the active slot list on the left to display their logbook, verify attendance, and adjust practical score sliders.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  )
}
