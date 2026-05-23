"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  CheckCircle2, 
  CarFront,
  ShieldAlert,
  ChevronRight,
  Activity
} from 'lucide-react'

interface StudentData {
  id: string
  name: string
  level: number
  xp: number
  attendance: number
  risk: string
  lastSession: string
  nextSession: string
}

export default function InstructorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('ALL')
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/instructor/students')
        if (res.ok) {
          const data = await res.json()
          const mapped: StudentData[] = data.map((s: any) => {
            const completedSessions = s.sessions?.filter((session: any) => session.status === 'COMPLETED').length || 0
            const scheduledSessions = s.sessions?.length || 0
            const attendancePct = scheduledSessions > 0 ? Math.round((completedSessions / scheduledSessions) * 100) : 0

            return {
              id: s.id,
              name: s.name || 'Unknown',
              level: s.level || 1,
              xp: s.xp || 0,
              attendance: attendancePct,
              risk: s.completionPercent < 30 ? 'HIGH' : s.completionPercent < 60 ? 'MEDIUM' : 'LOW',
              lastSession: s.dailyLog?.[0]?.note ? s.dailyLog[0].note.substring(0, 20) + '...' : 'N/A',
              nextSession: s.todaySession ? s.todaySession.lessonType : 'No upcoming session'
            }
          })
          setStudents(mapped)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = filterRisk === 'ALL' || s.risk === filterRisk
    return matchesSearch && matchesRisk
  })

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-2">Assigned Students</h1>
            <p className="text-sm sm:text-base text-text-2">Manage your roster, track analytics, and submit coaching feedback.</p>
          </div>
          
          <div className="grid grid-cols-2 md:flex md:items-center gap-3 bg-surface p-3 rounded-2xl border border-border w-full md:w-auto">
            <div className="flex flex-col px-3 md:px-4 md:border-r md:border-border">
              <span className="text-xs text-text-3 font-data-mono">TOTAL ASSIGNED</span>
              <span className="text-xl font-bold">{students.length}</span>
            </div>
            <div className="flex flex-col px-3 md:px-4 md:border-r md:border-border">
              <span className="text-xs text-text-3 font-data-mono">AVG ATTENDANCE</span>
              <span className="text-xl font-bold text-success">85%</span>
            </div>
            <div className="flex flex-col px-3 md:px-4">
              <span className="text-xs text-text-3 font-data-mono">AT RISK</span>
              <span className="text-xl font-bold text-danger">{students.filter(s => s.risk === 'HIGH').length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
            <input 
              type="text"
              placeholder="Search Student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white placeholder-text-3"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(risk => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                  filterRisk === risk 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-surface border-border text-text-3 hover:text-white hover:border-text-3'
                }`}
              >
                {risk === 'ALL' ? 'All Risks' : `${risk} Risk`}
              </button>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid gap-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-surface border border-border p-5 sm:p-6 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                
                {/* Profile Info */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="w-12 h-12 rounded-full bg-void border border-border flex items-center justify-center font-display font-bold text-lg text-primary">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">{student.name}</h3>
                    <p className="text-sm text-text-3 font-data-mono">Level {student.level} • {student.xp.toLocaleString()} XP</p>
                  </div>
                </div>

                {/* Analytics Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto">
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-text-3 font-data-mono flex items-center gap-1"><Activity className="w-3 h-3"/> ATTENDANCE</span>
                    <span className={`font-semibold ${student.attendance < 75 ? 'text-danger' : 'text-success'}`}>
                      {student.attendance}%
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-text-3 font-data-mono flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> RISK LEVEL</span>
                    <span className={`font-semibold ${
                      student.risk === 'HIGH' ? 'text-danger' : student.risk === 'MEDIUM' ? 'text-accent' : 'text-success'
                    }`}>
                      {student.risk}
                    </span>
                  </div>

                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <span className="text-xs text-text-3 font-data-mono flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> LAST SESSION</span>
                    <span className="text-sm text-text-1 truncate sm:max-w-[150px]" title={student.lastSession}>
                      {student.lastSession}
                    </span>
                  </div>

                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <span className="text-xs text-text-3 font-data-mono flex items-center gap-1"><CarFront className="w-3 h-3"/> NEXT UP</span>
                    <span className="text-sm text-text-1 truncate sm:max-w-[150px]" title={student.nextSession}>
                      {student.nextSession}
                    </span>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-between sm:justify-end">
                  <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary hover:text-white transition-colors w-full sm:w-auto">
                    Add Note
                  </button>
                  <button className="p-2 text-text-3 hover:text-white transition-colors hidden sm:inline-flex">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center border border-border border-dashed rounded-2xl bg-surface/50">
              <Users className="w-12 h-12 text-text-3 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-text-1 mb-2">No Students Found</h3>
              <p className="text-text-3">Try adjusting your search filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

