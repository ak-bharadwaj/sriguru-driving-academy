"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  HelpCircle, 
  RefreshCw, 
  Bookmark, 
  Check, 
  X as XIcon, 
  Clock, 
  BookOpen, 
  RotateCcw,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react'

// Import icons
import * as RoadSigns from '@/lib/icons/road-signs'

// Import SignCard component
import { SignCard } from '@/components/student/SignCard'

// Import Zustand stores
import { useXPStore } from '@/lib/stores/xp-store'
import { useRTOStore } from '@/lib/stores/rto-store'

// 1. Signs registry data
const ROAD_SIGNS_DATA = [
  {
    signKey: 'STOP_SIGN' as const,
    name: 'Stop Sign',
    category: 'Signs',
    meaning: 'Mandatory halt. All vehicles must come to a complete stop before the stop line.',
    rule: 'Bring your vehicle to a complete standstill for at least 3 seconds. Check for pedestrian cross-traffic and cross-street vehicles before resuming.'
  },
  {
    signKey: 'YIELD' as const,
    name: 'Yield Ahead',
    category: 'Signs',
    meaning: 'Yield the right-of-way. Prepare to stop if vehicles are approaching from other directions.',
    rule: 'Slow down at the intersection. You do not need to halt completely if the junction is entirely clear, but you must grant priority to merging traffic.'
  },
  {
    signKey: 'SPEED_LIMIT' as const,
    name: 'Speed Limit 50',
    category: 'Signs',
    meaning: 'Maximum permitted vehicle velocity is 50 kilometers per hour.',
    rule: 'Strictly monitor your speedometer. Fines apply immediately at 51 km/h. Reduce speeds further in wet conditions or low visibility zones.'
  },
  {
    signKey: 'NO_ENTRY' as const,
    name: 'No Entry',
    category: 'Signs',
    meaning: 'Entry prohibited. Direct entry of all vehicular traffic is barred into this roadway.',
    rule: 'Do not enter this lane under any circumstance. Look for circular bypass channels or turn around immediately.'
  },
  {
    signKey: 'PEDESTRIAN_CROSSING' as const,
    name: 'Pedestrian Crossing',
    category: 'Signs',
    meaning: 'Warns of approaching Zebra crossings frequented by pedestrian traffic.',
    rule: 'Slow down. Pedestrians have absolute right-of-way on zebra crossings. You must stop completely if a pedestrian initiates a crossing maneuver.'
  },
  {
    signKey: 'TRAFFIC_LIGHT' as const,
    name: 'Traffic Signal',
    category: 'Signals',
    meaning: 'Regulated intersection controller lights coordinating vehicle crossing phases.',
    rule: 'Red requires complete halt. Amber mandates stopping unless you are already inside the intersection box. Green permits moving forward with caution.'
  },
  {
    signKey: 'GIVE_WAY' as const,
    name: 'Give Way Inverted',
    category: 'Rules',
    meaning: 'Yield precedence to incoming vehicles on major thoroughfares.',
    rule: 'Slow down at highway roundabouts and highway entry slips. Merge behind, never ahead of, moving freeway traffic.'
  },
  {
    signKey: 'SCHOOL_ZONE' as const,
    name: 'School Zone',
    category: 'Signs',
    meaning: 'Warns of nearby primary/secondary schools and students walking adjacent to roads.',
    rule: 'Maintain strict vigilance. Limit speeds to a maximum of 20 km/h. Scan road shoulders for children who might dart onto lanes.'
  },
  {
    signKey: 'NO_PARKING' as const,
    name: 'No Parking',
    category: 'Parking',
    meaning: 'Vehicular parking is strictly forbidden along this designated roadside span.',
    rule: 'Do not park or leave your vehicle unattended. Brief stop-and-drop of passengers is permitted, but the driver must remain in control.'
  },
  {
    signKey: 'ONE_WAY' as const,
    name: 'One Way Right',
    category: 'Signs',
    meaning: 'Vehicular traffic is permitted to flow only in the direction designated by the arrow.',
    rule: 'Never drive in reverse or turn your vehicle against the indicated direction. Enter only from authorized access junctions.'
  }
]

// 2. Tab categories
const CATEGORIES = ['Signs', 'Signals', 'Rules', 'Parking', 'Emergencies', 'Laws']

