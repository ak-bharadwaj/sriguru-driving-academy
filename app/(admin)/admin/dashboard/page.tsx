"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Calendar, 
  Clock, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  PlayCircle,
  Database,
  BarChart3,
  Bookmark,
  ChevronLeft
} from 'lucide-react'

// Define typings
interface TelemetryData {
  health: {
    activeStudents: number
    sessionsToday: number
    pendingBookings: number
  }
  topStudents: Array<{
    id: string
    name: string
    email: string
    level: number
    xp: number
    license: string
  }>
  bookingPipeline: {
    pending: any[]
    approved: any[]
    completed: any[]
  }
  enrollmentSparkline: Array<{ day: string; value: number }>
  instructorUtilization: Array<{ name: string; hours: number; rate: number }>
  attendanceHeatmap: Array<{ day: number; week: number; value: number }>
  recentActivityLog: Array<{ id: string; timestamp: string; type: string; text: string }>
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

interface AlertFeed {
  id: string
  type: string
  message: string
  relativeTime: string
  pulse: boolean
}

const NAV_ITEMS = [
  { id: 'Overview', category: 'Operational Matrices', items: ['Dashboard', 'System Health', 'System Audits'] },
  { id: 'Students', category: 'Cadet Rosters', items: ['Roster Profiles', 'Theoretical Progress', 'Milestones Log'] },
  { id: 'Instructors', category: 'Coaching Ranks', items: ['Utilization Logs', 'Specialty Tags'] },
  { id: 'Bookings', category: 'Registry Feeds', items: ['Pipeline Logs', 'Calendar Slots'] },
  { id: 'Analytics', category: 'Telemetry Matrices', items: ['Enrollment Trends', 'Heatmaps'] },
  { id: 'Gamification', category: 'XP Regulations', items: ['Badges Registry', 'Level Thresholds'] }
]

export default function AdminFuturisticOperationsHUD() {
  // Navigation active states
  const [activeSection, setActiveSection] = useState('Overview')
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'Overview': true,
    'Students': false,
    'Instructors': false,
    'Bookings': false,
    'Analytics': false
  })

  // Data telemetry states
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [liveFeed, setLiveFeed] = useState<AlertFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [notifActive, setNotifActive] = useState(true)

  // Fetch telemetry log values
  const fetchTelemetry = async (page = 1) => {
    try {
      const res = await fetch(`/api/admin/overview?page=${page}&limit=5`)
      if (!res.ok) throw new Error('Telemetry request failed')
      const data = await res.json()
      setTelemetry(data)
    } catch (e) {
      console.error(e)
    }
  }

  // Fetch live alert feed
  const fetchLiveFeed = async () => {
    try {
      const res = await fetch('/api/admin/live-feed')
      if (res.ok) {
        const data = await res.json()
        setLiveFeed(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true)
      await Promise.all([fetchTelemetry(currentPage), fetchLiveFeed()])
      setLoading(false)
    }
    initFetch()
  }, [currentPage])

  // Auto-refresh live feed alerts every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLiveFeed()
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }))
    setActiveSection(catId)
  }

  // ----------------------------------------------------
  // SPARKLINE MATHEMATICAL PATH GENERATOR
  // ----------------------------------------------------
  const renderSparkline = () => {
    if (!telemetry || !telemetry.enrollmentSparkline) return null
    const width = 280
    const height = 80
    const padding = 10
    const points = telemetry.enrollmentSparkline
    
    const maxVal = Math.max(...points.map(p => p.value))
    const minVal = Math.min(...points.map(p => p.value))
    const valRange = maxVal - minVal || 1

    const coordinates = points.map((p, i) => {
      const x = padding + (i * (width - padding * 2)) / (points.length - 1)
      const y = height - padding - ((p.value - minVal) * (height - padding * 2)) / valRange
      return { x, y, ...p }
    })

    const polylinePoints = coordinates.map(c => `${c.x},${c.y}`).join(' ')

    return (
      <svg className="w-full h-[100px]" viewBox={`0 0 ${width} ${height}`}>
        {/* Underlay glow path */}
        <path
          d={`M ${coordinates[0].x} ${height} L ${coordinates.map(c => `${c.x} ${c.y}`).join(' L ')} L ${coordinates[coordinates.length - 1].x} ${height} Z`}
          fill="url(#sparklineGlow)"
          className="opacity-20"
        />
        {/* Active path */}
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />
        {/* Telemetry coordinate pointer beacons */}
        {coordinates.map((c, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle
              cx={c.x}
              cy={c.y}
              r="4.5"
              fill={idx === coordinates.length - 1 ? 'var(--color-accent)' : 'var(--color-primary)'}
              stroke="var(--color-void)"
              strokeWidth="1.5"
            />
          </g>
        ))}
        {/* Definitions */}
        <defs>
          <linearGradient id="sparklineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-void)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // ----------------------------------------------------
  // GITHUB HEATMAP SVG CALCULATOR (7x12 grid)
  // ----------------------------------------------------
  const renderHeatmap = () => {
    if (!telemetry || !telemetry.attendanceHeatmap) return null
    const boxSize = 10
    const gap = 3.5
    
    return (
      <svg className="w-full max-w-[260px] h-[110px]" viewBox="0 0 170 100">
        {telemetry.attendanceHeatmap.map((item, idx) => {
          const x = item.week * (boxSize + gap) + 6
          const y = item.day * (boxSize + gap) + 6
          
          // Custom blue HSL scale depending on operations intensity counts
          let fill = 'rgba(255, 255, 255, 0.03)'
          let stroke = 'rgba(255, 255, 255, 0.05)'
          if (item.value > 0) {
            fill = `rgba(37, 99, 235, ${Math.min(0.2 + (item.value * 0.15), 0.95)})`
            stroke = `rgba(37, 99, 235, ${Math.min(0.4 + (item.value * 0.1), 1)})`
          }

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={boxSize}
              height={boxSize}
              rx={2}
              fill={fill}
              stroke={stroke}
              strokeWidth="0.8"
              className="hover:stroke-accent transition-all duration-200 cursor-pointer"
            />
          )
        })}
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-void text-text-1 relative font-mono overflow-x-hidden text-xs selection:bg-primary/30">
      
      {/* Background cybernetic grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP OPERATIONS HUB HEADER BAR */}
      <header className="fixed top-0 inset-x-0 h-14 bg-surface/90 border-b border-border backdrop-blur-md z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-extrabold text-text-1 tracking-widest text-sm uppercase font-display flex items-center gap-2">
            SRI GURU <span className="text-primary font-mono text-[10px] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">OPS CONSOLE v4.2</span>
          </span>
        </div>

        {/* Console Health Signals */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[10px] text-text-3 font-mono border-r border-border pr-6">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-success" /> PG_BOUNCER: ACTIVE</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-primary" /> ping: 14ms</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button 
              onClick={() => setNotifActive(false)}
              className="relative p-2 bg-void/50 hover:bg-white/[0.04] border border-border rounded-lg text-text-2 hover:text-text-1 transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              {notifActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-ping" />
              )}
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 bg-void/60 border border-border px-3 py-1 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center font-extrabold text-primary font-display text-[10px]">
                OP
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-text-1 leading-none">Admin. Singh</span>
                <span className="text-[8px] font-mono text-text-3 mt-1 leading-none uppercase">Chief Director</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* THREE-COLUMN CYBERNETIC WORKSPACE INTERFACE */}
      <main className="pt-14 min-h-screen flex relative z-10">
        
        {/* COLUMN 1: LEFT NAV TREE SECTION (20%) */}
        <aside className="w-[20%] border-r border-border bg-surface/30 fixed top-14 bottom-0 left-0 overflow-y-auto scrollbar-none p-4 hidden lg:flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-text-3 px-2">Navigation Node Map</span>
            <div className="h-px bg-border my-2" />
          </div>

          {NAV_ITEMS.map((cat) => {
            const isExpanded = expandedCats[cat.id]
            const isActive = activeSection === cat.id

            return (
              <div key={cat.id} className="flex flex-col gap-1.5">
                {/* Category selector row */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/5 text-primary border-l-2 border-l-primary font-bold' 
                      : 'text-text-2 hover:text-text-1 hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="tracking-wide uppercase text-[10px]">{cat.id}</span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {/* Sub items expansion stack */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0, transformOrigin: 'top' }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col pl-4 border-l border-border/50 ml-3 gap-1"
                    >
                      {cat.items.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          className="w-full text-left py-1.5 text-[9px] text-text-3 hover:text-text-2 transition-all duration-200 flex items-center gap-1.5"
                        >
                          <div className="w-1 h-1 rounded-full bg-border" />
                          <span>{sub}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {/* Footer branding details */}
          <div className="mt-auto pt-6 border-t border-border/40 text-[8px] text-text-3 flex flex-col gap-1">
            <span>NEON CLOUD METRICS ACTIVE</span>
            <span>SYSTEM AUDIT: 100% HEALTH</span>
          </div>
        </aside>

        {/* COLUMN 2: CENTER OPERATIONS SCREEN (55%) */}
        <section className="w-full lg:w-[55%] lg:ml-[20%] border-r border-border bg-void/50 p-6 min-h-full pb-20">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Clock className="w-8 h-8 text-primary animate-spin" />
              <span className="text-[10px] text-text-3 font-mono">POOLING DYNAMIC DATABASE TELEMETRIES...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* SYSTEM HEALTH STRIP */}
              <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-3 block">JetBrains Mono Health Registers</span>
                <div className="grid grid-cols-3 divide-x divide-border font-mono">
                  
                  <div className="flex flex-col px-3 text-left">
                    <span className="text-[9px] text-text-3 uppercase">Active Students</span>
                    <span className="text-xl font-bold text-text-1 mt-1 font-mono tracking-tighter">
                      {telemetry?.health.activeStudents.toString().padStart(4, '0')}
                    </span>
                  </div>

                  <div className="flex flex-col px-4 text-left">
                    <span className="text-[9px] text-text-3 uppercase">Sessions Today</span>
                    <span className="text-xl font-bold text-primary mt-1 font-mono tracking-tighter">
                      {telemetry?.health.sessionsToday.toString().padStart(4, '0')}
                    </span>
                  </div>

                  <div className="flex flex-col px-4 text-left">
                    <span className="text-[9px] text-text-3 uppercase">Pending Bookings</span>
                    <span className="text-xl font-bold text-accent mt-1 font-mono tracking-tighter">
                      {telemetry?.health.pendingBookings.toString().padStart(4, '0')}
                    </span>
                  </div>

                </div>
              </div>

              {/* ASYMMETRIC 2x3 DENSE DATA OPERATIONS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* 1. ENROLLMENT TREND SPARKLINE */}
                <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between h-[190px]">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-2 pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Active Load Curve</span>
                    <span className="text-accent font-mono text-[9px]">+24%</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center mt-2">
                    {renderSparkline()}
                  </div>
                  <span className="text-[8px] text-text-3 mt-1 uppercase text-center">Enrollment telemetries logged over 7-day corridor</span>
                </div>

                {/* 2. TOP PERFORMING CADETS LIST */}
                <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between h-[190px]">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-2 pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-primary" /> Ranked Cadet XP</span>
                    <span className="text-text-3 text-[9px]">PAGINATED</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2.5 mt-3 justify-center">
                    {telemetry?.topStudents.map((stu) => {
                      const maxXP = stu.level * 1000
                      const xpPercent = Math.min((stu.xp / maxXP) * 100, 100)
                      return (
                        <div key={stu.id} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="font-bold text-text-1">{stu.name}</span>
                            <span className="text-text-3">Lvl {stu.level} · {stu.xp} XP</span>
                          </div>
                          {/* Raw progress XP Bar */}
                          <div className="w-full h-1.5 bg-void border border-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${xpPercent}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. INSTRUCTOR UTILIZATION RATING BAR */}
                <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between h-[190px]">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-2 pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> utilization ratios</span>
                    <span className="text-success text-[9px]">ONLINE</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-3.5 mt-3 justify-center">
                    {telemetry?.instructorUtilization.map((ins, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-text-2">{ins.name}</span>
                          <span className="font-mono text-text-1">{ins.hours} hrs ({ins.rate}%)</span>
                        </div>
                        {/* Utilization horizontal indicator rect */}
                        <div className="w-full h-2.5 bg-void border border-border rounded-md flex overflow-hidden">
                          <div 
                            className={`h-full ${ins.rate > 85 ? 'bg-success' : 'bg-primary'}`} 
                            style={{ width: `${ins.rate}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. ATTENDANCE MATRIX HEATMAP */}
                <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between h-[190px]">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-2 pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Matrix Activity Heat</span>
                    <span className="text-[9px] text-text-3 font-mono">7 x 12 GRID</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center mt-2">
                    {renderHeatmap()}
                  </div>
                  <div className="flex justify-between items-center text-[8px] text-text-3 px-1.5">
                    <span>LOW ENTRY</span>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary/20 rounded" />
                      <div className="w-2 h-2 bg-primary/50 rounded" />
                      <div className="w-2 h-2 bg-primary/80 rounded" />
                    </div>
                    <span>MAX CAPACITY</span>
                  </div>
                </div>

                {/* 5. BOOKING PIPELINE KANBAN (3 COLUMNS) */}
                <div className="col-span-1 md:col-span-2 bg-surface border border-border rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-2 pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Admissions Pipeline (Kanban)</span>
                    <span className="text-text-3 text-[9px] uppercase">Dynamic Registry</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Pipeline Column: Pending */}
                    <div className="bg-void/50 border border-border/65 rounded-xl p-3 flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-accent uppercase tracking-wider border-b border-border/40 pb-1">PENDING</span>
                      <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto scrollbar-none">
                        {telemetry?.bookingPipeline.pending.map((b, idx) => (
                          <div key={idx} className="bg-surface border border-border p-2 rounded-lg text-[9px] flex flex-col gap-0.5">
                            <span className="font-bold text-text-1 truncate">{b.name}</span>
                            <span className="text-text-3 font-mono">{b.licenseCategory} · {b.phoneNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pipeline Column: Confirmed */}
                    <div className="bg-void/50 border border-border/65 rounded-xl p-3 flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-primary uppercase tracking-wider border-b border-border/40 pb-1">CONFIRMED</span>
                      <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto scrollbar-none">
                        {telemetry?.bookingPipeline.approved.map((b, idx) => (
                          <div key={idx} className="bg-surface border border-border p-2 rounded-lg text-[9px] flex flex-col gap-0.5">
                            <span className="font-bold text-text-1 truncate">{b.name}</span>
                            <span className="text-text-3 font-mono">{b.licenseCategory} · {b.phoneNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pipeline Column: Archived */}
                    <div className="bg-void/50 border border-border/65 rounded-xl p-3 flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-text-3 uppercase tracking-wider border-b border-border/40 pb-1">ARCHIVED LOG</span>
                      <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto scrollbar-none">
                        {telemetry?.bookingPipeline.completed.map((b, idx) => (
                          <div key={idx} className="bg-surface border border-border p-2 rounded-lg text-[9px] flex flex-col gap-0.5 opacity-60">
                            <span className="font-bold text-text-1 truncate">{b.name}</span>
                            <span className="text-text-3 font-mono">{b.licenseCategory} · {b.phoneNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. RECENT ACTIVITY DENSE SCROLLABLE LOG */}
                <div className="col-span-1 md:col-span-2 bg-surface border border-border rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-2 pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-primary" /> Recent telemetry audit stream</span>
                    <span className="text-[9px] text-text-3 font-mono">PAGINATED CHANNELS</span>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto scrollbar-none font-mono">
                    {telemetry?.recentActivityLog.map((act) => (
                      <div key={act.id} className="flex gap-4 items-center text-[9px] border-b border-border/30 pb-2 hover:bg-white/[0.01] px-1 transition-all duration-150">
                        <span className="text-text-3 font-mono flex-shrink-0">[{act.timestamp}]</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[8px] flex-shrink-0 ${
                          act.type === 'BOOKING_NEW' ? 'bg-accent/15 text-accent border border-accent/20' :
                          act.type === 'QUIZ_PASS' ? 'bg-success/15 text-success border border-success/20' :
                          act.type === 'BADGE_GOLD' ? 'bg-primary/15 text-primary border border-primary/20' :
                          'bg-surface border border-border text-text-3'
                        }`}>
                          {act.type}
                        </span>
                        <p className="text-text-2 font-mono truncate">{act.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Operational Telemetry Pagination Controls */}
                  <div className="flex justify-between items-center pt-2 border-t border-border/40 text-[9px]">
                    <span className="text-text-3">Page {currentPage} of {telemetry?.pagination.totalPages || 1} ({telemetry?.pagination.totalItems} entries)</span>
                    <div className="flex gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="px-3 py-1 bg-void hover:bg-white/[0.03] border border-border disabled:opacity-30 rounded-lg flex items-center gap-1 transition-all duration-200"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                      <button
                        disabled={currentPage === telemetry?.pagination.totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, telemetry?.pagination.totalPages || 1))}
                        className="px-3 py-1 bg-void hover:bg-white/[0.03] border border-border disabled:opacity-30 rounded-lg flex items-center gap-1 transition-all duration-200"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>

        {/* COLUMN 3: RIGHT AUTO-REFRESHING LIVE FEED (25%) */}
        <aside className="w-[25%] border-l border-border bg-surface/30 fixed top-14 bottom-0 right-0 overflow-y-auto scrollbar-none p-4 hidden xl:flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-text-3">Live Feed Telemetry</span>
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            </div>
            <div className="h-px bg-border my-2" />
          </div>

          {/* Staggered Event Feeds List */}
          <div className="flex flex-col gap-4">
            {liveFeed.map((feed) => (
              <motion.div
                key={feed.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-surface border p-3 rounded-2xl flex flex-col gap-1.5 transition-all duration-300 relative overflow-hidden ${
                  feed.pulse ? 'border-primary shadow-[0_0_12px_rgba(37,99,235,0.1)]' : 'border-border'
                }`}
              >
                {/* Event alert indicator beacons */}
                <div className="flex justify-between items-center text-[8px] font-mono text-text-3">
                  <span className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      feed.type === 'BOOKING' ? 'bg-accent' :
                      feed.type === 'BADGE' ? 'bg-primary' :
                      feed.type === 'SESSION' ? 'bg-success' : 'bg-text-3'
                    }`} />
                    {feed.type} MATRIX
                  </span>
                  <span>{feed.relativeTime}</span>
                </div>

                <p className="text-[10px] text-text-2 leading-relaxed font-mono">
                  {feed.message}
                </p>

                {feed.pulse && (
                  <span className="absolute right-2 bottom-2 text-[8px] font-mono font-bold text-primary animate-pulse uppercase">
                    LIVE
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* System status hub logs */}
          <div className="mt-auto pt-6 border-t border-border/40 text-[8px] text-text-3 flex flex-col gap-2 font-mono">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-success" /> NEON PG CLIENT: POOLED</span>
            <span>HUD LAST SYNC: SECURE</span>
          </div>
        </aside>

      </main>
    </div>
  )
}
