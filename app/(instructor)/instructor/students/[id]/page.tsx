"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, User, ShieldCheck, Flame, Star, AlertTriangle, CheckCircle, PenTool, Battery, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import { useXPStore } from '@/lib/stores/xp-store'
import { useRTOStore } from '@/lib/stores/rto-store'
import { StudentState } from '@/lib/data/academyStore'

interface PageProps {
  params: { id: string }
}

export default function InstructorCadetDetails({ params }: PageProps) {
  const studentId = params.id

  const [studentData, setStudentData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FEEDBACK'>('OVERVIEW')
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [skillScores, setSkillScores] = useState<Record<string, number>>({})
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null)
  
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

      setToastMessage("Session feedback and XP bonus submitted to cadet profile.")
      setTimeout(() => setToastMessage(null), 3000)
      setSessionNotes('')
    } catch (error) {
      console.error(error)
      setToastMessage("Failed to submit feedback. Try again.")
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
        setToastMessage(`${skillName} progress updated.`)
        setTimeout(() => setToastMessage(null), 3000)
      } else {
        throw new Error('Failed to update skill')
      }
    } catch (error) {
      console.error(error)
      setToastMessage("Failed to update progress.")
      setTimeout(() => setToastMessage(null), 3000)
    } finally {
      setUpdatingSkill(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center">
        <Clock className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="font-mono text-xs uppercase text-text-3">LOADING STUDENT PROFILE...</span>
      </div>
    )
  }

  if (!studentData) return null

  if ((studentData as any).notFound) {
    return (
      <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-danger mb-4" />
        <h2 className="text-xl font-bold font-display mb-2">Student Not Found</h2>
        <p className="text-text-3 font-body text-sm mb-6">The cadet profile you are looking for does not exist or is not assigned to you.</p>
        <Link href="/instructor/students" className="px-6 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold hover:bg-surface-2 transition-all">
          Return to Roster
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
          <ChevronLeft className="w-4 h-4" /> Back to Roster
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-void border-2 border-primary/40 rounded-full flex items-center justify-center text-primary">
              <User className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-widest text-primary uppercase">Student Profile</span>
              <h1 className="text-3xl font-extrabold text-text-1 tracking-tight font-display mt-1">
                {(studentData as any).name || 'Student'}
              </h1>
              <p className="text-sm font-mono text-text-3 mt-1">ID: {studentId.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-surface border border-border px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-text-3 font-mono uppercase">Level</span>
              <div className="text-xl font-bold font-mono text-text-1">{studentData.level}</div>
            </div>
            <div className="bg-surface border border-border px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-text-3 font-mono uppercase">XP Total</span>
              <div className="text-xl font-bold font-mono text-accent">{studentData.xp}</div>
            </div>
            <div className="bg-surface border border-border px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-text-3 font-mono uppercase">Streak</span>
              <div className="text-xl font-bold font-mono text-primary flex items-center gap-1 justify-center">
                <Flame className="w-4 h-4" /> {studentData.streakDays}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-4 mb-8">
        <button 
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === 'OVERVIEW' ? 'bg-primary text-void shadow-lg shadow-primary/20' : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          Performance Overview
        </button>
        <button 
          onClick={() => setActiveTab('FEEDBACK')}
          className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === 'FEEDBACK' ? 'bg-accent text-void shadow-lg shadow-accent/20' : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          Submit Feedback
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
                  <h3 className="text-sm font-bold font-display uppercase tracking-widest text-text-1">Driving Skills</h3>
                </div>
                <button
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="text-xs font-mono uppercase tracking-widest text-text-3 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <PenTool className="w-3 h-3" />
                  {isEditingSkills ? 'Done' : 'Edit'}
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
                <h3 className="text-sm font-bold font-display uppercase tracking-widest text-text-1">Weak Theory Topics</h3>
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
                  <p className="text-xs font-mono text-text-3 uppercase">No theory vulnerabilities detected.</p>
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
                <h3 className="text-lg font-bold font-display text-text-1">Session Notes & Feedback</h3>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-3 mb-3">Overall Performance</label>
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
                <label className="block text-xs font-mono uppercase tracking-widest text-text-3 mb-3">Your Feedback for the Student</label>
                <textarea 
                  required
                  rows={5}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Note specific maneuvers needing practice, defensive driving habits..."
                  className="w-full bg-void border border-border rounded-xl p-4 text-sm text-text-1 focus:border-primary outline-none transition-colors resize-none font-body"
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
                <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-primary">XP Bonus Authorized</h4>
                  <p className="text-xs text-text-2 mt-1">Submitting this feedback will automatically award <strong>+150 XP</strong> to the student for completing the session.</p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.4)]"
              >
                <CheckCircle className="w-4 h-4" /> Submit Feedback & Award XP
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
