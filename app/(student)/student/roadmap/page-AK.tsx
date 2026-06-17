"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
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
  TrendingUp
} from 'lucide-react'
import { useRTOStore } from '@/lib/stores/rto-store'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    learningVectors: 'Learning Path',
    curriculumRoadmap: 'Course Roadmap',
    visualCoordinates: 'Follow this path to track your driving progress.',
    currentZone: 'CURRENT PHASE:',
    studentResolution: 'Your Progress',
    overallCompletion: 'Overall Course Completion',
    estimatedCompletion: 'Estimated 3 Weeks remaining',
    progressRatio: 'Modules Completed',
    coachingFocus: 'Areas for Improvement',
    criticalWeakMetrics: 'Topics you should review',
    allCaughtUp: 'You are all caught up!',
    practiceNow: 'Practice Now',
    moduleSuffix: 'Module',
    failedTimesPre: 'Failed',
    failedTimesPost: 'times in practice',
    milestone: 'LESSON',
    observationChecklist: 'Checklist:',
    check1: '✓ Check mirrors',
    check2: '✓ Wear seatbelt',
    check3: '✓ Start engine',
    cancel: 'Close',
    continueCourse: 'Continue Learning',
  },
  HI: {
    learningVectors: 'सीखने का मार्ग',
    curriculumRoadmap: 'कोर्स रोडमैप',
    visualCoordinates: 'अपनी ड्राइविंग प्रगति को ट्रैक करने के लिए इस मार्ग का अनुसरण करें।',
    currentZone: 'वर्तमान चरण:',
    studentResolution: 'आपकी प्रगति',
    overallCompletion: 'समग्र कोर्स पूरा होना',
    estimatedCompletion: 'अनुमानित 3 सप्ताह शेष',
    progressRatio: 'मॉड्यूल पूर्ण',
    coachingFocus: 'सुधार के क्षेत्र',
    criticalWeakMetrics: 'जिन विषयों की आपको समीक्षा करनी चाहिए',
    allCaughtUp: 'आपने सब कुछ पूरा कर लिया है!',
    practiceNow: 'अभी अभ्यास करें',
    moduleSuffix: 'मॉड्यूल',
    failedTimesPre: 'अभ्यास में',
    failedTimesPost: 'बार विफल रहे',
    milestone: 'पाठ',
    observationChecklist: 'चेकलिस्ट:',
    check1: '✓ दर्पण जांचें',
    check2: '✓ सीटबेल्ट पहनें',
    check3: '✓ इंजन शुरू करें',
    cancel: 'बंद करें',
    continueCourse: 'सीखना जारी रखें',
  },
  TE: {
    learningVectors: 'నేర్చుకునే మార్గం',
    curriculumRoadmap: 'కోర్సు రోడ్‌మ్యాప్',
    visualCoordinates: 'మీ డ్రైవింగ్ పురోగతిని ట్రాక్ చేయడానికి ఈ మార్గాన్ని అనుసరించండి.',
    currentZone: 'ప్రస్తుత దశ:',
    studentResolution: 'మీ పురోగతి',
    overallCompletion: 'మొత్తం కోర్సు పూర్తి',
    estimatedCompletion: 'సుమారు 3 వారాలు మిగిలి ఉన్నాయి',
    progressRatio: 'పూర్తయిన మాడ్యూల్స్',
    coachingFocus: 'మెరుగుపరచవలసిన ప్రాంతాలు',
    criticalWeakMetrics: 'మీరు సమీక్షించాల్సిన విషయాలు',
    allCaughtUp: 'మీరు అన్నీ పూర్తి చేసారు!',
    practiceNow: 'ఇప్పుడే ప్రాక్టీస్ చేయండి',
    moduleSuffix: 'మాడ్యూల్',
    failedTimesPre: 'ప్రాక్టీస్‌లో',
    failedTimesPost: 'సార్లు విఫలమయ్యారు',
    milestone: 'పాఠం',
    observationChecklist: 'చెక్‌లిస్ట్:',
    check1: '✓ అద్దాలను తనిఖీ చేయండి',
    check2: '✓ సీట్‌బెల్ట్ ధరించండి',
    check3: '✓ ఇంజిన్ ప్రారంభించండి',
    cancel: 'మూసివేయండి',
    continueCourse: 'నేర్చుకోవడం కొనసాగించండి',
  }
}


