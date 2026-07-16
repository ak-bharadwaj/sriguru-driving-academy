"use client"

import React, { useState, useEffect } from 'react'
import { RotateCcw, ArrowRight, Check, Play } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { RealisticCarSVG, ScaledCanvas } from './DynamicHTMLSimulations'

export interface SimulationProps {
  onComplete?: () => void
}

const COMMON_SIM_T = {
  EN: {
    telemetry: "Telemetry Status",
    begin: "Begin",
    next: "Next",
    kmh: "km/h",
    rpm: "RPM",
    complete: "Complete",
    success: "Success",
    passed: "Passed",
    reset: "Reset"
  },
  HI: {
    telemetry: "टेलीमेट्री स्थिति",
    begin: "शुरू करें",
    next: "अगला",
    kmh: "किमी/घं",
    rpm: "आरपीएम",
    complete: "पूर्ण",
    success: "सफल",
    passed: "उत्तीर्ण",
    reset: "रीसेट"
  },
  TE: {
    telemetry: "టెలిమెట్రీ స్థితి",
    begin: "ప్రారంభించండి",
    next: "తదుపరి",
    kmh: "కిమీ/గం",
    rpm: "RPM",
    complete: "పూర్తయింది",
    success: "విజయం",
    passed: "పాస్",
    reset: "రీసెట్"
  }
}

