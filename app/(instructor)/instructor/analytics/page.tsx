"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Users, Calendar, Award, Star, Clock } from 'lucide-react'

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

  if (!stats) return <div className="p-10 text-white">Failed to load stats.</div>

  const maxSkillCount = stats.topSkills.length > 0 ? Math.max(...stats.topSkills.map(s => s.count)) : 1

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto z-10 relative flex flex-col gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2">My Performance</h1>
          <p className="text-sm sm:text-base text-text-2">Analytics and insights for your coaching sessions.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">STUDENTS</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold">{stats.totalStudents}</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">SESSIONS (MO)</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold">{stats.sessionsThisMonth}</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">PASS RATE</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-success">{stats.passRate}%</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-xs font-data-mono text-text-3">AVG RATING</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-accent">{stats.avgRating || 'N/A'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6">Student Progress</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-sm font-data-mono text-text-2 border-b border-border">
                  <tr>
                    <th className="pb-4 px-3">STUDENT</th>
                    <th className="pb-4 px-3">SESSIONS</th>
                    <th className="pb-4 px-3">ATTENDANCE</th>
                    <th className="pb-4 px-3">LAST SESSION</th>
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
                        {s.lastSession ? new Date(s.lastSession).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {stats.studentStats.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-text-2 text-base">No students assigned.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Top Skills Covered</h3>
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
                {stats.topSkills.length === 0 && <p className="text-base text-text-2">No skills logged yet.</p>}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-5">Recent Feedback</h3>
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
                {stats.recentFeedback.length === 0 && <p className="text-base text-text-2">No feedback received yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
