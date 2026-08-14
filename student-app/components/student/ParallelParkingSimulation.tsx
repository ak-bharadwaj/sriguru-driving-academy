"use client"

import React, { useState, useEffect } from 'react'
import { RotateCcw, ArrowRight, Check, Play } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { RealisticCarSVG, ScaledCanvas } from './DynamicHTMLSimulations' 

export interface ParallelParkingSimulationProps {
  onComplete?: () => void
}

const SIM_T = {
  EN: {
    telemetry: "Telemetry Status",
    begin: "Begin",
    next: "Next",
    kmh: "km/h",
    initialTitle: "Initial Positioning",
    initialDesc: "Prepare to park. Click 'Begin' to start.",
    parked: "Parked OK",
    vacant: "Vacant Spot",
    steps: [
      { t: "1. Pull Up Alongside", d: "Position your car parallel to the lead vehicle." },
      { t: "2. Full Lock Left", d: "Turn the wheel full left and reverse to a 40° angle." },
      { t: "3. Full Lock Right", d: "Turn the wheel full right and swing the front in." },
      { t: "4. Straighten Up", d: "Straighten the wheel, adjust distance, shift to Park." }
    ]
  },
  HI: {
    telemetry: "टेलीमेट्री स्थिति",
    begin: "शुरू करें",
    next: "अगला",
    kmh: "किमी/घं",
    initialTitle: "प्रारंभिक स्थिति",
    initialDesc: "पार्क करने की तैयारी करें। 'शुरू करें' पर क्लिक करें।",
    parked: "ठीक पार्क किया",
    vacant: "खाली स्थान",
    steps: [
      { t: "1. बगल में खींचें", d: "अपनी कार को आगे वाले वाहन के समानांतर रखें।" },
      { t: "2. पूरा बाएँ घुमाएँ", d: "पहिया पूरा बाएँ घुमाएँ और 40-डिग्री कोण तक पीछे हटें।" },
      { t: "3. पूरा दाएँ घुमाएँ", d: "पहिया पूरा दाएँ घुमाएँ और सामने का हिस्सा अंदर लाएँ।" },
      { t: "4. सीधा करें", d: "पहिया सीधा करें, दूरी समायोजित करें, पार्क करें।" }
    ]
  },
  TE: {
    telemetry: "టెలిమెట్రీ స్థితి",
    begin: "ప్రారంభించండి",
    next: "తదుపరి",
    kmh: "కిమీ/గం",
    initialTitle: "ప్రారంభ స్థానం",
    initialDesc: "పార్కింగ్ కు సిద్ధం అవ్వండి. 'ప్రారంభించండి' క్లిక్ చేయండి.",
    parked: "పార్కింగ్ ఓకే",
    vacant: "ఖాళీ స్థలం",
    steps: [
      { t: "1. పక్కకు లాగండి", d: "ముందు వాహనానికి సమాంతరంగా కారును ఉంచండి." },
      { t: "2. పూర్తిగా ఎడమవైపు", d: "వీల్‌ను పూర్తిగా ఎడమవైపుకు తిప్పి 40-డిగ్రీల కోణానికి వెనుకకు వెళ్లండి." },
      { t: "3. పూర్తిగా కుడివైపు", d: "స్టీరింగ్‌ను పూర్తిగా కుడివైపుకు తిప్పి లోపలికి వెళ్లండి." },
      { t: "4. నేరుగా చేయండి", d: "వీల్‌ను నేరుగా చేసి, దూరాన్ని సర్దుబాటు చేసి పార్క్‌కు మార్చండి." }
    ]
  }
}

