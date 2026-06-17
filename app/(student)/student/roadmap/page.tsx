"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  Map, 
  Award, 
  AlertCircle, 
  Play, 
  Eye, 
  Compass, 
  FileText, 
  Moon, 
  CloudRain, 
  Flag,
  RotateCcw,
  TrendingUp,
  Zap,
  Key,
  AlignLeft,
  Route
} from 'lucide-react'
import { useRTOStore } from '@/lib/stores/rto-store'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    learningVectors: 'Learning Vectors',
    curriculumRoadmap: 'Curriculum Roadmap',
    visualCoordinates: 'A visual coordinate path representing your physical and theoretical progress loops.',
    currentZone: 'CURRENT ZONE:',
    studentResolution: 'Student RESOLUTION',
    overallCompletion: 'Overall Curriculum Milestone Completion',
    estimatedCompletion: 'Progress updates weekly',
    progressRatio: 'Progress ratio masteries',
    coachingFocus: 'Coaching Focus Board',
    criticalWeakMetrics: 'Critical weak metrics found inside RTO sign practice runs',
    warningSignsMastery: 'Warning Signs Mastery',
    accuracyScored: '56% accuracy scored during timed practice runs',
    practiceNow: 'Practice Now',
    moduleSuffix: 'Module',
    failedTimesPre: 'Failed',
    failedTimesPost: 'times inside practice sheets',
    milestone: 'MILESTONE',
    observationChecklist: 'Observation Checklist:',
    check1: '✓ Adjust rear view mirror vectors',
    check2: '✓ Lock seatbelt harness anchor',
    check3: '✓ Validate ignition starter switch',
    cancel: 'Cancel',
    continueCourse: 'Continue Course',
    weeklyReset: 'Progress resets weekly every Monday',
    noNodesYet: 'No syllabus days configured yet.',
  },
  HI: {
    learningVectors: 'सीखने के वेक्टर',
    curriculumRoadmap: 'पाठ्यक्रम रोडमैप',
    visualCoordinates: 'आपके शारीरिक और सैद्धांतिक प्रगति लूप का प्रतिनिधित्व करने वाला दृश्य समन्वय पथ।',
    currentZone: 'वर्तमान क्षेत्र:',
    studentResolution: 'छात्र संकल्प',
    overallCompletion: 'समग्र पाठ्यक्रम मील का पत्थर पूरा होना',
    estimatedCompletion: 'प्रगति साप्ताहिक रूप से अपडेट होती है',
    progressRatio: 'प्रगति अनुपात महारत',
    coachingFocus: 'कोचिंग फोकस बोर्ड',
    criticalWeakMetrics: 'RTO संकेत अभ्यास रन के अंदर महत्वपूर्ण कमजोर मेट्रिक्स मिले',
    warningSignsMastery: 'चेतावनी संकेत महारत',
    accuracyScored: 'समयबद्ध अभ्यास रन के दौरान 56% सटीकता प्राप्त की',
    practiceNow: 'अभी अभ्यास करें',
    moduleSuffix: 'मॉड्यूल',
    failedTimesPre: '',
    failedTimesPost: 'बार अभ्यास शीट के अंदर विफल रहे',
    milestone: 'मील का पत्थर',
    observationChecklist: 'अवलोकन चेकलिस्ट:',
    check1: '✓ रियर व्यू मिरर वैक्टर समायोजित करें',
    check2: '✓ सीटबेल्ट हार्नेस एंकर लॉक करें',
    check3: '✓ इग्निशन स्टार्टर स्विच मान्य करें',
    cancel: 'रद्द करें',
    continueCourse: 'कोर्स जारी रखें',
    weeklyReset: 'प्रगति हर सोमवार साप्ताहिक रूप से रीसेट होती है',
    noNodesYet: 'अभी तक कोई पाठ्यक्रम दिन कॉन्फ़िगर नहीं किया गया।',
  },
  TE: {
    learningVectors: 'లెర్నింగ్ వెక్టార్స్',
    curriculumRoadmap: 'కరికులం రోడ్‌మ్యాప్',
    visualCoordinates: 'మీ శారీరక మరియు సైద్ధాంతిక పురోగతి లూప్‌లను సూచించే దృశ్య సమన్వయ మార్గం.',
    currentZone: 'ప్రస్తుత జోన్:',
    studentResolution: 'విద్యార్థి తీర్మానం',
    overallCompletion: 'మొత్తం కరికులం మైలురాయి పూర్తి',
    estimatedCompletion: 'ప్రోగ్రెస్ ప్రతి సోమవారం రీసెట్ అవుతుంది',
    progressRatio: 'ప్రోగ్రెస్ రేషియో మాస్టరీస్',
    coachingFocus: 'కోచింగ్ ఫోకస్ బోర్డ్',
    criticalWeakMetrics: 'RTO సంకేతాల ప్రాక్టీస్ రన్‌లలో క్లిష్టమైన బలహీన కొలమానాలు కనుగొనబడ్డాయి',
    warningSignsMastery: 'హెచ్చరిక సంకేతాల మాస్టరీ',
    accuracyScored: 'సమయబద్ధమైన ప్రాక్టీస్ రన్‌లలో 56% ఖచ్చితత్వం సాధించబడింది',
    practiceNow: 'ఇప్పుడే ప్రాక్టీస్ చేయండి',
    moduleSuffix: 'మాడ్యూల్',
    failedTimesPre: 'ప్రాక్టీస్ షీట్‌లలో',
    failedTimesPost: 'సార్లు విఫలమయ్యారు',
    milestone: 'మైలురాయి',
    observationChecklist: 'పరిశీలన చెక్‌లిస్ట్:',
    check1: '✓ రియర్ వ్యూ మిర్రర్ వెక్టార్‌లను సర్దుబాటు చేయండి',
    check2: '✓ సీట్‌బెల్ట్ హార్నెస్ యాంకర్‌లను లాక్ చేయండి',
    check3: '✓ ఇగ్నిషన్ స్టార్టర్ స్విచ్‌లను ధృవీకరించండి',
    cancel: 'రద్దు చేయండి',
    continueCourse: 'కోర్సును కొనసాగించండి',
    weeklyReset: 'ప్రోగ్రెస్ ప్రతి సోమవారం రీసెట్ అవుతుంది',
    noNodesYet: 'ఇంకా సిలబస్ రోజులు కాన్ఫిగర్ చేయబడలేదు.',
  }
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Key, CircleDashed: Eye, Zap, RotateCw: RotateCcw, ParkingSquare: RotateCcw,
  AlignLeft, GitMerge: Compass, Route, Moon, AlertTriangle: AlertCircle,
  FileText, Award, Compass, TrendingUp, CloudRain, Flag
}

