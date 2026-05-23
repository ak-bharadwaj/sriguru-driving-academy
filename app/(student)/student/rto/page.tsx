"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X as XIcon, 
  Clock, 
  BookOpen, 
  RotateCcw,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

// Import icons
import * as RoadSigns from '@/lib/icons/road-signs'

// Import SignCard component
import { SignCard } from '@/components/student/SignCard'

// Import Zustand stores
import { useXPStore } from '@/lib/stores/xp-store'
import { useRTOStore } from '@/lib/stores/rto-store'

import { RoadSignItem, QuizQuestionItem, ROAD_SIGNS_DATA, QUIZ_QUESTIONS } from '@/lib/data/rto-data'

const CATEGORIES = ['Signs', 'Signals', 'Rules', 'Parking', 'Emergencies', 'Laws']

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

  const handleFlashcardSwipe = (direction: 'left' | 'right') => {
    setIsFlipped(false)
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
    }, 300)
  }

  // ----------------------------------------------------
  // QUIZ MODE STATE & timerRef (requestAnimationFrame)
  // ----------------------------------------------------
  const [quizIdx, setQuizIdx] = useState(0)
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestionItem[]>([])
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  
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

  const stopQuestionTimer = useCallback(() => {
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current)
      timerRafRef.current = null
    }
  }, [])

  const handleNextQuestionRef = useRef<() => void>(() => {})

  const handleQuizAnswer = useCallback((optionIdx: number) => {
    stopQuestionTimer()
    if (isAnswered) return

    setSelectedOpt(optionIdx)
    setIsAnswered(true)

    setUserAnswers(prev => ({ ...prev, [quizIdx]: optionIdx }))
    
    // Auto-advance after 500ms since we don't show answers immediately
    setTimeout(() => {
      handleNextQuestionRef.current()
    }, 500)
  }, [isAnswered, quizIdx, stopQuestionTimer])

  const startQuestionTimer = useCallback(() => {
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
  }, [handleQuizAnswer])

  useEffect(() => {
    if (activeMode === 'quiz' && !quizFinished && !isAnswered && activeQuestions.length > 0) {
      setTimeLeft(15)
      startQuestionTimer()
    }
    return () => stopQuestionTimer()
  }, [activeMode, quizIdx, isAnswered, quizFinished, startQuestionTimer, stopQuestionTimer, activeQuestions.length])

  const handleNextQuestion = useCallback(() => {
    setIsAnswered(false)
    setSelectedOpt(null)
    if (quizIdx < activeQuestions.length - 1) {
      setQuizIdx((prev) => prev + 1)
    } else {
      // Calculate final score
      let score = 0;
      const newTopicScores = {
        'Signs': { correct: 0, total: 0 },
        'Signals': { correct: 0, total: 0 },
        'Rules': { correct: 0, total: 0 },
        'Parking': { correct: 0, total: 0 },
        'Laws': { correct: 0, total: 0 }
      }
      
      activeQuestions.forEach((q, idx) => {
        const uAns = userAnswers[idx];
        const isCorrect = uAns === q.correctIndex;
        if (isCorrect) score++;
        
        const topicKey = q.topic as keyof typeof newTopicScores;
        const curr = newTopicScores[topicKey] || { correct: 0, total: 0 };
        newTopicScores[topicKey] = {
          correct: curr.correct + (isCorrect ? 1 : 0),
          total: curr.total + 1
        };
      });
      
      setQuizScore(score);
      setTopicScores(newTopicScores);
      setQuizFinished(true);
      
      // Award XP at the end
      if (score > 0) {
        addXP(score * 10)
        addToast({
          title: 'Exam Completed',
          description: `You scored ${score}/${activeQuestions.length}. Earned +${score * 10} XP!`,
          type: 'xp'
        })
      }
    }
  }, [quizIdx, activeQuestions, userAnswers, addXP, addToast])

  useEffect(() => {
    handleNextQuestionRef.current = handleNextQuestion
  }, [handleNextQuestion])

  const resetQuizSession = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random())
    setActiveQuestions(shuffled.slice(0, 20))
    setQuizIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setQuizFinished(false)
    setQuizScore(0)
    setUserAnswers({})
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
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0
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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32">
        
        {/* Header Title Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent">RTO Theoretical Dashboard</span>
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
                      steps={sign.steps}
                      imagePath={sign.imagePath}
                      onStartQuiz={() => {
                        resetQuizSession()
                        setActiveMode('quiz')
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-12 h-12 text-text-3 opacity-30 animate-pulse" />
                    <h4 className="text-lg font-bold mt-4 text-text-2">No Signs Found</h4>
                    <p className="text-xs text-text-3 max-w-xs mt-1">There are no signs available for this category yet.</p>
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

                    <div className="w-[140px] h-[140px] flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative">
                      {(() => {
                        const activeSign = ROAD_SIGNS_DATA[currentFlashIdx]
                        const SVGComponent = activeSign.signKey ? RoadSigns[activeSign.signKey] : null
                        if (activeSign.imagePath) {
                          return <Image src={activeSign.imagePath} alt="Sign" width={140} height={140} className="object-contain" />
                        } else if (SVGComponent) {
                          return React.createElement(SVGComponent as React.ComponentType<{ size: number; glow?: boolean }>, { size: 140, glow: true })
                        }
                        
                        // Fallback shape
                        const shapeClass = activeSign.fallbackShape === 'circle' ? 'rounded-full' 
                                         : activeSign.fallbackShape === 'octagon' ? 'clip-octagon'
                                         : activeSign.fallbackShape === 'triangle' ? 'clip-triangle'
                                         : 'rounded-xl'
                        const colorClass = activeSign.fallbackColor === 'red' ? 'bg-[#ff3b30]'
                                         : activeSign.fallbackColor === 'blue' ? 'bg-[#007aff]'
                                         : activeSign.fallbackColor === 'yellow' ? 'bg-[#ffcc00]'
                                         : 'bg-[#34c759]'
                                         
                        return (
                          <div className={`w-32 h-32 ${shapeClass} ${colorClass} flex items-center justify-center border-4 border-white shadow-lg`}>
                            <span className="text-white font-bold text-xs uppercase text-center px-2">{activeSign.name}</span>
                          </div>
                        )
                      })()}
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
                        <h6 className="text-[10px] font-mono text-accent uppercase tracking-wider">Student Safety Steps</h6>
                        <div className="mt-2 flex flex-col gap-2">
                          {ROAD_SIGNS_DATA[currentFlashIdx].steps && ROAD_SIGNS_DATA[currentFlashIdx].steps.length > 0 ? (
                            ROAD_SIGNS_DATA[currentFlashIdx].steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex gap-2 items-start text-xs text-text-2 font-body italic border-l border-l-accent pl-2.5 leading-relaxed">
                                <span className="flex-shrink-0 text-accent font-bold">{sIdx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-text-2 font-body italic border-l border-l-accent pl-2.5 leading-relaxed">
                              {ROAD_SIGNS_DATA[currentFlashIdx].rule}
                            </p>
                          )}
                        </div>
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
          <div className="mt-8 flex flex-col items-center pb-12">
            
            {!quizFinished && activeQuestions.length > 0 ? (
              <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                
                {/* Selection frame */}
                {isAnswered && (
                  <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 border-2 border-primary bg-primary/5 rounded-3xl" />
                )}

                {/* Header question and clock */}
                <div className="relative z-10 flex justify-between items-center text-xs font-mono text-text-3 border-b border-border pb-4">
                  <span>Question {quizIdx + 1} of {activeQuestions.length}</span>
                  
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
                  <div className="w-[140px] h-[140px] flex items-center justify-center bg-void/50 border border-border rounded-2xl p-4 flex-shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative">
                    {(() => {
                      const activeQuestion = activeQuestions[quizIdx]
                      const QuestionSVGComponent = activeQuestion.signKey ? RoadSigns[activeQuestion.signKey] : null
                      if (activeQuestion.imagePath) {
                        return <Image src={activeQuestion.imagePath} alt="Sign" width={100} height={100} className="object-contain" />
                      } else if (QuestionSVGComponent) {
                        return React.createElement(QuestionSVGComponent as React.ComponentType<{ size: number; glow?: boolean }>, { size: 100, glow: true })
                      }
                      
                      // Fallback shape
                      const shapeClass = activeQuestion.fallbackShape === 'circle' ? 'rounded-full' 
                                       : activeQuestion.fallbackShape === 'octagon' ? 'clip-octagon'
                                       : activeQuestion.fallbackShape === 'triangle' ? 'clip-triangle'
                                       : 'rounded-xl'
                                       
                      return (
                        <div className={`w-24 h-24 ${shapeClass} bg-primary/20 flex items-center justify-center border-4 border-primary/50 shadow-lg`}>
                          <span className="text-primary font-bold text-[10px] uppercase text-center px-1">Concept</span>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Question wording */}
                  <div className="flex-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-primary">Traffic Regulation Code</span>
                    <h3 className="text-lg md:text-xl font-bold text-text-1 font-display mt-1 leading-snug">
                      {activeQuestions[quizIdx].question}
                    </h3>
                  </div>
                </div>

                {/* Interactive Question options */}
                <div className="relative z-10 flex flex-col gap-3 mt-2">
                  {activeQuestions[quizIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx
                    
                    let cardStyle = 'bg-void/50 border-border hover:border-text-3 text-text-2'
                    
                    if (isAnswered) {
                      if (isSelected) {
                        cardStyle = 'bg-primary/15 border-primary text-primary font-semibold shadow-[0_0_12px_rgba(37,99,235,0.1)]'
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
                        {isAnswered && isSelected && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : quizFinished ? (
              // Quiz Finished End Screen with RAW SVG Radar spider chart
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-surface border border-border rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Left Area: Accurate raw radar polygon */}
                <div className="w-full md:w-1/2 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2">Spider Accuracy Dashboard</span>
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
                        {Math.round((quizScore / activeQuestions.length) * 100)}%
                      </span>
                    </div>
                    <div className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-text-3 uppercase">Correct Signs</span>
                      <span className="text-3xl font-extrabold text-primary mt-2">
                        {quizScore} <span className="text-xs text-text-3">/ {activeQuestions.length}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-void/30 border border-border p-4 rounded-2xl flex flex-col gap-1">
                    <h5 className="text-xs font-bold text-text-2 uppercase font-display tracking-tight">RTO Dashboard Insight</h5>
                    <p className="text-xs text-text-3 leading-relaxed font-body">
                      Your response matrices suggest high mastery on standard Signs and Rules, with minor road sign gaps flagged under &quot;Laws&quot; topics. Reviewing concept flashcards is suggested.
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
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
