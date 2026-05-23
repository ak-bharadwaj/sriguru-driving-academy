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

import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    instructorWorkspace: 'Instructor Workspace',
    coachingConsole: 'Coaching Console',
    consoleDesc: 'Review active slots, log attendance, and grade students on practical skills.',
    viewCalendar: 'View Full Calendar',
    activeSlots: 'Active Slots',
    searchRoster: 'Search roster...',
    todaysSlots: "Today's Slots",
    noStudents: 'No matching students found.',
    sessionToday: '📅 Session Today',
    noSessionToday: 'No Today Session',
    feeDue: '⚠️ Fee Due',
    joined: 'Joined',
    sessionsDone: 'Sessions done',
    upcomingTest: 'Upcoming Test',
    deselect: 'Deselect',
    verifyAttendance: 'Verify Attendance',
    todaysTopic: "TODAY'S TOPIC",
    duration: 'Duration',
    hours: 'Hours',
    present: 'Present',
    absent: 'Absent',
    noActiveSession: 'No active session scheduled today.',
    logbook: 'Logbook',
    dailyQuickLog: 'Daily Quick Log',
    autoSaving: 'Auto-saving',
    logPlaceholder: 'Write driving observations (mirror checks, clutch balance, lane position, etc.)...',
    skillSliders: 'Skill Sliders',
    practicalScoring: 'Practical Scoring (Scale 1-10)',
    noStudentSelected: 'No Student Selected',
    noStudentDesc: 'Select a student from the active slot list on the left to display their logbook, verify attendance, and adjust practical score sliders.',
  },
  HI: {
    instructorWorkspace: 'प्रशिक्षक कार्यक्षेत्र',
    coachingConsole: 'कोचिंग कंसोल',
    consoleDesc: 'सक्रिय स्लॉट की समीक्षा करें, उपस्थिति दर्ज करें, और व्यावहारिक कौशल पर छात्रों को ग्रेड दें।',
    viewCalendar: 'पूरा कैलेंडर देखें',
    activeSlots: 'सक्रिय स्लॉट',
    searchRoster: 'रोस्टर खोजें...',
    todaysSlots: "आज के स्लॉट",
    noStudents: 'कोई छात्र नहीं मिला।',
    sessionToday: '📅 आज का सत्र',
    noSessionToday: 'आज कोई सत्र नहीं',
    feeDue: '⚠️ शुल्क बकाया',
    joined: 'शामिल हुए',
    sessionsDone: 'सत्र पूरे हुए',
    upcomingTest: 'आगामी टेस्ट',
    deselect: 'चयन रद्द करें',
    verifyAttendance: 'उपस्थिति सत्यापित करें',
    todaysTopic: "आज का विषय",
    duration: 'अवधि',
    hours: 'घंटे',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    noActiveSession: 'आज कोई सक्रिय सत्र निर्धारित नहीं है।',
    logbook: 'लॉगबुक',
    dailyQuickLog: 'दैनिक त्वरित लॉग',
    autoSaving: 'स्वत: सहेजा जा रहा है',
    logPlaceholder: 'ड्राइविंग टिप्पणियां लिखें (मिरर जांच, क्लच संतुलन, लेन स्थिति, आदि)...',
    skillSliders: 'कौशल स्लाइडर',
    practicalScoring: 'व्यावहारिक स्कोरिंग (स्केल 1-10)',
    noStudentSelected: 'कोई छात्र चयनित नहीं',
    noStudentDesc: 'उनकी लॉगबुक प्रदर्शित करने, उपस्थिति सत्यापित करने और व्यावहारिक स्कोर स्लाइडर्स को समायोजित करने के लिए बाईं ओर सक्रिय स्लॉट सूची से एक छात्र का चयन करें।',
  },
  TE: {
    instructorWorkspace: 'ఇన్‌స్ట్రక్టర్ వర్క్‌స్పేస్',
    coachingConsole: 'కోచింగ్ కన్సోల్',
    consoleDesc: 'క్రియాశీల స్లాట్‌లను సమీక్షించండి, హాజరు నమోదు చేయండి మరియు ఆచరణాత్మక నైపుణ్యాలపై విద్యార్థులకు గ్రేడ్ ఇవ్వండి.',
    viewCalendar: 'పూర్తి క్యాలెండర్‌ను చూడండి',
    activeSlots: 'యాక్టివ్ స్లాట్‌లు',
    searchRoster: 'రోస్టర్‌ను శోధించండి...',
    todaysSlots: "నేటి స్లాట్‌లు",
    noStudents: 'సరిపోలే విద్యార్థులు కనుగొనబడలేదు.',
    sessionToday: '📅 ఈరోజు సెషన్',
    noSessionToday: 'ఈరోజు సెషన్ లేదు',
    feeDue: '⚠️ ఫీజు బాకీ ఉంది',
    joined: 'చేరారు',
    sessionsDone: 'సెషన్స్ పూర్తయ్యాయి',
    upcomingTest: 'రాబోయే పరీక్ష',
    deselect: 'ఎంపికను తీసివేయండి',
    verifyAttendance: 'హాజరును ధృవీకరించండి',
    todaysTopic: "నేటి అంశం",
    duration: 'వ్యవధి',
    hours: 'గంటలు',
    present: 'హాజరు',
    absent: 'గైర్హాజరు',
    noActiveSession: 'ఈరోజు ఎలాంటి యాక్టివ్ సెషన్ షెడ్యూల్ చేయబడలేదు.',
    logbook: 'లాగ్‌బుక్',
    dailyQuickLog: 'రోజువారీ క్విక్ లాగ్',
    autoSaving: 'ఆటో-సేవింగ్',
    logPlaceholder: 'డ్రైవింగ్ పరిశీలనలను వ్రాయండి (అద్దం తనిఖీలు, క్లచ్ బ్యాలెన్స్, లేన్ స్థానం మొదలైనవి)...',
    skillSliders: 'స్కిల్ స్లైడర్లు',
    practicalScoring: 'ప్రాక్టికల్ స్కోరింగ్ (స్కేల్ 1-10)',
    noStudentSelected: 'ఏ విద్యార్థి ఎంపిక కాలేదు',
    noStudentDesc: 'వారి లాగ్‌బుక్‌ను ప్రదర్శించడానికి, హాజరును ధృవీకరించడానికి మరియు ఆచరణాత్మక స్కోర్ స్లైడర్‌లను సర్దుబాటు చేయడానికి ఎడమ వైపున ఉన్న యాక్టివ్ స్లాట్ జాబితా నుండి విద్యార్థిని ఎంచుకోండి.',
  }
}

