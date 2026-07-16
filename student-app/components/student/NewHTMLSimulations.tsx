"use client"

import React, { useState, useEffect } from 'react'
import { RotateCcw, ArrowRight, Check, Play, Key } from 'lucide-react'
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
export const SideProfileInclineSVG = ({ speed = 0 }: { speed?: number }) => (
  <div className="relative w-[120px] h-[45px]">
    <svg width="120" height="45" viewBox="0 0 120 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl absolute inset-0">
      <rect x="15" y="10" width="90" height="22" rx="6" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
      <path d="M 30 10 L 45 2 L 75 2 L 90 10 Z" fill="#1e293b" />
      <circle cx="35" cy="32" r="8" fill="#0f172a" />
      <circle cx="85" cy="32" r="8" fill="#0f172a" />
    </svg>
  </div>
)

// Startup translations
const STARTUP_SIM_T = {
  EN: {
    telemetry: "Telemetry Status",
    begin: "Begin",
    next: "Next",
    rpm: "RPM",
    startup: {
      initialTitle: "Vehicle Pre-Flight",
      initialDesc: "Perform safety checks before ignition. Click 'Begin'.",
      engineOn: "Engine Started",
      steps: [
        { t: "1. Seatbelt Fastened", d: "Secure your seatbelt across your chest and lap." },
        { t: "2. Gear to Neutral", d: "Ensure the transmission is disengaged (Neutral)." },
        { t: "3. Depress Clutch", d: "Press the clutch pedal fully to the floor." },
        { t: "4. Ignition Crank", d: "Turn the key. Observe the tachometer sweep." }
      ]
    }
  },
  HI: {
    telemetry: "टेलीमेट्री स्थिति",
    begin: "शुरू करें",
    next: "अगला",
    rpm: "RPM",
    startup: {
      initialTitle: "वाहन प्री-फ्लाइट",
      initialDesc: "इग्निशन से पहले सुरक्षा जांच करें। 'शुरू करें' पर क्लिक करें।",
      engineOn: "इंजन चालू",
      steps: [
        { t: "1. सीटबेल्ट बंधा", d: "अपनी छाती और गोद में सीटबेल्ट सुरक्षित करें।" },
        { t: "2. न्यूट्रल गियर", d: "सुनिश्चित करें कि ट्रांसमिशन अलग हो गया है (न्यूट्रल)।" },
        { t: "3. क्लच दबाएं", d: "क्लच पेडल को पूरी तरह से फर्श तक दबाएं।" },
        { t: "4. इग्निशन क्रैंक", d: "चाबी घुमाएं। टैकोमीटर स्वीप देखें।" }
      ]
    }
  }
}