// Telemetry Bar Component for consistent look
const TelemetryBar = ({ 
  speed, 
  activeGear, 
  activeWheelAngle, 
  step, 
  maxSteps = 4, 
  title, 
  desc, 
  isAnimating, 
  onNext, 
  onReset,
  successText = "Complete"
}: { 
  speed: number
  activeGear: string
  activeWheelAngle: number
  step: number
  maxSteps?: number
  title: string
  desc: string
  isAnimating: boolean
  onNext: () => void
  onReset: () => void
  successText?: string
}) => {
  const { language } = useLanguageStore()
  const t = COMMON_SIM_T[language] || COMMON_SIM_T.EN

  return (
    <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 relative z-30 w-full shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner">
          <svg className="w-9 h-9 text-text-2 transition-transform duration-[1000ms] ease-in-out" style={{ transform: `rotate(${activeWheelAngle}deg)` }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
            <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
            <line x1="18" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
            <line x1="82" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
          </svg>
          <span className="absolute -bottom-1 right-[-4px] text-[9px] font-mono bg-void border border-white/10 px-0.5 rounded text-accent">
            {activeWheelAngle}°
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-text-1 w-8">{speed} <span className="text-[9px] text-text-3">{t.kmh}</span></span>
            <div className="flex gap-1 bg-void border border-white/5 p-1 rounded text-[10px] font-mono font-bold">
              {["P", "R", "N", "D", "1", "2"].map(g => (
                <span key={g} className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${activeGear === g ? 'bg-primary text-white' : 'text-text-3 opacity-40'}`}>
                  {g}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider mt-1">
            {t.telemetry}
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-[280px]">
        <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">
          {title}
        </h4>
        <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">
          {desc}
        </p>
      </div>

      <div className="flex gap-2">
        {step > 0 && (
          <button onClick={onReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button onClick={onNext} disabled={isAnimating || step === maxSteps} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === maxSteps ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
          {step === 0 ? (
            <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></>
          ) : step === maxSteps ? (
            <><Check className="w-3 h-3" /><span>{successText}</span></>
          ) : (
            <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>
          )}
        </button>
      </div>
    </div>
  )
}

// Side Profile representation for inclines
export const SideProfileInclineSVG = ({ speed = 0, isRollingBack = false }: { speed?: number, isRollingBack?: boolean }) => (
  <div className="relative w-[120px] h-[45px]">
    <svg width="120" height="45" viewBox="0 0 120 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl absolute inset-0">
      <rect x="15" y="10" width="90" height="22" rx="6" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
      <path d="M 30 10 L 45 2 L 75 2 L 90 10 Z" fill="#1e293b" />
      <circle cx="35" cy="32" r="8" fill="#0f172a" />
      <circle cx="85" cy="32" r="8" fill="#0f172a" />
    </svg>
  </div>
)

// ============================================================================
// 1. VEHICLE STARTUP SIMULATION
// ============================================================================
export const VehicleStartupSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [rpm, setRpm] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Fasten Seatbelt", d: "Secure your seatbelt before cranking the engine." },
    { t: "2. Set Gear to Neutral", d: "Ensure the gear shift is in neutral position." },
    { t: "3. Press Clutch Pedal", d: "Depress the clutch fully to safely crank." },
    { t: "4. Twist Ignition Key", d: "Crank the ignition key. Watch the RPM dial soar!" }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 4) {
        setRpm(1200)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1e293b] border-b border-white/5 overflow-hidden flex items-center justify-center">
        <div className="w-[300px] h-[160px] bg-slate-900 border-4 border-slate-700 rounded-3xl p-4 flex flex-col justify-around relative shadow-2xl">
          <div className="flex justify-between items-center px-4">
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-slate-400 font-mono">TACHOMETER</div>
              <div className="text-xl font-bold font-mono text-white">{rpm} <span className="text-xs">RPM</span></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-slate-400 font-mono">SEATBELT</div>
              <div className={`text-xs font-bold font-mono ${step >= 1 ? 'text-success' : 'text-danger'}`}>{step >= 1 ? 'FASTENED' : 'UNSECURED'}</div>
            </div>
          </div>
          <div className="flex justify-around items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-primary border-primary text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>CL</div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary border-primary text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>N</div>
          </div>
        </div>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step >= 2 ? "N" : "P"} 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Initial Cabin Check" : steps[step - 1].t} 
        desc={step === 0 ? "Perform starting protocols. Press Begin." : steps[step - 1].d} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setRpm(0); }} 
        successText="Started"
      />
    </div>
  )
}

// ============================================================================
// 2. STEERING CONTROL SIMULATION
// ============================================================================
export const SteeringControlSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [carX, setCarX] = useState(40)
  const [carY, setCarY] = useState(130)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Steer Left Around Cone", d: "Turn wheel left (-30deg) to clear the obstacle." },
    { t: "2. Counter-Steer Right", d: "Rotate wheel right (30deg) to realign." },
    { t: "3. Straighten Wheel", d: "Bring steering back to center." },
    { t: "4. Slow Down & Halt", d: "Apply brakes smoothly to stop." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      
      if (nextStep === 1) {
        setSpeed(20)
        setWheelAngle(-30)
        setCarX(180)
        setCarY(80)
      } else if (nextStep === 2) {
        setWheelAngle(30)
        setCarX(340)
        setCarY(180)
      } else if (nextStep === 3) {
        setWheelAngle(0)
        setCarX(480)
        setCarY(130)
      } else if (nextStep === 4) {
        setSpeed(0)
        setCarX(560)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#2a2d3a] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[130px] left-0 right-0 h-0.5 border-t border-dashed border-white/30" />
            
            {/* Cones */}
            <div className="absolute left-[240px] top-[100px] w-6 h-8 bg-amber-500 rounded-t-lg border-b-4 border-amber-700" />
            <div className="absolute left-[400px] top-[160px] w-6 h-8 bg-amber-500 rounded-t-lg border-b-4 border-amber-700" />
            
            {/* Player Car */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle / 2}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step > 0 && step < 4 ? "D" : "P"} 
        activeWheelAngle={wheelAngle} 
        step={step} 
        title={step === 0 ? "Slalom Approach" : steps[step - 1].t} 
        desc={step === 0 ? "Prepare to steer around road cones." : steps[step - 1].d} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setCarY(130); setWheelAngle(0); setSpeed(0); }} 
        successText="Passed"
      />
    </div>
  )
}

// ============================================================================
// 3. CLUTCH CONTROL SIMULATION
// ============================================================================
export const ClutchControlSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [carX, setCarX] = useState(30)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Raise RPM to 1500", d: "Apply acceleration gas to build enough power." },
    { t: "2. Locate Clutch Bite Point", d: "Slowly release clutch until engine sound changes." },
    { t: "3. Release Handbrake", d: "Disengage parking brake to allow forward travel." },
    { t: "4. Roll Forward & Accelerate", d: "Increase throttle input and steer up the slope." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 4) {
        setSpeed(20)
        setCarX(220)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-sky-900/20" />
        <div className="absolute left-[-20px] right-[-20px] h-[300px] bg-[#334155] border-t-8 border-slate-600 origin-top-left" style={{ transform: 'rotate(-10deg)', top: '150px' }} />
        <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${150 - carX * Math.tan(10 * Math.PI / 180) - 30}px`, transform: 'rotate(-10deg)' }}>
          <SideProfileInclineSVG speed={speed} />
        </div>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step > 0 ? "1" : "N"} 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Hill Hold Approach" : steps[step - 1].t} 
        desc={step === 0 ? "Prepare to climb the slope without rolling back." : steps[step - 1].d} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(30); setSpeed(0); }} 
        successText="Passed"
      />
    </div>
  )
}

