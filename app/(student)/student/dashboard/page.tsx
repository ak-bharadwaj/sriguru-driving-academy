"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Map, 
  BookOpen, 
  FileText, 
  Award, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Compass, 
  MessageSquare,
  ArrowRight,
  TrendingUp
} from 'lucide-react'

// Import Zustand stores
import { useXPStore, Badge } from '@/lib/stores/xp-store'
import { useStudentStore, AttendanceRecord, RoadmapMilestone } from '@/lib/stores/student-store'
import { useSessionStore, DrivingSession } from '@/lib/stores/session-store'
import { useRTOStore } from '@/lib/stores/rto-store'

// Define orbital tabs
const ORBITAL_TABS = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Roadmap', label: 'Roadmap', icon: Map },
  { id: 'Learn', label: 'Learn', icon: BookOpen },
  { id: 'RTO', label: 'RTO Test', icon: FileText },
  { id: 'Badges', label: 'Badges', icon: Award },
]

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Home')

  // Get state from Zustand stores
  const { currentXP, level, streakDays, badges, addXP, awardBadge, incrementStreak } = useXPStore()
  const { profile, roadmapProgress, attendanceRecords, setProfile, setRoadmap, recordAttendance } = useStudentStore()
  const { upcomingSessions, setUpcomingSessions } = useSessionStore()
  const { practiceProgress, weakTopics, updatePracticeProgress } = useRTOStore()

  // Initialize store with gorgeous premium mock data if empty
  useEffect(() => {
    if (!profile) {
      setProfile({
        id: 'student-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@sriguru.com',
        phoneNumber: '+91 98765 43210',
        licenseCategory: 'Light Motor Vehicle (LMV)',
        instructorId: 'inst-1'
      })
    }

    if (roadmapProgress.length === 0) {
      const milestones: RoadmapMilestone[] = [
        { id: 'm1', title: 'Cockpit Drill & Basics', description: 'Seat, mirror, steering, start-stop', isCompleted: true, order: 1, skillsChecked: ['Seat Adjust', 'Mirror Alignment', 'Clutch Bite'] },
        { id: 'm2', title: 'Gear Shifting & Steering', description: 'Synchro shifts and figure-8 steering', isCompleted: true, order: 2, skillsChecked: ['2nd to 3rd Sync', 'Tight Turns'] },
        { id: 'm3', title: 'Slope Assist & Clutch Play', description: 'Hill start without rollback mechanics', isCompleted: false, order: 3, skillsChecked: ['Handbrake Start', 'Clutch Balancing'] },
        { id: 'm4', title: 'Parallel & Reverse Parking', description: 'Accurate reference point alignment', isCompleted: false, order: 4, skillsChecked: ['Asymmetric Parallel', 'S-Curve Reverse'] },
        { id: 'm5', title: 'Highway & City Merging', description: 'Speed matching and defensive maneuvers', isCompleted: false, order: 5, skillsChecked: ['Lane Change', 'Overtaking Speed'] },
      ]
      setRoadmap(milestones)
    }

    if (attendanceRecords.length === 0) {
      const records: AttendanceRecord[] = [
        { sessionId: 'sess-old-1', date: 'May 10', present: true, durationMinutes: 60, instructorFeedback: 'Excellent clutch control during stop-and-go.' },
        { sessionId: 'sess-old-2', date: 'May 12', present: true, durationMinutes: 60, instructorFeedback: 'Steering transitions are smooth; work on downshifts.' },
        { sessionId: 'sess-old-3', date: 'May 15', present: true, durationMinutes: 60, instructorFeedback: 'Parallel parking angle matches the marks accurately.' },
      ]
      records.forEach(r => recordAttendance(r))
    }

    if (upcomingSessions.length === 0) {
      const sessions: DrivingSession[] = [
        { id: 'sess-up-1', instructorName: 'Captain Vikram Singh', dateTime: 'Friday, May 22 • 10:00 AM', durationHours: 1.5, topic: 'Reverse Parallel Parking & Clutch-slope Play', status: 'scheduled' },
        { id: 'sess-up-2', instructorName: 'Captain Vikram Singh', dateTime: 'Monday, May 25 • 04:30 PM', durationHours: 1.0, topic: 'Night Merging & High-speed Lane Changing', status: 'scheduled' }
      ]
      setUpcomingSessions(sessions)
    }

    if (practiceProgress === 0) {
      updatePracticeProgress(84)
    }

    // Set initial custom values on XP if they are empty
    if (level === 1 && currentXP === 0) {
      // Add initial mock metrics
      addXP(1450) // This will level them up to Level 2 (1000XP) and leave 450XP in Level 2!
      incrementStreak()
      incrementStreak()
      incrementStreak()
      incrementStreak()
      incrementStreak() // 5-day streak
      
      const badge1: Badge = { id: 'b1', name: 'Steering Maestro', description: 'Complete figure-8 with zero cone touches.', unlockedAt: new Date().toISOString(), icon: 'Maestro' }
      const badge2: Badge = { id: 'b2', name: 'Slope Conqueror', description: 'Flawless incline stop and start.', unlockedAt: new Date().toISOString(), icon: 'Slope' }
      awardBadge(badge1)
      awardBadge(badge2)
    }
  }, [])

  // XP Circle Ring Calculations
  const radius = 70
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const maxXPForLevel = level * 1000
  const xpPercentage = Math.min((currentXP / maxXPForLevel) * 100, 100)
  const strokeDashoffset = circumference - (xpPercentage / 100) * circumference

  // Dynamic calculations for Stats
  const completedSessionsCount = attendanceRecords.filter(r => r.present).length
  const totalMilestonesCount = roadmapProgress.length
  const completedMilestonesCount = roadmapProgress.filter(m => m.isCompleted).length
  const skillsMasteredCount = roadmapProgress.filter(m => m.isCompleted).reduce((acc, m) => acc + m.skillsChecked.length, 0)
  const attendanceRate = completedSessionsCount > 0 ? 100 : 0 // Perfect 100% since present for all logged

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-20 overflow-x-hidden font-body selection:bg-primary/30">
      
      {/* Top Orbital Navigation Floating Pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-surface/85 backdrop-blur-lg px-3 py-2 rounded-full border border-border flex items-center gap-1 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {ORBITAL_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium tracking-wide transition-colors duration-300 ${
                isActive ? 'text-text-1' : 'text-text-3 hover:text-text-2'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="orbital-active"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-3'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-36">
        
        {/* Asymmetrical Named CSS Grid Layout (62% left, 38% right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[62%_38%] gap-8 items-start">
          
          {/* LEFT COLUMN: HERO & STATS */}
          <div className="flex flex-col gap-8">
            
            {/* Hero Gamified Universe Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-surface border border-border rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Background ambient glow matching branding colors */}
              <div className="absolute -right-24 -top-24 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

              {/* Large SVG XP Ring */}
              <div className="relative w-[180px] h-[180px] flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90">
                  {/* Track ring */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    className="stroke-void"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    className="stroke-white/[0.04]"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Active progress ring */}
                  <motion.circle
                    cx="90"
                    cy="90"
                    r={radius}
                    className="stroke-primary"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Level indicators in center */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-text-3 text-[10px] uppercase tracking-widest font-mono">Rank</span>
                  <span className="text-5xl font-extrabold tracking-tighter text-text-1 font-display leading-none">
                    {level}
                  </span>
                  <span className="text-[10px] text-accent font-semibold tracking-wider uppercase mt-1">
                    {currentXP} / {maxXPForLevel} XP
                  </span>
                </div>
              </div>

              {/* Hero details side container */}
              <div className="flex-1 w-full flex flex-col gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-text-3">Academy Cadet</span>
                  <h2 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-1">
                    {profile?.name || 'Loading Cadet...'}
                  </h2>
                  
                  {/* Streak flame details */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="bg-accent/15 border border-accent/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-accent fill-accent animate-pulse" />
                      <span className="text-xs font-bold text-accent font-mono uppercase tracking-wide">
                        {streakDays} Day In-Row Streak
                      </span>
                    </div>
                    <span className="text-xs text-text-2">Level {level} Elite Driver</span>
                  </div>
                </div>

                {/* Confidence Meter (Highway-divided dotted design) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-3 uppercase tracking-wider">Confidence Index</span>
                    <span className="text-primary font-bold">{practiceProgress}% Mastery</span>
                  </div>
                  
                  {/* Dotted high-performance overlay mask */}
                  <div className="relative h-4 bg-void rounded-full overflow-hidden border border-border/80">
                    {/* Active progress */}
                    <motion.div 
                      initial={{ scaleX: 0, transformOrigin: 'left' }}
                      animate={{ scaleX: practiceProgress / 100 }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                      className="absolute left-0 top-0 bottom-0 right-0 bg-gradient-to-r from-primary to-accent" 
                    />
                    
                    {/* Dotted mask replicating highway lane markers */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_60%,#07090F_60%,#07090F_100%)] bg-[size:10px_100%]" />
                  </div>
                </div>

                {/* Asymmetric Next Lesson Card */}
                {upcomingSessions.length > 0 && (
                  <div className="mt-2 bg-void/50 border border-border border-l-4 border-l-accent p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <span className="text-[10px] text-text-3 font-mono uppercase tracking-widest block">Next Scheduled In-Car Workout</span>
                        <h4 className="text-sm font-semibold text-text-1 mt-0.5">{upcomingSessions[0].topic}</h4>
                        <p className="text-xs text-text-2 mt-0.5">{upcomingSessions[0].dateTime} • {upcomingSessions[0].instructorName}</p>
                      </div>
                    </div>
                    <button className="p-2 bg-surface hover:bg-primary/20 border border-border hover:border-primary/40 rounded-full transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-text-2 hover:text-primary" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Asymmetrical Stats Mini-Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Stat 1: Completed Sessions (Subtle color card) */}
              <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300">
                  <CheckCircle2 className="w-24 h-24 text-text-1" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-text-3">Workouts Finished</span>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-4xl font-extrabold text-success font-display">{completedSessionsCount}</span>
                  <span className="text-xs text-text-3">lessons</span>
                </div>
                <p className="text-[10px] text-text-2 mt-1 font-body">100% attendance rate</p>
              </div>

              {/* Stat 2: Theory Quiz Accuracy (Electric Blue card) */}
              <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between h-36 relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300">
                  <TrendingUp className="w-24 h-24 text-text-1" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-text-3">Mock RTO Accuracy</span>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-4xl font-extrabold text-primary font-display">{practiceProgress}%</span>
                  <span className="text-xs text-text-3">accuracy</span>
                </div>
                <p className="text-[10px] text-text-2 mt-1 font-body">Top 12% in regional registry</p>
              </div>

              {/* Stat 3: Milestones Finished */}
              <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between h-36 relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300">
                  <Compass className="w-24 h-24 text-text-1" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-text-3">Roadmap Milestones</span>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-4xl font-extrabold text-accent font-display">{completedMilestonesCount}</span>
                  <span className="text-xs text-text-3">/ {totalMilestonesCount} done</span>
                </div>
                <p className="text-[10px] text-text-2 mt-1 font-body">Incline Assist in-progress</p>
              </div>

              {/* Stat 4: Skills Mastered */}
              <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300">
                  <Award className="w-24 h-24 text-text-1" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-text-3">Skills Mastered</span>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-4xl font-extrabold text-text-1 font-display">{skillsMasteredCount}</span>
                  <span className="text-xs text-text-3">checks</span>
                </div>
                <p className="text-[10px] text-text-2 mt-1 font-body">Steering & gear Sync perfect</p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: TIMELINE ACTIVITY FEED */}
          <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative min-h-[500px]">
            <h3 className="text-lg font-bold text-text-1 tracking-tight font-display flex items-center justify-between border-b border-border pb-4">
              <span>Cadet Logbook</span>
              <span className="text-[10px] bg-white/[0.04] border border-border px-2 py-0.5 rounded font-mono text-text-2 uppercase">Realtime Feed</span>
            </h3>

            {/* Vertical timeline line container */}
            <div className="relative pl-6 flex-1 flex flex-col gap-8">
              {/* Vertical line indicator */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />

              <motion.div 
                className="flex flex-col gap-8"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {/* Timeline Item 1: Gear Shift Lesson Completed */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
                  }}
                  className="relative flex items-start gap-4"
                >
                  <div className="absolute -left-[24px] top-1 w-[12px] h-[12px] rounded-full bg-success border-4 border-void ring-1 ring-success/20 z-10" />
                  <div className="flex-1 bg-void/30 border border-border/60 hover:border-border p-4 rounded-xl transition-colors duration-300">
                    <div className="flex justify-between items-center text-xs font-mono text-text-3">
                      <span>IN-CAR WORKOUT</span>
                      <span>May 15</span>
                    </div>
                    <h5 className="text-sm font-semibold text-text-1 mt-1">Figure-8 Steering Sync Done</h5>
                    <div className="flex items-center gap-1.5 mt-2 bg-success/5 border border-success/10 px-2.5 py-1 rounded text-xs text-text-2">
                      <MessageSquare className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      <p className="italic">"Parallel parking angle matches the marks accurately." — Captain Vikram</p>
                    </div>
                  </div>
                </motion.div>

                {/* Timeline Item 2: Badge Earned */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
                  }}
                  className="relative flex items-start gap-4"
                >
                  <div className="absolute -left-[24px] top-1 w-[12px] h-[12px] rounded-full bg-accent border-4 border-void ring-1 ring-accent/20 z-10" />
                  <div className="flex-1 bg-void/30 border border-border/60 hover:border-border p-4 rounded-xl transition-colors duration-300">
                    <div className="flex justify-between items-center text-xs font-mono text-text-3">
                      <span>ACHIEVEMENT UNLOCKED</span>
                      <span>May 12</span>
                    </div>
                    <h5 className="text-sm font-semibold text-text-1 mt-1">"Steering Maestro" Badge Awarded</h5>
                    <p className="text-xs text-text-2 mt-1">Earned for completing figure-8 course with zero boundary violations +150 XP</p>
                  </div>
                </motion.div>

                {/* Timeline Item 3: RTO Quiz Taken */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
                  }}
                  className="relative flex items-start gap-4"
                >
                  <div className="absolute -left-[24px] top-1 w-[12px] h-[12px] rounded-full bg-primary border-4 border-void ring-1 ring-primary/20 z-10" />
                  <div className="flex-1 bg-void/30 border border-border/60 hover:border-border p-4 rounded-xl transition-colors duration-300">
                    <div className="flex justify-between items-center text-xs font-mono text-text-3">
                      <span>THEORY PRACTICE</span>
                      <span>May 10</span>
                    </div>
                    <h5 className="text-sm font-semibold text-text-1 mt-1">RTO Simulation Exam Passed</h5>
                    <p className="text-xs text-text-2 mt-1">Achieved 88% overall accuracy. Minor weakness logged under: "Signboards Hand Signals".</p>
                  </div>
                </motion.div>

                {/* Timeline Item 4: Registration */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
                  }}
                  className="relative flex items-start gap-4"
                >
                  <div className="absolute -left-[24px] top-1 w-[12px] h-[12px] rounded-full bg-text-3 border-4 border-void ring-1 ring-text-3/20 z-10" />
                  <div className="flex-1 bg-void/30 border border-border/60 hover:border-border p-4 rounded-xl transition-colors duration-300">
                    <div className="flex justify-between items-center text-xs font-mono text-text-3">
                      <span>SYSTEM LOG</span>
                      <span>May 05</span>
                    </div>
                    <h5 className="text-sm font-semibold text-text-1 mt-1">Cadet License Initiated</h5>
                    <p className="text-xs text-text-2 mt-1">Successfully enrolled under Cadet LMV training. Primary coach assigned: Capt. Vikram.</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