// RTO Quiz Questions
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    signKey: 'SPEED_LIMIT' as const,
    question: 'What is the absolute maximum speed permitted by this circular speed regulator sign?',
    options: ['Minimum speed limit 50 km/h', 'Maximum permitted speed 50 km/h', 'Recommended cruising speed 50 km/h', 'Distance warning to city grid'],
    correctIndex: 1,
    explanation: 'A red circular sign containing a number denotes a mandatory speed cap. Speeding beyond this threshold constitutes a traffic violation.',
    topic: 'Signs'
  },
  {
    id: 'q2',
    signKey: 'YIELD' as const,
    question: 'What does this downward-pointing warning triangle mandate when approaching mergers?',
    options: ['Halt completely for 5 seconds', 'Yield right-of-way to cross-highway traffic', 'One-way entry slip ahead', 'No stopping permitted'],
    correctIndex: 1,
    explanation: 'A yield sign requires you to slow down and give way to incoming merging traffic, stopping only if safety dictates.',
    topic: 'Rules'
  },
  {
    id: 'q3',
    signKey: 'NO_ENTRY' as const,
    question: 'What is the legal mandate of this red roundlet with a horizontal white bar?',
    options: ['Caution: Road closed ahead', 'Heavy vehicles entry barred', 'No Entry for all vehicles', 'No overtaking zone'],
    correctIndex: 2,
    explanation: 'This is the standard international No Entry sign. Driving past this marker is highly dangerous and illegal.',
    topic: 'Laws'
  },
  {
    id: 'q4',
    signKey: 'TRAFFIC_LIGHT' as const,
    question: 'When the traffic light changes to a steady Amber state, what is the correct action?',
    options: ['Accelerate rapidly to beat the signal transition', 'Halt immediately inside the crosswalk line', 'Slow down and prepare to stop, unless already inside the junction', 'Sound your horn and proceed straight'],
    correctIndex: 2,
    explanation: 'An amber light means you must stop unless you are already too close to the line to halt safely without emergency braking.',
    topic: 'Signals'
  },
  {
    id: 'q5',
    signKey: 'NO_PARKING' as const,
    question: 'What restriction applies in a zone featuring a blue circle barred with a red slash?',
    options: ['No parking allowed', 'No stopping or dropoffs allowed', 'Toll road starts here', 'One-way lane ahead'],
    correctIndex: 0,
    explanation: 'The blue circle with a red border and a single slash designates a No Parking zone. Stop-and-drops are permitted briefly.',
    topic: 'Parking'
  }
]