// ============================================================================
// 4. BRAKING TECHNIQUES SIMULATION (Correct RTO Travel Direction)
// ============================================================================
export const BrakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(40)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Accelerate to Cruise Speed", d: "Accelerate to 40 km/h in left lane." },
    { t: "2. Check Mirrors", d: "Look back before applying brakes." },
    { t: "3. Apply Smooth Brake Pressure", d: "Slow down gradually. Do not slam." },
    { t: "4. Press Clutch to Halt", d: "Hold clutch down as speed hits 0 to avoid stall." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setSpeed(40)
        setCarX(180)
      } else if (nextStep === 2) {
        setCarX(320)
      } else if (nextStep === 3) {
        setSpeed(15)
        setCarX(440)
      } else if (nextStep === 4) {
        setSpeed(0)
        setCarX(500)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            
            {/* Horizontal Road - Driving on the Left (Bottom Lane is Left-to-Right) */}
            <div className="absolute top-[100px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 flex flex-col justify-center">
              <div className="w-full h-0.5 border-t border-dashed border-white/40" />
            </div>

            {/* Stop Line in Bottom Lane */}
            <div className="absolute left-[510px] top-[144px] bottom-[20px] w-3 bg-white" />
            
            {/* Player Car in Bottom Lane (driving left to right) */}
            <div className="absolute top-[148px] transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={step >= 3} activeGear="D" />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step > 0 && step < 4 ? "D" : "P"} 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Braking Coordination" : steps[step - 1].t} 
        desc={step === 0 ? "Learn to brake smoothly before stop lines. Press Begin." : steps[step - 1].d} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setSpeed(0); }} 
        successText="Passed"
      />
    </div>
  )
}

// ============================================================================
// 5. MIRROR CHECKING SIMULATION
// ============================================================================
export const MirrorCheckingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [checked, setChecked] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const checkMirror = (mirror: string) => {
    if (!checked.includes(mirror)) {
      const updated = [...checked, mirror]
      setChecked(updated)
      if (updated.length === 3) {
        setStep(4)
        if (onComplete) onComplete()
      } else {
        setStep(updated.length)
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#0f172a] border-b border-white/5 flex flex-col justify-around p-4">
        <div className="w-full flex justify-center">
          <button onClick={() => checkMirror('rear')} className={`w-[240px] h-10 border-2 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${checked.includes('rear') ? 'bg-success/20 border-success text-success' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            REARVIEW MIRROR {checked.includes('rear') && '✓'}
          </button>
        </div>
        <div className="w-full flex justify-between px-6">
          <button onClick={() => checkMirror('left')} className={`w-[110px] h-16 border-2 rounded-l-2xl flex items-center justify-center font-bold text-xs transition-all ${checked.includes('left') ? 'bg-success/20 border-success text-success' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            LEFT MIRROR {checked.includes('left') && '✓'}
          </button>
          <button onClick={() => checkMirror('right')} className={`w-[110px] h-16 border-2 rounded-r-2xl flex items-center justify-center font-bold text-xs transition-all ${checked.includes('right') ? 'bg-success/20 border-success text-success' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            RIGHT MIRROR {checked.includes('right') && '✓'}
          </button>
        </div>
      </div>
      <TelemetryBar 
        speed={0} 
        activeGear="P" 
        activeWheelAngle={0} 
        step={step} 
        title="Cockpit Mirror Array Scan" 
        desc={step === 4 ? "All critical zones cleared and checked." : "Tap each of the three mirrors to perform a safety check."} 
        isAnimating={isAnimating} 
        onNext={() => {}} 
        onReset={() => { setStep(0); setChecked([]); }} 
        successText="Clear"
      />
    </div>
  )
}

// ============================================================================
// 8. HILL STARTS SIMULATION
// ============================================================================
export const HillStartsSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(30)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 4) {
        setSpeed(20)
        setCarX(220)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1a202c] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950/10" />
        <div className="absolute left-[-20px] right-[-20px] h-[300px] bg-[#334155] border-t-8 border-slate-600 origin-top-left" style={{ transform: 'rotate(-12deg)', top: '150px' }} />
        <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${150 - carX * Math.tan(12 * Math.PI / 180) - 30}px`, transform: 'rotate(-12deg)' }}>
          <SideProfileInclineSVG speed={speed} />
        </div>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step > 0 ? "1" : "N"} 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Hill Start Drill" : `Incline Hold Step ${step}`} 
        desc={step === 0 ? "Prepare to throttle up and release handbrake." : "Release brake at biting point and climb."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(30); setSpeed(0); }} 
        successText="Climbed"
      />
    </div>
  )
}

