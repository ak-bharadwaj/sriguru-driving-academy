"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, User, ShieldCheck, Flame, Star, AlertTriangle, CheckCircle, PenTool, Battery, Clock, Award, BookOpen, CheckSquare, Square, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useXPStore } from '@/lib/stores/xp-store'
import { useRTOStore } from '@/lib/stores/rto-store'
import { StudentState } from '@/lib/data/academyStore'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    loadingStudentProfile: 'LOADING STUDENT PROFILE...',
    studentNotFoundTitle: 'Student Not Found',
    studentNotFoundDesc: 'The cadet profile you are looking for does not exist or is not assigned to you.',
    returnToRoster: 'Return to Roster',
    backToRoster: 'Back to Roster',
    studentProfileLabel: 'Student Profile',
    student: 'Student',
    idLabel: 'ID',
    levelLabel: 'Level',
    xpTotalLabel: 'XP Total',
    streakLabel: 'Streak',
    performanceOverview: 'Performance Overview',
    submitFeedback: 'Submit Feedback',
    drivingSkills: 'Driving Skills',
    done: 'Done',
    edit: 'Edit',
    weakTheoryTopics: 'Weak Theory Topics',
    noTheoryVulnerabilities: 'No theory vulnerabilities detected.',
    sessionNotesFeedback: 'Session Notes & Feedback',
    overallPerformance: 'Overall Performance',
    yourFeedback: 'Your Feedback for the Student',
    feedbackPlaceholder: 'Note specific maneuvers needing practice, defensive driving habits...',
    xpBonusAuthorized: 'XP Bonus Authorized',
    xpBonusDesc: 'Submitting this feedback will automatically award ',
    xpBonusVal: '+150 XP',
    xpBonusSuffix: ' to the student for completing the session.',
    submitFeedbackAwardXp: 'Submit Feedback & Award XP',
    feedbackSuccess: 'Session feedback and XP bonus submitted to cadet profile.',
    feedbackFail: 'Failed to submit feedback. Try again.',
    progressUpdateMsg: 'progress updated.',
    progressUpdateFail: 'Failed to update progress.'
  },
  HI: {
    loadingStudentProfile: 'छात्र प्रोफ़ाइल लोड हो रही है...',
    studentNotFoundTitle: 'छात्र नहीं मिला',
    studentNotFoundDesc: 'आप जिस कैडेट प्रोफ़ाइल की तलाश कर रहे हैं वह मौजूद नहीं है या आपको असाइन नहीं की गई है।',
    returnToRoster: 'रोस्टर पर लौटें',
    backToRoster: 'रोस्टर पर वापस जाएँ',
    studentProfileLabel: 'छात्र प्रोफ़ाइल',
    student: 'छात्र',
    idLabel: 'आईडी',
    levelLabel: 'स्तर',
    xpTotalLabel: 'कुल एक्सपी',
    streakLabel: 'स्ट्रीक',
    performanceOverview: 'प्रदर्शन का अवलोकन',
    submitFeedback: 'फीडबैक सबमिट करें',
    drivingSkills: 'ड्राइविंग कौशल',
    done: 'संपन्न',
    edit: 'संपादित करें',
    weakTheoryTopics: 'कमजोर थ्योरी विषय',
    noTheoryVulnerabilities: 'कोई थ्योरी कमजोरियां नहीं पाई गईं।',
    sessionNotesFeedback: 'सत्र नोट्स और प्रतिक्रिया',
    overallPerformance: 'समग्र प्रदर्शन',
    yourFeedback: 'छात्र के लिए आपकी प्रतिक्रिया',
    feedbackPlaceholder: 'अभ्यास की आवश्यकता वाले विशिष्ट पैंतरेबाज़ी, रक्षात्मक ड्राइविंग की आदतें नोट करें...',
    xpBonusAuthorized: 'एक्सपी बोनस अधिकृत',
    xpBonusDesc: 'यह फीडबैक सबमिट करने से छात्र को सत्र पूरा करने के लिए स्वचालित रूप से ',
    xpBonusVal: '+150 XP',
    xpBonusSuffix: ' मिल जाएगा।',
    submitFeedbackAwardXp: 'फीडबैक सबमिट करें और XP दें',
    feedbackSuccess: 'सत्र प्रतिक्रिया और एक्सपी बोनस कैडेट प्रोफ़ाइल में सबमिट किया गया।',
    feedbackFail: 'प्रतिक्रिया सबमिट करने में विफल। पुनः प्रयास करें।',
    progressUpdateMsg: 'प्रगति अद्यतन।',
    progressUpdateFail: 'प्रगति अद्यतन करने में विफल।'
  },
  TE: {
    loadingStudentProfile: 'విద్యార్థి ప్రొఫైల్ లోడ్ అవుతోంది...',
    studentNotFoundTitle: 'విద్యార్థి కనుగొనబడలేదు',
    studentNotFoundDesc: 'మీరు వెతుకుతున్న క్యాడెట్ ప్రొఫైల్ లేదు లేదా మీకు కేటాయించబడలేదు.',
    returnToRoster: 'రోస్టర్‌కు తిరిగి వెళ్ళు',
    backToRoster: 'రోస్టర్‌కు తిరిగి వెళ్ళు',
    studentProfileLabel: 'విద్యార్థి ప్రొఫైల్',
    student: 'విద్యార్థి',
    idLabel: 'ID',
    levelLabel: 'స్థాయి',
    xpTotalLabel: 'XP మొత్తం',
    streakLabel: 'స్ట్రీక్',
    performanceOverview: 'పనితీరు అవలోకనం',
    submitFeedback: 'ఫీడ్‌బ్యాక్ సమర్పించండి',
    drivingSkills: 'డ్రైవింగ్ నైపుణ్యాలు',
    done: 'పూర్తయింది',
    edit: 'సవరించండి',
    weakTheoryTopics: 'బలహీనమైన థియరీ అంశాలు',
    noTheoryVulnerabilities: 'థియరీ లోపాలు ఏవీ కనుగొనబడలేదు.',
    sessionNotesFeedback: 'సెషన్ గమనికలు & ఫీడ్‌బ్యాక్',
    overallPerformance: 'మొత్తం పనితీరు',
    yourFeedback: 'విద్యార్థి కోసం మీ ఫీడ్‌బ్యాక్',
    feedbackPlaceholder: 'సాధన అవసరమైన నిర్దిష్ట విన్యాసాలు, డిఫెన్సివ్ డ్రైవింగ్ అలవాట్లను గమనించండి...',
    xpBonusAuthorized: 'XP బోనస్ ఆమోదించబడింది',
    xpBonusDesc: 'ఈ ఫీడ్‌బ్యాక్‌ను సమర్పించడం వల్ల సెషన్‌ను పూర్తి చేసినందుకు విద్యార్థికి ఆటోమేటిక్‌గా ',
    xpBonusVal: '+150 XP',
    xpBonusSuffix: ' లభిస్తుంది.',
    submitFeedbackAwardXp: 'ఫీడ్‌బ్యాక్ సమర్పించి XP ఇవ్వండి',
    feedbackSuccess: 'సెషన్ ఫీడ్‌బ్యాక్ మరియు XP బోనస్ క్యాడెట్ ప్రొఫైల్‌కు సమర్పించబడింది.',
    feedbackFail: 'ఫీడ్‌బ్యాక్ సమర్పించడంలో విఫలమైంది. మళ్ళీ ప్రయత్నించండి.',
    progressUpdateMsg: 'పురోగతి నవీకరించబడింది.',
    progressUpdateFail: 'పురోగతిని నవీకరించడంలో విఫలమైంది.'
  }
}


