"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  CarFront, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Info
} from 'lucide-react'
import { useXPStore } from '@/lib/stores/xp-store'

// Simulator Steps Data
const SIMULATION_STEPS = [
  {
    id: 1,
    title: 'Positioning & Alignment',
    instruction: 'Pull up parallel to the car in front of the empty space. Leave about 2-3 feet of distance between your car and the parked car.',
    mistake: 'Pulling too close or too far prevents the correct turning radius.',
    carState: { x: 0, y: 0, rotate: 0 },
    confidencePoints: 10
  },
  {
    id: 2,
    title: 'Initial Reverse',
    instruction: 'Shift into reverse. Turn the steering wheel fully to the left (towards the curb). Slowly back up until your car is at a 45-degree angle.',
    mistake: 'Turning the wheel too late causes you to hit the curb.',
    carState: { x: -30, y: 50, rotate: -45 },
    confidencePoints: 20
  },
  {
    id: 3,
    title: 'Straightening Out',
    instruction: 'Straighten the steering wheel. Continue backing up straight until your front bumper clears the rear bumper of the car in front.',
    mistake: 'Not straightening the wheel quickly enough leads to a deep angle.',
    carState: { x: -45, y: 90, rotate: -45 },
    confidencePoints: 30
  },
  {
    id: 4,
    title: 'Final Turn & Park',
    instruction: 'Turn the steering wheel fully to the right (away from the curb). Back up until your car is parallel with the curb and positioned evenly between both cars.',
    mistake: 'Hitting the curb or the car behind you.',
    carState: { x: -60, y: 120, rotate: 0 },
    confidencePoints: 40
  }
]

export default function SimulatorPage() {
  const router = useRouter()
  const { addToast, addXP } = useXPStore()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [confidence, setConfidence] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const step = SIMULATION_STEPS[currentStep]

  useEffect(() => {
    // Animate confidence meter when step changes
    setConfidence(step.confidencePoints)
  }, [currentStep, step.confidencePoints])

  const handleNext = () => {
    if (currentStep < SIMULATION_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      finishSimulation()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const finishSimulation = () => {
    setIsCompleted(true)
    setTimeout(() => {
      addXP(100)
      addToast({
        title: 'Simulation Mastered!',
        description: '+100 XP for perfect Parallel Parking execution.',
        type: 'xp'
      })
      router.push('/student/learn')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-void text-text-1 flex flex-col md:flex-row overflow-hidden font-body relative">
      
      {/* Top/Left Panel: The Simulator View */}
      <div className="w-full md:w-3/5 h-[50vh] md:h-screen relative border-b md:border-b-0 md:border-r border-border bg-surface flex items-center justify-center overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-void to-void" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Analytics HUD */}
        <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
          <div className="bg-void/80 backdrop-blur-md border border-border p-4 rounded-2xl flex items-center gap-4">
            <Gauge className="text-primary w-6 h-6" />
            <div>
              <p className="text-xs text-text-3 font-data-mono">Analytics</p>
              <p className="text-sm font-semibold">ANGLE: {Math.abs(step.carState.rotate)}°</p>
            </div>
          </div>
        </div>

        {/* Confidence Meter HUD */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-void/80 backdrop-blur-md border border-border p-4 rounded-2xl flex flex-col gap-2 w-48">
            <div className="flex justify-between items-center text-xs font-data-mono">
              <span className="text-text-3">CONFIDENCE</span>
              <span className="text-accent">{confidence}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </div>
          </div>
        </div>

        {/* The Simulation Scene */}
        <div className="relative w-[300px] h-[500px] flex justify-center items-center">
          
          {/* Parking Lines */}
          <div className="absolute right-[40px] top-[50px] w-[80px] h-[140px] border-l-2 border-t-2 border-b-2 border-white/20 border-dashed rounded-l-md" />
          <div className="absolute right-[40px] bottom-[50px] w-[80px] h-[140px] border-l-2 border-t-2 border-b-2 border-white/20 border-dashed rounded-l-md" />
          <div className="absolute right-[40px] top-[210px] w-[80px] h-[180px] border-l-2 border-white/40 border-dashed" />

          {/* Parked Car 1 (Top) */}
          <div className="absolute right-[50px] top-[60px] w-[60px] h-[120px] bg-surface border border-white/10 rounded-xl flex items-center justify-center opacity-50">
            <CarFront className="w-8 h-8 text-text-3" />
          </div>

          {/* Parked Car 2 (Bottom) */}
          <div className="absolute right-[50px] bottom-[60px] w-[60px] h-[120px] bg-surface border border-white/10 rounded-xl flex items-center justify-center opacity-50">
            <CarFront className="w-8 h-8 text-text-3" />
          </div>

          {/* Student Car (Animated) */}
          <motion.div 
            className="absolute top-[60px] w-[60px] h-[120px] bg-primary/20 border border-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] z-20"
            initial={false}
            animate={{
              x: step.carState.x,
              y: step.carState.y,
              rotate: step.carState.rotate,
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            {/* Front indicator */}
            <div className="absolute top-2 w-10 h-2 bg-primary/40 rounded-full" />
            <CarFront className="w-8 h-8 text-primary" />
          </motion.div>

        </div>
      </div>

      {/* Bottom/Right Panel: Interactive Coaching */}
      <div className="w-full md:w-2/5 h-[50vh] md:h-screen flex flex-col bg-void p-6 md:p-12 relative">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full justify-center"
            >
              <div className="mb-4">
                <span className="text-primary font-data-mono text-sm tracking-wider uppercase">
                  Phase 0{step.id} / 04
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                {step.title}
              </h2>
              
              <div className="bg-surface border border-border p-6 rounded-2xl mb-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-text-1 text-lg leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              </div>

              <div className="bg-danger/10 border border-danger/20 p-5 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-danger font-semibold mb-1">Common Mistake</h4>
                  <p className="text-text-2 text-sm">
                    {step.mistake}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10 flex justify-between items-center">
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
                  className="px-8 py-3 bg-primary text-white rounded-full font-semibold flex items-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all"
                >
                  {currentStep === SIMULATION_STEPS.length - 1 ? 'Execute Park' : 'Next Phase'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center h-full"
            >
              <div className="w-20 h-20 bg-success/20 border border-success rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Simulation Passed</h2>
              <p className="text-text-2 mb-8 max-w-sm">
                Excellent maneuver execution. You&apos;ve mastered the spatial awareness required for parallel parking.
              </p>
              <button
                onClick={() => router.push('/student/learn')}
                className="px-8 py-3 bg-surface border border-border rounded-full hover:bg-surface-2 transition-colors font-semibold"
              >
                Return to Modules
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

