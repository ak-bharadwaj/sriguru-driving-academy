"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  FileText, 
  Award, 
  Calendar, 
  Map, 
  TrendingUp, 
  Bell, 
  X,
  PlayCircle,
  Gamepad2,
  Layers
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useXPStore } from '@/lib/stores/xp-store'
import { useLanguageStore } from '@/store/languageStore'

const DASHBOARD_DICT = {
  en: {
    welcomeBack: "Welcome back,",
    courseProgress: "Course Progress",
    totalCompletion: "Total Completion",
    done: "Done",
    level: "Level",
    streak: "Streak",
    cards: "Cards",
    attend: "Attend",
    interactivePractice: "Interactive Practice",
    simTitle: "Simulations",
    simDesc: "Practice advanced maneuvers",
    flashTitle: "Flashcards",
    flashDesc: "Review your active rules",
    learningHub: "Learning Hub",
    theoryMods: "Theory Modules",
    theoryDesc: "Complete interactive road safety theory lessons.",
    rtoHub: "RTO Learning Hub",
    rtoDesc: "Master road signs and take mock simulation tests.",
    schedule: "Schedule Training",
    schedDesc: "Book upcoming practical sessions with your instructor.",
    achievements: "Achievements",
    achDesc: "View earned badges and progression milestones.",
    dashboardHub: "Dashboard Hub",
    viewSchedule: "View Schedule",
    noSessions: "No Sessions",
    bookLesson: "Book your next lesson"
  },
  si: {
    welcomeBack: "ආපසු සාදරයෙන් පිළිගනිමු,",
    courseProgress: "පාඨමාලාවේ ප්‍රගතිය",
    totalCompletion: "සම්පූර්ණ ප්‍රගතිය",
    done: "අවසන්",
    level: "මට්ටම",
    streak: "දින",
    cards: "කාඩ්",
    attend: "පැමිණීම",
    interactivePractice: "අන්තර්ක්‍රියාකාරී පුහුණුව",
    simTitle: "අනුහුරුකරණ",
    simDesc: "උසස් රියදුරු පුහුණුව",
    flashTitle: "ෆ්ලෑෂ් කාඩ්",
    flashDesc: "මාර්ග නීති සමාලෝචනය කරන්න",
    learningHub: "ඉගෙනුම් කේන්ද්‍රය",
    theoryMods: "න්‍යායික මොඩියුල",
    theoryDesc: "අන්තර්ක්‍රියාකාරී මාර්ග ආරක්ෂණ පාඩම් සම්පූර්ණ කරන්න.",
    rtoHub: "RTO ඉගෙනුම් කේන්ද්‍රය",
    rtoDesc: "මාර්ග සංඥා සහ අනුහුරුකරණ පරීක්ෂණ.",
    schedule: "කාලසටහන",
    schedDesc: "ඔබේ උපදේශක සමඟ ප්‍රායෝගික සැසි වෙන්කර ගන්න.",
    achievements: "ජයග්‍රහණ",
    achDesc: "ඔබගේ ලාංඡන සහ ප්‍රගතිය බලන්න.",
    dashboardHub: "උපකරණ පුවරුව",
    viewSchedule: "කාලසටහන බලන්න",
    noSessions: "සැසි නොමැත",
    bookLesson: "ඔබේ ඊළඟ පාඩම වෙන්කර ගන්න"
  }
}

interface RoadmapPhaseData {
  phase: string
  total: number
  completed: number
  percent: number
}

interface StudentDashboardProps {
  initialDbData: {
    student: {
      id: string
      name: string
      email: string
      avatarUrl: string | null
      xp: number
      level: number
      streakDays: number
      instructorName: string
      status: string
      hasProvidedFeedback: boolean
    }
    nextSession: {
      id: string
      scheduledAt: string
      lessonType: string
      instructorName: string
    } | null
    nextTest?: {
      id: string
      testDate: string
      testCenter: string
    } | null
    roadmapProgress: RoadmapPhaseData[]
    quickStats: {
      totalAttended: number
      attendanceRate: number
      quizAccuracy: number
      cardsCompleted: number
    }
    recentBadges: {
      id: string
      name: string
      description: string
      icon: string
      earnedAt: string
    }[]
    announcements: {
      id: string
      title: string
      message: string
      createdAt: string
    }[]
  }
}