export const ParallelParkingSimulation: React.FC<ParallelParkingSimulationProps> = ({
  onComplete
}) => {
  const { language } = useLanguageStore()
  const t = SIM_T[language] || SIM_T.EN

  const [step, setStep] = useState<number>(0)
  const [speed, setSpeed] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const stepsInfo = [
    { gear: "D", wheelAngle: 0, targetSpeed: 8 },
    { gear: "R", wheelAngle: -450, targetSpeed: 5 }, 
    { gear: "R", wheelAngle: 450, targetSpeed: 4 },  
    { gear: "D", wheelAngle: 0, targetSpeed: 2 }
  ]

  useEffect(() => {
    if (step === 0) {
      setSpeed(0)
      return
    }

    const targetSpeed = stepsInfo[step - 1].targetSpeed
    setIsAnimating(true)
    
    let currentSpeed = 0
    const interval = setInterval(() => {
      if (currentSpeed < targetSpeed) {
        currentSpeed += 1
        setSpeed(currentSpeed)
      } else {
        clearInterval(interval)
        setTimeout(() => {
          let decelSpeed = targetSpeed
          const decelInterval = setInterval(() => {
            if (decelSpeed > 0) {
              decelSpeed -= 1
              setSpeed(decelSpeed)
            } else {
              clearInterval(decelInterval)
              setIsAnimating(false)
              if (step === 4 && onComplete) onComplete()
            }
          }, 150)
        }, 1200)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [step])

  const handleNext = () => {
    if (isAnimating) return
    if (step < 4) setStep(prev => prev + 1)
  }

  const handleReset = () => {
    if (isAnimating) return
    setStep(0)
    setSpeed(0)
  }

  // CORRECTED PARALLEL MATH: Shifting entire layout left by 50px
  const getCarTransform = () => {
    switch (step) {
      case 1: return 'translate(380px, 100px) rotate(0deg)'
      case 2: return 'translate(300px, 60px) rotate(35deg)' 
      case 3: return 'translate(220px, 45px) rotate(5deg)'  
      case 4: return 'translate(230px, 40px) rotate(0deg)'
      case 0:
      default: return 'translate(-70px, 100px) rotate(0deg)'
    }
  }

  const activeGear = step === 0 ? "P" : (step === 4 && !isAnimating ? "P" : stepsInfo[step - 1].gear)
  const activeWheelAngle = step === 0 ? 0 : stepsInfo[step - 1].wheelAngle

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      
      <div className="flex-1 relative w-full min-h-[300px] bg-[#353839] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative">
            
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />

            <div className="absolute top-0 left-[-1000px] right-[-1000px] h-[30px] bg-green-900/40 border-b-4 border-slate-500 shadow-md z-0" />

            {/* Bay 1: Back Car (Blue) - shifted left by 50px */}
            <div className="absolute left-[50px] top-[30px] w-[150px] h-[65px] border-b-[2px] border-r-[2px] border-white/40 flex items-center justify-center">
               <RealisticCarSVG colorClass="blue" showLights={true} activeGear="P" step={1} />
            </div>

            {/* Bay 2: Target Vacant Spot - shifted left by 50px */}
            <div className="absolute left-[200px] top-[30px] w-[160px] h-[65px] border-b-[2px] border-r-[2px] border-primary/60 bg-primary/10 flex items-center justify-center transition-colors duration-500 shadow-inner" style={{ backgroundColor: step === 4 ? 'rgba(34, 197, 94, 0.2)' : '' }}>
              <span className={`text-[12px] font-mono uppercase tracking-wider font-bold transition-colors ${step === 4 ? 'text-success' : 'text-primary/70'}`}>
                {step === 4 ? t.parked : t.vacant}
              </span>
            </div>

            {/* Bay 3: Front Car (Red) - shifted left by 50px */}
            <div className="absolute left-[360px] top-[30px] w-[150px] h-[65px] border-b-[2px] border-white/40 flex items-center justify-center">
               <RealisticCarSVG colorClass="red" showLights={true} activeGear="P" step={1} />
            </div>

            <div className="absolute top-[180px] left-[-1000px] right-[-1000px] h-[4px] border-t-[4px] border-dashed border-white/40" />

            {/* PLAYER CAR (Silver) - Rotates around its true rear axle */}
            <div 
              className="absolute z-20 transition-all duration-[1500ms] ease-in-out top-0 left-0"
              style={{ transform: getCarTransform(), transformOrigin: '20px 24px' }}
            >
               <RealisticCarSVG colorClass="slate" showLights={true} activeGear={activeGear} step={step} />
            </div>

          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 relative z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-9 h-9 text-text-2 transition-transform duration-[1500ms] ease-in-out" style={{ transform: `rotate(${activeWheelAngle}deg)` }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                {["P", "R", "N", "D"].map(g => (
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
            {step === 0 ? t.initialTitle : t.steps[step - 1].t}
          </h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">
            {step === 0 ? t.initialDesc : t.steps[step - 1].d}
          </p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button onClick={handleNext} disabled={isAnimating || step === 4} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === 4 ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
            {step === 0 ? (
              <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></>
            ) : step === 4 ? (
              <><Check className="w-3 h-3" /><span>{t.parked}</span></>
            ) : (
              <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