interface Milestone {
  id: string
  name: string
  phase: number // 1 to 5
  phaseName: string
  description: string
  x: number // SVG X coord
  y: number // SVG Y coord
  icon: React.ComponentType<{ className?: string }>
  details: string
}

// Visual layout coordinates for the winding road based on orderIndex
const VISUAL_COORDS: Record<number, { x: number; y: number; details: string }> = {
  1: { x: 180, y: 70, details: 'Learn to adjust your mirrors, use the pedals, and perform basic safety checks before driving.' },
  2: { x: 100, y: 150, details: 'Get comfortable with the clutch, shifting gears, and smoothly accelerating.' },
  3: { x: 80, y: 230, details: 'Practice driving at slow speeds, making U-turns, and staying in your lane.' },
  4: { x: 140, y: 310, details: 'Learn to judge gaps in traffic, enter side roads, and drive in moderate traffic.' },
  5: { x: 260, y: 340, details: 'Master parallel parking, reversing into bays, and parking near curbs.' },
  6: { x: 320, y: 420, details: 'Understand road markings, junctions, using indicators, and following road signs.' },
  7: { x: 250, y: 500, details: 'Practice merging onto highways, overtaking safely, and checking blind spots.' },
  8: { x: 120, y: 550, details: 'Learn how to drive safely at night, handle headlight glare, and keep safe distances.' },
  9: { x: 80, y: 630, details: 'Understand how to drive in the rain, prevent skidding, and use hazard lights.' },
  10: { x: 130, y: 710, details: 'Practice emergency braking, pulling over safely, and what to do if the engine stalls.' },
  11: { x: 280, y: 750, details: 'Prepare for the RTO exam by learning road signs and speed limits.' },
  12: { x: 320, y: 830, details: 'Take practice tests to ensure you are ready to pass the official RTO written exam.' },
}

const ICON_MAP: Record<string, any> = {
  Key: Eye, CircleDashed: Compass, Zap: Map, RotateCw: TrendingUp, ParkingSquare: RotateCcw, 
  AlignLeft: Flag, GitMerge: Compass, Route: Moon, Moon: CloudRain, AlertTriangle: AlertCircle, 
  FileText: FileText, Award: Award
}

const PHASE_MAP: Record<string, { id: number, name: string }> = {
  BEGINNER: { id: 1, name: 'Beginner Zone' },
  INTERMEDIATE: { id: 2, name: 'Intermediate Zone' },
  ADVANCED: { id: 3, name: 'Advanced Zone' },
  RTO: { id: 4, name: 'RTO Zone' },
  MASTERY: { id: 5, name: 'Mastery Zone' }
}