interface PageProps {
  params: { id: string }
}

export default function InstructorCadetDetails({ params }: PageProps) {
  const { language } = useLanguageStore()
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const studentId = params.id

  const [studentData, setStudentData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FEEDBACK' | 'SYLLABUS'>('OVERVIEW')
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [skillScores, setSkillScores] = useState<Record<string, number>>({})
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null)

  // Syllabus progress state
  const [syllabusProgress, setSyllabusProgress] = useState<any[]>([])
  const [syllabusLoading, setSyllabusLoading] = useState(false)
  const [togglingDay, setTogglingDay] = useState<string | null>(null)
  
  // Feedback form state
  const [sessionNotes, setSessionNotes] = useState('')
  const [performanceRating, setPerformanceRating] = useState(3)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { weakTopics } = useRTOStore() // Using global RTO store for demo

  useEffect(() => {
    // Fetch student data from the instructor roster endpoint
    const fetchState = async () => {
      try {
        const res = await fetch('/api/instructor/students')
        if (res.ok) {
          const roster = await res.json()
          const student = roster.find((s: any) => s.id === studentId)
          if (student) {
            // Map the API response to the expected state structure
            setStudentData({
              ...student,
              xp: student.xp || 0,
              level: student.level || 1,
              streakDays: student.totalSessions || 0
            })
            if (student.skills) {
              const scores: Record<string, number> = {}
              student.skills.forEach((s: any) => {
                scores[s.name] = s.score
              })
              setSkillScores(scores)
            }
          } else {
            setStudentData({ notFound: true })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchState()
  }, [studentId])

  const fetchSyllabusProgress = async () => {
    setSyllabusLoading(true)
    try {
      const res = await fetch(`/api/instructor/syllabus-progress?studentId=${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setSyllabusProgress(data.days || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSyllabusLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'SYLLABUS') fetchSyllabusProgress()
  }, [activeTab, studentId])

  const toggleDayComplete = async (day: any) => {
    setTogglingDay(day.id)
    try {
      if (day.completed) {
        // Unmark
        const res = await fetch('/api/instructor/syllabus-progress', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, syllabusDayId: day.id })
        })
        if (res.ok) {
          setSyllabusProgress(prev => prev.map(d => d.id === day.id ? { ...d, completed: false, completedAt: null } : d))
        }
      } else {
        // Mark complete
        const res = await fetch('/api/instructor/syllabus-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, syllabusDayId: day.id })
        })
        if (res.ok) {
          setSyllabusProgress(prev => prev.map(d => d.id === day.id ? { ...d, completed: true, completedAt: new Date().toISOString() } : d))
          setToastMessage(`Day ${day.dayNumber} marked complete! ✓`)
          setTimeout(() => setToastMessage(null), 2000)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingDay(null)
    }
  }

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/instructor/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          comments: sessionNotes,
          rating: performanceRating,
          tag: 'Session Feedback'
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit feedback')
      }

      setToastMessage(t.feedbackSuccess)
      setTimeout(() => setToastMessage(null), 3000)
      setSessionNotes('')
    } catch (error) {
      console.error(error)
      setToastMessage(t.feedbackFail)
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  const handleUpdateSkill = async (skillName: string, score: number) => {
    setUpdatingSkill(skillName)
    try {
      const slug = skillName.toLowerCase().replace(/\s+/g, '-')
      const res = await fetch('/api/instructor/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, skill: slug, score })
      })
      if (res.ok) {
        setSkillScores(prev => ({ ...prev, [skillName]: score }))
        setToastMessage(`${skillName} ${t.progressUpdateMsg}`)
        setTimeout(() => setToastMessage(null), 3000)
      } else {
        throw new Error('Failed to update skill')
      }
    } catch (error) {
      console.error(error)
      setToastMessage(t.progressUpdateFail)
      setTimeout(() => setToastMessage(null), 3000)
    } finally {
      setUpdatingSkill(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center">
        <Clock className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="font-mono text-xs uppercase text-text-3">{t.loadingStudentProfile}</span>
      </div>
    )
  }

  if (!studentData) return null

  if ((studentData as any).notFound) {
    return (
      <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-danger mb-4" />
        <h2 className="text-xl font-bold font-display mb-2">{t.studentNotFoundTitle}</h2>
        <p className="text-text-3 font-body text-sm mb-6">{t.studentNotFoundDesc}</p>
        <Link href="/instructor/students" className="px-6 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold hover:bg-surface-2 transition-all">
          {t.returnToRoster}
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body min-h-screen">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-success border border-success/30 text-void px-6 py-3 rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-8">
        <Link href="/instructor/students" className="inline-flex items-center gap-2 text-xs font-bold text-text-3 hover:text-text-1 transition-colors uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" /> {t.backToRoster}
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-void border-2 border-primary/40 rounded-full flex items-center justify-center text-primary">
              <User className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-widest text-primary uppercase">{t.studentProfileLabel}</span>
              <h1 className="text-3xl font-extrabold text-text-1 tracking-tight font-display mt-1">
                {(studentData as any).name || t.student}
              </h1>
              <p className="text-sm font-mono text-text-3 mt-1">{t.idLabel}: {studentId.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-surface border border-border px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-text-3 font-mono uppercase">{t.levelLabel}</span>
              <div className="text-xl font-bold font-mono text-text-1">{studentData.level}</div>
            </div>
            <div className="bg-surface border border-border px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-text-3 font-mono uppercase">{t.xpTotalLabel}</span>
              <div className="text-xl font-bold font-mono text-accent">{studentData.xp}</div>
            </div>
            <div className="bg-surface border border-border px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-text-3 font-mono uppercase">{t.streakLabel}</span>
              <div className="text-xl font-bold font-mono text-primary flex items-center gap-1 justify-center">
                <Flame className="w-4 h-4" /> {studentData.streakDays}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-4 mb-8 overflow-x-auto scrollbar-none">
        <button 
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'OVERVIEW' ? 'bg-primary text-void shadow-lg shadow-primary/20' : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          {t.performanceOverview}
        </button>
        <button 
          onClick={() => setActiveTab('SYLLABUS')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'SYLLABUS' ? 'bg-amber-500 text-void shadow-lg shadow-amber-500/20' : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Syllabus Progress</span>
        </button>
        <button 
          onClick={() => setActiveTab('FEEDBACK')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'FEEDBACK' ? 'bg-accent text-void shadow-lg shadow-accent/20' : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          {t.submitFeedback}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Maneuver Confidence */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Battery className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold font-display uppercase tracking-widest text-text-1">{t.drivingSkills}</h3>
                </div>
                <button
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="text-xs font-mono uppercase tracking-widest text-text-3 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <PenTool className="w-3 h-3" />
                  {isEditingSkills ? t.done : t.edit}
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {(studentData as any).skills?.map((skill: any, i: number) => {
                  const currentScore = skillScores[skill.name] ?? skill.score
                  const conf = currentScore * 10 // Convert 0-10 score to 0-100%
                  let color = 'bg-danger'
                  if (conf >= 80) color = 'bg-success'
                  else if (conf >= 50) color = 'bg-primary'
                  else if (conf >= 30) color = 'bg-accent'

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center text-xs font-bold text-text-1 mb-2">
                        <span>{skill.name}</span>
                        {isEditingSkills ? (
                          <span className="font-mono text-text-3">{currentScore} / 10</span>
                        ) : (
                          <span className="font-mono text-text-3">{conf}%</span>
                        )}
                      </div>
                      
                      {isEditingSkills ? (
                        <div className="flex items-center gap-3">
                          <input 
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={currentScore}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              setSkillScores(prev => ({ ...prev, [skill.name]: val }))
                            }}
                            onMouseUp={(e) => handleUpdateSkill(skill.name, parseInt((e.target as HTMLInputElement).value))}
                            onTouchEnd={(e) => handleUpdateSkill(skill.name, parseInt((e.target as HTMLInputElement).value))}
                            disabled={updatingSkill === skill.name}
                            className={`w-full h-2 rounded-full appearance-none bg-void cursor-pointer ${updatingSkill === skill.name ? 'opacity-50' : ''}`}
                            style={{
                              backgroundImage: `linear-gradient(to right, rgb(var(--color-primary)) ${conf}%, transparent ${conf}%)`
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${conf}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${color}`} 
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RTO Weak Topics */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                <AlertTriangle className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold font-display uppercase tracking-widest text-text-1">{t.weakTheoryTopics}</h3>
              </div>
              
              {Object.keys(weakTopics).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Object.keys(weakTopics).map((topic, i) => (
                    <span key={i} className="px-3 py-1.5 bg-danger/10 border border-danger/30 text-danger rounded-lg text-xs font-bold font-mono flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ShieldCheck className="w-8 h-8 text-success mx-auto mb-3 opacity-50" />
                  <p className="text-xs font-mono text-text-3 uppercase">{t.noTheoryVulnerabilities}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'SYLLABUS' && (
          <motion.div
            key="syllabus"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-lg font-bold font-display text-text-1">Course Syllabus Progress</h3>
                    <p className="text-xs text-text-3 font-mono mt-0.5">Tick lessons as the student completes them — no fixed order required</p>
                  </div>
                </div>
                {syllabusProgress.length > 0 && (
                  <div className="text-right">
                    <div className="text-xl font-black font-mono text-amber-500">
                      {syllabusProgress.filter(d => d.completed).length}/{syllabusProgress.length}
                    </div>
                    <div className="text-[10px] text-text-3 uppercase font-mono">Completed</div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {syllabusProgress.length > 0 && (
                <div className="mb-6">
                  <div className="w-full h-2 bg-void rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(syllabusProgress.filter(d => d.completed).length / syllabusProgress.length) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-text-3 font-mono">Start</span>
                    <span className="text-[10px] text-amber-500 font-mono font-bold">
                      {Math.round((syllabusProgress.filter(d => d.completed).length / syllabusProgress.length) * 100)}% done
                    </span>
                    <span className="text-[10px] text-text-3 font-mono">Course Complete</span>
                  </div>
                </div>
              )}

              {syllabusLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
              ) : syllabusProgress.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-10 h-10 text-text-3 mx-auto mb-4 opacity-30" />
                  <p className="text-text-3 font-mono text-xs uppercase">No syllabus configured for this student's course type</p>
                  <p className="text-text-3 text-xs mt-2">Admin can add syllabus days in Content → Syllabus Manager</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {syllabusProgress.map((day, idx) => (
                    <motion.button
                      key={day.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => toggleDayComplete(day)}
                      disabled={togglingDay === day.id}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all group ${
                        day.completed
                          ? 'bg-success/5 border-success/30 hover:bg-success/10'
                          : 'bg-void/50 border-border hover:border-amber-500/40 hover:bg-amber-500/5'
                      } disabled:opacity-60`}
                    >
                      {/* Day number badge */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        day.completed ? 'bg-success/20 border border-success/30' : 'bg-void border border-border group-hover:border-amber-500/50'
                      }`}>
                        {togglingDay === day.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        ) : day.completed ? (
                          <CheckSquare className="w-4 h-4 text-success" />
                        ) : (
                          <Square className="w-4 h-4 text-text-3 group-hover:text-amber-500 transition-colors" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                            day.completed ? 'text-success' : 'text-text-3'
                          }`}>
                            Day {day.dayNumber}
                          </span>
                          {day.completed && day.completedAt && (
                            <span className="text-[9px] text-success/60 font-mono">
                              ✓ {new Date(day.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-bold leading-snug ${
                          day.completed ? 'text-text-2 line-through decoration-success/40' : 'text-text-1'
                        }`}>
                          {day.title}
                        </h4>
                        <p className="text-xs text-text-3 mt-0.5 leading-relaxed">{day.description}</p>
                      </div>

                      {/* Quick action hint */}
                      <div className={`text-[10px] font-mono uppercase tracking-wider shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        day.completed ? 'text-danger/60' : 'text-success/70'
                      }`}>
                        {day.completed ? 'unmark' : 'mark done'}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'FEEDBACK' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={submitFeedback} className="bg-surface border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6">
              
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <PenTool className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold font-display text-text-1">{t.sessionNotesFeedback}</h3>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-3 mb-3">{t.overallPerformance}</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button 
                      key={rating}
                      type="button"
                      onClick={() => setPerformanceRating(rating)}
                      className={`flex-1 py-3 rounded-xl border flex justify-center transition-all ${
                        performanceRating >= rating 
                          ? 'bg-accent/10 border-accent text-accent shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                          : 'bg-void border-border text-text-3 hover:border-text-3'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${performanceRating >= rating ? 'fill-accent' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-3 mb-3">{t.yourFeedback}</label>
                <textarea 
                  required
                  rows={5}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder={t.feedbackPlaceholder}
                  className="w-full bg-void border border-border rounded-xl p-4 text-sm text-text-1 focus:border-primary outline-none transition-colors resize-none font-body"
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
                <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-primary">{t.xpBonusAuthorized}</h4>
                  <p className="text-xs text-text-2 mt-1">{t.xpBonusDesc}<strong>{t.xpBonusVal}</strong>{t.xpBonusSuffix}</p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.4)]"
              >
                <CheckCircle className="w-4 h-4" /> {t.submitFeedbackAwardXp}
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