// ============================================================================
// 9. LANE CHANGING SIMULATION
// ============================================================================
export const LaneChangingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(40)
  const [carY, setCarY] = useState(150)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setCarX(180)
      } else if (nextStep === 2) {
        setWheelAngle(-15)
        setCarX(320)
        setCarY(90)
      } else if (nextStep === 3) {
        setWheelAngle(0)
        setCarX(440)
        setCarY(80)
      } else if (nextStep === 4) {
        setCarX(520)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-white/40" />
            </div>
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" leftBlinker={step === 2} />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={60} 
        activeGear="D" 
        activeWheelAngle={wheelAngle} 
        step={step} 
        title={step === 0 ? "Lane Swapping Approach" : `Merge Phase ${step}`} 
        desc={step === 0 ? "Initiate lane change on highway. Press Begin." : "Glide safely across lane markings."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setCarY(150); setWheelAngle(0); }} 
        successText="Merged"
      />
    </div>
  )
}

// ============================================================================
// 10. TRAFFIC SIGNALS SIMULATION
// ============================================================================
export const TrafficSignalsSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(40)
  const [speed, setSpeed] = useState(0)
  const [lightColor, setLightColor] = useState<'green' | 'amber' | 'red'>('green')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setSpeed(30)
        setCarX(180)
      } else if (nextStep === 2) {
        setLightColor('amber')
        setCarX(300)
      } else if (nextStep === 3) {
        setLightColor('red')
        setSpeed(10)
        setCarX(400)
      } else if (nextStep === 4) {
        setSpeed(0)
        setCarX(480)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[100px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500" />
            <div className="absolute left-[500px] top-[100px] bottom-[20px] w-3 bg-white" />
            
            <div className="absolute left-[520px] top-[20px] w-8 h-20 bg-black border-2 border-slate-700 rounded flex flex-col items-center justify-around py-1">
              <div className={`w-4 h-4 rounded-full ${lightColor === 'red' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-red-950'}`} />
              <div className={`w-4 h-4 rounded-full ${lightColor === 'amber' ? 'bg-amber-500 shadow-[0_0_8px_orange]' : 'bg-amber-950'}`} />
              <div className={`w-4 h-4 rounded-full ${lightColor === 'green' ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-green-950'}`} />
            </div>

            <div className="absolute top-[120px] transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={step >= 3} activeGear="D" />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step > 0 && step < 4 ? "D" : "P"} 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Junction Stop Setup" : `Signal Phase ${step}`} 
        desc={step === 0 ? "Obey signals and halt at stop line. Press Begin." : "Decelerate smoothly as signal turns red."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setSpeed(0); setLightColor('green'); }} 
        successText="Halted"
      />
    </div>
  )
}

// ============================================================================
// 11. HIGHWAY MERGING SIMULATION
// ============================================================================
export const HighwayMergingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(40)
  const [carY, setCarY] = useState(160)
  const [speed, setSpeed] = useState(0)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setSpeed(40)
        setCarX(180)
      } else if (nextStep === 2) {
        setSpeed(70)
        setWheelAngle(-15)
        setCarX(320)
        setCarY(100)
      } else if (nextStep === 3) {
        setWheelAngle(0)
        setCarX(450)
        setCarY(90)
      } else if (nextStep === 4) {
        setSpeed(80)
        setCarX(530)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 shadow-inner" />
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" leftBlinker={step === 2} />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear="D" 
        activeWheelAngle={wheelAngle} 
        step={step} 
        title={step === 0 ? "Highway Ramp Slide" : `Merge Acceleration Step ${step}`} 
        desc={step === 0 ? "Accelerate on slip road to match speed flow. Press Begin." : "Merge safely with cruising highway traffic."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setCarY(160); setSpeed(0); setWheelAngle(0); }} 
        successText="Merged"
      />
    </div>
  )
}