export default function StudentLearningRoadmap() {
  const { weakTopics, practiceProgress } = useRTOStore()
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN
 
  const [milestones, setMilestones] = useState<Milestone[]>([])

  React.useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await fetch('/api/student/roadmap')
        if (res.ok) {
          const nodes = await res.json()
          const mappedNodes = nodes.map((n: any) => ({
            id: n.id,
            name: n.title,
            phase: PHASE_MAP[n.phase]?.id || 1,
            phaseName: PHASE_MAP[n.phase]?.name || 'Unknown',
            description: n.description,
            x: VISUAL_COORDS[n.orderIndex]?.x || 200,
            y: VISUAL_COORDS[n.orderIndex]?.y || 100,
            icon: ICON_MAP[n.icon] || Award,
            details: VISUAL_COORDS[n.orderIndex]?.details || n.description,
            status: n.status
          }))
          setMilestones(mappedNodes)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchRoadmap()
  }, [practiceProgress])

  // Selected milestone details modal/panel state
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  // Top overall stats calculation
  const totalMilestones = milestones.length
  const completedNodes = milestones.filter(m => m.status === 'COMPLETED')
  const completedCount = completedNodes.length
  const estimatedCompletion = t.estimatedCompletion

  // Identify current phase zone matching highest available/completed node
  const activeMilestone = milestones.find(m => m.status === 'IN_PROGRESS') || milestones[0]
  const currentPhaseZone = activeMilestone?.phaseName || 'BEGINNER'

  // Render SVG points pathway string (winding bezier spline)
  const svgPathString = `
    M 200,0 
    C 200,30 180,50 180,70
    C 180,100 100,120 100,150
    C 100,180 80,200 80,230
    C 80,270 140,280 140,310
    C 140,330 260,320 260,340
    C 260,380 320,380 320,420
    C 320,460 250,460 250,500
    C 250,520 120,520 120,550
    C 120,590 80,590 80,630
    C 80,670 130,670 130,710
    C 130,730 280,720 280,750
    C 280,790 320,790 320,830
    C 320,870 260,870 260,910
    C 260,940 110,940 110,970
    C 110,1020 200,1020 200,1070
    C 200,1110 200,1130 200,1170
  `

  // Weak areas calculation: only show if there are actual weak topics
  const showWeakAreas = Object.keys(weakTopics).length > 0

  return (
    <div className="min-h-screen bg-void text-text-1 font-body relative pb-24 pt-24">
      
      {/* Background neon glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Roster Container */}
      <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6 relative">
        
        {/* Hub Header */}
        <header className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary">{t.learningVectors}</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5 uppercase">
              {t.curriculumRoadmap}
            </h1>
            <p className="text-xs text-text-2 mt-1">
              {t.visualCoordinates}
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-mono bg-white/[0.03] border border-border px-3.5 py-1.5 rounded-full text-accent font-bold uppercase">
              {t.currentZone} {currentPhaseZone}
            </span>
          </div>
        </header>

        {/* Overall progress box */}
        <div className="bg-surface border border-border p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="text-left">
            <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider block">{t.studentResolution}</span>
            <h4 className="text-sm font-bold text-text-1 uppercase font-display mt-1">{t.overallCompletion}</h4>
            <p className="text-xs text-text-2 font-mono mt-0.5">{estimatedCompletion}</p>
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
                  style={{ width: `${totalMilestones > 0 ? (completedCount / totalMilestones) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-text-3 mt-1 block text-right">{t.progressRatio}</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            VISUAL WINDING ROAD MAP (SVG PATHS BASED)
            ---------------------------------------------------- */}
        <div className="bg-surface/50 border border-border rounded-3xl py-12 px-6 flex justify-center relative shadow-xl min-h-[1200px]">
          
          <div className="relative w-full max-w-[400px] h-[1200px]">
            
            {/* SVG winding road canvas */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" 
              viewBox="0 0 400 1200" 
              fill="none"
            >
              {/* Outer dark concrete curb border */}
              <path 
                d={svgPathString} 
                stroke="rgba(255,255,255,0.03)" 
                strokeWidth="48" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              
              {/* Core road path asphalt background */}
              <path 
                d={svgPathString} 
                stroke="#0D1117" 
                strokeWidth="42" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Lane dashed center markings */}
              <path 
                d={svgPathString} 
                stroke="rgba(255,255,255,0.25)" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeDasharray="6, 12"
              />
            </svg>

            {/* Render milestones dynamically onto the coordinates path */}
            {milestones.map((m) => {
              const isCompleted = m.status === 'COMPLETED'
              const isInProgress = m.status === 'IN_PROGRESS'
              const isAvailable = m.status === 'AVAILABLE'
              
              const Icon = m.icon
              
              let borderStyle = 'bg-surface border-border text-text-3'
              let clickHandler: () => void = () => {}
              let isClickable = false
              let extraComponent: React.ReactNode = null

              if (isCompleted) {
                borderStyle = 'bg-success border-success text-white shadow-lg shadow-success/15'
                isClickable = true
                clickHandler = () => setSelectedMilestone(m)
              } else if (isInProgress) {
                borderStyle = 'bg-void border-accent text-accent shadow-lg shadow-accent/20 border-2'
                isClickable = true
                clickHandler = () => setSelectedMilestone(m)
                
                // Spinner outer border layout
                extraComponent = (
                  <span className="absolute inset-[-4px] rounded-full border border-dashed border-accent animate-spin" />
                )
              } else if (isAvailable) {
                borderStyle = 'bg-surface border-primary text-primary shadow-lg shadow-primary/15 animate-pulse border-2'
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
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${borderStyle} ${
                    isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                  }`}
                  style={{
                    left: `${m.x - 24}px`, // center circle on coordinate
                    top: `${m.y - 24}px`
                  }}
                  title={`${m.name} (${m.status.toUpperCase()})`}
                >
                  {extraComponent}
                  {isCompleted ? (
                    <Check className="w-5 h-5 font-bold" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  
                  {/* Miniature labels underneath */}
                  <span className="absolute top-13 left-1/2 -translate-x-1/2 w-28 text-center text-[8.5px] font-mono font-bold tracking-tight text-text-2 uppercase bg-void/80 border border-border/40 py-0.5 px-1.5 rounded select-none pointer-events-none">
                    {m.name}
                  </span>
                </div>
              )
            })}

          </div>

        </div>

        {/* ----------------------------------------------------
            WEAK AREA FOCUS BOARDS SECTION (Scored < 70%)
            ---------------------------------------------------- */}
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
                  <span className="text-xs font-bold text-text-1 font-mono">{t.allCaughtUp}</span>
                </div>
              ) : (
                Object.entries(weakTopics).map(([topic, count]) => (
                  <div key={topic} className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-1 font-mono uppercase">{topic} {t.moduleSuffix}</span>
                      <span className="text-[9px] text-text-3 font-mono mt-1">{t.failedTimesPre} {count} {t.failedTimesPost}</span>
                    </div>
                    <button
                      onClick={() => window.location.href = '/rto'}
                      className="px-3.5 py-1.5 bg-accent hover:bg-accent/90 text-void font-bold text-[9px] font-mono rounded-lg transition-all duration-200"
                    >
                      {t.practiceNow}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ----------------------------------------------------
          SLIDE-UP MILESTONE DETAIL PANEL
          ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 bg-void/80 z-[500] flex items-end justify-center px-4 pb-4">
            
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setSelectedMilestone(null)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-surface border border-border rounded-t-3xl max-w-lg w-full p-6 relative z-10 shadow-2xl text-left"
            >
              {/* Drag handles style */}
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4" />

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-wider">
                    {selectedMilestone.phaseName} · {t.milestone} {selectedMilestone.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-text-1 font-display mt-0.5 uppercase">
                    {selectedMilestone.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedMilestone(null)}
                  className="p-1 hover:bg-white/[0.04] rounded-lg text-text-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-text-2 leading-relaxed mt-3 font-body">
                {selectedMilestone.details}
              </p>

              <div className="bg-void/60 border border-border p-4 rounded-xl my-4 text-xs font-mono">
                <span className="text-[9px] text-text-3 uppercase tracking-wider block">{t.observationChecklist}</span>
                <p className="text-text-2 mt-1 leading-relaxed">
                  {t.check1}<br />
                  {t.check2}<br />
                  {t.check3}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="flex-1 py-3 bg-void hover:bg-white/[0.02] border border-border text-text-2 font-bold text-xs rounded-xl transition-all duration-200"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => window.location.href = '/learn'}
                  className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-primary/10 transition-all duration-200"
                >
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

// Inline Close vector icon helper
function X({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <svg 
      className={className} 
      onClick={onClick} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

