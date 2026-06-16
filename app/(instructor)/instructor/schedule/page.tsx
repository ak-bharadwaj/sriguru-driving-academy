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
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Schedule Management',
    pageSubtitle: 'View upcoming slots, mark attendance, and manage your daily roadmap.',
    newSession: 'New Session',
    loadingSessions: 'Loading sessions...',
    startSession: 'Start Session',
    markCompleted: 'Mark Completed',
    viewLog: 'View Log',
    noSlotsTitle: 'No Slots Scheduled',
    noSlotsDesc: 'You have a free block for this filter.',
    scheduleNewSession: 'Schedule New Session',
    studentLabel: 'Student',
    selectStudentOpt: 'Select a student',
    dateTimeLabel: 'Date & Time',
    durationLabel: 'Duration (mins)',
    lessonTypeLabel: 'Lesson Type',
    lessonTypePlaceholder: 'e.g. Parallel Parking',
    notesLabel: 'Notes (Optional)',
    notesPlaceholder: 'Any specific focus areas...',
    cancelBtn: 'Cancel',
    scheduleSlotBtn: 'Schedule Slot',
    markAttendanceTitle: 'Mark Attendance',
    statusLabel: 'Status',
    statusPresent: 'Present',
    statusLate: 'Late',
    statusAbsent: 'Absent',
    completeBtn: 'Complete',
    today: 'Today',
    tomorrow: 'Tomorrow',
    defaultTrack: 'Default Track',
    unknown: 'Unknown',
    markAbsent: 'Mark Absent',
    extendSession: 'Extend +15m',
    otpLabel: 'Student OTP Code',
    otpPlaceholder: 'e.g. 123456',
    otpHelp: 'Ask the student to open their dashboard and read the 6-digit code to you.'
  },
  HI: {
    pageTitle: 'अनुसूची प्रबंधन',
    pageSubtitle: 'आगामी स्लॉट देखें, उपस्थिति दर्ज करें, और अपने दैनिक रोडमैप का प्रबंधन करें।',
    newSession: 'नया सत्र',
    loadingSessions: 'सत्र लोड हो रहे हैं...',
    startSession: 'सत्र प्रारंभ करें',
    markCompleted: 'पूरा चिह्नित करें',
    viewLog: 'लॉग देखें',
    noSlotsTitle: 'कोई स्लॉट निर्धारित नहीं',
    noSlotsDesc: 'आपके पास इस फ़िल्टर के लिए एक खाली ब्लॉक है।',
    scheduleNewSession: 'नया सत्र निर्धारित करें',
    studentLabel: 'छात्र',
    selectStudentOpt: 'एक छात्र चुनें',
    dateTimeLabel: 'दिनांक और समय',
    durationLabel: 'अवधि (मिनट)',
    lessonTypeLabel: 'पाठ का प्रकार',
    lessonTypePlaceholder: 'उदाहरण: समानांतर पार्किंग',
    notesLabel: 'नोट्स (वैकल्पिक)',
    notesPlaceholder: 'कोई विशिष्ट फोकस क्षेत्र...',
    cancelBtn: 'रद्द करें',
    scheduleSlotBtn: 'स्लॉट अनुसूची',
    markAttendanceTitle: 'उपस्थिति दर्ज करें',
    statusLabel: 'स्थिति',
    statusPresent: 'उपस्थित',
    statusLate: 'देर से',
    statusAbsent: 'अनुपस्थित',
    completeBtn: 'पूरा करें',
    today: 'आज',
    tomorrow: 'कल',
    defaultTrack: 'डिफ़ॉल्ट ट्रैक',
    unknown: 'अज्‍नात',
    markAbsent: 'अनुपस्थित चिह्नित करें',
    extendSession: '+15 मिनट बढ़ाएं',
    otpLabel: 'छात्र ओटीपी कोड',
    otpPlaceholder: 'जैसे 123456',
    otpHelp: 'छात्र से कहें कि वे अपना डैशबोर्ड खोलें और आपको 6 अंकों का कोड बताएं।'
  },
  TE: {
    pageTitle: 'షెడ్యూల్ నిర్వహణ',
    pageSubtitle: 'రాబోయే స్లాట్‌లను వీక్షించండి, హాజరును గుర్తించండి మరియు మీ రోజువారీ రోడ్‌మ్యాప్‌ను నిర్వహించండి.',
    newSession: 'కొత్త సెషన్',
    loadingSessions: 'సెషన్‌లు లోడ్ అవుతున్నాయి...',
    startSession: 'సెషన్ ప్రారంభించండి',
    markCompleted: 'పూర్తయినట్లు గుర్తించండి',
    viewLog: 'లాగ్ చూడండి',
    noSlotsTitle: 'ఎలాంటి స్లాట్‌లు షెడ్యూల్ చేయబడలేదు',
    noSlotsDesc: 'ఈ ఫిల్టర్ కోసం మీకు ఖాళీ బ్లాక్ ఉంది.',
    scheduleNewSession: 'కొత్త సెషన్‌ను షెడ్యూల్ చేయండి',
    studentLabel: 'విద్యార్థి',
    selectStudentOpt: 'ఒక విద్యార్థిని ఎంచుకోండి',
    dateTimeLabel: 'తేదీ & సమయం',
    durationLabel: 'వ్యవధి (నిమిషాలు)',
    lessonTypeLabel: 'పాఠం రకం',
    lessonTypePlaceholder: 'ఉదాహరణకు: పారలల్ పార్కింగ్',
    notesLabel: 'గమనికలు (ఐచ్ఛికం)',
    notesPlaceholder: 'ఏదైనా నిర్దిష్ట ఫోకస్ ప్రాంతాలు...',
    cancelBtn: 'రద్దు చేయి',
    scheduleSlotBtn: 'స్లాట్ షెడ్యూల్',
    markAttendanceTitle: 'హాజరును గుర్తించండి',
    statusLabel: 'స్థితి',
    statusPresent: 'హాజరు',
    statusLate: 'ఆలస్యం',
    statusAbsent: 'గైర్హాజరు',
    completeBtn: 'పూర్తి చేయండి',
    today: 'ఈరోజు',
    tomorrow: 'రేపు',
    defaultTrack: 'డిఫాల్ట్ ట్రాక్',
    unknown: 'తెలియదు',
    markAbsent: 'గైర్హాజరుగా గుర్తించండి',
    extendSession: '+15 నిమిషాలు పొడిగించు',
    otpLabel: 'విద్యార్థి OTP కోడ్',
    otpPlaceholder: 'ఉదా. 123456',
    otpHelp: 'విద్యార్థిని వారి డాష్‌బోర్డ్ తెరిచి 6 అంకెల కోడ్‌ను మీకు చెప్పమని అడగండి.'
  },
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function InstructorSchedulePage() {
  const { language } = useLanguageStore()
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [activeFilter, setActiveFilter] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState<{sessionId: string, studentId: string} | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState('PRESENT')
  const [otpInput, setOtpInput] = useState('')
  const [attendanceError, setAttendanceError] = useState<string | null>(null)
  
  const [sessionDate, setSessionDate] = useState('')
  const [sessionTime, setSessionTime] = useState('')
  const [newSessionData, setNewSessionData] = useState({
    studentId: '',
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
      const combinedDateTime = new Date(`${sessionDate}T${sessionTime}`)
      await fetch('/api/instructor/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSessionData,
          scheduledAt: combinedDateTime.toISOString()
        }),
      })
      setShowCreateModal(false)
      setNewSessionData({ studentId: '', duration: 60, lessonType: '', notes: '' })
      setSessionDate('')
      setSessionTime('')
      mutate()
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showAttendanceModal) return
    setAttendanceError(null)
    try {
      const res = await fetch('/api/instructor/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: showAttendanceModal.studentId,
          sessionId: showAttendanceModal.sessionId,
          status: attendanceStatus,
          otp: (attendanceStatus === 'PRESENT' || attendanceStatus === 'LATE') ? otpInput : undefined
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        setAttendanceError(errData.error || 'Failed to mark attendance')
        return
      }
      setShowAttendanceModal(null)
      setOtpInput('')
      mutate()
    } catch (e) {
      console.error(e)
      setAttendanceError('Network error or server failed to process request.')
    }
  }

  const handleDirectMarkAbsent = async (sessionId: string, studentId: string) => {
    try {
      const res = await fetch('/api/instructor/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          sessionId,
          status: 'ABSENT'
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        alert(errData.error || 'Failed to mark absent')
      }
      mutate()
    } catch (e) {
      console.error(e)
    }
  }

  const handleExtendSession = async (sessionId: string, currentDuration: number) => {
    try {
      const res = await fetch(`/api/instructor/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: currentDuration + 15 }),
      })
      if (!res.ok) {
        const errData = await res.json()
        alert(errData.error || 'Failed to extend session')
      }
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
    if (d.toDateString() === now.toDateString()) dateStr = t.today
    else {
      const tomorrowDate = new Date(now)
      tomorrowDate.setDate(tomorrowDate.getDate() + 1)
      if (d.toDateString() === tomorrowDate.toDateString()) dateStr = t.tomorrow
    }
    
    return {
      id: s.id,
      studentId: s.student?.id || '',
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      date: dateStr,
      student: s.student?.name || t.unknown,
      type: s.lessonType,
      status: s.status,
      location: t.defaultTrack, // Backend doesn't store this directly yet
      duration: s.duration
    }
  })

  const filteredSchedule = formattedSchedule.filter((session: any) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'TODAY') return session.date === t.today
    if (activeFilter === 'TOMORROW') return session.date === t.tomorrow
    return session.status === activeFilter
  })

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-2">{t.pageTitle}</h1>
            <p className="text-sm sm:text-base text-text-2">{t.pageSubtitle}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.4)] whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {t.newSession}
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
        <div className="relative pl-6 sm:pl-8 border-l-2 border-border/60 ml-4 sm:ml-5">
          
          {isLoading && (
            <div className="py-20 text-center text-text-3 font-medium">{t.loadingSessions}</div>
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

            const solidColorClass = statusBg.replace('/10', '')

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 relative"
              >
                {/* Timeline Solid Bullet Dot */}
                <div className={`absolute -left-[30px] sm:-left-[39px] top-6 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-4 border-void ${solidColorClass} flex items-center justify-center`} />

                {/* Session Card */}
                <div className={`bg-surface border border-border border-l-4 ${borderAccent} p-5 rounded-2xl flex flex-col lg:flex-row gap-6 lg:items-center justify-between transition-colors duration-200 hover:bg-surface/90`}>
                  
                  {/* Left Info: Time & Type */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-data-mono flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {session.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold font-data-mono text-text-3 bg-void px-2.5 py-1 rounded border border-border">{session.date}</span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-display font-bold text-text-1 mb-1">
                      {session.time} — {session.type}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 text-xs sm:text-sm text-text-2 mt-3 font-medium">
                      <span className="flex items-center gap-2 text-text-2"><User className="w-4 h-4 text-text-3"/> {session.student}</span>
                      <span className="flex items-center gap-2 text-text-2"><MapPin className="w-4 h-4 text-text-3"/> {session.location}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-border w-full lg:w-auto">
                    {session.status === 'SCHEDULED' && (
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <button 
                          onClick={() => handleUpdateStatus(session.id, 'IN_PROGRESS')}
                          className="px-4 sm:px-5 py-2.5 bg-primary text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all w-full lg:w-auto whitespace-nowrap"
                        >
                          {t.startSession}
                        </button>
                        <button 
                          onClick={() => handleDirectMarkAbsent(session.id, session.studentId)}
                          className="px-4 sm:px-5 py-2.5 bg-surface-2 text-text-2 border border-border rounded-xl text-xs sm:text-sm font-semibold hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all w-full lg:w-auto whitespace-nowrap"
                        >
                          {t.markAbsent}
                        </button>
                        <button 
                          onClick={() => handleDelete(session.id)}
                          className="p-2.5 text-text-3 hover:text-danger bg-surface border border-border rounded-xl transition-all"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {session.status === 'IN_PROGRESS' && (
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <button 
                          onClick={() => handleExtendSession(session.id, session.duration)}
                          className="px-4 sm:px-5 py-2.5 bg-surface-2 text-text-2 border border-border rounded-xl text-xs sm:text-sm font-semibold hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all w-full lg:w-auto whitespace-nowrap"
                        >
                          {t.extendSession}
                        </button>
                        <button 
                          onClick={() => {
                            setAttendanceError(null)
                            setOtpInput('')
                            setShowAttendanceModal({ sessionId: session.id, studentId: session.studentId })
                          }}
                          className="px-4 sm:px-5 py-2.5 bg-success text-void rounded-xl text-xs sm:text-sm font-bold hover:bg-success/95 transition-all w-full lg:w-auto flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {t.markCompleted}
                        </button>
                      </div>
                    )}
                    {session.status === 'COMPLETED' && (
                      <button className="px-4 sm:px-5 py-2.5 bg-surface text-text-2 border border-border rounded-xl text-xs sm:text-sm font-semibold hover:text-text-1 hover:bg-surface/85 transition-all w-full lg:w-auto">
                        {t.viewLog}
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            )
          })}
          
          {!isLoading && filteredSchedule.length === 0 && (
            <div className="py-20 text-center border border-border border-dashed rounded-3xl bg-surface/40 ml-4 backdrop-blur-sm">
              <CalendarIcon className="w-12 h-12 text-text-3 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-text-1 mb-2">{t.noSlotsTitle}</h3>
              <p className="text-text-3 text-sm">{t.noSlotsDesc}</p>
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
                onClick={() => {
                  setShowCreateModal(false)
                  setSessionDate('')
                  setSessionTime('')
                }}
                className="absolute top-4 right-4 p-2 text-text-3 hover:text-white bg-surface-2 rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">{t.scheduleNewSession}</h2>
              
              <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">{t.studentLabel}</label>
                  <select 
                    required
                    value={newSessionData.studentId}
                    onChange={e => setNewSessionData({...newSessionData, studentId: e.target.value})}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="" disabled>{t.selectStudentOpt}</option>
                    {studentsData && Array.isArray(studentsData) && studentsData.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>
 
                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">{t.dateTimeLabel}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="date" 
                      required
                      value={sessionDate}
                      onChange={e => setSessionDate(e.target.value)}
                      className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                      style={{ colorScheme: 'dark' }}
                    />
                    <input 
                      type="time" 
                      required
                      value={sessionTime}
                      onChange={e => setSessionTime(e.target.value)}
                      className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-2 mb-2">{t.durationLabel}</label>
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
                    <label className="block text-sm font-semibold text-text-2 mb-2">{t.lessonTypeLabel}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={t.lessonTypePlaceholder}
                      value={newSessionData.lessonType}
                      onChange={e => setNewSessionData({...newSessionData, lessonType: e.target.value})}
                      className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
 
                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">{t.notesLabel}</label>
                  <textarea 
                    rows={2}
                    value={newSessionData.notes}
                    onChange={e => setNewSessionData({...newSessionData, notes: e.target.value})}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none"
                    placeholder={t.notesPlaceholder}
                  />
                </div>
 
                <div className="mt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setSessionDate('')
                      setSessionTime('')
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-2 hover:bg-surface-2 transition-all"
                  >
                    {t.cancelBtn}
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
                  >
                    {t.scheduleSlotBtn}
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
              
              <h2 className="text-2xl font-display font-bold text-white mb-6">{t.markAttendanceTitle}</h2>
              
              <form onSubmit={handleMarkAttendance} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-sm font-semibold text-text-2 mb-2">{t.statusLabel}</label>
                  <select 
                    value={attendanceStatus}
                    onChange={e => {
                      setAttendanceStatus(e.target.value)
                      setAttendanceError(null)
                    }}
                    className="w-full bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="PRESENT">{t.statusPresent}</option>
                    <option value="LATE">{t.statusLate}</option>
                    <option value="ABSENT">{t.statusAbsent}</option>
                  </select>
                </div>

                {(attendanceStatus === 'PRESENT' || attendanceStatus === 'LATE') && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-semibold text-text-2 mb-2">{t.otpLabel}</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      placeholder={t.otpPlaceholder}
                      value={otpInput}
                      onChange={e => {
                        setOtpInput(e.target.value.replace(/\D/g, ''))
                        setAttendanceError(null)
                      }}
                      className="w-full bg-void border border-border rounded-xl p-3 text-white tracking-widest text-center font-mono font-bold text-xl focus:outline-none focus:border-primary"
                    />
                    <p className="text-[11px] text-text-3 mt-2 leading-relaxed">
                      {t.otpHelp}
                    </p>
                  </div>
                )}

                {attendanceError && (
                  <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{attendanceError}</span>
                  </div>
                )}

                <div className="mt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowAttendanceModal(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-2 hover:bg-surface-2 transition-all"
                  >
                    {t.cancelBtn}
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-success text-void rounded-xl text-sm font-bold hover:bg-success/90 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.4)] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.completeBtn}
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
