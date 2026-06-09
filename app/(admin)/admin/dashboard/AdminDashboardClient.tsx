"use client"

import React, { useState } from 'react'
import Link from 'next/link'
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
  pendingInquiries: number
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

import { useLanguageStore } from '@/store/languageStore'

const ADMIN_DICT = {
  EN: {
    adminWorkspace: "Admin Workspace",
    academyHQ: "Academy HQ",
    cmdCenter: "Command center for operations, student onboarding, and engagement analytics.",
    systemOnline: "System Online",
    totalStudents: "Total Students",
    active: "active",
    sessions: "Sessions",
    today: "today",
    wk: "/wk",
    enquiries: "Enquiries",
    pendingReview: "pending review",
    instructors: "Instructors",
    activeToday: "active today",
    pendingActions: "Pending Actions",
    waiting: "waiting",
    inboxZero: "Inbox zero! All bookings processed.",
    reviewApprove: "Review & Approve",
    recentActivity: "Recent Activity",
    engagementTrends: "Engagement Trends",
    last7Days: "Last 7 Days",
    students: "students",
    xp: "XP",
    topStudents: "Top Students",
    level: "Level",
    instructorLoad: "Instructor Load",
    sessWk: "sess/wk",
    feedbackComp: "Feedback completion:",
    onboardStudent: "Onboard Student",
    name: "Name",
    trainingType: "Training Type",
    emailLogin: "Email (for login)",
    assignInstructor: "Assign Primary Instructor",
    selectInstructor: "Select an instructor...",
    studentsCurrently: "students currently",
    cancel: "Cancel",
    approveCreate: "Approve & Create Account",
    accountCreated: "Account created and login sent to student!",
    failedCreate: "Failed to create account",
    networkError: "Network error occurred."
  },
  HI: {
    adminWorkspace: "व्यवस्थापक कार्यस्थान",
    academyHQ: "अकादमी मुख्यालय",
    cmdCenter: "संचालन, छात्र ऑनबोर्डिंग और जुड़ाव विश्लेषण के लिए कमांड सेंटर।",
    systemOnline: "सिस्टम ऑनलाइन",
    totalStudents: "कुल छात्र",
    active: "सक्रिय",
    sessions: "सत्र",
    today: "आज",
    wk: "/सप्ताह",
    enquiries: "पूछताछ",
    pendingReview: "समीक्षा लंबित",
    instructors: "प्रशिक्षक",
    activeToday: "आज सक्रिय",
    pendingActions: "लंबित कार्रवाइयां",
    waiting: "प्रतीक्षारत",
    inboxZero: "इनबॉक्स शून्य! सभी बुकिंग संसाधित।",
    reviewApprove: "समीक्षा और अनुमोदन",
    recentActivity: "हाल की गतिविधि",
    engagementTrends: "जुड़ाव रुझान",
    last7Days: "पिछले 7 दिन",
    students: "छात्र",
    xp: "एक्सपी",
    topStudents: "शीर्ष छात्र",
    level: "स्तर",
    instructorLoad: "प्रशिक्षक कार्यभार",
    sessWk: "सत्र/सप्ताह",
    feedbackComp: "फ़ीडबैक पूर्णता:",
    onboardStudent: "छात्र को ऑनबोर्ड करें",
    name: "नाम",
    trainingType: "प्रशिक्षण का प्रकार",
    emailLogin: "ईमेल (लॉगिन के लिए)",
    assignInstructor: "प्राथमिक प्रशिक्षक असाइन करें",
    selectInstructor: "एक प्रशिक्षक चुनें...",
    studentsCurrently: "छात्र वर्तमान में",
    cancel: "रद्द करें",
    approveCreate: "अनुमोदित करें और खाता बनाएं",
    accountCreated: "खाता बनाया गया और छात्र को लॉगिन भेजा गया!",
    failedCreate: "खाता बनाने में विफल",
    networkError: "नेटवर्क त्रुटि हुई।"
  },
  TE: {
    adminWorkspace: "అడ్మిన్ వర్క్‌స్పేస్",
    academyHQ: "అకాడమీ HQ",
    cmdCenter: "కార్యకలాపాలు, విద్యార్థుల ఆన్‌బోర్డింగ్ మరియు నిశ్చితార్థ విశ్లేషణల కోసం కమాండ్ సెంటర్.",
    systemOnline: "సిస్టమ్ ఆన్‌లైన్",
    totalStudents: "మొత్తం విద్యార్థులు",
    active: "యాక్టివ్",
    sessions: "సెషన్‌లు",
    today: "ఈరోజు",
    wk: "/వారం",
    enquiries: "విచారణలు",
    pendingReview: "సమీక్ష పెండింగ్‌లో ఉంది",
    instructors: "బోధకులు",
    activeToday: "ఈరోజు యాక్టివ్",
    pendingActions: "పెండింగ్ చర్యలు",
    waiting: "వేచి ఉంది",
    inboxZero: "ఇన్‌బాక్స్ శూన్యం! అన్ని బుకింగ్‌లు ప్రాసెస్ చేయబడ్డాయి.",
    reviewApprove: "సమీక్షించి ఆమోదించండి",
    recentActivity: "ఇటీవలి కార్యాచరణ",
    engagementTrends: "నిశ్చితార్థం ట్రెండ్స్",
    last7Days: "గత 7 రోజులు",
    students: "విద్యార్థులు",
    xp: "XP",
    topStudents: "టాప్ విద్యార్థులు",
    level: "స్థాయి",
    instructorLoad: "బోధకుని లోడ్",
    sessWk: "సెస్/వారం",
    feedbackComp: "అభిప్రాయం పూర్తి:",
    onboardStudent: "విద్యార్థిని ఆన్‌బోర్డ్ చేయండి",
    name: "పేరు",
    trainingType: "శిక్షణ రకం",
    emailLogin: "ఇమెయిల్ (లాగిన్ కోసం)",
    assignInstructor: "ప్రాథమిక బోధకుడిని కేటాయించండి",
    selectInstructor: "ఒక బోధకుడిని ఎంచుకోండి...",
    studentsCurrently: "ప్రస్తుతం విద్యార్థులు",
    cancel: "రద్దు చేయి",
    approveCreate: "ఆమోదించండి & ఖాతాను సృష్టించండి",
    accountCreated: "ఖాతా సృష్టించబడింది మరియు లాగిన్ విద్యార్థికి పంపబడింది!",
    failedCreate: "ఖాతా సృష్టించడం విఫలమైంది",
    networkError: "నెట్‌వర్క్ లోపం సంభవించింది."
  }
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

  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof ADMIN_DICT
  const t = ADMIN_DICT[activeLang] || ADMIN_DICT.EN

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
        setOnboardMessage(t.accountCreated)
        setPendingBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
        setTimeout(() => {
          setSelectedBooking(null)
          setOnboardingStatus('idle')
        }, 2000)
      } else {
        const err = await res.json()
        setOnboardingStatus('error')
        setOnboardMessage(err.error || t.failedCreate)
      }
    } catch (e) {
      setOnboardingStatus('error')
      setOnboardMessage(t.networkError)
    }
  }

  // Zone 3: Engagement Graph SVG (Minimal sparkline style)
  const maxActive = Math.max(...engagementData.map(d => d.activeStudents), 1)
  
  return (
    <div className="w-full flex flex-col gap-6 text-[rgb(var(--color-text-1))]">

      {/* CLEAN FLAT ENTERPRISE PAGE HEADER */}
      <div className="border-b border-[rgb(var(--color-border))]/60 pb-6 mb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-[rgb(var(--color-primary))] font-mono text-xs uppercase tracking-widest font-bold">{t.adminWorkspace}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-[rgb(var(--color-text-1))] mt-1">{t.academyHQ}</h1>
            <p className="text-[rgb(var(--color-text-3))] text-xs md:text-sm mt-1.5 max-w-xl">{t.cmdCenter}</p>
          </div>
          <div className="px-5 py-2.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl text-sm font-bold shadow-sm">
            {t.systemOnline}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8 relative z-10">

        {/* ZONE 1: Command Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2">
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" /> {t.totalStudents}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.totalStudents}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">{stats.activeStudents} {t.active}</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2">
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {t.sessions}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.sessionsToday}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">{t.today} ({stats.sessionsThisWeek} {t.wk})</span>
            </div>
          </div>

          <Link href="/admin/enquiries" className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden hover:border-rose-500/50 hover:bg-[rgb(var(--color-border))]/30 transition-all cursor-pointer group">
            <div className="w-full h-full flex flex-col gap-2">
              {stats.pendingInquiries > 0 && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/10 rounded-bl-3xl flex justify-center items-start p-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                </div>
              )}
              <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2 group-hover:text-rose-400 transition-colors">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> {t.enquiries}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{Number(stats.pendingInquiries) || 0}</span>
                <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">{t.pendingReview}</span>
              </div>
            </div>
          </Link>

          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 flex flex-col gap-2">
            <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-amber-500" /> {t.instructors}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[rgb(var(--color-text-1))]">{stats.activeInstructors}</span>
              <span className="text-xs font-medium text-[rgb(var(--color-text-2))]">{t.activeToday}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Zone 2 & Zone 6 */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            
            {/* ZONE 2: Pending Actions (Bookings) */}
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> {t.pendingActions}
                </h3>
                <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-500 px-2 py-1 rounded-lg">{pendingBookings.length} {t.waiting}</span>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="text-center py-8 text-[rgb(var(--color-text-3))] text-sm italic font-mono bg-[rgb(var(--color-void))] rounded-2xl border border-[rgb(var(--color-border))]/50">
                  {t.inboxZero}
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
                        {t.reviewApprove}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ZONE 6: Recent Activity (System Logs) */}
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5 flex-1">
              <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[rgb(var(--color-text-3))]" /> {t.recentActivity}
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
            <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[rgb(var(--color-primary))]" /> {t.engagementTrends}
                </h3>
                <span className="text-xs text-[rgb(var(--color-text-3))] font-mono">{t.last7Days}</span>
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
                        {d.activeStudents} {t.students}, {d.xpAwarded} {t.xp}
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
              <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> {t.topStudents}
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
                        <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono">{t.level} {stu.level}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[rgb(var(--color-primary))] font-mono">{stu.xp} {t.xp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ZONE 5: Instructor Load */}
              <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" /> {t.instructorLoad}
                </h3>
                
                <div className="flex flex-col gap-4">
                  {instructors.map((ins) => (
                    <div key={ins.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[rgb(var(--color-text-1))]">{ins.name}</span>
                        <span className="text-[rgb(var(--color-text-3))] font-mono">{ins.studentCount} {t.students}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-[rgb(var(--color-border))] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500"
                            style={{ width: `${Math.min(ins.sessionsThisWeek * 5, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[rgb(var(--color-text-2))]">{ins.sessionsThisWeek} {t.sessWk}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] font-mono mt-1 border-t border-[rgb(var(--color-border))]/50 pt-1">
                        <span className="text-[rgb(var(--color-text-3))]">{t.feedbackComp}</span>
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
                <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.onboardStudent}</h2>
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
                      <label className="text-xs font-bold text-[rgb(var(--color-text-3))]">{t.name}</label>
                      <input type="text" readOnly value={selectedBooking.name} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-2 text-sm text-[rgb(var(--color-text-2))] outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[rgb(var(--color-text-3))]">{t.trainingType}</label>
                      <input type="text" readOnly value={selectedBooking.trainingType} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-2 text-sm text-[rgb(var(--color-text-2))] outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-xs font-bold text-[rgb(var(--color-text-3))]">{t.emailLogin}</label>
                      <input type="text" readOnly value={selectedBooking.email} className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-2 text-sm text-[rgb(var(--color-text-2))] outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-[rgb(var(--color-border))]/50 mt-2">
                    <label className="text-xs font-bold text-[rgb(var(--color-primary))]">{t.assignInstructor}</label>
                    <select
                      required
                      value={assignedInstructor}
                      onChange={(e) => setAssignedInstructor(e.target.value)}
                      className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] rounded-xl px-3 py-3 text-sm font-medium text-[rgb(var(--color-text-1))] outline-none transition-colors"
                    >
                      <option value="" disabled>{t.selectInstructor}</option>
                      {instructors.map(ins => (
                        <option key={ins.id} value={ins.id}>
                          {ins.name} ({ins.studentCount} {t.studentsCurrently})
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
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={onboardingStatus === 'loading' || !assignedInstructor}
                      className="flex-1 py-3 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {onboardingStatus === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>{t.approveCreate}</>
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
