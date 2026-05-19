"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  Check, 
  Map, 
  Award, 
  AlertCircle, 
  ChevronUp, 
  Play, 
  Eye, 
  Compass, 
  FileText, 
  Moon, 
  CloudRain, 
  Flag,
  RotateCcw,
  TrendingUp,
  Compass as NavIcon
} from 'lucide-react'
import { useRTOStore } from '@/lib/stores/rto-store'
import { useStudentStore } from '@/lib/stores/student-store'

interface Milestone {
  id: string
  name: string
  phase: number // 1 to 5
  phaseName: string
  description: string
  x: number // SVG X coord
  y: number // SVG Y coord
  icon: any
  details: string
}

// 15 milestones distributed across 5 zones
const MILESTONES: Milestone[] = [
  // Phase 1: Beginner Zone
  { id: '1', name: 'Vehicle Basics', phase: 1, phaseName: 'Beginner Zone', description: 'Cabin check, cockpit setup, seat settings.', x: 180, y: 70, icon: Eye, details: 'Master mirror alignment (3-point visibility check), secondary controls, and standard cockpit safety routines.' },
  { id: '2', name: 'Cockpit Controls', phase: 1, phaseName: 'Beginner Zone', description: 'Clutch friction alignment and brake controls.', x: 100, y: 150, icon: Compass, details: 'Familiarization with friction points, manual gearbox shifters, pedal alignment, and basic acceleration loops.' },
  { id: '3', name: 'Slow Speed Drills', phase: 1, phaseName: 'Beginner Zone', description: 'First gear idle crawl and steering bounds.', x: 80, y: 230, icon: Map, details: 'Learn to crawl at idle speeds under 5 km/h, execute standard U-turns, and maintain lane holding vectors.' },

  // Phase 2: Intermediate Zone
  { id: '4', name: 'Traffic Navigation', phase: 2, phaseName: 'Intermediate Zone', description: 'Moderate traffic merging and safety checks.', x: 140, y: 310, icon: TrendingUp, details: 'Defensive gap evaluations, side road entries, manual gear holding in moderate congestion grids.' },
  { id: '5', name: 'Parallel Parking', phase: 2, phaseName: 'Intermediate Zone', description: 'Step-by-step reverse parking vectors.', x: 260, y: 340, icon: RotateCcw, details: 'Complete 3-step parallel reversals, parking curb alignments, and reverse slot entries.' },
  { id: '6', name: 'Signals & Rules', phase: 2, phaseName: 'Intermediate Zone', description: 'RTO lane markings, signs, and indicators.', x: 320, y: 420, icon: Flag, details: 'Study double white divider lines, box junctions, indicator timing rules, and standard sign protocols.' },

  // Phase 3: Advanced Zone
  { id: '7', name: 'Highway Cruising', phase: 3, phaseName: 'Advanced Zone', description: 'High speed merging and freeway lane changing.', x: 250, y: 500, icon: Compass, details: 'Master joining highways, overtaking large transport vehicles, blind-spot checks at 80 km/h.' },
  { id: '8', name: 'Night Driving', phase: 3, phaseName: 'Advanced Zone', description: 'Low visibility high beam/low beam protocols.', x: 120, y: 550, icon: Moon, details: 'Anti-glare focusing, night junction crawls, safe tailing gaps during dark hours.' },
  { id: '9', name: 'Weather & Rain', phase: 3, phaseName: 'Advanced Zone', description: 'Wet surface traction hold and defogging.', x: 80, y: 630, icon: CloudRain, details: 'Hydroplaning checks, window defogger alignment, hazard light utilization guidelines.' },
  { id: '10', name: 'Emergency Decisions', phase: 3, phaseName: 'Advanced Zone', description: 'Sudden braking maneuvers and engine stalling.', x: 130, y: 710, icon: AlertCircle, details: 'Practice sudden hazard braking under dual control, emergency shoulder pullouts, and post-stall ignition safety.' },

  // Phase 4: RTO Zone
  { id: '11', name: 'Signs Theory', phase: 4, phaseName: 'RTO Zone', description: 'Mandatory, cautionary, and informatory signs.', x: 280, y: 750, icon: FileText, details: 'Interactive RTO prep sign cards, speed restriction tags, and mock layout exams.' },
  { id: '12', name: 'Mock Examination', phase: 4, phaseName: 'RTO Zone', description: 'Complete timed dashboard theoretical mock tests.', x: 320, y: 830, icon: Award, details: 'Verify timed questions under 10 minutes with strict 60% standard pass metric thresholds.' },
  { id: '13', name: 'Documentation Prep', phase: 4, phaseName: 'RTO Zone', description: 'Learner permit registry and medical certificates.', x: 260, y: 910, icon: FileText, details: 'Clear the administrative checklist of application forms, photo files, and learner validation IDs.' },

  // Phase 5: Mastery Zone
  { id: '14', name: 'Confidence Check', phase: 5, phaseName: 'Mastery Zone', description: 'Complete 30-minute uninterrupted route test.', x: 110, y: 970, icon: Compass, details: 'Verify advanced maneuvers with your coach, showing clutch hold mastery and parallel parking precision.' },
  { id: '15', name: 'Independent Drive', phase: 5, phaseName: 'Mastery Zone', description: 'Navigate to target point without instruction.', x: 200, y: 1070, icon: Flag, details: 'The ultimate final checkout. Safely pilot LMV manually across a pre-planned route without instructions.' }
]