export default function DashboardClient({ initialDbData }: StudentDashboardProps) {
  const [dbData] = useState(initialDbData)
  const { language } = useLanguageStore()
  const t = DASHBOARD_DICT[language as keyof typeof DASHBOARD_DICT] || DASHBOARD_DICT.en
  
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const { setPendingBadgeReveal } = useXPStore()

  useEffect(() => {
    const saved = localStorage.getItem('student_dismissed_announcements')
    if (saved) {
      try {
        setDismissedAnnouncements(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const dismissAnnouncement = (id: string) => {
    const updated = [...dismissedAnnouncements, id]
    setDismissedAnnouncements(updated)
    localStorage.setItem('student_dismissed_announcements', JSON.stringify(updated))
  }

  const activeAnnouncements = dbData.announcements.filter(
    (a) => !dismissedAnnouncements.includes(a.id)
  )

  const student = dbData.student
  
  const totalCards = dbData.roadmapProgress.reduce((acc, curr) => acc + curr.total, 0)
  const completedCards = dbData.roadmapProgress.reduce((acc, curr) => acc + curr.completed, 0)
  const overallPercent = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference

  useEffect(() => {
    if ((overallPercent === 100 || student.status === 'COMPLETED') && !student.hasProvidedFeedback && !feedbackSubmitted) {
      setShowFeedbackModal(true)
    }
  }, [overallPercent, student.status, student.hasProvidedFeedback, feedbackSubmitted])

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (feedbackRating === 0) return
    setSubmittingFeedback(true)
    try {
      const res = await fetch('/api/student/course-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: feedbackRating, comment: feedbackComment })
      })
      if (res.ok) {
        setFeedbackSubmitted(true)
        setShowFeedbackModal(false)
        const data = await res.json()
        if (data.badgeAwarded) {
          setPendingBadgeReveal({
            id: data.badgeAwarded.id,
            name: data.badgeAwarded.name,
            description: data.badgeAwarded.description,
            icon: data.badgeAwarded.icon,
            unlockedAt: new Date().toISOString(),
            customImage: data.badgeAwarded.customImage
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
    setSubmittingFeedback(false)
  }

  const serviceCategories = [
    { name: t.theoryMods, desc: t.theoryDesc, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/student/learn' },
    { name: t.rtoHub, desc: t.rtoDesc, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', path: '/student/rto' },
    { name: t.schedule, desc: t.schedDesc, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10', path: '/student/schedule' },
    { name: t.achievements, desc: t.achDesc, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/student/badges' },
  ]

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] font-body relative pb-28 transition-colors duration-300">
      
      <div className="bg-[rgb(var(--color-primary))] rounded-b-[40px] pt-12 pb-32 px-6 relative overflow-hidden text-white shadow-md">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 font-medium text-lg">{t.welcomeBack}</p>
              <h1 className="text-3xl font-bold font-display mt-1">{student.name}</h1>
              <p className="text-white/60 text-sm mt-1">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/student/notifications" className="relative w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-md">
                <Bell className="w-6 h-6 text-white" />
                {activeAnnouncements.length > 0 && (
                  <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border border-[rgb(var(--color-primary))]"></span>
                )}
              </Link>
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                {student.avatarUrl ? (
                  <Image src={student.avatarUrl} alt={student.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                    {student.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 -mt-20 relative z-10 flex flex-col gap-6">
        
        <AnimatePresence>
          {activeAnnouncements.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-3 overflow-hidden"
            >
              {activeAnnouncements.map((a) => (
                <div key={a.id} className="bg-[rgb(var(--color-surface))] rounded-[24px] shadow-app p-4 flex gap-3 relative border border-[rgb(var(--color-border))]">
                  <div className="bg-[rgb(var(--color-accent))]/10 p-2 rounded-xl text-[rgb(var(--color-accent))] self-start">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pr-4">
                    <h4 className="text-sm font-bold text-[rgb(var(--color-text-1))]">{a.title}</h4>
                    <p className="text-xs text-[rgb(var(--color-text-2))] mt-1">{a.message}</p>
                  </div>
                  <button onClick={() => dismissAnnouncement(a.id)} className="absolute top-4 right-4 text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-1))]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-[rgb(var(--color-surface))] rounded-[28px] shadow-app p-8 flex flex-col items-center text-center border border-[rgb(var(--color-border))]">
          <h2 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">{t.courseProgress}</h2>
          <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">{t.totalCompletion}</p>
          
          <div className="relative mt-8 mb-6 flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-90 drop-shadow-md">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="var(--color-border)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 1s ease-in-out'
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4579FF" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold text-[rgb(var(--color-text-1))]">{overallPercent}%</span>
              <span className="text-[10px] uppercase tracking-wider text-[rgb(var(--color-text-3))] font-bold mt-1">{t.done}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full mt-6 pt-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase text-[rgb(var(--color-text-3))] font-bold">{t.level}</span>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-1))]">{student.level}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase text-[rgb(var(--color-text-3))] font-bold">{t.streak}</span>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-1))]">{student.streakDays}d</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase text-[rgb(var(--color-text-3))] font-bold">{t.cards}</span>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-1))]">{completedCards}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase text-[rgb(var(--color-text-3))] font-bold">{t.attend}</span>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-1))]">{dbData.quickStats.attendanceRate}%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h3 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))] mb-4 px-1">{t.interactivePractice}</h3>
          <div className="flex flex-col gap-4">
            <Link href="/student/simulations" className="group relative block overflow-hidden rounded-[32px] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-app hover:shadow-app-hover transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-6 sm:p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500 shrink-0">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-display font-bold text-[rgb(var(--color-text-1))] mb-1 group-hover:text-emerald-600 transition-colors">{t.simTitle}</h4>
                  <p className="text-sm text-[rgb(var(--color-text-2))]">{t.simDesc}</p>
                </div>
              </div>
            </Link>

            <Link href="/student/flashcards" className="group relative block overflow-hidden rounded-[32px] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-app hover:shadow-app-hover transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-6 sm:p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-500 shrink-0">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-display font-bold text-[rgb(var(--color-text-1))] mb-1 group-hover:text-rose-600 transition-colors">{t.flashTitle}</h4>
                  <p className="text-sm text-[rgb(var(--color-text-2))]">{t.flashDesc}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] mb-4 px-1">{t.learningHub}</h3>
          <div className="flex flex-col gap-4">
            {serviceCategories.map((service, idx) => {
              const Icon = service.icon
              return (
                <Link key={idx} href={service.path} className="group">
                  <div className="w-full bg-[rgb(var(--color-surface))] rounded-[24px] shadow-app p-5 flex items-center gap-5 border border-[rgb(var(--color-border))] transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98] group-hover:border-[rgb(var(--color-primary))]/30 group-hover:shadow-app-hover">
                    <div className={`w-14 h-14 rounded-[16px] ${service.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-7 h-7 ${service.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-[rgb(var(--color-text-1))]">{service.name}</h4>
                      <p className="text-xs text-[rgb(var(--color-text-2))] mt-0.5">{service.desc}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-void))] flex items-center justify-center text-[rgb(var(--color-text-3))] group-hover:text-[rgb(var(--color-primary))] group-hover:bg-[rgb(var(--color-primary))]/10 transition-colors">
                      <TrendingUp className="w-4 h-4 rotate-45" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">{t.dashboardHub}</h3>
            <Link href="/student/schedule" className="text-sm text-[rgb(var(--color-primary))] font-semibold">{t.viewSchedule}</Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-none">
            {dbData.nextSession ? (
              <div className="bg-[rgb(var(--color-primary))] text-white rounded-[24px] p-6 w-[240px] flex-shrink-0 relative overflow-hidden shadow-app-hover">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <h4 className="text-4xl font-bold font-display">{new Date(dbData.nextSession.scheduledAt).getDate()}</h4>
                <p className="text-white/80 text-sm mt-1 mb-6">{new Date(dbData.nextSession.scheduledAt).toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                
                <p className="font-semibold">{dbData.nextSession.lessonType} Training</p>
                <div className="flex items-center gap-2 mt-2">
                  <PlayCircle className="w-4 h-4 text-white/70" />
                  <span className="text-sm font-medium">{new Date(dbData.nextSession.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ) : (
              <div className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-1))] border border-[rgb(var(--color-border))] rounded-[24px] p-6 w-[240px] flex-shrink-0 relative overflow-hidden shadow-app flex flex-col justify-center items-center text-center">
                <Calendar className="w-10 h-10 text-[rgb(var(--color-text-3))] mb-3" />
                <p className="font-semibold text-lg font-display">{t.noSessions}</p>
                <p className="text-xs text-[rgb(var(--color-text-3))] mt-1">{t.bookLesson}</p>
              </div>
            )}

            <div className="bg-app-yellow text-[rgb(var(--color-void))] rounded-[24px] p-6 w-[240px] flex-shrink-0 relative overflow-hidden shadow-app-hover flex flex-col justify-between">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/40 rounded-full blur-xl" />
              <div>
                <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                  <Award className="w-6 h-6" />
                </div>
                <p className="text-[rgb(var(--color-void))]/70 text-sm font-bold uppercase tracking-wider">Instructor</p>
              </div>
              <div>
                <p className="font-bold text-2xl font-display leading-tight">{student.instructorName || 'Unassigned'}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-bold px-3 py-1.5 bg-[rgb(var(--color-void))]/10 rounded-full backdrop-blur-md">Active Coach</span>
                </div>
              </div>
            </div>

            {dbData.nextTest && (
              <div className="bg-rose-500 text-white rounded-[24px] p-6 w-[240px] flex-shrink-0 relative overflow-hidden shadow-app-hover">
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-xl" />
                <h4 className="text-4xl font-bold font-display">{new Date(dbData.nextTest.testDate).getDate()}</h4>
                <p className="text-white/80 text-sm mt-1 mb-6">{new Date(dbData.nextTest.testDate).toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                
                <p className="font-semibold uppercase text-xs tracking-widest text-white/90">Official Test</p>
                <p className="font-bold font-display text-lg mt-1">{dbData.nextTest.testCenter}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Course Completion Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-primary to-accent" />
              
              <div className="text-center mb-6 mt-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Award className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">Congratulations!</h2>
                <p className="text-sm text-[rgb(var(--color-text-2))] mt-2">You have completed your driving course. We'd love to hear about your experience.</p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-text-3))]">Rate your experience</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={`p-2 transition-transform hover:scale-110 focus:outline-none`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="32" 
                          height="32" 
                          viewBox="0 0 24 24" 
                          fill={feedbackRating >= star ? "currentColor" : "none"} 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`w-8 h-8 ${feedbackRating >= star ? "text-amber-400 fill-amber-400" : "text-[rgb(var(--color-text-3))] opacity-50"}`}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-text-3))]">Any comments? (Optional)</label>
                  <textarea 
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full h-24 bg-[rgb(var(--color-void))]/50 border border-[rgb(var(--color-border))] rounded-xl p-4 text-sm text-[rgb(var(--color-text-1))] focus:border-[rgb(var(--color-primary))] outline-none resize-none"
                    placeholder="How was your instructor?"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={feedbackRating === 0 || submittingFeedback}
                  className="w-full py-3.5 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl hover:bg-[rgb(var(--color-primary))]/90 transition-all shadow-lg shadow-[rgb(var(--color-primary))]/20 disabled:opacity-50 mt-2"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit & Claim Badge'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="w-full py-2 text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-1))] transition-colors"
                >
                  Skip for now
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
