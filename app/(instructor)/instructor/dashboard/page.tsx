"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVirtualizer } from '@tanstack/react-virtual'
import { 
  Search, 
  User, 
  Calendar, 
  Clipboard, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock, 
  Plus, 
  BookOpen, 
  Sliders, 
  AlertTriangle,
  ArrowRight,
  UserCheck
} from 'lucide-react'

interface SkillItem {
  name: string
  score: number
}

interface FeedbackTimelineItem {
  id: string
  topic: string
  date: string
  rating: number
  comments: string
  tag: 'Strength' | 'Needs Work' | 'Critical'
}

interface DailyLogItem {
  date: string
  note: string
}

interface StudentSession {
  id: string
  studentId: string
  instructorId: string
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
  feedbackTimeline: FeedbackTimelineItem[]
  dailyLog: DailyLogItem[]
  todaySession: StudentSession | null
}

export default function InstructorCoachingDashboard() {
  const [students, setStudents] = useState<AssignedStudent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  
  // Dynamic action overlays
  const [attendanceAlert, setAttendanceAlert] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Feedback fields
  const [feedbackComments, setFeedbackComments] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(4)
  const [feedbackTag, setFeedbackTag] = useState<'Strength' | 'Needs Work' | 'Critical'>('Strength')

  // Debounced daily log state
  const [dailyNote, setDailyNote] = useState('')
  const [activeDate] = useState(() => new Date().toISOString().split('T')[0])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch instructor assigned student roster
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
    const initFetch = async () => {
      setLoading(true)
      await fetchRoster()
      setLoading(false)
    }
    initFetch()
  }, [])

  // Retrieve current active student from state
  const currentStudent = students.find(s => s.id === selectedStudentId)

  // Sync daily note field when active student switches
  useEffect(() => {
    if (currentStudent) {
      const todayLog = currentStudent.dailyLog.find(l => l.date === activeDate)
      setDailyNote(todayLog ? todayLog.note : '')
    } else {
      setDailyNote('')
    }
  }, [selectedStudentId, currentStudent, activeDate])

  // Real-time search filter query (Zustand-like instant state matching)
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: filteredStudents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5
  })

  // ----------------------------------------------------
  // DEBOUNCED DAILY COACHING LOG (1s raw debounce useRef)
  // ----------------------------------------------------
  const handleDailyNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDailyNote(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (!selectedStudentId) return
      
      try {
        console.log(`DEBOUNCING: Saving coaching daily log for student ${selectedStudentId}...`)
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
          // Re-fetch locally to update log lists without UI flicker
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

  // ----------------------------------------------------
  // ATTENDANCE SUBMISSION ACTION
  // ----------------------------------------------------
  const handleAttendance = async (studentId: string, sessionId: string, status: 'Present' | 'Absent') => {
    try {
      const res = await fetch('/api/instructor/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, sessionId, status })
      })

      if (res.ok) {
        setAttendanceAlert(`Attendance marked: student was ${status.toUpperCase()}!`)
        fetchRoster() // Refresh rosters
        
        // Auto-dismiss alert banner after 2 seconds
        setTimeout(() => {
          setAttendanceAlert(null)
        }, 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ----------------------------------------------------
  // PROGRESS SCORE SLIDER SUBMISSION ACTION
  // ----------------------------------------------------
  const handleProgressChange = async (studentId: string, skill: string, score: number) => {
    // Update local state first to feel ultra-snappy and reactive
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

  // ----------------------------------------------------
  // LESSON FEEDBACK SUBMISSION ACTION
  // ----------------------------------------------------
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId || !feedbackComments.trim()) return

    try {
      const res = await fetch('/api/instructor/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentId,
          comments: feedbackComments,
          rating: feedbackRating,
          tag: feedbackTag
        })
      })

      if (res.ok) {
        setFeedbackComments('')
        fetchRoster() // Refresh timeline lists
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Find all scheduled sessions of today from all students to display in Schedule view
  const todaySchedules = students
    .filter(s => s.todaySession)
    .map(s => ({
      studentId: s.id,
      studentName: s.name,
      session: s.todaySession!
    }))

  return (
    <div className="min-h-screen bg-void text-text-1 font-body relative pb-16 pt-24">
      
      {/* Glow elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Roster Container */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
        
        {/* Hub Header */}
        <header className="border-b border-border pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Coaching Station</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5">
              Instructor Workspace
            </h1>
            <p className="text-xs text-text-2 mt-1">
              Track student progress, mark daily logs, and coordinate roadmap validations in real-time.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-mono bg-white/[0.03] border border-border px-3 py-1.5 rounded-full text-text-2 uppercase">
              INSTRUCTOR ID: HARPREET_S
            </span>
          </div>
        </header>

        {/* Dynamic green confirmation strip */}
        <AnimatePresence>
          {attendanceAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-success/90 border border-success/30 text-white px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-lg shadow-success/15"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{attendanceAlert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            <Clock className="w-8 h-8 text-primary animate-spin" />
            <span className="text-[10px] text-text-3 font-mono">LOADING ASSIGNED COACHING ROSTERS...</span>
          </div>
        ) : (
          /* WORKSPACE SPLIT PANEL (35% left, 65% right) */
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 items-start">
            
            {/* ----------------------------------------------------
                LEFT PANEL: STUDENT ROSTER (35%)
                ---------------------------------------------------- */}
            <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col gap-4 shadow-lg">
              
              {/* Search Bar at Top */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input
                  type="text"
                  placeholder="Filter cadets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-void/60 border border-border/80 focus:border-primary pl-10 pr-4 py-2.5 rounded-2xl text-xs text-text-1 placeholder-text-3 transition-all duration-300 outline-none"
                />
              </div>

              {/* Roster student lists */}
              <div 
                ref={parentRef}
                className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto scrollbar-none relative"
                style={{ height: '500px' }}
              >
                <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider px-1">Assigned Cadets ({filteredStudents.length})</span>
                
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-text-3">
                    No matching cadets assigned.
                  </div>
                ) : (
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative'
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const stu = filteredStudents[virtualRow.index]
                      const isActive = selectedStudentId === stu.id
                      
                      // Small SVG 32px progress ring dimensions: radius=12, circumference=75.4
                      const r = 12
                      const circ = 2 * Math.PI * r
                      const strokeOffset = circ - (circ * stu.completionPercent) / 100

                      return (
                        <div
                          key={stu.id}
                          onClick={() => setSelectedStudentId(stu.id)}
                          className={`absolute left-0 top-0 w-full p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                            isActive 
                              ? 'bg-primary/5 border-primary border-l-4 text-text-1' 
                              : 'bg-void/40 border-border hover:bg-white/[0.02]'
                          }`}
                          style={{
                            height: '56px',
                            transform: `translateY(${virtualRow.start}px)`
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar Circle */}
                            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0 text-xs font-display">
                              {stu.name[0]}
                            </div>
                            
                            <div className="flex flex-col text-left min-w-0">
                              <span className="text-xs font-bold text-text-1 truncate">{stu.name}</span>
                              <span className="text-[9px] font-mono text-text-3 mt-0.5 truncate">Joined {stu.enrollmentDate}</span>
                            </div>
                          </div>

                          {/* Small SVG 32px Progress Ring */}
                          <div className="relative w-8 h-8 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r={r} stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" fill="none" />
                              <circle
                                cx="16"
                                cy="16"
                                r={r}
                                stroke="var(--color-primary)"
                                strokeWidth="2.5"
                                fill="none"
                                strokeDasharray={circ}
                                strokeDashoffset={strokeOffset}
                                strokeLinecap="round"
                                className="transition-all duration-500 ease-out"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[7.5px] font-mono text-text-2">
                              {stu.completionPercent}%
                            </span>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ----------------------------------------------------
                RIGHT PANEL: WORKSPACE SCREEN (65%)
                ---------------------------------------------------- */}
            <div className="bg-surface border border-border rounded-3xl p-6 min-h-[500px] shadow-lg relative flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {currentStudent ? (
                  
                  /* A: STUDENT DETAIL DETAIL VIEW */
                  <motion.div
                    key={currentStudent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Top Strip */}
                    <div className="border-b border-border/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-extrabold text-text-1 font-display tracking-tight">{currentStudent.name}</h2>
                          <span className="bg-primary/10 border border-primary/20 text-primary text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                            {currentStudent.license} Category
                          </span>
                        </div>
                        <p className="text-[10px] text-text-3 mt-1 font-mono">
                          REGISTRY: {currentStudent.email} · {currentStudent.totalSessions} TOTAL LESSONS LOGGED
                        </p>
                      </div>

                      {/* Quick action helper markers */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedStudentId(null)}
                          className="px-3.5 py-1.5 bg-void hover:bg-white/[0.02] border border-border text-text-2 hover:text-text-1 rounded-xl text-[10px] font-bold transition-all duration-200"
                        >
                          Roster Schedule
                        </button>
                      </div>
                    </div>

                    {/* Attendance mark module */}
                    {currentStudent.todaySession ? (
                      <div className="bg-void/60 border border-border p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-left">
                          <span className="text-[9px] font-mono text-accent uppercase font-bold block">TODAY SCHEDULED SESSION</span>
                          <h4 className="text-xs font-bold text-text-1 mt-0.5">{currentStudent.todaySession.topic}</h4>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handleAttendance(currentStudent.id, currentStudent.todaySession!.id, 'Present')}
                            className="flex-1 md:flex-none px-3.5 py-2 bg-success text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-success/10 hover:bg-success/90 transition-all duration-200"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Mark Present
                          </button>
                          <button
                            onClick={() => handleAttendance(currentStudent.id, currentStudent.todaySession!.id, 'Absent')}
                            className="flex-1 md:flex-none px-3.5 py-2 bg-danger text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-danger/10 hover:bg-danger/90 transition-all duration-200"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Mark Absent
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-void/30 border border-border/40 p-3 rounded-2xl text-center text-text-3 text-[10px] font-mono">
                        NO ACTIVE SESSION SCHEDULED FOR THIS CADET TODAY.
                      </div>
                    )}

                    {/* Progress Section (Sliders) */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
                        <Sliders className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-mono text-text-2 uppercase tracking-wider font-bold">Practical Scoreboard Controls</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentStudent.skills.map((sk) => (
                          <div key={sk.name} className="bg-void/40 border border-border p-3.5 rounded-xl flex flex-col gap-2 text-left">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-text-1">{sk.name} Module</span>
                              <span className="font-mono text-primary font-bold">{sk.score} / 10</span>
                            </div>

                            {/* Score range slider */}
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={sk.score}
                              onChange={(e) => handleProgressChange(currentStudent.id, sk.name, parseInt(e.target.value))}
                              className="w-full accent-primary bg-void h-1.5 rounded-lg appearance-none cursor-pointer border border-border/60"
                            />
                            <span className="text-[8px] text-text-3 font-mono text-right">Drag to edit inline scoreboard</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Form and past logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* Left: Add Feedback Form */}
                      <form onSubmit={handleFeedbackSubmit} className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col gap-3.5 text-left">
                        <span className="text-[10px] font-mono text-primary uppercase font-bold block border-b border-border/40 pb-1">Log Lesson Commentary</span>
                        
                        <textarea
                          placeholder="Note down practical control dynamics, observations, or warnings..."
                          value={feedbackComments}
                          onChange={(e) => setFeedbackComments(e.target.value)}
                          className="w-full h-24 bg-void border border-border/80 focus:border-primary p-3 rounded-xl text-xs text-text-1 placeholder-text-3 resize-none outline-none transition-all duration-200"
                        />

                        {/* Tag Selector pills */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-mono text-text-3 uppercase">Priority tag:</span>
                          <div className="flex gap-1.5">
                            {['Strength', 'Needs Work', 'Critical'].map((tag) => {
                              const isSelected = feedbackTag === tag
                              let pillStyle = 'border-border bg-void text-text-3'
                              
                              if (isSelected) {
                                pillStyle = tag === 'Strength' ? 'bg-success/15 border-success text-success font-bold' :
                                            tag === 'Needs Work' ? 'bg-accent/15 border-accent text-accent font-bold' :
                                            'bg-danger/15 border-danger text-danger font-bold'
                              }

                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => setFeedbackTag(tag as any)}
                                  className={`px-2.5 py-1 text-[9px] border rounded-full transition-all duration-200 ${pillStyle}`}
                                >
                                  {tag}
                                </button>
                              )}
                            )}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={!feedbackComments.trim()}
                          className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1 transition-all duration-200 disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Publish Lesson Commentary
                        </button>
                      </form>

                      {/* Right: Debounced Daily Coaching Log (last 7 days) */}
                      <div className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col gap-3.5 text-left">
                        <div className="flex justify-between items-center border-b border-border/40 pb-1">
                          <span className="text-[10px] font-mono text-accent uppercase font-bold">Daily Coaching Logs</span>
                          <span className="text-[8px] font-mono text-text-3 uppercase">Auto-Saves</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-mono text-text-3 block">TODAY NOTE ({activeDate}):</span>
                          <textarea
                            placeholder="Add brief daily observations... (auto-saves on 1s pause)"
                            value={dailyNote}
                            onChange={handleDailyNoteChange}
                            className="w-full h-20 bg-void border border-border focus:border-accent p-2.5 rounded-xl text-xs text-text-1 placeholder-text-3 resize-none outline-none transition-all duration-200"
                          />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider block">Past Log Archives</span>
                          <div className="flex flex-col gap-2 max-h-[110px] overflow-y-auto scrollbar-none">
                            {currentStudent.dailyLog.map((log, idx) => (
                              <div key={idx} className="border border-border/40 p-2 rounded-lg text-[9px] flex flex-col gap-0.5">
                                <span className="font-mono text-text-3">{log.date}</span>
                                <p className="text-text-2 font-mono leading-relaxed mt-0.5">{log.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Feedback timeline */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-mono text-text-2 uppercase tracking-wider font-bold">Timeline commentary logs</h4>
                      </div>

                      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto scrollbar-none text-left">
                        {currentStudent.feedbackTimeline.length === 0 ? (
                          <div className="text-center py-6 text-text-3 text-[10px] font-mono">
                            NO PREVIOUS COMMENTARIES FILED FOR THIS CADET.
                          </div>
                        ) : (
                          currentStudent.feedbackTimeline.map((feed) => (
                            <div key={feed.id} className="border border-border p-3.5 rounded-xl flex gap-3.5 items-start">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                feed.tag === 'Strength' ? 'bg-success' :
                                feed.tag === 'Needs Work' ? 'bg-accent' :
                                'bg-danger'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className="font-bold text-text-1">{feed.topic}</span>
                                  <span className="text-text-3 font-mono">[{feed.date}]</span>
                                </div>
                                <p className="text-xs text-text-2 leading-relaxed mt-1 font-body">
                                  {feed.comments}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  
                  /* B: TODAY SCHEDULE OVERVIEW VIEW (WHEN NO STUDENT SELECTED) */
                  <motion.div
                    key="schedule"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="border-b border-border/80 pb-4">
                      <h2 className="text-xl font-extrabold text-text-1 font-display tracking-tight">Today Coaching Schedule</h2>
                      <p className="text-[10px] text-text-3 mt-1 font-mono">
                        COACHING SLOTS FOR TODAY IN TIME SEQUENCE FLOWS
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {todaySchedules.length === 0 ? (
                        <div className="text-center py-20 text-text-3 flex flex-col items-center gap-3">
                          <Calendar className="w-10 h-10 text-border" />
                          <span className="text-xs font-mono">NO ACTIVE COACHING SLOTS FILED FOR TODAY.</span>
                        </div>
                      ) : (
                        todaySchedules.map((item, idx) => {
                          const dateObj = new Date(item.session.dateTime)
                          const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                          return (
                            <div
                              key={item.session.id}
                              onClick={() => setSelectedStudentId(item.studentId)}
                              className="p-4 bg-void/40 hover:bg-void/90 border border-border hover:border-primary rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 group text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="px-3 py-2 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-xl flex flex-col items-center font-mono">
                                  <Clock className="w-3.5 h-3.5 mb-0.5" />
                                  {timeStr}
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-text-1 group-hover:text-primary transition-all duration-200">
                                    {item.studentName}
                                  </span>
                                  <span className="text-[10px] text-text-3 font-mono mt-0.5">
                                    {item.session.topic} (Duration {item.session.durationHours} hrs)
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[8.5px] border ${
                                  item.session.status === 'SCHEDULED' ? 'bg-primary/15 border-primary/25 text-primary' :
                                  item.session.status === 'ACTIVE' ? 'bg-accent/15 border-accent/25 text-accent' :
                                  'bg-success/15 border-success/25 text-success'
                                }`}>
                                  {item.session.status}
                                </span>
                                <ArrowRight className="w-4 h-4 text-text-3 group-hover:translate-x-1 transition-transform duration-200" />
                              </div>

                            </div>
                          )
                        })
                      )}
                    </div>

                    <div className="bg-void/40 border border-border p-5 rounded-2xl mt-4 flex items-start gap-3.5 text-left">
                      <AlertTriangle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <div className="text-xs leading-relaxed text-text-2">
                        <span className="font-bold text-text-1 font-mono uppercase">Coaching Guideline:</span>{' '}
                        Before marking cadet rosters present or absent, perform visual cockpit validations. Ensure score edits are fully logged inside the scoreboard sliders during road test operations.
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}