// ============================================================================
// 1. VEHICLE STARTUP SIMULATION
// ============================================================================
export const VehicleStartupSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = STARTUP_SIM_T[language] || STARTUP_SIM_T.EN
  const tMod = t.startup

  const [step, setStep] = useState(0)
  const [rpm, setRpm] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (isAnimating) return
    if (step < 4) {
      setIsAnimating(true)
      
      if (step === 3) {
        let currentRpm = 0
        const upInterval = setInterval(() => {
          currentRpm += 400
          if (currentRpm >= 2000) {
            clearInterval(upInterval)
            const downInterval = setInterval(() => {
              currentRpm -= 200
              if (currentRpm <= 800) { 
                clearInterval(downInterval)
                setRpm(800)
                setIsAnimating(false)
                if (onComplete) onComplete()
              } else setRpm(currentRpm)
            }, 50)
          } else setRpm(currentRpm)
        }, 50)
      } else {
        setTimeout(() => setIsAnimating(false), 800)
      }
      
      setStep(prev => prev + 1)
    }
  }

  const handleReset = () => {
    if (isAnimating) return
    setStep(0)
    setRpm(0)
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1e293b] overflow-hidden flex flex-col border-b border-white/5">
        
        {/* WINDSHIELD (Outside View) - Garage Scene */}
        <div className={`absolute top-0 left-0 right-0 h-[130px] transition-colors duration-1000 ${step >= 4 ? 'bg-slate-600' : 'bg-slate-800'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}>
          {/* Garage Wall texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')]" />
          {/* Overhead Garage Lights reflection */}
          <div className={`absolute top-0 left-1/4 right-1/4 h-8 bg-white/20 blur-xl transition-all duration-500 ${step >= 4 ? 'opacity-100 scale-110' : 'opacity-40'}`} />
          <div className="absolute top-4 left-[35%] w-[30%] h-1.5 bg-slate-100/40 rounded-full blur-[2px]" />
          {/* Windshield glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          {/* Wiper cowls */}
          <div className="absolute bottom-0 left-0 right-0 h-[30px] bg-[#1a1c20] origin-bottom" style={{ transform: 'perspective(500px) rotateX(60deg)' }} />
        </div>

        {/* DASHBOARD ARCH */}
        <div className="absolute top-[100px] left-[-12%] right-[-12%] h-[72px] bg-slate-800 rounded-t-[50%] shadow-[0_-8px_20px_rgba(0,0,0,0.6)] z-10 border-t border-slate-700" />

        {/* DASHBOARD BODY */}
        <div className="absolute top-[132px] left-0 right-0 bottom-0 bg-slate-900 z-10 flex"
             style={{ transform: isAnimating && step === 4 ? `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)` : 'none' }}>

          {/* ── LEFT 55%: Steering Wheel POV (see-through) ── */}
          <div className="relative w-[55%] h-full flex flex-col items-center">

            {/* Instrument Cluster (Illuminates on startup) */}
            <div className={`absolute top-[-14px] left-1/2 -translate-x-1/2 w-[230px] h-[84px] bg-black rounded-t-[42px] rounded-b-xl border-[3px] flex justify-between items-center px-3 z-20 shadow-inner transition-all duration-1000 ${step >= 4 ? 'border-primary/40 shadow-[0_0_30px_rgba(56,189,248,0.15)]' : 'border-slate-700'}`}>
              {/* RPM */}
              <div className={`w-[58px] h-[58px] rounded-full border-2 relative flex items-center justify-center transition-all duration-1000 ${step >= 4 ? 'border-primary/50 bg-blue-955/40 shadow-[0_0_15px_rgba(56,189,248,0.3)_inset]' : 'border-slate-800 bg-slate-950'}`}>
                <span className={`text-[8px] font-bold absolute top-2 transition-colors duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-700'}`}>{Math.round(rpm / 100)}</span>
                <div className="absolute bottom-1/2 left-1/2 w-[3px] h-[22px] origin-bottom rounded-full transition-all duration-75"
                  style={{ transform: `translateX(-50%) rotate(${-130 + (rpm / 8000) * 260}deg)`, backgroundColor: step >= 4 ? '#38bdf8' : '#64748b', boxShadow: step >= 4 ? '0 0 8px #38bdf8' : 'none' }} />
              </div>
              {/* MFD */}
              <div className={`flex flex-col items-center w-[52px] h-[52px] border rounded-lg justify-center gap-1 transition-all duration-1000 ${step >= 4 ? 'bg-blue-900/30 border-primary/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'bg-blue-950/20 border-blue-900/30'}`}>
                <div className="flex gap-1">
                  <div className={`w-[13px] h-[13px] rounded-full text-[5px] font-bold text-white flex items-center justify-center transition-all duration-500 ${step >= 1 ? 'bg-slate-700' : 'bg-red-500 shadow-[0_0_6px_red]'}`}>SB</div>
                  <div className={`w-[13px] h-[13px] rounded-full text-[5px] font-bold text-white flex items-center justify-center transition-all duration-500 ${step >= 4 ? 'bg-slate-700' : 'bg-amber-500 shadow-[0_0_6px_orange]'}`}>ENG</div>
                </div>
                <span className={`text-[8px] font-mono font-bold transition-all duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-600'}`}>0 <span className="text-[5px] opacity-50">km/h</span></span>
              </div>
              {/* Speed */}
              <div className={`w-[58px] h-[58px] rounded-full border-2 relative flex items-center justify-center transition-all duration-1000 ${step >= 4 ? 'border-primary/50 bg-blue-955/40 shadow-[0_0_15px_rgba(56,189,248,0.3)_inset]' : 'border-slate-800 bg-slate-950'}`}>
                <span className={`text-[8px] font-bold absolute top-2 transition-colors duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-700'}`}>0</span>
                <div className="absolute bottom-1/2 left-1/2 w-[3px] h-[22px] origin-bottom rounded-full transition-all duration-1000" style={{ transform: `translateX(-50%) rotate(-130deg)`, backgroundColor: step >= 4 ? '#38bdf8' : '#64748b', boxShadow: step >= 4 ? '0 0 8px #38bdf8' : 'none' }} />
              </div>
            </div>

            {/* STEERING WHEEL */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[185px] h-[185px] z-30" style={{ transform: 'translateX(-50%) perspective(350px) rotateX(12deg)' }}>
              {/* Column */}
              <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[44px] h-[90px] bg-slate-955 rounded-t-xl shadow-2xl" />
              {/* Ignition key beside column */}
              <div className="absolute top-[58%] left-[4px] w-[32px] h-[32px] bg-slate-955 rounded-full border-[3px] border-slate-700 flex items-center justify-center shadow-lg z-40" style={{ transform: 'perspective(100px)' }}>
                <div className={`relative w-[6px] h-[18px] rounded-sm transition-all duration-700 origin-center flex flex-col items-center ${step >= 4 ? 'rotate-90 bg-primary shadow-[0_0_10px_#38bdf8]' : 'bg-slate-400'}`}>
                  {/* Keychain hole */}
                  <div className="w-[3px] h-[3px] bg-slate-900 rounded-full mt-[1px]" />
                  {/* Dangling Keychain block */}
                  <div className={`absolute top-[100%] w-[12px] h-[26px] border-[2px] border-slate-500 rounded-b-md origin-top transition-transform duration-1000 ${step >= 4 ? 'rotate-[-90deg]' : 'rotate-0'}`}>
                    <div className="absolute bottom-0 w-full h-[14px] bg-slate-800 rounded-b-sm" />
                  </div>
                </div>
              </div>
              {/* Rim */}
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-888/80 shadow-[0_6px_20px_rgba(0,0,0,0.7)]" style={{ background: 'transparent' }}>
                {/* H-spoke */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[8px] bg-slate-800/70 rounded-full" />
                </div>
                {/* V-spoke bottom half */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[8px] h-[50%] bg-slate-800/70 rounded-full" />
                {/* Centre hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[44px] h-[44px] rounded-full border-[2px] border-slate-700/50 bg-slate-900/40 flex items-center justify-center">
                    <span className="text-slate-600 text-[7px] font-bold">HORN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PEDALS */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[170px] h-[80px] bg-black/70 rounded-t-[24px] flex items-end justify-center gap-5 pb-2 border-t-4 border-slate-800 z-20" style={{ transform: 'perspective(200px) rotateX(15deg)', transformOrigin: 'bottom' }}>
              <div className="flex flex-col items-center">
                <div className="relative flex justify-center">
                  {/* Pedal Arm */}
                  <div className="absolute bottom-full w-[4px] h-[20px] bg-slate-800 -z-10" />
                  {/* Pedal Pad */}
                  <div className={`w-[22px] bg-slate-600 rounded-sm border-b-[6px] border-slate-900 transition-all duration-500 shadow-[0_5px_10px_black] ${step >= 3 ? 'h-[24px] translate-y-[16px] rotate-x-[30deg]' : 'h-[42px]'}`} />
                </div>
                <span className="text-[8px] text-slate-500 mt-1 font-bold tracking-widest" style={{ transform: 'translateY(5px) rotateX(-15deg)' }}>C</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative flex justify-center">
                  <div className="absolute bottom-full w-[4px] h-[20px] bg-slate-800 -z-10" />
                  <div className="w-[30px] h-[40px] bg-slate-600 rounded-sm border-b-[6px] border-slate-900 shadow-[0_5px_10px_black]" />
                </div>
                <span className="text-[8px] text-slate-500 mt-1 font-bold tracking-widest" style={{ transform: 'translateY(5px) rotateX(-15deg)' }}>B</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative flex justify-center">
                  <div className="absolute bottom-full w-[4px] h-[20px] bg-slate-800 -z-10" />
                  <div className="w-[16px] h-[52px] bg-slate-600 rounded-sm border-b-[6px] border-slate-900 shadow-[0_5px_10px_black]" />
                </div>
                <span className="text-[8px] text-slate-500 mt-1 font-bold tracking-widest" style={{ transform: 'translateY(5px) rotateX(-15deg)' }}>G</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT 45%: Step Action Panels ── */}
          <div className="w-[45%] h-full flex flex-col gap-1.5 py-2 pr-3 z-20">

            {/* SEATBELT */}
            <div className={`flex-1 rounded-xl border-2 transition-all duration-500 flex items-center gap-2.5 px-2.5 ${step === 1 ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]' : step > 1 ? 'border-success/40 bg-success/5' : 'border-slate-700/60 bg-slate-900/50'}`}>
              <div className="relative w-[40px] h-[38px] flex-shrink-0">
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-[10px] h-[20px] bg-slate-700 rounded border border-slate-600">
                  <div className="mt-0.5 mx-0.5 h-[4px] bg-red-500 rounded-sm" />
                  <div className="mt-0.5 mx-0.5 h-[8px] bg-black rounded-sm" />
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[9px] bg-slate-400 border-y border-slate-300 rounded-r transition-all duration-700" style={{ width: step >= 1 ? '26px' : '0px' }}>
                  <div className="absolute right-[-3px] top-[-2px] w-[3px] h-[13px] bg-slate-200 rounded-sm" />
                </div>
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Seatbelt</p>
                <p className={`text-[10px] font-bold mt-0.5 ${step >= 1 ? 'text-success' : 'text-slate-500'}`}>{step >= 1 ? '✓ Fastened' : 'Not fastened'}</p>
              </div>
            </div>

            {/* GEAR */}
            <div className={`flex-1 rounded-xl border-2 transition-all duration-500 flex items-center gap-2.5 px-2.5 ${step === 2 ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]' : step > 2 ? 'border-success/40 bg-success/5' : 'border-slate-700/60 bg-slate-900/50'}`}>
              <div className="w-[28px] h-[62px] bg-black rounded-full border-2 border-slate-700 relative flex flex-col items-center py-1.5 justify-between flex-shrink-0 shadow-inner">
                <span className={`text-[8px] font-mono font-bold ${step < 2 ? 'text-white' : 'text-slate-600'}`}>P</span>
                <span className={`text-[8px] font-mono font-bold ${step >= 2 ? 'text-green-400 drop-shadow-[0_0_4px_#4ade80]' : 'text-slate-600'}`}>N</span>
                <span className="text-[8px] font-mono font-bold text-slate-600">D</span>
                <div className="absolute w-[20px] h-[20px] bg-gradient-to-b from-slate-300 to-slate-500 rounded-full border border-slate-400 transition-all duration-500 z-10 shadow-md" style={{ top: step >= 2 ? '50%' : '10%', transform: 'translateY(-50%)' }} />
                <div className="absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-[4px] bg-slate-800 rounded-full" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Gear</p>
                <p className={`text-[10px] font-bold mt-0.5 ${step >= 2 ? 'text-success' : 'text-slate-500'}`}>{step >= 2 ? '✓ Neutral (N)' : 'Park (P)'}</p>
              </div>
            </div>

            {/* CLUTCH */}
            <div className={`flex-1 rounded-xl border-2 transition-all duration-500 flex items-center gap-2.5 px-2.5 ${step === 3 ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]' : step > 3 ? 'border-success/40 bg-success/5' : 'border-slate-700/60 bg-slate-900/50'}`}>
              <div className="relative w-[18px] h-[48px] flex-shrink-0 flex items-end justify-center">
                <div className={`w-full bg-slate-600 rounded-sm border-b-[5px] border-slate-900 transition-all duration-500 origin-top ${step >= 3 ? 'h-[30px] translate-y-[8px]' : 'h-[44px]'}`} />
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Clutch Pedal</p>
                <p className={`text-[10px] font-bold mt-0.5 ${step >= 3 ? 'text-success' : 'text-slate-500'}`}>{step >= 3 ? '✓ Pressed down' : 'Released'}</p>
              </div>
            </div>

            {/* IGNITION */}
            <div className={`flex-1 rounded-xl border-2 transition-all duration-500 flex items-center gap-2.5 px-2.5 ${step === 4 ? 'border-primary bg-primary/10 shadow-[0_0_14px_rgba(56,189,248,0.3)]' : 'border-slate-700/60 bg-slate-900/50'}`}>
              <div className="relative w-[36px] h-[36px] rounded-full border-2 border-slate-700 bg-black flex items-center justify-center flex-shrink-0">
                <Key className={`w-[14px] h-[14px] transition-all duration-700 ${step >= 4 ? 'text-primary rotate-90 drop-shadow-[0_0_6px_#38bdf8]' : 'text-slate-500'}`} />
                {step >= 4 && <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping opacity-50" />}
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Ignition</p>
                <p className={`text-[10px] font-bold mt-0.5 ${step >= 4 ? 'text-primary' : 'text-slate-500'}`}>{step >= 4 ? '🔑 Engine ON!' : 'Off'}</p>
                {step >= 4 && <p className="text-[8px] text-primary/70 font-mono">{rpm} RPM</p>}
              </div>
            </div>
          </div>
        </div>

        {/* First-person seatbelt strap */}
        <div className="absolute z-50 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            top: '-100px', left: '-10px',
            width: step >= 1 ? '50px' : '0px',
            height: '500px',
            background: 'linear-gradient(to bottom, #475569 0%, #334155 100%)',
            borderRight: '2px solid #64748b',
            transform: 'rotate(-30deg)',
            transformOrigin: 'top left',
            opacity: step >= 1 ? 0.8 : 0,
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* BOTTOM CONTROLS PANE */}
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 relative z-50">
        <div className="flex items-center gap-3">
          <div className={`relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner transition-colors duration-1000 ${step === 4 ? 'text-primary border-primary/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'text-text-3'}`}>
            <Key className={`w-6 h-6 transition-transform duration-500 ${step === 4 ? 'rotate-90' : 'rotate-0'}`} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold font-mono text-text-1 w-10">{rpm} <span className="text-[9px] text-text-3">{t.rpm}</span></span>
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider mt-1">{t.telemetry}</span>
          </div>
        </div>
        <div className="flex-1 max-w-[280px]">
          <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">
            {step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}
          </h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">
            {step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}
          </p>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === 4 ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
            {step === 0 ? <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></> : step === 4 ? <><Check className="w-3 h-3" /><span>{tMod.engineOn}</span></> : <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. STEERING CONTROL SIMULATION
// ============================================================================
export const SteeringControlSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [carX, setCarX] = useState(20)
  const [carY, setCarY] = useState(151) // start: lower lane center
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Steer Left (Evasive)", d: "Turn wheel left (-25deg) to steer around first cone." },
    { t: "2. Counter-Steer Right", d: "Steer right (25deg) around the second cone to realign." },
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
        setWheelAngle(-25)
        setCarX(200)
        setCarY(61)   // upper lane
      } else if (nextStep === 2) {
        setWheelAngle(25)
        setCarX(360)
        setCarY(151)  // lower lane
      } else if (nextStep === 3) {
        setWheelAngle(0)
        setCarX(460)
        setCarY(151)  // lower lane straight
      } else if (nextStep === 4) {
        setSpeed(0)
        setCarX(520)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#2a2d3a] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            {/* Road */}
            <div className="absolute left-0 right-0 bg-[#374151] border-t-4 border-b-4 border-slate-500" style={{ top: '40px', bottom: '0px' }} />
            {/* Centre dashed lane divider */}
            <div className="absolute left-0 right-0 border-t-2 border-dashed border-white/30" style={{ top: '130px' }} />
            
            {/* Cones - staggered on opposite sides of path */}
            <div className="absolute w-5 h-7 bg-amber-500 rounded-t-md border-b-4 border-amber-700 z-10 animate-bounce" style={{ left: '220px', top: '155px', animationDuration: '2s' }} />
            <div className="absolute w-5 h-7 bg-amber-500 rounded-t-md border-b-4 border-amber-700 z-10 animate-bounce" style={{ left: '380px', top: '75px', animationDuration: '2.3s' }} />
            
            {/* Player Car */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle / 2}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={Math.max(step, 1)} showLights={true} activeGear="D" />
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
        desc={step === 0 ? "Steer through cones without hitting them. Press Begin." : steps[step - 1].d}
        isAnimating={isAnimating}
        onNext={handleNext}
        onReset={() => { setStep(0); setCarX(20); setCarY(151); setWheelAngle(0); setSpeed(0); }}
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
        setCarX(140)
      } else if (nextStep === 2) {
        setCarX(230)
      } else if (nextStep === 3) {
        setSpeed(15)
        setCarX(310)
      } else if (nextStep === 4) {
        setSpeed(0)
        setCarX(375) // Front of car (375 + 110 = 485px) stops completely before the white stop line at 500px!
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            
            {/* Horizontal Road - Driving on the Left (Bottom Lane is Left-to-Right) */}
            <div className="absolute top-[50px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 flex flex-col justify-center" />

            {/* Stop Line in Bottom Lane */}
            <div className="absolute left-[500px] top-[95px] bottom-[20px] w-3 bg-white" />
            
            {/* Player Car in Bottom Lane (driving left to right) */}
            <div className="absolute top-[98px] transition-all duration-[1000ms] ease-in-out" style={{ left: `${carX}px` }}>
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
  const [carY, setCarY] = useState(98)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Red car positions in the upper lane to keep a safe distance
  const redCarX = step === 0 ? 380 : step === 1 ? 440 : step === 2 ? 500 : step === 3 ? 560 : 620

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) {
        setCarX(180)
      } else if (nextStep === 2) {
        setWheelAngle(15) // Steer right into the right lane
        setCarX(320)
        setCarY(48)
      } else if (nextStep === 3) {
        setWheelAngle(0)
        setCarX(440)
        setCarY(48)
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
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[50px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-white/40" />
            </div>

            {/* Red Car ahead in upper lane */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${redCarX}px`, top: '48px' }}>
              <RealisticCarSVG colorClass="blue" step={1} showLights={true} activeGear="D" />
            </div>

            {/* Player Car changing lanes */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${wheelAngle}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" rightBlinker={step >= 1 && step < 4} />
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
        onReset={() => { setStep(0); setCarX(40); setCarY(98); setWheelAngle(0); }} 
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
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[50px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500" />
            <div className="absolute left-[500px] top-[50px] bottom-[20px] w-3 bg-white" />
            
            <div className="absolute left-[520px] top-[10px] w-8 h-20 bg-black border-2 border-slate-700 rounded flex flex-col items-center justify-around py-1">
              <div className={`w-4 h-4 rounded-full ${lightColor === 'red' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-red-950'}`} />
              <div className={`w-4 h-4 rounded-full ${lightColor === 'amber' ? 'bg-amber-500 shadow-[0_0_8px_orange]' : 'bg-amber-950'}`} />
              <div className={`w-4 h-4 rounded-full ${lightColor === 'green' ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-green-950'}`} />
            </div>

            <div className="absolute top-[70px] transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px` }}>
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
  const [carY, setCarY] = useState(110)
  const [speed, setSpeed] = useState(0)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Safe traffic cars coordinates (leading red car and trailing blue car on main highway)
  const redCarX = step === 0 ? 420 : step === 1 ? 490 : step === 2 ? 560 : 640
  const blueCarX = step === 0 ? 40 : step === 1 ? 100 : step === 2 ? 180 : step === 3 ? 260 : 340

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
        setWheelAngle(15) // Steer right into target highway lane
        setCarX(320)
        setCarY(60)
      } else if (nextStep === 3) {
        setWheelAngle(0)
        setCarX(450)
        setCarY(50)
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
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[50px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 shadow-inner" />
            
            {/* Red Car ahead in target highway lane */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${redCarX}px`, top: '50px' }}>
              <RealisticCarSVG colorClass="blue" step={1} showLights={true} activeGear="D" />
            </div>

            {/* Blue Car behind in target highway lane */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${blueCarX}px`, top: '50px' }}>
              <RealisticCarSVG colorClass="red" step={1} showLights={true} activeGear="D" />
            </div>

            {/* Player Car merging */}
            <div className="absolute transition-all duration-[1200ms] ease-in-out" style={{ left: `${carX}px`, top: `${carY}px`, transform: `rotate(${-wheelAngle}deg)` }}>
              <RealisticCarSVG colorClass="slate" step={step} showLights={true} activeGear="D" rightBlinker={step >= 2 && step < 4} />
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
        onReset={() => { setStep(0); setCarX(40); setCarY(110); setSpeed(0); setWheelAngle(0); }} 
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
  const [carY, setCarY] = useState(98)
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
        setCarY(48)
      } else if (nextStep === 2) {
        setWheelAngle(0)
        setSpeed(80)
        setCarX(320)
      } else if (nextStep === 3) {
        setWheelAngle(15)
        setCarX(460)
        setCarY(98)
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
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[50px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 shadow-inner" />
            
            {/* Cargo Truck */}
            <div className="absolute left-[240px] top-[90px] w-32 h-[45px] bg-blue-900 rounded border border-slate-600 flex items-center justify-center text-white text-[8px] font-bold">CARGO TRUCK</div>
            
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
        onReset={() => { setStep(0); setCarX(40); setCarY(98); setSpeed(50); setWheelAngle(0); }} 
        successText="Complete"
      />
    </div>
  )
}

// ============================================================================
// 13. EMERGENCY BRAKING SIMULATION (Correct RTO Travel Direction and Heights)
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
        setCarX(200)
      } else if (nextStep === 2) {
        setCarX(340)
      } else if (nextStep === 3) {
        setSpeed(0)
        setCarX(410)
        if (onComplete) onComplete()
      }
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#353839] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            
            {/* Horizontal Road - Driving on the Left (Bottom Lane is Left-to-Right) */}
            <div className="absolute top-[50px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500 flex flex-col justify-center" />
            
            {/* Obstacle/STOP Sign on Left (Bottom right side of road, positioned at Y=90px to prevent clipping) */}
            {step >= 2 && (
              <div className="absolute left-[470px] top-[90px] z-10 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded bg-red-600 border-2 border-white flex items-center justify-center animate-pulse shadow-lg">
                  <span className="text-white font-bold text-[10px]">STOP</span>
                </div>
              </div>
            )}

            {/* Player Car in Bottom Lane (driving left to right, shifted up to Y=98px to prevent clipping) */}
            <div className="absolute top-[98px] transition-all duration-[1000ms] ease-in-out" style={{ left: `${carX}px` }}>
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
  const [headlightsOn, setHeadlightsOn] = useState(false)
  const [wiperAngle, setWiperAngle] = useState(-55)
  const [isAnimating, setIsAnimating] = useState(false)

  // Wiper pendulum effect
  useEffect(() => {
    if (!wiperActive) { setWiperAngle(-55); return }
    let dir = 1
    const interval = setInterval(() => {
      setWiperAngle(prev => {
        const next = prev + dir * 10
        if (next >= 30) dir = -1
        if (next <= -55) dir = 1
        return next
      })
    }, 50)
    return () => clearInterval(interval)
  }, [wiperActive])

  const steps = [
    { t: "1. Rain Starts — Slow Down!", d: "Wet road surface has less traction. Safely decelerate to 30 km/h." },
    { t: "2. Activate Windshield Wipers", d: "Turn wipers to high speed to clear rain stream lines." },
    { t: "3. Turn On Headlights", d: "Activate low-beam headlights to enhance target visibility." },
    { t: "4. Increase Safety Gap", d: "Allow double the typical following distance for hydroplaning safety." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) { setSpeed(30) }
      else if (nextStep === 2) { setWiperActive(true) }
      else if (nextStep === 3) { setHeadlightsOn(true) }
      else if (nextStep === 4) { if (onComplete) onComplete() }
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  // rain drops overlay inside windshield path
  const rainDrops = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: (i * 18 + 7) % 460,
    delay: (i * 0.12) % 1.2,
    dur: 0.35 + (i % 3) * 0.1,
    len: 8 + (i % 3) * 3
  }))

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#0d1424] overflow-hidden flex flex-col border-b border-white/5">
        <ScaledCanvas canvasWidth={500}>
          <div className="w-[500px] h-[220px] relative">
            {/* 1. Windshield View (Perspective Road Ahead) */}
            <div className="absolute top-0 left-[20px] right-[20px] h-[130px] overflow-hidden bg-slate-900 border-b-2 border-slate-700" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' }}>
              <div className="absolute inset-0 bg-[#0f172a]" />
              
              {/* Wet Perspective Road Surface */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 460 130" fill="none">
                <polygon points="180,0 280,0 420,130 40,130" fill="#1e293b" />
                <polygon points="180,0 280,0 420,130 40,130" fill={step >= 3 ? 'rgba(254,249,195,0.06)' : 'rgba(255,255,255,0.01)'} />
                <polygon points="228,0 232,0 240,130 220,130" fill="white" opacity="0.15" />
                <line x1="230" y1="0" x2="230" y2="130" stroke="#475569" strokeWidth="2" strokeDasharray="10 8" />

                {/* Lead car ahead (gets further away at step 4) */}
                <g transform={`translate(${210} ${step >= 4 ? 25 : 55}) scale(${step >= 4 ? 0.35 : 0.6})`}>
                  <rect x="0" y="10" width="70" height="35" rx="6" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
                  <rect x="10" y="1" width="50" height="15" rx="3" fill="#0f172a" />
                  <circle cx="10" cy="20" r="5" fill="#f87171" className="animate-pulse" />
                  <circle cx="60" cy="20" r="5" fill="#f87171" className="animate-pulse" />
                </g>
              </svg>

              {/* Rain Drops falling inside windshield area */}
              {step >= 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 130">
                  {rainDrops.map(drop => (
                    <line
                      key={drop.id}
                      x1={drop.x} y1="0"
                      x2={drop.x - 2} y2={drop.len}
                      stroke="rgba(147,197,253,0.4)"
                      strokeWidth="1.2"
                      style={{
                        animationName: 'rainFall',
                        animationDuration: `${drop.dur}s`,
                        animationDelay: `${drop.delay}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear'
                      }}
                    />
                  ))}
                </svg>
              )}

              {/* Windshield Wiper Overlay */}
              {wiperActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 460 130">
                    <line
                      x1="120" y1="130"
                      x2={120 + 90 * Math.cos((wiperAngle * Math.PI) / 180)}
                      y2={130 + 90 * Math.sin((wiperAngle * Math.PI) / 180)}
                      stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"
                    />
                    <line
                      x1="340" y1="130"
                      x2={340 - 90 * Math.cos((wiperAngle * Math.PI) / 180)}
                      y2={130 + 90 * Math.sin((wiperAngle * Math.PI) / 180)}
                      stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* 2. Dashboard Arch & Body */}
            <div className="absolute top-[110px] left-0 right-0 h-[30px] bg-slate-800 rounded-t-[50%] z-10 border-t border-slate-700 shadow-lg" />
            <div className="absolute top-[125px] left-0 right-0 bottom-0 bg-slate-900 z-10 p-2 flex justify-between items-center px-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[7px] text-slate-500 font-mono">SPEED</span>
                  <span className="text-xs font-bold font-mono text-white">{step === 0 ? '50' : speed} <span className="text-[8px] text-slate-400">km/h</span></span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[7px] text-slate-500 font-mono">RPM</span>
                  <span className="text-xs font-bold font-mono text-white">{step === 0 ? '2100' : wiperActive ? '1600' : '1200'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-[8px] ${headlightsOn ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-700'}`}>💡</div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-[8px] ${wiperActive ? 'bg-blue-500/20 border-blue-400 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-700'}`}>🌧</div>
              </div>
            </div>
          </div>
        </ScaledCanvas>
        <style>{`
          @keyframes rainFall { 0% { transform: translateY(-20px); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(150px); opacity: 0.6; } }
        `}</style>
      </div>
      <TelemetryBar
        speed={step === 0 ? 50 : speed}
        activeGear="D"
        activeWheelAngle={0}
        step={step}
        title={step === 0 ? "Rain Driving Protocol" : steps[step - 1].t}
        desc={step === 0 ? "Heavy rain storm detected! Check dashboard and follow protocol. Press Begin." : steps[step - 1].d}
        isAnimating={isAnimating}
        onNext={handleNext}
        onReset={() => { setStep(0); setSpeed(0); setWiperActive(false); setHeadlightsOn(false); }}
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
  const [lowBeamOn, setLowBeamOn] = useState(false)
  const [highBeamGlare, setHighBeamGlare] = useState(false)
  const [dipped, setDipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Switch On Low Beams", d: "Always switch low-beam headlights on immediately in low light." },
    { t: "2. Safe Cruising Speed", d: "Set speed to a safe night limit of 40 km/h." },
    { t: "3. Oncoming High Beam Glare!", d: "An oncoming car has high-beams active. Do NOT stare into the glare!" },
    { t: "4. Dip Lights & Look Left Edge", d: "Flash beams, then focus on left edge line markers to avoid blindness." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 1) { setLowBeamOn(true); setSpeed(40) }
      else if (nextStep === 2) { setSpeed(40) }
      else if (nextStep === 3) { setHighBeamGlare(true) }
      else if (nextStep === 4) { setDipped(true); setHighBeamGlare(false); if (onComplete) onComplete() }
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#020512] overflow-hidden flex flex-col border-b border-white/5">
        <ScaledCanvas canvasWidth={500}>
          <div className="w-[500px] h-[220px] relative">
            {/* 1. Windshield View (Outside Dark Road) */}
            <div className="absolute top-0 left-[20px] right-[20px] h-[130px] overflow-hidden bg-[#02040a] border-b-2 border-slate-800" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' }}>
              {/* Star fields */}
              {[{x:50,y:10},{x:150,y:6},{x:240,y:18},{x:330,y:12},{x:410,y:8}].map((s,i) => (
                <div key={i} className="absolute w-0.5 h-0.5 bg-white/70 rounded-full" style={{ left: s.x, top: s.y }} />
              ))}

              {/* Pitch black road surface */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 460 130" fill="none">
                <polygon points="180,0 280,0 420,130 40,130" fill="#0f172a" />
                
                {/* Cats eye reflectors on lane boundaries */}
                {[20, 50, 80, 110].map((y, idx) => {
                  const xLeft = 180 - (y / 130) * 140
                  const xRight = 280 + (y / 130) * 140
                  return (
                    <g key={idx}>
                      <circle cx={xLeft} cy={y} r="1.5" fill="#f59e0b" opacity="0.6" />
                      <circle cx={xRight} cy={y} r="1.5" fill="#ef4444" opacity="0.6" />
                    </g>
                  )
                })}

                {/* Headlight beam illuminated path */}
                {lowBeamOn && (
                  <polygon points="180,0 280,0 420,130 40,130" fill="rgba(254,249,195,0.08)" />
                )}

                {/* Left lane markers guide line (useful in step 4) */}
                {dipped && (
                  <path d="M 120 130 L 195 0" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                )}
              </svg>

              {/* Oncoming car with glaring high beams */}
              {step >= 3 && (
                <g className="absolute" style={{ right: '40px', top: '15px' }}>
                  <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                    <circle cx="15" cy="20" r="5" fill="#fff" filter="drop-shadow(0 0 10px #fef08a)" />
                    <circle cx="45" cy="20" r="5" fill="#fff" filter="drop-shadow(0 0 10px #fef08a)" />
                  </svg>
                </g>
              )}

              {/* Glare overlay on windshield */}
              {highBeamGlare && (
                <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 30%, rgba(254,240,138,0.3) 0%, transparent 60%)' }} />
              )}
            </div>

            {/* 2. Dashboard Arch & Controls */}
            <div className="absolute top-[110px] left-0 right-0 h-[30px] bg-slate-800 rounded-t-[50%] z-10 border-t border-slate-700 shadow-md" />
            <div className="absolute top-[125px] left-0 right-0 bottom-0 bg-slate-900 z-10 p-2 flex justify-between items-center px-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[7px] text-slate-500 font-mono">SPEED</span>
                  <span className="text-xs font-bold font-mono text-white">{speed} <span className="text-[8px] text-slate-400">km/h</span></span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[7px] text-slate-500 font-mono">BEAM</span>
                  <span className={`text-[10px] font-bold font-mono ${dipped ? 'text-green-400' : lowBeamOn ? 'text-blue-400' : 'text-slate-500'}`}>
                    {dipped ? 'DIPPED' : lowBeamOn ? 'LOW' : 'OFF'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {step >= 3 && !dipped && (
                  <div className="px-2 py-1 rounded text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse font-mono font-bold">
                    GLARE BLINDING!
                  </div>
                )}
                {dipped && (
                  <div className="px-2 py-1 rounded text-[8px] bg-green-500/20 text-green-400 border border-green-500/30 font-mono font-bold">
                    LOOK LEFT GUIDE LINE
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar
        speed={speed}
        activeGear="D"
        activeWheelAngle={0}
        step={step}
        title={step === 0 ? "Night Cabin Approach" : steps[step - 1].t}
        desc={step === 0 ? "Prepare cabin lights and prepare to drive under dark conditions. Press Begin." : steps[step - 1].d}
        isAnimating={isAnimating}
        onNext={handleNext}
        onReset={() => { setStep(0); setSpeed(0); setLowBeamOn(false); setHighBeamGlare(false); setDipped(false); }}
        successText="Cleared"
      />
    </div>
  )
}

// ============================================================================
// 16. ROUNDABOUT NAVIGATION SIMULATION
// ============================================================================
export const RoundaboutSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Clockwise roundabout navigation for driving on left (India): Bottom Entry -> Bottom-Left -> Left -> Top-Left -> Exit Right
  const positions = [
    { x: 220, y: 245, r: 0,   label: 'Entry — Waiting to Enter' },
    { x: 185, y: 195, r: -45,  label: 'Entering Clockwise' },
    { x: 105, y: 140, r: 0,   label: 'Navigating Left Arc' },
    { x: 175, y: 65,  r: 45,  label: 'Passing Top Section' },
    { x: 350, y: 120, r: 90,  label: 'Exiting Roundabout' },
  ]

  const steps = [
    { t: "1. Enter & Yield", d: "Give way to traffic already in roundabout. Enter LEFT lane." },
    { t: "2. Navigate Left Arc", d: "Keep left, steer through the left bend of the roundabout." },
    { t: "3. Pass the Top", d: "Continue through the top section, maintain speed." },
    { t: "4. Signal & Exit Right", d: "Signal LEFT when at your exit, steer right to leave the roundabout." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 4 && onComplete) onComplete()
      setTimeout(() => setIsAnimating(false), 1200)
    }
  }

  const pos = positions[step]

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={500}>
          <div className="w-[500px] h-full relative" style={{ minHeight: '280px' }}>
            <svg className="absolute inset-0" width="500" height="280" viewBox="0 0 500 280" fill="none">
              <rect width="500" height="280" fill="#1b2230" />
              {/* Entry road from bottom */}
              <rect x="205" y="210" width="90" height="70" fill="#374151" />
              <line x1="250" y1="210" x2="250" y2="280" stroke="white" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4" />
              {/* Exit road to right */}
              <rect x="310" y="95" width="190" height="90" fill="#374151" />
              <line x1="310" y1="140" x2="500" y2="140" stroke="white" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4" />
              
              {/* Circular road: outer ring */}
              <circle cx="250" cy="140" r="190" fill="#374151" stroke="#64748b" strokeWidth="4" />
              {/* Center island (green) */}
              <circle cx="250" cy="140" r="100" fill="#1e3a2a" stroke="#64748b" strokeWidth="3" />
              <circle cx="250" cy="140" r="30" fill="#2d5a3d" />
              
              {/* Dashed lane divider inside ring */}
              <circle cx="250" cy="140" r="145" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="12 10" opacity="0.35" />
              
              {/* Entry / Exit border lines */}
              <line x1="205" y1="210" x2="205" y2="280" stroke="#64748b" strokeWidth="3" />
              <line x1="295" y1="210" x2="295" y2="280" stroke="#64748b" strokeWidth="3" />
              <line x1="310" y1="95" x2="500" y2="95" stroke="#64748b" strokeWidth="3" />
              <line x1="310" y1="185" x2="500" y2="185" stroke="#64748b" strokeWidth="3" />
              
              {/* Yield triangle at entry */}
              <polygon points="230,215 250,202 270,215" fill="#ef4444" opacity="0.8" />
              <text x="250" y="225" fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle">YIELD</text>
            </svg>
            
            {/* Car navigating roundabout - scaled 0.75 */}
            <div
              className="absolute transition-all duration-[1200ms] ease-in-out"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: `rotate(${pos.r}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <div className="scale-75 origin-center">
                <RealisticCarSVG
                  colorClass="slate"
                  step={Math.max(step, 1)}
                  showLights={true}
                  activeGear="D"
                  rightBlinker={step === 4}
                />
              </div>
            </div>
            
            <div className="absolute left-2 top-2 px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {pos.label}
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <TelemetryBar
        speed={step === 0 ? 0 : 25}
        activeGear={step === 0 ? "P" : "D"}
        activeWheelAngle={step === 1 ? -15 : step === 2 ? -15 : step === 3 ? -15 : 0}
        step={step}
        title={step === 0 ? "Roundabout Entry" : steps[step - 1].t}
        desc={step === 0 ? "Approach the roundabout. YIELD to traffic inside. Press Begin." : steps[step - 1].d}
        isAnimating={isAnimating}
        onNext={handleNext}
        onReset={() => { setStep(0); }}
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
          <div className="w-[600px] h-full relative" style={{ minHeight: '220px' }}>
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute left-[80px] top-0 bottom-0 w-6 bg-slate-500 shadow" />
            <div className="absolute top-[80px] transition-all duration-[1000ms] ease-in-out" style={{ left: `${carX}px` }}>
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
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { t: "1. Know Your Blind Zones", d: "Red zones are blind spots — mirrors don't cover these areas!" },
    { t: "2. Check Rear-View Mirror", d: "Rear mirror shows what's directly behind. Not the sides." },
    { t: "3. Turn Head to Check Blind Spot", d: "Turn your head physically to see into the red blind zone." },
    { t: "4. Safe to Change Lane!", d: "Blind spot verified clear. Signal and proceed." }
  ]

  const handleNext = () => {
    if (step < 4) {
      setIsAnimating(true)
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep === 4 && onComplete) onComplete()
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={500}>
          <div className="w-[500px] h-full relative" style={{ minHeight: '260px' }}>
            <svg className="absolute inset-0" width="500" height="260" viewBox="0 0 500 260" fill="none">
              <rect width="500" height="260" fill="#1b2230" />
              <rect x="0" y="60" width="500" height="140" fill="#374151" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#64748b" strokeWidth="3" />
              <line x1="0" y1="200" x2="500" y2="200" stroke="#64748b" strokeWidth="3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="white" strokeWidth="1.5" strokeDasharray="20 15" opacity="0.35" />
              <text x="40" y="105" fill="white" fontSize="16" opacity="0.15" textAnchor="middle">→</text>
              <text x="40" y="175" fill="white" fontSize="16" opacity="0.15" textAnchor="middle">→</text>
              <text x="460" y="105" fill="white" fontSize="16" opacity="0.15" textAnchor="middle">→</text>
              <text x="460" y="175" fill="white" fontSize="16" opacity="0.15" textAnchor="middle">→</text>

              {/* Left rear blind zone */}
              <ellipse cx="155" cy="148" rx="80" ry="40"
                fill={step === 0 || step === 1 ? 'rgba(239,68,68,0.25)' : step === 2 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}
                stroke={step >= 3 ? '#22c55e' : '#ef4444'}
                strokeWidth="1.5" strokeDasharray="5 4"
              />
              {/* Right rear blind zone */}
              <ellipse cx="155" cy="88" rx="80" ry="40"
                fill={step === 0 || step === 1 ? 'rgba(239,68,68,0.25)' : step === 2 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}
                stroke={step >= 3 ? '#22c55e' : '#ef4444'}
                strokeWidth="1.5" strokeDasharray="5 4"
              />
              
              {step === 0 && (
                <>
                  <text x="130" y="152" fill="#fca5a5" fontSize="9" textAnchor="middle" fontFamily="monospace">BLIND ZONE</text>
                  <text x="130" y="92" fill="#fca5a5" fontSize="9" textAnchor="middle" fontFamily="monospace">BLIND ZONE</text>
                </>
              )}
              {step >= 3 && (
                <>
                  <text x="130" y="152" fill="#86efac" fontSize="9" textAnchor="middle" fontFamily="monospace">CLEAR ✓</text>
                  <text x="130" y="92" fill="#86efac" fontSize="9" textAnchor="middle" fontFamily="monospace">CLEAR ✓</text>
                </>
              )}

              {/* Mirror cone */}
              <ellipse cx="190" cy="130" rx="100" ry="32"
                fill="rgba(59,130,246,0.10)"
                stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 5"
              />
              {step >= 2 && (
                <text x="195" y="133" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace">MIRROR VISIBLE</text>
              )}

              {/* Traffic Cars */}
              {step >= 1 && (
                <g transform="translate(100, 68) rotate(0)">
                  <rect x="0" y="0" width="70" height="30" rx="8" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                  <rect x="18" y="3" width="20" height="24" rx="3" fill="rgba(0,0,0,0.2)" />
                  <rect x="65" y="4" width="4" height="8" rx="1" fill="#fef08a" />
                  <rect x="65" y="18" width="4" height="8" rx="1" fill="#fef08a" />
                  {step <= 2 && <text x="35" y="-6" fill="#fca5a5" fontSize="7" textAnchor="middle" fontFamily="monospace">HIDDEN</text>}
                  {step >= 3 && <text x="35" y="-6" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">VISIBLE ✓</text>}
                </g>
              )}
              {step >= 1 && (
                <g transform="translate(85, 148) rotate(0)">
                  <rect x="0" y="0" width="70" height="30" rx="8" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
                  <rect x="18" y="3" width="20" height="24" rx="3" fill="rgba(0,0,0,0.2)" />
                  <rect x="65" y="4" width="4" height="8" rx="1" fill="#fef08a" />
                  <rect x="65" y="18" width="4" height="8" rx="1" fill="#fef08a" />
                  {step <= 2 && <text x="35" y="-6" fill="#fca5a5" fontSize="7" textAnchor="middle" fontFamily="monospace">IN BLIND SPOT</text>}
                  {step >= 3 && <text x="35" y="-6" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">SEEN ✓</text>}
                </g>
              )}

              {/* Player Car */}
              <g transform="translate(290, 105)">
                <rect x="0" y="0" width="110" height="48" rx="14" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                <rect x="28" y="4" width="32" height="40" rx="4" fill="rgba(0,0,0,0.25)" />
                <rect x="105" y="6" width="4" height="12" rx="1" fill="#fef08a" />
                <rect x="105" y="30" width="4" height="12" rx="1" fill="#fef08a" />
                <rect x="1" y="6" width="4" height="12" rx="1" fill="#ef4444" />
                <rect x="1" y="30" width="4" height="12" rx="1" fill="#ef4444" />
                <text x="55" y="28" fill="white" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">YOU</text>
                {step === 3 && <rect x="105" y="6" width="5" height="12" rx="1" fill="#fbbf24" opacity="0.9" />}
              </g>

              {/* Head turn indicator */}
              {step === 3 && (
                <g transform="translate(295, 125)">
                  <path d="M -15 0 Q -25 -15 -30 0" stroke="#fbbf24" strokeWidth="2" fill="none" markerEnd="url(#arrowY)" />
                  <text x="-50" y="-15" fill="#fbbf24" fontSize="8" fontFamily="monospace">HEAD TURN</text>
                  <defs>
                    <marker id="arrowY" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
                    </marker>
                  </defs>
                </g>
              )}
            </svg>

            <div className="absolute flex gap-2" style={{ left: '8px', top: '8px' }}>
              <div className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono border ${step >= 3 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {step >= 3 ? '✓ BLIND SPOTS CLEAR' : '⚠ BLIND SPOTS ACTIVE'}
              </div>
            </div>
          </div>
        </ScaledCanvas>
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
        onReset={() => { setStep(0); }} 
        successText="Cleared"
      />
    </div>
  )
}

// Re-export original high-fidelity simulations
export { ParallelParkingSimulation } from './ParallelParkingSimulation'
export { ReverseBayParkingSimulation } from './ReverseBayParkingSimulation'
export { ThreePointTurnSimulation } from './DynamicHTMLSimulations'