export default function RTOLearningCenter() {
  const [activeCategory, setActiveCategory] = useState('Signs')
  const [activeMode, setActiveMode] = useState<'learn' | 'quiz' | 'flashcard'>('learn')

  const { addToast, addXP } = useXPStore()
  const { recordWeakTopic } = useRTOStore()

  // ----------------------------------------------------
  // FLASHCARD MODE STATES & GESTURES
  // ----------------------------------------------------
  const [currentFlashIdx, setCurrentFlashIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const handleFlashcardSwipe = (direction: 'left' | 'right') => {
    setIsFlipped(false)
    setSwipeDirection(direction)
    // Slide out animation
    setSwipeOffset(direction === 'left' ? -400 : 400)
    
    // Award minor XP for reviewing right (know)
    if (direction === 'right') {
      addXP(5)
      addToast({
        title: 'Concept Reviewed!',
        description: 'Awarded +5 XP for learning mastery.',
        type: 'xp'
      })
    }

    setTimeout(() => {
      // Go to next card
      setCurrentFlashIdx((prev) => (prev + 1) % ROAD_SIGNS_DATA.length)
      setSwipeOffset(0)
      setSwipeDirection(null)
    }, 300)
  }

  // ----------------------------------------------------
  // QUIZ MODE STATE & timerRef (requestAnimationFrame)
  // ----------------------------------------------------
  const [quizIdx, setQuizIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  
  // Topic accuracy tracker for raw SVG radar chart
  const [topicScores, setTopicScores] = useState<Record<string, { correct: number; total: number }>>({
    'Signs': { correct: 0, total: 0 },
    'Signals': { correct: 0, total: 0 },
    'Rules': { correct: 0, total: 0 },
    'Parking': { correct: 0, total: 0 },
    'Laws': { correct: 0, total: 0 }
  })

  // requestAnimationFrame Timer Hook
  const [timeLeft, setTimeLeft] = useState(15) // 15 seconds per question
  const timerRafRef = useRef<number | null>(null)
  const timerStartRef = useRef<number>(0)

  const startQuestionTimer = () => {
    // Clear any active raf timer
    if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current)
    
    timerStartRef.current = performance.now()
    const update = (now: number) => {
      const elapsed = (now - timerStartRef.current) / 1000
      const remaining = Math.max(15 - Math.floor(elapsed), 0)
      setTimeLeft(remaining)
      
      if (remaining > 0) {
        timerRafRef.current = requestAnimationFrame(update)
      } else {
        // Timeout -> wrong answer
        handleQuizAnswer(-1)
      }
    }
    timerRafRef.current = requestAnimationFrame(update)
  }

  const stopQuestionTimer = () => {
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current)
      timerRafRef.current = null
    }
  }

  useEffect(() => {
    if (activeMode === 'quiz' && !quizFinished && !isAnswered) {
      setTimeLeft(15)
      startQuestionTimer()
    }
    return () => stopQuestionTimer()
  }, [activeMode, quizIdx, isAnswered, quizFinished])

  const handleQuizAnswer = (optionIdx: number) => {
    stopQuestionTimer()
    if (isAnswered) return

    setSelectedOpt(optionIdx)
    setIsAnswered(true)

    const question = QUIZ_QUESTIONS[quizIdx]
    const isCorrect = optionIdx === question.correctIndex

    // Update topic score accuracy logs
    setTopicScores((prev) => {
      const curr = prev[question.topic] || { correct: 0, total: 0 }
      return {
        ...prev,
        [question.topic]: {
          correct: curr.correct + (isCorrect ? 1 : 0),
          total: curr.total + 1
        }
      }
    })

    if (isCorrect) {
      setQuizScore((prev) => prev + 1)
      addXP(10)
      addToast({
        title: 'Theory Correct!',
        description: 'Accurate reference point. Earned +10 XP.',
        type: 'xp'
      })
    } else {
      // Record weak topic in store
      recordWeakTopic(question.topic)
      addToast({
        title: 'Violation Logged',
        description: `Correction loaded under: ${question.topic}`,
        type: 'xp'
      })
    }
  }

  const handleNextQuestion = () => {
    setIsAnswered(false)
    setSelectedOpt(null)
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx((prev) => prev + 1)
    } else {
      setQuizFinished(true)
    }
  }

  const resetQuizSession = () => {
    setQuizIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setQuizFinished(false)
    setQuizScore(0)
    setTopicScores({
      'Signs': { correct: 0, total: 0 },
      'Signals': { correct: 0, total: 0 },
      'Rules': { correct: 0, total: 0 },
      'Parking': { correct: 0, total: 0 },
      'Laws': { correct: 0, total: 0 }
    })
  }

  // ----------------------------------------------------
  // RADAR CHART PURE SVG GRAPHICS MATH
  // ----------------------------------------------------
  const renderRadarChart = () => {
    const center = 150
    const scaleRadius = 90
    const keys = Object.keys(topicScores)
    const pointsCount = keys.length

    // Generate concentric pentagon polygon paths for background grid rings
    const gridPolygons = [0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => {
      const points = keys.map((_, i) => {
        const angle = (i * 2 * Math.PI) / pointsCount - Math.PI / 2
        const x = center + scaleRadius * scale * Math.cos(angle)
        const y = center + scaleRadius * scale * Math.sin(angle)
        return `${x},${y}`
      })
      return points.join(' ')
    })

    // Generate active data points based on actual category accuracies
    const dataPoints = keys.map((key, i) => {
      const stats = topicScores[key]
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0.5 // Default helper in visual mock
      const angle = (i * 2 * Math.PI) / pointsCount - Math.PI / 2
      const x = center + scaleRadius * accuracy * Math.cos(angle)
      const y = center + scaleRadius * accuracy * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')

    // Render text coordinates for labels
    const labelCoordinates = keys.map((key, i) => {
      const angle = (i * 2 * Math.PI) / pointsCount - Math.PI / 2
      const x = center + (scaleRadius + 22) * Math.cos(angle)
      const y = center + (scaleRadius + 10) * Math.sin(angle)
      return { label: key, x, y }
    })

    return (
      <svg className="w-[300px] h-[300px]" viewBox="0 0 300 300">
        {/* Render grid rings */}
        {gridPolygons.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}

        {/* Center hub spokes */}
        {keys.map((_, i) => {
          const angle = (i * 2 * Math.PI) / pointsCount - Math.PI / 2
          const x = center + scaleRadius * Math.cos(angle)
          const y = center + scaleRadius * Math.sin(angle)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          )
        })}

        {/* Dynamic Accuracy Poly-shape fill */}
        <polygon
          points={dataPoints}
          fill="rgba(37, 99, 235, 0.25)"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          className="transition-all duration-700"
        />

        {/* Render point nodes */}
        {keys.map((key, i) => {
          const stats = topicScores[key]
          const accuracy = stats.total > 0 ? stats.correct / stats.total : 0.5
          const angle = (i * 2 * Math.PI) / pointsCount - Math.PI / 2
          const x = center + scaleRadius * accuracy * Math.cos(angle)
          const y = center + scaleRadius * accuracy * Math.sin(angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4.5"
              fill="var(--color-accent)"
              stroke="var(--color-surface)"
              strokeWidth="1.5"
            />
          )
        })}

        {/* Render category text labels */}
        {labelCoordinates.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            fill="var(--color-text-2)"
            fontSize="10"
            fontWeight="700"
            fontFamily="'Outfit', sans-serif"
            textAnchor="middle"
          >
            {pt.label}
          </text>
        ))}
      </svg>
    )
  }

  // Filter signs for categories
  const filteredSigns = ROAD_SIGNS_DATA.filter((s) => s.category === activeCategory)

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-20 overflow-x-hidden font-body">
      
      {/* Background ambient branding glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32">
        
        {/* Header Title Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent">RTO Theoretical Matrix</span>
            <h1 className="text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1">
              RTO Learning Center
            </h1>
            <p className="text-sm text-text-2 mt-2 max-w-xl font-body">
              Master mandatory signs, signal states, and regional laws to unlock complete safety checkpoints.
            </p>
          </div>

          {/* Interactive Portal Switcher */}
          <div className="bg-surface border border-border p-1 rounded-2xl flex gap-1 self-start">
            <button
              onClick={() => setActiveMode('learn')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeMode === 'learn' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-text-3 hover:text-text-2'
              }`}
            >
              Signboards Grid
            </button>
            <button
              onClick={() => setActiveMode('flashcard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeMode === 'flashcard' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-text-3 hover:text-text-2'
              }`}
            >
              3D Flashcards
            </button>
            <button
              onClick={() => {
                resetQuizSession()
                setActiveMode('quiz')
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeMode === 'quiz' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-text-3 hover:text-text-2'
              }`}
            >
              RTO Mock Exam
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------
            MODE 1: SIGNBOARDS GRID MODE (LEARN)
            ---------------------------------------------------- */}
        {activeMode === 'learn' && (
          <div className="mt-8 flex flex-col gap-8">
            
            {/* Snap scroll category bar */}
            <div className="w-full relative">
              <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-2">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`snap-start flex-shrink-0 px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-300 select-none ${
                        isActive 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_12px_rgba(37,99,235,0.1)]' 
                          : 'bg-surface border-border text-text-3 hover:text-text-2 hover:border-text-3'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Grid display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center"
              >
                {filteredSigns.length > 0 ? (
                  filteredSigns.map((sign, idx) => (
                    <SignCard
                      key={idx}
                      signKey={sign.signKey}
                      name={sign.name}
                      category={sign.category}
                      meaning={sign.meaning}
                      rule={sign.rule}
                      onStartQuiz={() => {
                        resetQuizSession()
                        setActiveMode('quiz')
                        const qIdx = QUIZ_QUESTIONS.findIndex(q => q.signKey === sign.signKey)
                        if (qIdx !== -1) setQuizIdx(qIdx)
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-12 h-12 text-text-3 opacity-30 animate-pulse" />
                    <h4 className="text-lg font-bold mt-4 text-text-2">Data Registry Pending</h4>
                    <p className="text-xs text-text-3 max-w-xs mt-1">Additional custom signs under this category snap logs are compiling.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ----------------------------------------------------
            MODE 2: 3D PERSPECTIVE FLASHCARDS
            ---------------------------------------------------- */}
        {activeMode === 'flashcard' && (
          <div className="mt-12 flex flex-col items-center gap-8">
            <div className="text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-text-3">Concept Flashcards</span>
              <h3 className="text-xl font-extrabold text-text-1 font-display mt-1">Review Active Road Rules</h3>
              <p className="text-xs text-text-2 mt-1">Tap to flip, swipe Left (forget) or Right (master) with pointer velocity.</p>
            </div>

            {/* 3D perspective flip container */}
            <div className="relative w-[340px] h-[400px] flex items-center justify-center select-none touch-none">
              
              {/* Swipe Left (No) Indicator overlay */}
              {swipeOffset < -40 && (
                <div className="absolute left-6 top-6 z-20 bg-danger/90 border border-danger text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono rotate-[-12deg] tracking-widest uppercase pointer-events-none">
                  FORGET
                </div>
              )}
              {/* Swipe Right (Yes) Indicator overlay */}
              {swipeOffset > 40 && (
                <div className="absolute right-6 top-6 z-20 bg-success/90 border border-success text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono rotate-[12deg] tracking-widest uppercase pointer-events-none">
                  MASTERED
                </div>
              )}

              {/* Inertia swipe card panel */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ 
                  x: swipeOffset || 0,
                  rotate: swipeOffset ? swipeOffset / 10 : 0,
                  perspective: 1000
                }}
                onDrag={(e, info) => setSwipeOffset(info.offset.x)}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) {
                    handleFlashcardSwipe('left')
                  } else if (info.offset.x > 100) {
                    handleFlashcardSwipe('right')
                  } else {
                    setSwipeOffset(0)
                  }
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-full cursor-pointer relative"
              >
                <motion.div
                  className="w-full h-full relative duration-700"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* CARD FRONT CONTAINER */}
                  <div 
                    className="absolute inset-0 bg-surface border border-border rounded-3xl p-8 flex flex-col items-center justify-between shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex justify-between w-full text-xs font-mono text-text-3">
                      <span>Concept Card {currentFlashIdx + 1}/{ROAD_SIGNS_DATA.length}</span>
                      <span className="uppercase text-primary font-bold">Zebra Loop</span>
                    </div>

                    <div className="w-[140px] h-[140px] flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                      {React.createElement(RoadSigns[ROAD_SIGNS_DATA[currentFlashIdx].signKey] as any, { size: 140, glow: true })}
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-text-3 font-mono uppercase tracking-widest">Click to Flip</span>
                      <h4 className="text-lg font-bold text-text-1 font-display tracking-tight mt-1">
                        {ROAD_SIGNS_DATA[currentFlashIdx].name}
                      </h4>
                    </div>
                  </div>

                  {/* CARD BACK CONTAINER */}
                  <div 
                    className="absolute inset-0 bg-surface border border-border rounded-3xl p-8 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="flex justify-between w-full text-xs font-mono text-text-3 border-b border-border pb-3">
                      <span>RTO DRIVING RULES</span>
                      <span className="text-accent font-bold">+5 XP LOG</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 justify-center mt-2">
                      <div>
                        <h6 className="text-[10px] font-mono text-text-3 uppercase tracking-wider">Concept Meaning</h6>
                        <p className="text-sm text-text-1 font-body mt-1 leading-relaxed">{ROAD_SIGNS_DATA[currentFlashIdx].meaning}</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <h6 className="text-[10px] font-mono text-accent uppercase tracking-wider">Cadet Instruction</h6>
                        <p className="text-xs text-text-2 font-body mt-1 italic border-l border-l-accent pl-2.5 leading-relaxed">
                          {ROAD_SIGNS_DATA[currentFlashIdx].rule}
                        </p>
                      </div>
                    </div>

                    <div className="text-center text-[10px] text-text-3 font-mono border-t border-border pt-4">
                      Swipe LEFT (forgot) | Swipe RIGHT (mastered)
                    </div>
                  </div>

                </motion.div>
              </motion.div>

            </div>

            {/* Gesture Helper Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => handleFlashcardSwipe('left')}
                className="p-4 bg-surface border border-border hover:border-danger/30 text-text-3 hover:text-danger rounded-full transition-all duration-300"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-6 bg-surface border border-border text-text-2 hover:text-text-1 text-sm font-semibold rounded-full flex items-center gap-2 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                Flip
              </button>
              <button 
                onClick={() => handleFlashcardSwipe('right')}
                className="p-4 bg-surface border border-border hover:border-success/30 text-text-3 hover:text-success rounded-full transition-all duration-300"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            MODE 3: MOCK TEST SIMULATION MODE
            ---------------------------------------------------- */}
        {activeMode === 'quiz' && (
          <div className="mt-8 flex flex-col items-center">
            
            {!quizFinished ? (
              <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                
                {/* Correct/Incorrect flashing frames */}
                {isAnswered && (
                  <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 border-2 ${
                    selectedOpt === QUIZ_QUESTIONS[quizIdx].correctIndex
                      ? 'border-success bg-success/5' 
                      : 'border-danger bg-danger/5'
                  }`} />
                )}

                {/* Header question and clock */}
                <div className="relative z-10 flex justify-between items-center text-xs font-mono text-text-3 border-b border-border pb-4">
                  <span>Question {quizIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                  
                  {/* requestAnimationFrame Clock HUD */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                    timeLeft < 5 ? 'border-danger/30 text-danger bg-danger/5 animate-pulse' : 'border-border text-text-2'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-bold">{timeLeft}s remaining</span>
                  </div>
                </div>

                {/* Question Details */}
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center mt-2">
                  
                  {/* Question sign display */}
                  <div className="w-[140px] h-[140px] flex items-center justify-center bg-void/50 border border-border rounded-2xl p-4 flex-shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    {React.createElement(RoadSigns[QUIZ_QUESTIONS[quizIdx].signKey] as any, { size: 100, glow: true })}
                  </div>

                  {/* Question wording */}
                  <div className="flex-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-primary">Traffic Regulation Code</span>
                    <h3 className="text-lg md:text-xl font-bold text-text-1 font-display mt-1 leading-snug">
                      {QUIZ_QUESTIONS[quizIdx].question}
                    </h3>
                  </div>
                </div>

                {/* Interactive Question options */}
                <div className="relative z-10 flex flex-col gap-3 mt-2">
                  {QUIZ_QUESTIONS[quizIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx
                    const isCorrectOption = oIdx === QUIZ_QUESTIONS[quizIdx].correctIndex
                    
                    let cardStyle = 'bg-void/50 border-border hover:border-text-3 text-text-2'
                    
                    if (isAnswered) {
                      if (isCorrectOption) {
                        cardStyle = 'bg-success/15 border-success text-success font-semibold shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                      } else if (isSelected) {
                        cardStyle = 'bg-danger/15 border-danger text-danger font-semibold'
                      } else {
                        cardStyle = 'bg-void/20 border-border/40 text-text-3 opacity-40'
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(oIdx)}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-300 flex items-center justify-between ${cardStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrectOption && <Check className="w-4 h-4 text-success" />}
                        {isAnswered && isSelected && !isCorrectOption && <XIcon className="w-4 h-4 text-danger" />}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation text showing after answer selection */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      className="relative z-10 bg-void/50 border-t border-border pt-4 flex flex-col gap-2"
                    >
                      <span className="text-[10px] font-mono text-accent uppercase tracking-wider">RTO Official Correction Commentary:</span>
                      <p className="text-xs text-text-2 leading-relaxed">{QUIZ_QUESTIONS[quizIdx].explanation}</p>
                      
                      <button
                        onClick={handleNextQuestion}
                        className="mt-2 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl self-end px-6 flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                      >
                        <span>{quizIdx === QUIZ_QUESTIONS.length - 1 ? 'Finish Exam' : 'Next Regulation'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ) : (
              // Quiz Finished End Screen with RAW SVG Radar spider chart
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-surface border border-border rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Left Area: Accurate raw radar polygon */}
                <div className="w-full md:w-1/2 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2">Spider Accuracy Matrix</span>
                  <div className="bg-void border border-border/80 p-4 rounded-3xl shadow-inner flex items-center justify-center">
                    {renderRadarChart()}
                  </div>
                </div>

                {/* Right Area: Score log metrics */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-primary">Simulation Completed</span>
                    <h3 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-1">
                      Mock RTO Assessment Log
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-text-3 uppercase">Total Accuracy</span>
                      <span className="text-3xl font-extrabold text-success mt-2">
                        {Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%
                      </span>
                    </div>
                    <div className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-text-3 uppercase">Correct Signs</span>
                      <span className="text-3xl font-extrabold text-primary mt-2">
                        {quizScore} <span className="text-xs text-text-3">/ {QUIZ_QUESTIONS.length}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-void/30 border border-border p-4 rounded-2xl flex flex-col gap-1">
                    <h5 className="text-xs font-bold text-text-2 uppercase font-display tracking-tight">RTO Matrix Insight</h5>
                    <p className="text-xs text-text-3 leading-relaxed font-body">
                      Your response matrices suggest high mastery on standard Signs and Rules, with minor road sign gaps flagged under "Laws" topics. Reviewing concept flashcards is suggested.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={resetQuizSession}
                      className="flex-1 py-3 bg-void/80 hover:bg-white/[0.03] border border-border text-text-2 hover:text-text-1 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake Exam
                    </button>
                    <button
                      onClick={() => setActiveMode('learn')}
                      className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <span>Study Materials</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