// ============================================================================
// 12. OVERTAKING SIMULATION
// ============================================================================
export const OvertakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(40)
  const [carY, setCarY] = useState(150)
  const [speed, setSpeed] = useState(50)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setWheelAngle(-15)
        setCarX(160)
        setCarY(90)
      } else if (nextStep === 2) {
        setWheelAngle(0)
        setSpeed(80)
        setCarX(320)
      } else if (nextStep === 3) {
        setWheelAngle(15)
        setCarX(460)
        setCarY(150)
      } else if (nextStep === 4) {
        setWheelAngle(0)
        setSpeed(60)
        setCarX(520)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 shadow-inner" />
            
            {/* Cargo Truck */}
            <div className="absolute left-[240px] top-[140px] w-32 h-[55px] bg-blue-900 rounded border border-slate-600 flex items-center justify-center text-white text-[8px] font-bold">CARGO TRUCK</div>
            
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" leftBlinker={step === 1} rightBlinker={step === 3} />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear="D" 
        activeWheelAngle={wheelAngle} 
        step={step} 
        title={step === 0 ? "Overtake Setup" : `Overtaking Step ${step}`} 
        desc={step === 0 ? "Prepare to pass a slow moving truck ahead. Press Begin." : "Accelerate, shift lanes, pass, and return."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setCarY(150); setSpeed(50); setWheelAngle(0); }} 
        successText="Complete"
      />
    </div>
  )
}

// ============================================================================
// 13. EMERGENCY BRAKING SIMULATION (Correct RTO Travel Direction)
// ============================================================================
export const EmergencyBrakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(40)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setSpeed(50)
        setCarX(220)
      } else if (nextStep === 2) {
        setCarX(360)
      } else if (nextStep === 3) {
        setSpeed(0)
        setCarX(430)
      } else if (nextStep === 4) {
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#353839] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            
            {/* Horizontal Road - Driving on the Left (Bottom Lane is Left-to-Right) */}
            <div className="absolute top-[100px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 flex flex-col justify-center" />
            
            {/* Obstacle/STOP Sign on Left (Bottom right side of road) */}
            {step >= 2 && (
              <div className="absolute left-[480px] top-[140px] z-10 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded bg-red-600 border-2 border-white flex items-center justify-center animate-pulse shadow-lg">
                  <span className="text-white font-bold text-[10px]">STOP</span>
                </div>
              </div>
            )}

            {/* Player Car in Bottom Lane (driving left to right) */}
            <div className="absolute top-[148px] transition-all duration-[1000ms] ease-in-out" style={{ left: `${carX}px` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={step >= 3} activeGear="D" />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear={step > 0 && step < 3 ? "D" : "P"} 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Emergency Stop Approach" : `Halt Phase ${step}`} 
        desc={step === 0 ? "Halt immediately when obstacle stop banner appears. Press Begin." : "Decelerate rapidly to standstill."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(40); setSpeed(0); }} 
        successText="Safe Stop"
      />
    </div>
  )
}

// ============================================================================
// 14. DRIVING IN RAIN SIMULATION
// ============================================================================
export const RainDrivingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [wiperActive, setWiperActive] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setSpeed(40)
      } else if (nextStep === 2) {
        setWiperActive(true)
      } else if (nextStep === 3) {
        setSpeed(30)
      } else if (nextStep === 4) {
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#0f172a] border-b border-white/5 flex flex-col justify-center items-center p-4">
        <div className="w-[280px] h-[130px] border-2 border-slate-700 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
          <div className="absolute text-slate-500 font-mono text-[9px]">WINDSHIELD VIEW</div>
          <div className={`absolute bottom-0 left-1/2 w-1 h-[100px] bg-slate-400 origin-bottom transition-all ${wiperActive ? 'animate-bounce' : 'rotate-[-60deg]'}`} />
        </div>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear="D" 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Rain Hazards" : `Wet Driving Step ${step}`} 
        desc={step === 0 ? "Turn on wipers and reduce speed to match downpour conditions." : "Maintain traction and safe distance."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setSpeed(0); setWiperActive(false); }} 
        successText="Passed"
      />
    </div>
  )
}

// ============================================================================
// 15. NIGHT DRIVING SIMULATION
// ============================================================================
export const NightDrivingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [lightsActive, setLightsActive] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setLightsActive(true)
      } else if (nextStep === 2) {
        setSpeed(40)
      } else if (nextStep === 4) {
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#020617] border-b border-white/5 flex flex-col justify-center items-center p-4">
        <div className={`w-[260px] h-[120px] rounded-2xl border-2 border-slate-800 transition-colors duration-1000 flex items-center justify-center ${lightsActive ? 'bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-slate-950'}`}>
          <span className="text-[10px] text-slate-500 font-mono">{lightsActive ? '💡 LIGHT BEAMS ACTIVE' : 'DARK WINDSHIELD'}</span>
        </div>
      </div>
      <TelemetryBar 
        speed={speed} 
        activeGear="D" 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Night Drive Ignition" : `Night Visibility Step ${step}`} 
        desc={step === 0 ? "Turn on low beams and initiate low light cruise." : "Keep safe distance and monitor blind zones."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setSpeed(0); setLightsActive(false); }} 
        successText="Safe Stop"
      />
    </div>
  )
}

