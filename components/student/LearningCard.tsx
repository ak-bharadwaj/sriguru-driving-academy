"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Award, AlertTriangle, ShieldAlert, Check, HelpCircle, X } from 'lucide-react'
import { ParallelParkingSimulation } from './ParallelParkingSimulation'
import { ReverseBayParkingSimulation } from './ReverseBayParkingSimulation'
import { 
  VehicleStartupSimulation, 
  SteeringControlSimulation, 
  ClutchControlSimulation, 
  HighwayMergingSimulation 
} from './DynamicHTMLSimulations'
import {
  ThreePointTurnSimulation,
  EmergencyBrakingSimulation,
  RoundaboutSimulation,
  NightDrivingSimulation
} from './AdvancedDrivingSimulations'

export interface QuizData {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface LearningCardData {
  id: string
  title: string
  category: string
  signImage?: string | null
  content?: string | null // JSON representation
  slug?: string
  phase?: string
  xpReward?: number
  steps?: string[] | any
  commonMistakes?: string[] | any
  instructorTips?: string[] | any
  safetyWarnings?: string[] | any
  quizQuestion?: string
  quizOptions?: string[] | any
  quizAnswer?: string
  orderIndex?: number
}

interface ParsedCardContent {
  steps: string[]
  commonMistakes: string
  safetyWarning: string
  xpReward: number
  quiz: QuizData
}

interface LearningCardProps {
  card: LearningCardData
  cardIndex: number
  totalCards: number
  onSkip: () => void
  onComplete: (xpReward: number) => void
  isNextCard1?: boolean
  isNextCard2?: boolean
}

export const LearningCard: React.FC<LearningCardProps> = ({
  card,
  cardIndex,
  totalCards,
  onSkip,
  onComplete,
  isNextCard1 = false,
  isNextCard2 = false
}) => {
  // Parse JSON content safely or map directly from flat object fields
  let parsedContent: ParsedCardContent
  if (card.steps && Array.isArray(card.steps)) {
    const steps = card.steps as string[]
    const commonMistakes = Array.isArray(card.commonMistakes)
      ? card.commonMistakes.join(', ')
      : (card.commonMistakes || '')
    const safetyWarning = Array.isArray(card.safetyWarnings)
      ? card.safetyWarnings.join(', ')
      : (card.safetyWarnings || '')
    const quizOptions = Array.isArray(card.quizOptions) ? (card.quizOptions as string[]) : []
    const correctIndex = quizOptions.findIndex(opt => opt === card.quizAnswer) !== -1
      ? quizOptions.findIndex(opt => opt === card.quizAnswer)
      : 0
    const explanation = Array.isArray(card.instructorTips)
      ? card.instructorTips.join('. ')
      : (card.instructorTips || 'Follow correct practice guidelines.')

    parsedContent = {
      steps,
      commonMistakes,
      safetyWarning,
      xpReward: card.xpReward || 10,
      quiz: {
        question: card.quizQuestion || 'Verify your understanding of this skill.',
        options: quizOptions.length > 0 ? quizOptions : ['Correct', 'Incorrect'],
        correctIndex,
        explanation
      }
    }
  } else {
    try {
      parsedContent = JSON.parse(card.content || '')
    } catch {
      parsedContent = {
        steps: ['Ensure cockpit parameters match visual drill guidelines.'],
        commonMistakes: 'Skipping cabin validation mirrors check.',
        safetyWarning: 'Never disengage gear check disconnections.',
        xpReward: 50,
        quiz: {
          question: 'Standard check default placeholder?',
          options: ['Check', 'Ignore', 'Skip', 'Fasten'],
          correctIndex: 0,
          explanation: 'Baseline default parameters.'
        }
      }
    }
  }

  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  
  // Motion drag variables
  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-200, 200], [-15, 15])
  const opacity = useTransform(dragX, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5])

  // Handle pointer end velocity drag check
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const swipeThreshold = 140
    const swipeVelocity = info.velocity.x

    if (info.offset.x < -swipeThreshold || swipeVelocity < -500) {
      // Swipe left -> Skip
      onSkip()
    } else if (info.offset.x > swipeThreshold || swipeVelocity > 500) {
      // Swipe right -> complete, show Quiz
      setShowQuiz(true)
    } else {
      // Reset position
      dragX.set(0)
    }
  }

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswered) return
    setSelectedOption(optionIdx)
    setQuizAnswered(true)

    const isCorrect = optionIdx === parsedContent.quiz.correctIndex
    if (isCorrect) {
      // Delay transition to let them see success check
      setTimeout(() => {
        onComplete(parsedContent.xpReward)
        setShowQuiz(false)
        setQuizAnswered(false)
        setSelectedOption(null)
        dragX.set(0)
      }, 1500)
    }
  }

  // Peeking behind static styling states
  if (isNextCard2) {
    return (
      <div 
        className="w-full max-w-md h-[560px] bg-surface/40 border border-border/40 rounded-3xl p-6 absolute pointer-events-none select-none"
        style={{ 
          transform: 'rotate(-16deg) scale(0.90) translateY(12px)',
          zIndex: 5,
          filter: 'brightness(0.5) blur(1px)'
        }}
      >
        <div className="w-full h-full flex flex-col justify-between">
          <div className="h-6 bg-white/[0.02] rounded-full w-24" />
          <div className="h-40 bg-white/[0.01] rounded-2xl w-full" />
          <div className="space-y-3">
            <div className="h-4 bg-white/[0.02] rounded w-full" />
            <div className="h-4 bg-white/[0.02] rounded w-5/6" />
            <div className="h-4 bg-white/[0.02] rounded w-4/5" />
          </div>
          <div className="h-10 bg-white/[0.02] rounded-xl w-full" />
        </div>
      </div>
    )
  }

  if (isNextCard1) {
    return (
      <div 
        className="w-full max-w-md h-[560px] bg-surface/70 border border-border/80 rounded-3xl p-6 absolute pointer-events-none select-none"
        style={{ 
          transform: 'rotate(-8deg) scale(0.95) translateY(6px)',
          zIndex: 10,
          filter: 'brightness(0.7) blur(0.5px)'
        }}
      >
        <div className="w-full h-full flex flex-col justify-between">
          <div className="h-6 bg-white/[0.04] rounded-full w-24" />
          <div className="h-40 bg-white/[0.02] rounded-2xl w-full" />
          <div className="space-y-3">
            <div className="h-4 bg-white/[0.03] rounded w-full" />
            <div className="h-4 bg-white/[0.03] rounded w-5/6" />
            <div className="h-4 bg-white/[0.03] rounded w-4/5" />
          </div>
          <div className="h-10 bg-white/[0.03] rounded-xl w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md h-[560px] relative" style={{ zIndex: 20 }}>
      
      {/* Draggable Active Card Stack */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -500, right: 500 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        style={{ x: dragX, rotate, opacity }}
        className="w-full h-full bg-surface border border-border rounded-3xl flex flex-col justify-between overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
      >
        {/* Active Card Body Grid */}
        <div className="w-full h-full flex flex-col justify-between">
          
          {/* Top 40% illustration area: abstract road geometric scene or simulator */}
          <div className="h-[35%] bg-gradient-to-b from-void to-primary/20 relative overflow-hidden flex items-center justify-center border-b border-border">
            {card.slug === 'parallel-parking' ? (
              <ParallelParkingSimulation />
            ) : card.slug === 'reverse-parking' ? (
              <ReverseBayParkingSimulation />
            ) : card.slug === 'vehicle-startup' ? (
              <VehicleStartupSimulation />
            ) : card.slug === 'steering-control' ? (
              <SteeringControlSimulation />
            ) : card.slug === 'clutch-control' ? (
              <ClutchControlSimulation />
            ) : card.slug === 'highway-merging' ? (
              <HighwayMergingSimulation />
            ) : card.slug === 'three-point-turn' ? (
              <ThreePointTurnSimulation />
            ) : card.slug === 'emergency-braking' ? (
              <EmergencyBrakingSimulation />
            ) : card.slug === 'roundabout' ? (
              <RoundaboutSimulation />
            ) : card.slug === 'night-driving' ? (
              <NightDrivingSimulation />
            ) : (
              <>
                {/* Absolute positioning of abstract SVGs */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="roadGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-surface)" />
                      <stop offset="100%" stopColor="var(--color-void)" />
                    </linearGradient>
                  </defs>
                  {/* Sky sunset glow */}
                  <circle cx="200" cy="40" r="160" fill="url(#roadGrad)" className="opacity-40" />
                  
                  {/* Mountain Silhouettes - Soft Theme Colors */}
                  <path d="M-20,110 L60,50 L140,110 L220,70 L340,110 Z" className="fill-slate-200 dark:fill-slate-900" opacity="0.6" />
                  <path d="M80,110 L180,60 L280,110 L380,80 L480,110 Z" className="fill-slate-300 dark:fill-slate-800" opacity="0.8" />

                  {/* Tapering road lanes */}
                  <path d="M140,110 L260,110 L205,30 L195,30 Z" className="fill-slate-100 dark:fill-slate-950" stroke="var(--color-border)" strokeWidth="0.5" />
                  
                  {/* Highway side boundaries */}
                  <line x1="140" y1="110" x2="195" y2="30" stroke="var(--color-primary)" strokeWidth="1.5" className="opacity-60" />
                  <line x1="260" y1="110" x2="205" y2="30" stroke="var(--color-primary)" strokeWidth="1.5" className="opacity-60" />
                  
                  {/* Dashed center lane divider line */}
                  <line x1="200" y1="110" x2="200" y2="30" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4,5" className="opacity-60" />
                </svg>
              </>
            )}

            {/* Title Badge overlays */}
            <div className="absolute top-3 left-3 bg-surface/85 backdrop-blur-xs border border-border px-2.5 py-0.5 rounded-full text-[9px] font-mono text-text-2 z-30">
              SKILL {cardIndex + 1} OF {totalCards}
            </div>

            <div className="absolute top-3 right-3 bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full flex items-center gap-1 z-30">
              <Award className="w-3 text-accent fill-accent" />
              <span className="text-[9px] font-bold text-accent font-mono">+{parsedContent.xpReward} XP</span>
            </div>
          </div>

          {/* Dedicated High-Contrast Card Header */}
          <div className="px-5 py-3 border-b border-border/40 bg-surface">
            <span className="text-[10px] text-primary uppercase font-mono tracking-widest block font-bold">{card.category} Module</span>
            <h3 className="text-base font-extrabold text-text-1 font-display tracking-tight mt-0.5 leading-tight">
              {card.title}
            </h3>
          </div>

          {/* Middle Section: Staggered step-by-step lists */}
          <div className="flex-1 p-5 overflow-y-auto scrollbar-none flex flex-col gap-3.5">
            <h5 className="text-[10px] font-mono text-text-3 uppercase tracking-wider">Step-By-Step Practice</h5>
            <div className="flex flex-col gap-2.5">
              {parsedContent.steps.map((step, sIdx) => (
                <motion.div 
                  key={sIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * sIdx, ease: 'easeOut' }}
                  className="flex gap-2.5 items-start"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <p className="text-[11px] text-text-2 leading-relaxed font-body">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Warning and Common Mistakes strip */}
          <div className="border-t border-border p-3.5 bg-void/30 flex flex-col gap-2">
            {/* Common Mistakes */}
            <div className="flex gap-2 items-start">
              <AlertTriangle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-[9px] leading-relaxed">
                <span className="font-bold text-accent font-mono uppercase tracking-wider">Mistake Alert:</span>{' '}
                <span className="text-text-2">{parsedContent.commonMistakes}</span>
              </div>
            </div>
            {/* Safety Warning Pill */}
            <div className="bg-danger/5 border border-danger/10 px-2.5 py-1.5 rounded-xl flex gap-2 items-start">
              <ShieldAlert className="w-3.5 h-3.5 text-danger mt-0.5 flex-shrink-0" />
              <div className="text-[9px] leading-relaxed text-text-2">
                <span className="font-bold text-danger font-mono uppercase tracking-wider">Warning:</span>{' '}
                {parsedContent.safetyWarning}
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons (Bypasses drag for easy desktop usage) */}
          <div className="border-t border-border p-3 bg-surface flex gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSkip()
              }}
              className="flex-1 min-h-[40px] py-1.5 bg-void hover:bg-white/[0.02] border border-border text-text-2 hover:text-text-1 font-mono uppercase tracking-wider text-[9px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <X className="w-3 h-3 text-danger" />
              Skip Skill
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowQuiz(true)
              }}
              className="flex-1 min-h-[40px] py-1.5 bg-primary hover:bg-primary/95 text-white font-mono uppercase tracking-wider text-[9px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Check className="w-3 h-3 text-success" />
              Master Skill
            </button>
          </div>

        </div>

        {/* Slide-Up Practice Quiz Overlay */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="absolute inset-0 bg-surface z-40 border-t border-border p-6 flex flex-col justify-between"
            >
              {/* Quiz Header */}
              <div className="flex justify-between items-center border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono uppercase tracking-widest text-text-2">Concept Validation Check</span>
                </div>
                <button 
                  onClick={() => setShowQuiz(false)}
                  className="p-1 bg-void hover:bg-white/[0.04] border border-border rounded-full text-text-3 hover:text-text-1 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Question Wording */}
              <div className="flex-1 flex flex-col justify-center gap-2 py-4">
                <span className="text-[10px] font-mono text-primary uppercase block">Practical Theory</span>
                <h4 className="text-base font-bold text-text-1 leading-snug font-display">
                  {parsedContent.quiz.question}
                </h4>
              </div>

              {/* Options list: Large tap targets minimum 48px height */}
              <div className="flex flex-col gap-2.5 mb-2">
                {parsedContent.quiz.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx
                  const isCorrect = oIdx === parsedContent.quiz.correctIndex

                  let btnStyle = 'border-border bg-void/50 hover:border-text-3 text-text-2'
                  
                  if (quizAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-success bg-success/15 text-success font-semibold shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                    } else if (isSelected) {
                      btnStyle = 'border-danger bg-danger/15 text-danger font-semibold'
                    } else {
                      btnStyle = 'border-border/40 bg-void/25 text-text-3 opacity-40'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizAnswered}
                      onClick={() => handleQuizAnswer(oIdx)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-left text-xs transition-all duration-300 flex items-center justify-between gap-4 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizAnswered && isCorrect && <Check className="w-3.5 h-3.5 text-success" />}
                      {quizAnswered && isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-danger" />}
                    </button>
                  )}
                )}
              </div>

              {/* Correct Explanation commentary */}
              <AnimatePresence>
                {quizAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-void/50 border border-border p-3.5 rounded-xl flex flex-col gap-1 mt-1 text-[10px]"
                  >
                    <span className="font-mono text-accent uppercase tracking-wider block">Academy explanation:</span>
                    <p className="text-text-2 leading-relaxed">{parsedContent.quiz.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

    </div>
  )
}
