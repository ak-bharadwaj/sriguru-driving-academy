"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  RotateCcw, 
  Navigation, 
  CheckCircle, 
  Award, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Award as AwardIcon
} from 'lucide-react'

// Import Zustand stores
import { useXPStore } from '@/lib/stores/xp-store'

// Import components
import { LearningCard, LearningCardData } from '@/components/student/LearningCard'

export default function PracticalLearnSection() {
  const [cards, setCards] = useState<LearningCardData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { addXP, addToast, level } = useXPStore()

  // Fetch learning cards from API route
  const fetchCards = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/student/learning-cards')
      if (!res.ok) throw new Error('Failed to retrieve learning cards')
      const data = await res.json()
      setCards(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  // Handlers for active swipes
  const handleSkip = () => {
    // Transition card index
    setCurrentIndex((prev) => prev + 1)
    addToast({
      title: 'Skill Skipped',
      description: 'You can revisit this skill deck anytime.',
      type: 'xp'
    })
  }

  const handleComplete = (xpReward: number) => {
    addXP(xpReward)
    addToast({
      title: 'Skill Validated!',
      description: `Gained +${xpReward} XP for mastering.`,
      type: 'xp'
    })
    setCurrentIndex((prev) => prev + 1)
  }

  const handleReset = () => {
    setCurrentIndex(0)
  }

  // Progress metrics
  const totalCards = cards.length
  const progressPercent = totalCards > 0 ? Math.min((currentIndex / totalCards) * 100, 100) : 0

  // ----------------------------------------------------
  // WINDING HIGHWAY PATH PROGRESS GRAPHICS MATH
  // ----------------------------------------------------
  // Path length definition of winding bezier highway
  const roadPathLength = 580
  
  // Sine-wave mathematical coordinates mapping the car's path
  const carX = 20 + (560 * progressPercent) / 100
  // Sine curve equation matching: Q 150 5, 250 35...
  // Matches our path: M 20 20 C 150 5, 250 35, 400 10 C 480 0, 530 30, 580 20
  // We approximate the Y coordinate using sine transitions
  const carY = 20 + 8 * Math.sin((progressPercent * Math.PI * 2.8) / 100)

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-24 overflow-x-hidden font-body">
      
      {/* Visual background glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 flex flex-col items-center gap-8">
        
        {/* Header Section */}
        <header className="w-full border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Practical Operations</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5">
              Practical Skill Decks
            </h1>
            <p className="text-xs text-text-2 mt-1">
              Master the physical operations checklist to pass on-road driving checkpoints.
            </p>
          </div>

          <div className="bg-surface/50 border border-border px-3 py-1.5 rounded-full flex items-center gap-2 self-start">
            <span className="text-[10px] font-mono text-text-3">CADET CADENCE:</span>
            <span className="text-xs font-bold text-accent font-mono">
              LEVEL {level}
            </span>
          </div>
        </header>

        {/* ----------------------------------------------------
            PREMIUM ROAD PROGRESS GRAPHIC
            ---------------------------------------------------- */}
        <div className="w-full bg-surface border border-border p-5 rounded-3xl relative overflow-hidden flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-mono text-text-2 px-1">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Skill Acquisition Path</span>
            </span>
            <span className="font-bold text-primary">{Math.round(progressPercent)}% Completed</span>
          </div>

          {/* SVG Winding Road Progress Graphic */}
          <div className="w-full relative h-[44px] bg-void/50 border border-border/60 rounded-2xl flex items-center px-2">
            <svg className="w-full h-full" viewBox="0 0 600 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Spline curve underlay (Winding Road track) */}
              <path
                id="base-road"
                d="M 20 20 C 150 5, 250 35, 400 10 C 480 0, 530 30, 580 20"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 20 20 C 150 5, 250 35, 400 10 C 480 0, 530 30, 580 20"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="6"
                strokeDasharray="4,6"
                strokeLinecap="round"
              />

              {/* Progress active path overlay */}
              <path
                d="M 20 20 C 150 5, 250 35, 400 10 C 480 0, 530 30, 580 20"
                stroke="url(#roadActiveGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={roadPathLength}
                strokeDashoffset={roadPathLength - (roadPathLength * progressPercent) / 100}
                className="transition-all duration-500 ease-out"
              />

              {/* Definitions */}
              <defs>
                <linearGradient id="roadActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>

              {/* Car pointer marker group */}
              <motion.g
                animate={{ x: carX - 20, y: carY - 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative"
              >
                {/* Glowing beacon circle */}
                <circle cx="20" cy="20" r="10" fill="var(--color-accent)" className="opacity-25 animate-ping" />
                {/* Visual marker knob */}
                <circle cx="20" cy="20" r="6" fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth="1.5" />
                {/* Small inner direction indicator */}
                <circle cx="20" cy="20" r="2.5" fill="#000" />
              </motion.g>
            </svg>
          </div>
        </div>

        {/* ----------------------------------------------------
            ACTIVE LEARNING CARD STACK / DECK METAPHOR
            ---------------------------------------------------- */}
        <div className="w-full flex items-center justify-center min-h-[580px] relative mt-4">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <RotateCcw className="w-10 h-10 text-primary animate-spin" />
              <h4 className="text-sm font-mono text-text-3">SEEKING DB PATHWAYS...</h4>
            </div>
          ) : error ? (
            <div className="bg-danger/10 border border-danger/20 p-6 rounded-3xl text-center max-w-sm">
              <h4 className="text-base font-bold text-danger">Database Connection Stalled</h4>
              <p className="text-xs text-text-2 mt-2">{error}</p>
              <button 
                onClick={fetchCards}
                className="mt-4 px-4 py-2 bg-danger text-white rounded-xl text-xs font-semibold"
              >
                Retry Request
              </button>
            </div>
          ) : currentIndex < totalCards ? (
            // Render active card and peek stacks behind
            <div className="relative w-full max-w-md h-[560px] flex items-center justify-center">
              
              {/* Deck background stack level 2 (-16deg) */}
              {currentIndex + 2 < totalCards && (
                <LearningCard
                  card={cards[currentIndex + 2]}
                  cardIndex={currentIndex + 2}
                  totalCards={totalCards}
                  onSkip={() => {}}
                  onComplete={() => {}}
                  isNextCard2
                />
              )}

              {/* Deck background stack level 1 (-8deg) */}
              {currentIndex + 1 < totalCards && (
                <LearningCard
                  card={cards[currentIndex + 1]}
                  cardIndex={currentIndex + 1}
                  totalCards={totalCards}
                  onSkip={() => {}}
                  onComplete={() => {}}
                  isNextCard1
                />
              )}

              {/* Front active card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cards[currentIndex].id}
                  initial={{ scale: 0.95, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: -20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="w-full h-full"
                >
                  <LearningCard
                    card={cards[currentIndex]}
                    cardIndex={currentIndex}
                    totalCards={totalCards}
                    onSkip={handleSkip}
                    onComplete={handleComplete}
                  />
                </motion.div>
              </AnimatePresence>

            </div>
          ) : (
            // Completed Stack End Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 text-center flex flex-col items-center justify-between min-h-[500px]"
            >
              <div className="w-full flex justify-between items-center border-b border-border pb-4">
                <span className="text-[10px] font-mono text-accent">Matrix Summary</span>
                <span className="text-[10px] font-mono text-text-3">100% Completed</span>
              </div>

              {/* Completion medallion details */}
              <div className="flex-1 flex flex-col justify-center items-center gap-6 py-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <div className="w-[100px] h-[100px] bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary relative z-10">
                    <AwardIcon className="w-12 h-12" />
                  </div>
                </div>

                <div className="max-w-xs">
                  <h3 className="text-2xl font-extrabold text-text-1 font-display tracking-tight">
                    Practical Skillset Mastered
                  </h3>
                  <p className="text-xs text-text-2 mt-2 leading-relaxed font-body">
                    Outstanding cadet! You have successfully processed all 18 operational practical skill cards in the Sri Guru archive database.
                  </p>
                </div>
              </div>

              <div className="w-full flex gap-3 mt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-void border border-border hover:bg-white/[0.02] text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Deck
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-1.5 transition-all duration-300"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  )
}