// ============================================================================
// 16. ROUNDABOUT NAVIGATION SIMULATION
// ============================================================================
export const RoundaboutSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(250)
  const [carY, setCarY] = useState(240)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setCarX(250)
        setCarY(190)
        setWheelAngle(-15)
      } else if (nextStep === 2) {
        setCarX(180)
        setCarY(120)
        setWheelAngle(15)
      } else if (nextStep === 3) {
        setCarX(250)
        setCarY(50)
        setWheelAngle(-15)
      } else if (nextStep === 4) {
        setCarX(380)
        setCarY(50)
        setWheelAngle(0)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={500}>
          <div className="w-[500px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute left-[150px] top-[40px] w-[200px] h-[200px] rounded-full border-[32px] border-slate-500 bg-emerald-800/10 shadow-inner" />
            
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" leftBlinker={step === 3} />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={25} 
        activeGear="D" 
        activeWheelAngle={wheelAngle} 
        step={step} 
        title={step === 0 ? "Yielding Loop entry" : `Loop Navigation Step ${step}`} 
        desc={step === 0 ? "Obey loop yield rules and enter circular segment. Press Begin." : "Steer and exit loop safely."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(250); setCarY(240); setWheelAngle(0); }} 
        successText="Exited"
      />
    </div>
  )
}

// ============================================================================
// 17. PARKING ALIGNMENT SIMULATION
// ============================================================================
export const ParkingAlignmentSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(190)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setCarX(160)
      } else if (nextStep === 2) {
        setCarX(130)
      } else if (nextStep === 3) {
        setCarX(120)
      } else if (nextStep === 4) {
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute left-[80px] top-0 bottom-0 w-6 bg-slate-500 shadow" />
            <div className="absolute top-[120px] transition-all duration-[1000ms] ease-in-out" style={{ left: `${carX}px` }}>
              <div className="w-[110px] h-[48px] origin-center -rotate-90 scale-75">
                <RealisticCarSVG colorClass="slate" step={step} showLights={true} />
              </div>
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar 
        speed={2} 
        activeGear="R" 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Curb Side Setup" : `Curb Steering Step ${step}`} 
        desc={step === 0 ? "Position vehicle parallel to the curb (15-30cm gap). Press Begin." : "Verify proximity distance clearance."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setCarX(190); }} 
        successText="Aligned"
      />
    </div>
  )
}

// ============================================================================
// 18. BLIND SPOT AWARENESS SIMULATION
// ============================================================================
export const BlindSpotAwarenessSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [headTurned, setHeadTurned] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 3) {
        setHeadTurned(true)
      } else if (nextStep === 4) {
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1e293b] border-b border-white/5 flex flex-col justify-center items-center p-4">
        <div className={`w-[260px] h-[130px] border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${headTurned ? 'border-success bg-success/5 shadow-inner' : 'border-slate-700 bg-slate-900'}`}>
          <span className="text-[10px] text-slate-400 font-mono">RADAR HAZARD SCOPE</span>
          <p className="text-[11px] text-white font-bold font-mono mt-2">{headTurned ? '✓ SIDE CAR SEEN (BLIND SPOT CLEAR)' : '🚫 BLIND SPOT HIDDEN'}</p>
        </div>
      </div>
      <TelemetryBar 
        speed={0} 
        activeGear="P" 
        activeWheelAngle={0} 
        step={step} 
        title={step === 0 ? "Blind Zone Proximity Setup" : `Scan Phase ${step}`} 
        desc={step === 0 ? "Scan for vehicles in adjacent mirrors. Press Begin." : "Rotate head to verify blind spots are safe."} 
        isAnimating={isAnimating} 
        onNext={handleNext} 
        onReset={() => { setStep(0); setHeadTurned(false); }} 
        successText="Cleared"
      />
    </div>
  )
}

// Re-export original high-fidelity simulations
export { ParallelParkingSimulation } from './ParallelParkingSimulation'
export { ReverseBayParkingSimulation } from './ReverseBayParkingSimulation'
export { ThreePointTurnSimulation } from './DynamicHTMLSimulations'