const PHASE_MAP: Record<string, { id: number, name: string }> = {
  BEGINNER: { id: 1, name: 'Beginner Zone' },
  INTERMEDIATE: { id: 2, name: 'Intermediate Zone' },
  ADVANCED: { id: 3, name: 'Advanced Zone' },
  RTO: { id: 4, name: 'RTO Zone' },
  MASTERY: { id: 5, name: 'Mastery Zone' }
}

interface Milestone {
  id: string
  name: string
  phase: number
  phaseName: string
  description: string
  x: number
  y: number
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  orderIndex: number
}

// Generate dynamic winding road coordinates for any number of days
function getDynamicCoords(orderIndex: number): { x: number; y: number } {
  // Create a serpentine/winding pattern
  const row = Math.floor((orderIndex - 1) / 4)
  const col = (orderIndex - 1) % 4
  
  // Alternate direction per row (serpentine)
  const xPositions = row % 2 === 0 
    ? [60, 160, 260, 340]
    : [340, 260, 160, 60]
  
  const x = xPositions[col] || 200
  const y = 80 + row * 130 + (col % 2 === 1 ? 30 : 0)
  
  return { x, y }
}

// Build SVG path string dynamically from milestone coordinates
function buildSvgPath(milestones: Milestone[]): string {
  if (milestones.length === 0) return ''
  const pts = milestones.map(m => ({ x: m.x, y: m.y }))
  
  // Start above the first point
  let d = `M ${pts[0].x},${Math.max(0, pts[0].y - 60)}`
  
  for (let i = 0; i < pts.length; i++) {
    if (i === 0) {
      d += ` L ${pts[0].x},${pts[0].y}`
    } else {
      const prev = pts[i - 1]
      const curr = pts[i]
      const cx1 = prev.x
      const cy1 = (prev.y + curr.y) / 2
      const cx2 = curr.x
      const cy2 = (prev.y + curr.y) / 2
      d += ` C ${cx1},${cy1} ${cx2},${cy2} ${curr.x},${curr.y}`
    }
  }
  
  // Extend below last point
  const last = pts[pts.length - 1]
  d += ` L ${last.x},${last.y + 80}`
  
  return d
}

