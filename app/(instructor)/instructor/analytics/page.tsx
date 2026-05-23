"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Users, Calendar, Award, Star, Clock } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    loading: 'Failed to load stats.',
    title: 'My Performance',
    subtitle: 'Analytics and insights for your coaching sessions.',
    students: 'STUDENTS',
    sessionsMo: 'SESSIONS (MO)',
    passRate: 'PASS RATE',
    avgRating: 'AVG RATING',
    na: 'N/A',
    studentProgress: 'Student Progress',
    student: 'STUDENT',
    sessions: 'SESSIONS',
    attendance: 'ATTENDANCE',
    lastSession: 'LAST SESSION',
    noStudents: 'No students assigned.',
    topSkills: 'Top Skills Covered',
    noSkills: 'No skills logged yet.',
    recentFeedback: 'Recent Feedback',
    noFeedback: 'No feedback received yet.',
  },
  HI: {
    loading: 'आँकड़े लोड करने में विफल।',
    title: 'मेरा प्रदर्शन',
    subtitle: 'आपके कोचिंग सत्रों के लिए एनालिटिक्स और इनसाइट्स।',
    students: 'छात्र',
    sessionsMo: 'सत्र (महीना)',
    passRate: 'पास दर',
    avgRating: 'औसत रेटिंग',
    na: 'लागू नहीं',
    studentProgress: 'छात्र की प्रगति',
    student: 'छात्र',
    sessions: 'सत्र',
    attendance: 'उपस्थिति',
    lastSession: 'अंतिम सत्र',
    noStudents: 'कोई छात्र असाइन नहीं किया गया।',
    topSkills: 'शीर्ष कौशल कवर किए गए',
    noSkills: 'अभी तक कोई कौशल लॉग नहीं किया गया।',
    recentFeedback: 'हाल की प्रतिक्रिया',
    noFeedback: 'अभी तक कोई प्रतिक्रिया नहीं मिली है।',
  },
  TE: {
    loading: 'గణాంకాలను లోడ్ చేయడంలో విఫలమైంది.',
    title: 'నా పనితీరు',
    subtitle: 'మీ కోచింగ్ సెషన్‌ల కోసం అనలిటిక్స్ మరియు అంతర్దృష్టులు.',
    students: 'విద్యార్థులు',
    sessionsMo: 'సెషన్‌లు (నెల)',
    passRate: 'పాస్ రేటు',
    avgRating: 'సగటు రేటింగ్',
    na: 'వర్తించదు',
    studentProgress: 'విద్యార్థి పురోగతి',
    student: 'విద్యార్థి',
    sessions: 'సెషన్స్',
    attendance: 'హాజరు',
    lastSession: 'చివరి సెషన్',
    noStudents: 'ఏ విద్యార్థులు కేటాయించబడలేదు.',
    topSkills: 'కవర్ చేయబడిన అగ్ర నైపుణ్యాలు',
    noSkills: 'ఇంకా నైపుణ్యాలు నమోదు కాలేదు.',
    recentFeedback: 'ఇటీవలి అభిప్రాయం',
    noFeedback: 'ఇంకా ఎలాంటి ఫీడ్‌బ్యాక్ రాలేదు.',
  }
}


interface Stats {
  totalStudents: number
  sessionsThisMonth: number
  totalSessions: number
  passRate: number
  avgRating: string | null
  topSkills: { skill: string, count: number }[]
  studentStats: { id: string, name: string, sessionCount: number, attendancePct: number, lastSession: string | null }[]
  recentFeedback: { id: string, content: string, tag: string, createdAt: string, studentName: string }[]
}

export default function InstructorAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const { language } = useLanguageStore()
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN


  useEffect(() => {
    fetch('/api/instructor/analytics')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-primary">
        <Clock className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!stats) return <div className="p-10 text-white">{t.loading}</div>

  const maxSkillCount = stats.topSkills.length > 0 ? Math.max(...stats.topSkills.map(s => s.count)) : 1

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto z-10 relative flex flex-col gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2">{t.title}</h1>
          <p className="text-sm sm:text-base text-text-2">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">{t.students}</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold">{stats.totalStudents}</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">{t.sessionsMo}</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold">{stats.sessionsThisMonth}</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">{t.passRate}</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-success">{stats.passRate}%</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">{t.avgRating}</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-accent">{stats.avgRating || t.na}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6">{t.studentProgress}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-sm font-data-mono text-text-2 border-b border-border">
                  <tr>
                    <th className="pb-4 px-3">{t.student}</th>
                    <th className="pb-4 px-3">{t.sessions}</th>
                    <th className="pb-4 px-3">{t.attendance}</th>
                    <th className="pb-4 px-3">{t.lastSession}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-base">
                  {stats.studentStats.map(s => (
                    <tr key={s.id} className="hover:bg-void/50 transition-colors">
                      <td className="py-5 px-3 font-semibold">{s.name}</td>
                      <td className="py-5 px-3 font-data-mono">{s.sessionCount}</td>
                      <td className="py-5 px-3">
                        <span className={`px-3 py-1.5 rounded text-sm font-bold ${s.attendancePct >= 80 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                          {s.attendancePct}%
                        </span>
                      </td>
                      <td className="py-5 px-3 text-text-2 font-medium">
                        {s.lastSession ? new Date(s.lastSession).toLocaleDateString() : t.na}
                      </td>
                    </tr>
                  ))}
                  {stats.studentStats.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-text-2 text-base">{t.noStudents}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">{t.topSkills}</h3>
              <div className="flex flex-col gap-5">
                {stats.topSkills.map(skill => (
                  <div key={skill.skill} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-text-1">{skill.skill}</span>
                      <span className="font-data-mono font-bold text-text-2">{skill.count}</span>
                    </div>
                    <div className="h-3 w-full bg-void rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.count / maxSkillCount) * 100}%` }}
                        className="h-full bg-primary"
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
                {stats.topSkills.length === 0 && <p className="text-base text-text-2">{t.noSkills}</p>}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-5">{t.recentFeedback}</h3>
              <div className="flex flex-col gap-5">
                {stats.recentFeedback.map(fb => (
                  <div key={fb.id} className="border-l-4 border-primary pl-5 py-2 bg-void/30 rounded-r-xl">
                    <p className="text-base text-text-1 mb-2 italic">"{fb.content}"</p>
                    <div className="flex items-center gap-3 text-sm text-text-2">
                      <span className="font-bold text-primary">{fb.studentName}</span>
                      <span>•</span>
                      <span className="bg-void px-3 py-1 rounded-md border border-border font-medium">{fb.tag}</span>
                    </div>
                  </div>
                ))}
                {stats.recentFeedback.length === 0 && <p className="text-base text-text-2">{t.noFeedback}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
