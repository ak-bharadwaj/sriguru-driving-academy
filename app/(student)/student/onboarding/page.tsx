"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  CarFront, 
  MapPin, 
  Target, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2
} from 'lucide-react'
import { useXPStore } from '@/lib/stores/xp-store'

const ONBOARDING_STEPS = [
  {
    id: 'experience',
    title: 'What is your current driving experience?',
    subtitle: 'This helps us calibrate your simulation difficulty.',
    options: [
      { id: 'novice', label: 'Complete Novice', desc: 'Never been behind the wheel.', icon: CarFront },
      { id: 'beginner', label: 'Beginner', desc: 'A few hours of practice.', icon: MapPin },
      { id: 'refresher', label: 'Needs Refresher', desc: 'Know how to drive, but out of practice.', icon: Target }
    ]
  },
  {
    id: 'goals',
    title: 'What is your primary training goal?',
    subtitle: 'We will personalize your roadmap to focus on this.',
    options: [
      { id: 'license', label: 'RTO License Clearance', desc: 'Focus strictly on passing the exams.', icon: ShieldCheck },
      { id: 'defensive', label: 'Defensive Driving Mastery', desc: 'Learn to handle extreme scenarios.', icon: ShieldCheck },
      { id: 'fast', label: 'Fast-Track', desc: 'Get on the road as quickly as safely possible.', icon: Zap }
    ]
  }
]

export default function OnboardingFlow() {
  const router = useRouter()
  const { addToast, addXP } = useXPStore()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  const handleSelect = (stepId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [stepId]: optionId }))
  }

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      finishOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const finishOnboarding = () => {
    setIsCompleting(true)
    // Simulate API call to save preferences
    setTimeout(() => {
      addXP(50)
      addToast({
        title: 'Profile Calibrated',
        description: 'Welcome to the Academy. +50 XP granted.',
        type: 'xp'
      })
      router.push('/student/dashboard')
    }, 2000)
  }

  const step = ONBOARDING_STEPS[currentStep]
  const canProceed = selections[step?.id] !== undefined

  return (
    <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Progress HUD */}
      <div className="absolute top-12 w-full max-w-2xl px-6 flex items-center justify-between z-10">
        <div className="flex gap-2">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ease-spring ${
                idx <= currentStep ? 'bg-primary w-12 shadow-[0_0_8px_rgba(37,99,235,0.6)]' : 'bg-surface border border-border w-8'
              }`}
            />
          ))}
        </div>
        <span className="text-data-mono text-text-3 text-sm">
          SYS_CALIBRATION_0{currentStep + 1}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleting ? (
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-2xl z-10 mt-12"
          >
            <div className="mb-10 text-center">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight text-[rgb(var(--color-text-1))]">
                {step.title}
              </h1>
              <p className="text-text-2 text-lg">
                {step.subtitle}
              </p>
            </div>

            <div className="grid gap-4">
              {step.options.map((opt) => {
                const isSelected = selections[step.id] === opt.id
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(step.id, opt.id)}
                    className={`relative p-6 rounded-2xl flex items-center gap-6 text-left transition-all duration-300 overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-[0_0_24px_rgba(37,99,235,0.15)]' 
                        : 'bg-surface border-border hover:border-primary/50 hover:bg-surface-2'
                    } border`}
                  >
                    {/* Active highlight bar */}
                    {isSelected && (
                      <motion.div 
                        layoutId="active-bar"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_12px_rgba(37,99,235,0.8)]"
                      />
                    )}
                    
                    <div className={`p-4 rounded-xl transition-colors ${isSelected ? 'bg-primary/20 text-primary' : 'bg-void text-text-3 group-hover:text-primary/70'}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <div>
                      <h3 className={`text-xl font-display font-semibold mb-1 ${isSelected ? 'text-white' : 'text-text-1'}`}>
                        {opt.label}
                      </h3>
                      <p className={`text-sm ${isSelected ? 'text-primary/80' : 'text-text-3'}`}>
                        {opt.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-primary"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-full text-text-2 hover:text-white transition-colors disabled:opacity-0 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${
                  canProceed 
                    ? 'bg-primary text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-primary-hover hover:scale-105 active:scale-95' 
                    : 'bg-surface border border-border text-text-3 cursor-not-allowed'
                }`}
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Initialize Profile' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="completing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center z-10"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-4 border-surface border-t-primary rounded-full mb-8"
            />
            <h2 className="text-3xl font-display font-bold text-white mb-2">Generating Neural Roadmap</h2>
            <p className="text-text-2 font-data-mono">Syncing Analytics data...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