export default function StudentLearningRoadmap() {
  const { weakTopics, practiceProgress } = useRTOStore()
  const { profile, roadmapProgress } = useStudentStore()

  // Manage node progress states (Normally resolved via Zustand lessons completion, mock here for clean visual mapping)
  // Milestone 1, 2, 3: Completed
  // Milestone 4: In Progress
  // Milestone 5+: Available or Locked
  const [completedIds, setCompletedIds] = useState<string[]>(['1', '2', '3'])
  const [inProgressId, setInProgressId] = useState<string>('4')
  
  // Selected milestone details modal/panel state
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  // Top overall stats calculation
  const totalMilestones = MILESTONES.length
  const completedCount = completedIds.length
  const estimatedCompletion = "3 Weeks remaining (based on 3 sessions/week)"

  // Unlock validation details
  const phase1Nodes = MILESTONES.filter(m => m.phase === 1)
  const completedPhase1Count = phase1Nodes.filter(n => completedIds.includes(n.id)).length
  const phase1ProgressPct = (completedPhase1Count / phase1Nodes.length) * 100
  const phase2Unlocked = phase1ProgressPct >= 80 // True because 3 out of 3 = 100%

  // Identify current phase zone matching highest available/completed node
  const activeMilestone = MILESTONES.find(m => m.id === inProgressId) || MILESTONES[0]
  const currentPhaseZone = activeMilestone.phaseName

  const getNodeState = (m: Milestone) => {
    if (completedIds.includes(m.id)) return 'completed'
    if (inProgressId === m.id) return 'inprogress'
    
    // Unlock boundaries check
    if (m.phase === 2 && !phase2Unlocked) return 'locked'
    // Phase 3, 4, 5 lock conditions
    if (m.phase > 2 && completedIds.length < 6) return 'locked'

    return 'available'
  }

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

  // Weak areas calculation: if practiceProgress < 70% or active weakTopics present
  const showWeakAreas = practiceProgress < 70 || Object.keys(weakTopics).length > 0

  return (
    <div className="min-h-screen bg-void text-text-1 font-body relative pb-24 pt-24">
      
      {/* Background neon glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Roster Container */}
      <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6 relative">
        
        {/* Hub Header */}
        <header className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary">LEARNING VECTORS</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5 uppercase">
              Curriculum Roadmap
            </h1>
            <p className="text-xs text-text-2 mt-1">
              Visual coordinates path representing your physical and theoretical progress loops.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-mono bg-white/[0.03] border border-border px-3.5 py-1.5 rounded-full text-accent font-bold uppercase">
              CURRENT ZONE: {currentPhaseZone}
            </span>
          </div>
        </header>

        {/* Overall progress box */}
        <div className="bg-surface border border-border p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="text-left">
            <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider block">CADET RESOLUTION</span>
            <h4 className="text-sm font-bold text-text-1 uppercase font-display mt-1">Overall Curriculum Milestone Completion</h4>
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
                  style={{ width: `${(completedCount / totalMilestones) * 100}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-text-3 mt-1 block text-right">Progress ratio masteries</span>
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
              {/* Completed sections (fully rendered white) */}
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
            {MILESTONES.map((m) => {
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
                
                // Spinner outer border layout
                extraComponent = (
                  <span className="absolute inset-[-4px] rounded-full border border-dashed border-accent animate-spin" />
                )
              } else if (state === 'available') {
                borderStyle = 'bg-surface border-primary text-primary shadow-lg shadow-primary/15 animate-pulse border-2'
                isClickable = true
                clickHandler = () => setSelectedMilestone(m)
              } else if (state === 'locked') {
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
                  title={`${m.name} (${state.toUpperCase()})`}
                >
                  {extraComponent}
                  {state === 'completed' ? (
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
                <h4 className="text-sm font-bold text-text-1 uppercase font-display leading-tight">Coaching Focus Board</h4>
                <p className="text-[9px] font-mono text-text-3 uppercase mt-0.5">Critical weak metrics spotted inside RTO signs mockup runs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(weakTopics).length === 0 ? (
                // Fallback weak topics in case the initial seed wasn't failed yet
                <div className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-1 font-mono">Warning Signs Mastery</span>
                    <span className="text-[9px] text-text-3 font-mono mt-1">Accuracy scored 56% during timed mockup runs</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/rto'}
                    className="px-3.5 py-1.5 bg-accent hover:bg-accent/90 text-void font-bold text-[9px] font-mono rounded-lg transition-all duration-200"
                  >
                    Practice Now
                  </button>
                </div>
              ) : (
                Object.entries(weakTopics).map(([topic, count]) => (
                  <div key={topic} className="bg-surface border border-border p-4 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-1 font-mono uppercase">{topic} Module</span>
                      <span className="text-[9px] text-text-3 font-mono mt-1">Failed {count} times inside mock practice sheets</span>
                    </div>
                    <button
                      onClick={() => window.location.href = '/rto'}
                      className="px-3.5 py-1.5 bg-accent hover:bg-accent/90 text-void font-bold text-[9px] font-mono rounded-lg transition-all duration-200"
                    >
                      Practice Now
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
          <div className="fixed inset-0 bg-void/80 z-50 flex items-end justify-center px-4 pb-4">
            
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
                    {selectedMilestone.phaseName} · MILESTONE {selectedMilestone.id}
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
                <span className="text-[9px] text-text-3 uppercase tracking-wider block">OBSERVATION CHECKLIST:</span>
                <p className="text-text-2 mt-1 leading-relaxed">
                  ✓ Adjust rear view mirror vectors<br />
                  ✓ Lock seatbelt harness anchors<br />
                  ✓ Validate ignition starter switches
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="flex-1 py-3 bg-void hover:bg-white/[0.02] border border-border text-text-2 font-bold text-xs rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => window.location.href = '/learn'}
                  className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-primary/10 transition-all duration-200"
                >
                  <Play className="w-3.5 h-3.5" />
                  Continue Course
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