export default function StudentLearningRoadmap() {
  const { weakTopics, practiceProgress } = useRTOStore()
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  React.useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await fetch('/api/student/roadmap')
        if (res.ok) {
          const nodes = await res.json()
          const mapped: Milestone[] = nodes.map((n: any) => {
            const coords = getDynamicCoords(n.orderIndex)
            return {
              id: n.id,
              name: n.title,
              phase: PHASE_MAP[n.phase]?.id || 1,
              phaseName: PHASE_MAP[n.phase]?.name || n.phase,
              description: n.description,
              x: coords.x,
              y: coords.y,
              icon: ICON_MAP[n.icon] || Award,
              completed: n.completed || false,
              orderIndex: n.orderIndex
            }
          })
          setMilestones(mapped)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoadmap()
  }, [])

  // Calculate canvas height dynamically
  const maxY = milestones.reduce((max, m) => Math.max(max, m.y), 0)
  const canvasHeight = Math.max(600, maxY + 160)
  const svgPath = buildSvgPath(milestones)

  // Progress stats
  const completedCount = milestones.filter(m => m.completed).length
  const totalMilestones = milestones.length

  // Find in-progress (first incomplete)
  const inProgressMilestone = milestones.find(m => !m.completed)
  const currentPhaseZone = inProgressMilestone?.phaseName || milestones[milestones.length - 1]?.phaseName || 'BEGINNER'

  const getNodeState = (m: Milestone) => {
    if (m.completed) return 'completed'
    if (inProgressMilestone?.id === m.id) return 'inprogress'
    // Lock if previous incomplete
    const prev = milestones.find(mp => mp.orderIndex === m.orderIndex - 1)
    if (prev && !prev.completed && prev.id !== inProgressMilestone?.id) return 'locked'
    return 'available'
  }

  const showWeakAreas = practiceProgress < 70 || Object.keys(weakTopics).length > 0

  return (
    <div className="min-h-screen bg-void text-text-1 font-body relative pb-24 pt-24">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6 relative">

        {/* Header */}
        <header className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary">{t.learningVectors}</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5 uppercase">
              {t.curriculumRoadmap}
            </h1>
            <p className="text-xs text-text-2 mt-1">{t.visualCoordinates}</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-mono bg-white/[0.03] border border-border px-3.5 py-1.5 rounded-full text-accent font-bold uppercase">
              {t.currentZone} {currentPhaseZone}
            </span>
          </div>
        </header>

        {/* Progress box */}
        <div className="bg-surface border border-border p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="text-left">
            <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider block">{t.studentResolution}</span>
            <h4 className="text-sm font-bold text-text-1 uppercase font-display mt-1">{t.overallCompletion}</h4>
            <p className="text-xs text-text-2 font-mono mt-0.5">{t.estimatedCompletion}</p>
            <p className="text-[10px] text-primary/70 font-mono mt-1">↺ {t.weeklyReset}</p>
          </div>
          <div className="flex items-center gap-4 bg-void/60 border border-border p-3.5 rounded-2xl">
            <div className="text-left">
              <span className="text-[32px] font-extrabold text-primary font-mono leading-none">{completedCount}</span>
              <span className="text-xs text-text-3 font-mono"> / {totalMilestones}</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-void h-2 rounded-full overflow-hidden border border-border/80">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out"
                  style={{ width: totalMilestones > 0 ? `${(completedCount / totalMilestones) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-[9px] font-mono text-text-3 mt-1 block text-right">{t.progressRatio}</span>
            </div>
          </div>
        </div>

        {/* Winding Road SVG Canvas */}
        {loading ? (
          <div className="bg-surface/50 border border-border rounded-3xl py-24 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin" />
          </div>
        ) : milestones.length === 0 ? (
          <div className="bg-surface/50 border border-border rounded-3xl py-24 flex items-center justify-center text-text-3 font-mono text-sm">
            {t.noNodesYet}
          </div>
        ) : (
          <div className="bg-surface/50 border border-border rounded-3xl py-12 px-6 flex justify-center relative shadow-xl overflow-hidden">
            <div className="relative w-full max-w-[400px]" style={{ height: `${canvasHeight}px` }}>

              {/* SVG winding road */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
                viewBox={`0 0 400 ${canvasHeight}`}
                fill="none"
              >
                {/* Road border */}
                <path d={svgPath} stroke="rgba(255,255,255,0.03)" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
                {/* Road asphalt */}
                <path d={svgPath} stroke="#0D1117" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" />
                {/* Completed progress segment */}
                {completedCount > 0 && milestones.length > 0 && (
                  <path d={svgPath} stroke="rgba(var(--color-primary),0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDashoffset="0"
                    style={{ opacity: 0.7 }}
                  />
                )}
                {/* Dashed center line */}
                <path d={svgPath} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6, 12" />
              </svg>

              {/* Milestone nodes */}
              {milestones.map((m) => {
                const state = getNodeState(m)
                const Icon = m.icon

                let borderStyle = 'bg-surface border-border text-text-3'
                let clickHandler = () => {}
                let isClickable = false
                let extraComponent: React.ReactNode = null

                if (state === 'completed') {
                  borderStyle = 'bg-success border-success text-white shadow-lg shadow-success/15'
                  isClickable = true
                  clickHandler = () => setSelectedMilestone(m)
                } else if (state === 'inprogress') {
                  borderStyle = 'bg-surface border-accent text-accent shadow-lg shadow-accent/15 border-2'
                  isClickable = true
                  clickHandler = () => setSelectedMilestone(m)
                  extraComponent = (
                    <span className="absolute inset-[-4px] rounded-full border border-dashed border-accent animate-spin" />
                  )
                } else if (state === 'available') {
                  borderStyle = 'bg-surface border-primary text-primary shadow-lg shadow-primary/15 border-2'
                  isClickable = true
                  clickHandler = () => setSelectedMilestone(m)
                } else {
                  borderStyle = 'bg-void/80 border-border text-text-3 opacity-60'
                  extraComponent = (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-void border border-border rounded-full flex items-center justify-center text-text-3">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )
                }

                return (
                  <div
                    key={m.id}
                    onClick={clickHandler}
                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 border ${borderStyle} ${
                      isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                    }`}
                    style={{ left: `${m.x - 24}px`, top: `${m.y - 24}px` }}
                    title={`Day ${m.orderIndex}: ${m.name} (${state.toUpperCase()})`}
                  >
                    {extraComponent}
                    {state === 'completed' ? (
                      <Check className="w-5 h-5 font-bold" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span className="absolute top-13 left-1/2 -translate-x-1/2 w-28 text-center text-[8.5px] font-mono font-bold tracking-tight text-text-2 uppercase bg-void/80 border border-border/40 py-0.5 px-1.5 rounded select-none pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis">
                      D{m.orderIndex} {m.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Weak area coaching board */}
        {showWeakAreas && (
          <div className="bg-void/50 border border-border p-6 rounded-[32px] text-left flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <AlertCircle className="w-5 h-5 text-accent animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-text-1 uppercase font-display leading-tight">{t.coachingFocus}</h4>
                <p className="text-[9px] font-mono text-text-3 uppercase mt-0.5">{t.criticalWeakMetrics}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(weakTopics).length === 0 ? (
                <div className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-1 font-mono">{t.warningSignsMastery}</span>
                    <span className="text-[9px] text-text-3 font-mono mt-1">{t.accuracyScored}</span>
                  </div>
                  <button onClick={() => window.location.href = '/rto'} className="px-3.5 py-1.5 bg-accent hover:bg-accent/90 text-void font-bold text-[9px] font-mono rounded-lg transition-all duration-200">
                    {t.practiceNow}
                  </button>
                </div>
              ) : (
                Object.entries(weakTopics).map(([topic, count]) => (
                  <div key={topic} className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-1 font-mono uppercase">{topic} {t.moduleSuffix}</span>
                      <span className="text-[9px] text-text-3 font-mono mt-1">{t.failedTimesPre} {count} {t.failedTimesPost}</span>
                    </div>
                    <button onClick={() => window.location.href = '/rto'} className="px-3.5 py-1.5 bg-accent hover:bg-accent/90 text-void font-bold text-[9px] font-mono rounded-lg transition-all duration-200">
                      {t.practiceNow}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Milestone Detail Slide-up Panel */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 bg-void/80 z-50 flex items-end justify-center px-4 pb-4">
            <div className="absolute inset-0" onClick={() => setSelectedMilestone(null)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-surface border border-border rounded-t-3xl max-w-lg w-full p-6 relative z-10 shadow-2xl text-left"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-wider">
                    {selectedMilestone.phaseName} · {t.milestone} · Day {selectedMilestone.orderIndex}
                  </span>
                  <h3 className="text-xl font-extrabold text-text-1 font-display mt-0.5 uppercase">
                    {selectedMilestone.name}
                  </h3>
                </div>
                <button onClick={() => setSelectedMilestone(null)} className="p-1 hover:bg-white/[0.04] rounded-lg text-text-3">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-text-2 leading-relaxed mt-3 font-body">
                {selectedMilestone.description}
              </p>

              <div className="bg-void/60 border border-border p-4 rounded-xl my-4 text-xs font-mono">
                <span className="text-[9px] text-text-3 uppercase tracking-wider block">{t.observationChecklist}</span>
                <p className="text-text-2 mt-1 leading-relaxed">
                  {t.check1}<br />{t.check2}<br />{t.check3}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedMilestone(null)} className="flex-1 py-3 bg-void hover:bg-white/[0.02] border border-border text-text-2 font-bold text-xs rounded-xl transition-all duration-200">
                  {t.cancel}
                </button>
                <button onClick={() => window.location.href = '/learn'} className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-primary/10 transition-all duration-200">
                  <Play className="w-3.5 h-3.5" />
                  {t.continueCourse}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function X({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <svg className={className} onClick={onClick} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