export default function InstructorDashboardClient({ instructor, initialStudents }: InstructorDashboardProps) {
  const [students, setStudents] = useState<AssignedStudent[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [attendanceAlert, setAttendanceAlert] = useState<string | null>(null)
  const [dailyNote, setDailyNote] = useState('')
  const [activeDate] = useState(() => new Date().toISOString().split('T')[0])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { language } = useLanguageStore()
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

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
              <p className="text-white/80 font-medium text-lg">{t.instructorWorkspace}</p>
              <h1 className="text-3xl font-bold font-display mt-1">{t.coachingConsole}</h1>
              <p className="text-white/60 text-sm mt-1 max-w-xl">{t.consoleDesc}</p>
            </div>
            <Link 
              href="/instructor/schedule"
              className="px-5 py-2.5 bg-white text-[rgb(var(--color-primary))] hover:bg-white/90 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Calendar className="w-5 h-5" />
              {t.viewCalendar}
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
              <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.activeSlots}</h2>
            </div>
            
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-5 shadow-sm flex flex-col gap-4 backdrop-blur-md">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-3))]" />
                <input
                  type="text"
                  placeholder={t.searchRoster}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] pl-11 pr-4 py-3 rounded-2xl text-sm font-medium text-[rgb(var(--color-text-1))] placeholder-[rgb(var(--color-text-3))] transition-all outline-none"
                />
              </div>

              {/* Roster Listings */}
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-widest pt-2">
                  {t.todaysSlots} ({filteredStudents.length})
                </span>
                
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-[rgb(var(--color-text-3))] text-xs italic">
                    {t.noStudents}
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
                              {stu.todaySession ? t.sessionToday : t.noSessionToday}
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
                              {t.feeDue}
                            </span>
                          )}
                        </h2>
                        <div className="text-xs text-[rgb(var(--color-text-3))] mt-1 flex flex-wrap items-center gap-3 font-mono">
                          <span>{currentStudent.email}</span>
                          <span>•</span>
                          <span>{t.joined} {currentStudent.enrollmentDate}</span>
                          <span>•</span>
                          <span>{currentStudent.totalSessions} {t.sessionsDone}</span>
                          
                          {/* Driving Test Alert */}
                          {currentStudent.drivingTests?.some(t => t.result === 'SCHEDULED') && (
                            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> {t.upcomingTest}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedStudentId(null)}
                      className="px-4 py-2 bg-[rgb(var(--color-void))] hover:bg-[rgb(var(--color-border))]/40 border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] rounded-xl text-xs font-bold transition-all"
                    >
                      {t.deselect}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* ZONE 3: Attendance Buttons */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center">2</div>
                        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">{t.verifyAttendance}</h3>
                      </div>

                      {currentStudent.todaySession ? (
                        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl flex flex-col gap-5 h-full backdrop-blur-md justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-primary))] uppercase tracking-widest block">{t.todaysTopic}</span>
                            <h4 className="text-lg font-bold text-[rgb(var(--color-text-1))] mt-1">{currentStudent.todaySession.topic}</h4>
                            <p className="text-xs text-[rgb(var(--color-text-3))] mt-1 font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {t.duration}: {currentStudent.todaySession.durationHours} {t.hours}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAttendance(currentStudent.id, currentStudent.todaySession!.id, 'Present')}
                              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-wider font-mono"
                            >
                              <UserCheck className="w-4 h-4" />
                              {t.present}
                            </button>
                            <button
                              onClick={() => handleAttendance(currentStudent.id, currentStudent.todaySession!.id, 'Absent')}
                              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/10 uppercase tracking-wider font-mono"
                            >
                              <XCircle className="w-4 h-4" />
                              {t.absent}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-8 rounded-3xl text-center text-[rgb(var(--color-text-3))] flex flex-col items-center justify-center h-full gap-2 backdrop-blur-md">
                          <CheckCircle2 className="w-10 h-10 text-[rgb(var(--color-text-3))] opacity-60" />
                          <span className="text-sm italic font-mono">{t.noActiveSession}</span>
                        </div>
                      )}
                    </div>

                    {/* ZONE 4: Logbook (Daily Quick Log) */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-2xl bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))] font-bold flex items-center justify-center">3</div>
                        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">{t.logbook}</h3>
                      </div>

                      <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl flex flex-col gap-4 shadow-sm h-full backdrop-blur-md">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[rgb(var(--color-text-2))]">{t.dailyQuickLog}</span>
                          <span className="text-[9px] font-mono font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{t.autoSaving}</span>
                        </div>
                        <textarea
                          placeholder={t.logPlaceholder}
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
                      <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">{t.skillSliders}</h3>
                    </div>

                    <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl flex flex-col gap-6 backdrop-blur-md">
                      <h4 className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-widest flex items-center gap-2 border-b border-[rgb(var(--color-border))]/60 pb-2">
                        <Sliders className="w-4 h-4 text-[rgb(var(--color-primary))]" /> {t.practicalScoring}
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
                    <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.noStudentSelected}</h2>
                    <p className="text-[rgb(var(--color-text-3))] mt-2 text-sm max-w-sm">
                      {t.noStudentDesc}
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
