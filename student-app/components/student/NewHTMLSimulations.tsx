"use client"

import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, ArrowRight, Check, Play, ShieldAlert, AlertTriangle, Key } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { motion, AnimatePresence } from 'framer-motion'

/* ScaledCanvas: fits a fixed-width inner canvas into any container width */
export const ScaledCanvas = ({ canvasWidth = 700, children }: { canvasWidth?: number; children: React.ReactNode }) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!outerRef.current) return
    const update = () => {
      const w = outerRef.current?.clientWidth ?? canvasWidth
      setScale(Math.min(1, w / canvasWidth))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(outerRef.current)
    return () => ro.disconnect()
  }, [canvasWidth])

  return (
    <div ref={outerRef} className="w-full h-full overflow-hidden relative flex items-start justify-center">
      <div
        style={{
          width: `${canvasWidth}px`,
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          flexShrink: 0,
          height: `${100 / scale}%`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export interface SimulationProps {
  onComplete?: () => void
}

/* ============================================================================
   TRANSLATION DICTIONARY
   ============================================================================ */
const SIM_T = {
  EN: {
    telemetry: "Telemetry Status",
    begin: "Begin",
    next: "Next",
    kmh: "km/h",
    rpm: "RPM",
    meters: "m",
    complete: "Complete",
    success: "Success",
    passed: "Passed",
    failed: "Failed",
    reset: "Reset",
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
    },
    steering: {
      initialTitle: "Slalom Approach",
      initialDesc: "Prepare to weave through cones. Click 'Begin'.",
      passed: "Passed",
      steps: [
        { t: "1. Approach First Cone", d: "Accelerate smoothly and approach the obstacle." },
        { t: "2. Steer Left (Evasive)", d: "Turn the steering wheel left to bypass the cone." },
        { t: "3. Steer Right (Recovery)", d: "Counter-steer right to return to your path." },
        { t: "4. Straighten & Halt", d: "Straighten the steering wheel and apply brakes." }
      ]
    },
    clutch: {
      initialTitle: "Incline Setup",
      initialDesc: "Prepare for a hill start. Click 'Begin'.",
      success: "Success",
      steps: [
        { t: "1. Handbrake Engaged", d: "Handbrake is pulled to prevent rolling backwards." },
        { t: "2. Set the Gas", d: "Apply gentle pressure to raise the engine to ~1500 RPM." },
        { t: "3. Find the Bite Point", d: "Release clutch slowly until RPM dips and car tugs forward." },
        { t: "4. Release & Accelerate", d: "Drop the handbrake and smoothly accelerate up the hill." }
      ]
    },
    merge: {
      initialTitle: "Slip Road Entry",
      initialDesc: "Prepare to merge onto the highway. Click 'Begin'.",
      merged: "Merged Safely",
      steps: [
        { t: "1. Build Momentum", d: "Accelerate rapidly on the slip road to match highway traffic." },
        { t: "2. Check Mirrors & Signal", d: "Activate right indicator and check the right side mirror." },
        { t: "3. Merge Right", d: "Steer smoothly into the left lane of the highway." },
        { t: "4. Establish Lane", d: "Straighten up and maintain highway cruising speed." }
      ]
    }
  },
  HI: {
    telemetry: "टेलीमेट्री स्थिति",
    begin: "शुरू करें",
    next: "अगला",
    kmh: "किमी/घं",
    rpm: "RPM",
    meters: "मीटर",
    complete: "पूर्ण",
    success: "सफल",
    passed: "उत्तीर्ण",
    failed: "असफल",
    reset: "रीसेट",
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
    },
    steering: {
      initialTitle: "स्लैलम एप्रोच",
      initialDesc: "शंकु के माध्यम से बुनाई के लिए तैयार करें। 'शुरू करें' पर क्लिक करें।",
      passed: "उत्तीर्ण",
      steps: [
        { t: "1. पहले शंकु के पास जाएं", d: "आसानी से गति बढ़ाएं और बाधा के पास पहुंचें।" },
        { t: "2. बाएँ मुड़ें (बचाव)", d: "शंकु को बायपास करने के लिए स्टीयरिंग व्हील को बाएँ घुमाएँ।" },
        { t: "3. दाएँ मुड़ें (रिकवरी)", d: "अपने रास्ते पर लौटने के लिए काउंटर-स्टीयर दाएँ करें।" },
        { t: "4. सीधा करें और रुकें", d: "स्टीयरिंग व्हील को सीधा करें और ब्रेक लगाएं।" }
      ]
    },
    clutch: {
      initialTitle: "इन्क्लाइन सेटअप",
      initialDesc: "हिल स्टार्ट के लिए तैयारी करें। 'शुरू करें' पर क्लिक करें।",
      success: "सफल",
      steps: [
        { t: "1. हैंडब्रेक लगा हुआ", d: "पीछे लुढ़कने से रोकने के लिए हैंडब्रेक खींचा गया है।" },
        { t: "2. गैस सेट करें", d: "इंजन को ~1500 RPM तक बढ़ाने के लिए हल्का दबाव डालें।" },
        { t: "3. बाइट पॉइंट खोजें", d: "क्लच को धीरे-धीरे छोड़ें जब तक कि RPM गिर न जाए।" },
        { t: "4. छोड़ें और गति बढ़ाएं", d: "हैंडब्रेक छोड़ें और पहाड़ी पर आसानी से गति बढ़ाएं।" }
      ]
    },
    merge: {
      initialTitle: "स्लिप रोड एंट्री",
      initialDesc: "राजमार्ग पर विलय करने की तैयारी करें। 'शुरू करें' पर क्लिक करें।",
      merged: "सुरक्षित रूप से मर्ज किया गया",
      steps: [
        { t: "1. गति बढ़ाएं", d: "राजमार्ग यातायात से मेल खाने के लिए स्लिप रोड पर तेजी से गति बढ़ाएं।" },
        { t: "2. शीशे जांचें और संकेत", d: "दायां संकेतक सक्रिय करें और दायां साइड मिरर जांचें।" },
        { t: "3. दाईं ओर मर्ज करें", d: "राजमार्ग के बाएँ लेन में आसानी से मुड़ें।" },
        { t: "4. लेन स्थापित करें", d: "सीधा करें और राजमार्ग क्रूज़िंग गति बनाए रखें।" }
      ]
    }
  },
  TE: {
    telemetry: "టెలిమెట్రీ",
    begin: "ప్రారంభించండి",
    next: "తదుపరి",
    kmh: "కిమీ/గం",
    rpm: "RPM",
    meters: "మీటర్లు",
    complete: "పూర్తయింది",
    success: "విజయం",
    passed: "పాస్",
    failed: "ఫెయిల్",
    reset: "రీసెట్",
    startup: {
      initialTitle: "వాహనం ప్రీ-ఫ్లైట్",
      initialDesc: "ఇగ్నిషన్‌కు ముందు భద్రతా తనిఖీలు. 'ప్రారంభించండి' క్లిక్ చేయండి.",
      engineOn: "ఇంజిన్ ప్రారంభమైంది",
      steps: [
        { t: "1. సీట్‌బెల్ట్", d: "మీ సీట్‌బెల్ట్‌ను సురక్షితంగా కట్టుకోండి." },
        { t: "2. గేర్ న్యూట్రల్", d: "ట్రాన్స్‌మిషన్ న్యూట్రల్‌లో ఉందని నిర్ధారించుకోండి." },
        { t: "3. క్లచ్ నొక్కండి", d: "క్లచ్ పెడల్‌ను పూర్తిగా ఫ్లోర్‌కు నొక్కండి." },
        { t: "4. ఇగ్నిషన్", d: "కీని తిప్పండి. టాకోమీటర్ స్వీప్‌ను గమనించండి." }
      ]
    },
    steering: {
      initialTitle: "స్లాలమ్ అప్రోచ్",
      initialDesc: "కోన్‌ల ద్వారా వెళ్ళడానికి సిద్ధం. 'ప్రారంభించండి' క్లిక్ చేయండి.",
      passed: "పాస్ చేయబడింది",
      steps: [
        { t: "1. మొదటి కోన్", d: "సున్నితంగా వేగవంతం చేసి అడ్డంకిని చేరుకోండి." },
        { t: "2. ఎడమవైపు స్టీర్ (ఎవేసివ్)", d: "కోన్‌ను దాటవేయడానికి స్టీరింగ్ వీల్‌ను ఎడమవైపుకు తిప్పండి." },
        { t: "3. కుడివైపు స్టీర్", d: "మీ మార్గానికి తిరిగి రావడానికి కుడివైపుకు కౌంటర్-స్టీర్ చేయండి." },
        { t: "4. స్ట్రెయిటెన్ & హాల్ట్", d: "స్టీరింగ్ వీల్‌ను నేరుగా చేసి బ్రేక్‌లు వేయండి." }
      ]
    },
    clutch: {
      initialTitle: "ఇన్‌క్లైన్ సెటప్",
      initialDesc: "హిల్ స్టార్ట్ కోసం సిద్ధం. 'ప్రారంభించండి' క్లిక్ చేయండి.",
      success: "విజయం",
      steps: [
        { t: "1. హ్యాండ్‌బ్రేక్", d: "వెనుకకు రోల్ అవ్వకుండా హ్యాండ్‌బ్రేక్ లాగబడింది." },
        { t: "2. గ్యాస్", d: "ఇంజిన్‌ను ~1500 RPM కు పెంచడానికి తేలికపాటి ఒత్తిడిని వర్తించండి." },
        { t: "3. బైట్ పాయింట్", d: "కారు లాగే వరకు క్లచ్‌ను నెమ్మదిగా వదలండి." },
        { t: "4. వదిలి వెళ్ళండి", d: "హ్యాండ్‌బ్రేక్‌ను వదిలి కొండపై సున్నితంగా వేగవంతం చేయండి." }
      ]
    },
    merge: {
      initialTitle: "స్లిప్ రోడ్ ఎంట్రీ",
      initialDesc: "హైవేలో విలీనం కావడానికి సిద్ధం. 'ప్రారంభించండి' క్లిక్ చేయండి.",
      merged: "విలీనం చేయబడింది",
      steps: [
        { t: "1. మొమెంటం", d: "హైవే ట్రాఫిక్‌కు సరిపోయేలా స్లిప్ రోడ్‌లో వేగం పెంచండి." },
        { t: "2. అద్దాలు & సిగ్నల్", d: "కుడి ఇండికేటర్‌ను ఆన్ చేసి కుడి అద్దాన్ని తనిఖీ చేయండి." },
        { t: "3. కుడివైపు విలీనం", d: "హైవే యొక్క ఎడమ లేన్‌లోకి సున్నితంగా స్టీర్ చేయండి." },
        { t: "4. లేన్ స్థిరపరచండి", d: "నేరుగా చేసి హైవే వేగాన్ని కొనసాగించండి." }
      ]
    }
  }
}

// ============================================================================
// VEHICLE RENDERING HELPERS
// ============================================================================

export const RealisticCarSVG = ({ colorClass, showLights = false, activeGear = 'D', rightBlinker = false, leftBlinker = false, step = 0 }: { colorClass: string, showLights?: boolean, activeGear?: string, rightBlinker?: boolean, leftBlinker?: boolean, step?: number }) => {
  let hex = '#cbd5e1'
  if (colorClass.includes('red')) hex = '#ef4444'
  if (colorClass.includes('blue')) hex = '#3b82f6'

  const isReverse = activeGear === 'R'
  const isStarted = step > 0

  return (
    <div className="relative" style={{ width: '110px', height: '48px' }}>
      <svg width="110" height="48" viewBox="0 0 110 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl absolute inset-0">
        <rect x="2" y="2" width="106" height="44" rx="14" fill={hex} stroke="#1e293b" strokeWidth="1.5" />
        <path d="M 80 4 L 105 8 L 105 40 L 80 44 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M 65 6 L 78 8 L 78 40 L 65 42 Z" fill="#0f172a" />
        <path d="M 66 8 L 76 9 L 76 39 L 66 40 Z" fill="#1e293b" />
        <rect x="35" y="5" width="30" height="38" rx="4" fill="rgba(0,0,0,0.1)" />
        <path d="M 25 8 L 35 6 L 35 42 L 25 40 Z" fill="#0f172a" />
        <path d="M 37 4 L 63 4 L 63 6 L 37 6 Z" fill="#0f172a" />
        <path d="M 37 42 L 63 42 L 63 44 L 37 44 Z" fill="#0f172a" />
        <rect x="70" y="0" width="5" height="4" rx="1" fill="#1e293b" />
        <rect x="70" y="44" width="5" height="4" rx="1" fill="#1e293b" />
        <path d="M 106 6 L 108 6 L 108 14 L 106 14 Z" fill="#fef08a" />
        <path d="M 106 34 L 108 34 L 108 42 L 106 42 Z" fill="#fef08a" />
        {showLights && (
          <g opacity="0.8">
            <path d="M 108 10 L 150 -5 L 150 25 Z" fill="url(#beamGlow)" />
            <path d="M 108 38 L 150 23 L 150 53 Z" fill="url(#beamGlow)" />
          </g>
        )}
        <path d="M 2 8 L 4 8 L 4 18 L 2 18 Z" fill={showLights ? "#ef4444" : "#7f1d1d"} filter={showLights && !isReverse ? "drop-shadow(-2px 0px 4px #ef4444)" : ""} />
        <path d="M 2 30 L 4 30 L 4 40 L 2 40 Z" fill={showLights ? "#ef4444" : "#7f1d1d"} filter={showLights && !isReverse ? "drop-shadow(-2px 0px 4px #ef4444)" : ""} />
        {showLights && isReverse && (
          <g>
            <rect x="2" y="11" width="2" height="4" fill="#ffffff" filter="drop-shadow(-2px 0px 3px #ffffff)" />
            <rect x="2" y="33" width="2" height="4" fill="#ffffff" filter="drop-shadow(-2px 0px 3px #ffffff)" />
          </g>
        )}
        <defs>
          <linearGradient id="beamGlow" x1="108" y1="24" x2="150" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="1" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {rightBlinker && <div className="absolute right-[2px] bottom-[4px] w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />}
      {leftBlinker && <div className="absolute right-[2px] top-[4px] w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />}
    </div>
  )
}

export const RealisticSideProfileSVG = ({ speed = 0, step = 0 }: { speed?: number, step?: number }) => (
  <div className="relative w-[140px] h-[50px]">
    <svg width="140" height="50" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl absolute inset-0">
      <circle cx="30" cy="40" r="10" fill="#1e293b" />
      <circle cx="110" cy="40" r="10" fill="#1e293b" />
      <path d="M 10 30 L 130 30 C 135 30 138 25 135 20 L 120 15 L 100 5 L 60 5 L 30 15 L 15 20 C 10 23 8 28 10 30 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
      <path d="M 35 16 L 62 6 L 95 6 L 115 16 Z" fill="#0f172a" />
      <path d="M 68 6 L 68 16" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M 134 18 L 136 18 L 136 24 L 134 24 Z" fill="#fef08a" />
      <path d="M 10 22 L 12 22 L 12 28 L 10 28 Z" fill="#ef4444" />
    </svg>
    <div className={`absolute left-[22px] top-[32px] w-[16px] h-[16px] border-[2px] border-dashed border-slate-300 rounded-full ${speed > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: `${Math.max(0.2, 2 - speed * 0.1)}s` }} />
    <div className={`absolute left-[102px] top-[32px] w-[16px] h-[16px] border-[2px] border-dashed border-slate-300 rounded-full ${speed > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: `${Math.max(0.2, 2 - speed * 0.1)}s` }} />
  </div>
)

// ============================================================================
// 1. VEHICLE STARTUP SIMULATION (Immersive Driver POV)
// ============================================================================
export const VehicleStartupSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = SIM_T[language] || SIM_T.EN
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
        <div className={`absolute top-0 left-0 right-0 h-[130px] transition-colors duration-1000 ${step >= 4 ? 'bg-slate-600' : 'bg-slate-800'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')]" />
          <div className={`absolute top-0 left-1/4 right-1/4 h-8 bg-white/20 blur-xl transition-all duration-500 ${step >= 4 ? 'opacity-100 scale-110' : 'opacity-40'}`} />
        </div>
        <div className="absolute top-[100px] left-[-12%] right-[-12%] h-[72px] bg-slate-800 rounded-t-[50%] shadow-[0_-8px_20px_rgba(0,0,0,0.6)] z-10 border-t border-slate-700" />
        <div className="absolute top-[132px] left-0 right-0 bottom-0 bg-slate-900 z-10 flex" style={{ transform: isAnimating && step === 4 ? `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)` : 'none' }}>
          <div className="relative w-[55%] h-full flex flex-col items-center">
            <div className={`absolute top-[-14px] left-1/2 -translate-x-1/2 w-[230px] h-[84px] bg-black rounded-t-[42px] rounded-b-xl border-[3px] flex justify-between items-center px-3 z-20 shadow-inner transition-all duration-1000 ${step >= 4 ? 'border-primary/40 shadow-[0_0_30px_rgba(56,189,248,0.15)]' : 'border-slate-700'}`}>
              <div className={`w-[58px] h-[58px] rounded-full border-2 relative flex items-center justify-center transition-all duration-1000 ${step >= 4 ? 'border-primary/50 bg-blue-950/40 shadow-[0_0_15px_rgba(56,189,248,0.3)_inset]' : 'border-slate-800 bg-slate-950'}`}>
                <span className={`text-[8px] font-bold absolute top-2 transition-colors duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-700'}`}>{Math.round(rpm / 100)}</span>
                <div className="absolute bottom-1/2 left-1/2 w-[3px] h-[22px] origin-bottom rounded-full transition-all duration-75" style={{ transform: `translateX(-50%) rotate(${-130 + (rpm / 8000) * 260}deg)`, backgroundColor: step >= 4 ? '#38bdf8' : '#64748b', boxShadow: step >= 4 ? '0 0 8px #38bdf8' : 'none' }} />
              </div>
              <div className={`flex flex-col items-center w-[52px] h-[52px] border rounded-lg justify-center gap-1 transition-all duration-1000 ${step >= 4 ? 'bg-blue-900/30 border-primary/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'bg-blue-950/20 border-blue-900/30'}`}>
                <div className="flex gap-1">
                  <div className={`w-[13px] h-[13px] rounded-full text-[5px] font-bold text-white flex items-center justify-center transition-all duration-500 ${step >= 1 ? 'bg-slate-700' : 'bg-red-500 shadow-[0_0_6px_red]'}`}>SB</div>
                  <div className={`w-[13px] h-[13px] rounded-full text-[5px] font-bold text-white flex items-center justify-center transition-all duration-500 ${step >= 4 ? 'bg-slate-700' : 'bg-amber-500 shadow-[0_0_6px_orange]'}`}>ENG</div>
                </div>
                <span className={`text-[8px] font-mono font-bold transition-all duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-600'}`}>0 <span className="text-[5px] opacity-50">km/h</span></span>
              </div>
              <div className={`w-[58px] h-[58px] rounded-full border-2 relative flex items-center justify-center transition-all duration-1000 ${step >= 4 ? 'border-primary/50 bg-blue-950/40 shadow-[0_0_15px_rgba(56,189,248,0.3)_inset]' : 'border-slate-800 bg-slate-950'}`}>
                <span className={`text-[8px] font-bold absolute top-2 transition-colors duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-700'}`}>0</span>
                <div className="absolute bottom-1/2 left-1/2 w-[3px] h-[22px] origin-bottom rounded-full transition-all duration-1000" style={{ transform: `translateX(-50%) rotate(-130deg)`, backgroundColor: step >= 4 ? '#38bdf8' : '#64748b', boxShadow: step >= 4 ? '0 0 8px #38bdf8' : 'none' }} />
              </div>
            </div>
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[185px] h-[185px] z-30" style={{ transform: 'translateX(-50%) perspective(350px) rotateX(12deg)' }}>
              <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[44px] h-[90px] bg-slate-950 rounded-t-xl shadow-2xl" />
              <div className="absolute top-[58%] left-[4px] w-[32px] h-[32px] bg-slate-950 rounded-full border-[3px] border-slate-700 flex items-center justify-center shadow-lg z-40" style={{ transform: 'perspective(100px)' }}>
                <div className={`relative w-[6px] h-[18px] rounded-sm transition-all duration-700 origin-center flex flex-col items-center ${step >= 4 ? 'rotate-90 bg-primary shadow-[0_0_10px_#38bdf8]' : 'bg-slate-400'}`}>
                  <div className="w-[3px] h-[3px] bg-slate-900 rounded-full mt-[1px]" />
                  <div className={`absolute top-[100%] w-[12px] h-[26px] border-[2px] border-slate-500 rounded-b-md origin-top transition-transform duration-1000 ${step >= 4 ? 'rotate-[-90deg]' : 'rotate-0'}`}>
                    <div className="absolute bottom-0 w-full h-[14px] bg-slate-800 rounded-b-sm" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-800/80 shadow-[0_6px_20px_rgba(0,0,0,0.7)]" style={{ background: 'transparent' }}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[8px] bg-slate-800/70 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[8px] h-[50%] bg-slate-800/70 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[44px] h-[44px] rounded-full border-[2px] border-slate-700/50 bg-slate-900/40 flex items-center justify-center">
                    <span className="text-slate-600 text-[7px] font-bold">HORN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[45%] h-full flex flex-col gap-1.5 py-2 pr-3 z-20">
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
            <div className={`flex-1 rounded-xl border-2 transition-all duration-500 flex items-center gap-2.5 px-2.5 ${step === 3 ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]' : step > 3 ? 'border-success/40 bg-success/5' : 'border-slate-700/60 bg-slate-900/50'}`}>
              <div className="relative w-[18px] h-[48px] flex-shrink-0 flex items-end justify-center">
                <div className={`w-full bg-slate-600 rounded-sm border-b-[5px] border-slate-900 transition-all duration-500 origin-top ${step >= 3 ? 'h-[30px] translate-y-[8px]' : 'h-[44px]'}`} />
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Clutch Pedal</p>
                <p className={`text-[10px] font-bold mt-0.5 ${step >= 3 ? 'text-success' : 'text-slate-500'}`}>{step >= 3 ? '✓ Pressed down' : 'Released'}</p>
              </div>
            </div>
            <div className={`flex-1 rounded-xl border-2 transition-all duration-500 flex items-center gap-2.5 px-2.5 ${step === 4 ? 'border-primary bg-primary/10 shadow-[0_0_14px_rgba(56,189,248,0.3)]' : 'border-slate-700/60 bg-slate-900/50'}`}>
              <div className="relative w-[36px] h-[36px] rounded-full border-2 border-slate-700 bg-black flex items-center justify-center flex-shrink-0">
                <Key className={`w-[14px] h-[14px] transition-all duration-700 ${step >= 4 ? 'text-primary rotate-90 drop-shadow-[0_0_6px_#38bdf8]' : 'text-slate-500'}`} />
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Ignition</p>
                <p className={`text-[10px] font-bold mt-0.5 ${step >= 4 ? 'text-primary' : 'text-slate-500'}`}>{step >= 4 ? '🔑 Engine ON!' : 'Off'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 relative z-50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold font-mono text-text-1 w-10">{rpm} <span className="text-[9px] text-text-3">{t.rpm}</span></span>
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
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === 4 ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10'}`}>
            {step === 0 ? <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></> : step === 4 ? <><Check className="w-3 h-3" /><span>{tMod.engineOn}</span></> : <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. STEERING CONTROL SIMULATION (Slalom Drill)
// ============================================================================
export const SteeringControlSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = SIM_T[language] || SIM_T.EN
  const tMod = t.steering

  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const stepsInfo = [
    { gear: "D", wheelAngle: 0,   targetSpeed: 15 },
    { gear: "D", wheelAngle: -35, targetSpeed: 15 },
    { gear: "D", wheelAngle: 35,  targetSpeed: 15 },
    { gear: "D", wheelAngle: 0,   targetSpeed: 0  }
  ]

  useEffect(() => {
    if (step === 0) { setSpeed(0); return; }
    const targetSpeed = stepsInfo[step - 1].targetSpeed
    setIsAnimating(true)
    
    let currentSpeed = speed
    const interval = setInterval(() => {
      if (currentSpeed < targetSpeed) { currentSpeed += 1; setSpeed(currentSpeed) }
      else if (currentSpeed > targetSpeed) { currentSpeed -= 1; setSpeed(currentSpeed) }
      else {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          if (step === 4 && onComplete) onComplete()
        }, 1200)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(prev => prev + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  const activeGear = step === 0 ? "P" : stepsInfo[step - 1].gear
  const activeWheelAngle = step === 0 ? 0 : stepsInfo[step - 1].wheelAngle

  const getCarTransform = () => {
    switch (step) {
      case 1: return 'translate(30px, 130px) rotate(0deg)'
      case 2: return 'translate(240px, 180px) rotate(15deg)'
      case 3: return 'translate(460px, 80px)  rotate(-15deg)'
      case 4: return 'translate(680px, 130px) rotate(0deg)'
      case 0: default: return 'translate(-80px, 130px) rotate(0deg)'
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#353839] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={700}>
          <div className="w-[700px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[150px] left-[-1000px] right-[-1000px] h-0 border-t border-dashed border-white/40" />
            <div className="absolute z-10" style={{top:'90px', left:'280px'}}>
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[28px] border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg" />
              <div className="w-[22px] h-[5px] bg-orange-700 rounded -mt-0.5" />
            </div>
            <div className="absolute z-10" style={{top:'200px', left:'500px'}}>
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[28px] border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg" />
              <div className="w-[22px] h-[5px] bg-orange-700 rounded -mt-0.5" />
            </div>
            <div className="absolute z-20 transition-all duration-[1500ms] ease-in-out top-0 left-0" style={{ transform: getCarTransform() }}>
              <RealisticCarSVG colorClass="slate" showLights={true} step={step} activeGear={activeGear} />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <svg className="w-9 h-9 text-text-2 transition-transform duration-[1500ms] ease-in-out" style={{ transform: `rotate(${activeWheelAngle}deg)` }} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
            <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
          </svg>
          <span className="text-sm font-bold font-mono text-text-1">{speed} <span className="text-[9px] text-text-3">{t.kmh}</span></span>
        </div>
        <div className="flex-1 max-w-[280px]">
          <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">{step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}</h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">{step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}</p>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className="px-4 py-2 bg-primary text-white text-xs rounded-xl font-bold uppercase">
            {step === 0 ? t.begin : step === 4 ? tMod.passed : t.next}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. CLUTCH CONTROL SIMULATION (Hill Start Incline)
// ============================================================================
export const ClutchControlSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = SIM_T[language] || SIM_T.EN
  const tMod = t.clutch

  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [rpm, setRpm] = useState(800)
  const [isAnimating, setIsAnimating] = useState(false)

  const stepsInfo = [
    { gear: "1", targetRpm: 800, targetSpeed: 0 },
    { gear: "1", targetRpm: 1500, targetSpeed: 0 },
    { gear: "1", targetRpm: 1200, targetSpeed: 0 },
    { gear: "1", targetRpm: 15, targetSpeed: 15 }
  ]

  useEffect(() => {
    if (step === 0) { setSpeed(0); setRpm(800); return; }
    const targetSpeed = stepsInfo[step - 1].targetSpeed
    const targetRpm = stepsInfo[step - 1].targetRpm
    setIsAnimating(true)
    
    let currentRpm = rpm
    const rpmInterval = setInterval(() => {
      if (Math.abs(currentRpm - targetRpm) < 50) {
        currentRpm = targetRpm
        setRpm(currentRpm)
        clearInterval(rpmInterval)
      } else {
        currentRpm += currentRpm < targetRpm ? 50 : -50
        setRpm(currentRpm)
      }
    }, 50)

    let currentSpeed = speed
    const speedInterval = setInterval(() => {
      if (Math.abs(currentSpeed - targetSpeed) < 1) {
        currentSpeed = targetSpeed
        setSpeed(currentSpeed)
        clearInterval(speedInterval)
      } else {
        currentSpeed += currentSpeed < targetSpeed ? 1 : -1
        setSpeed(currentSpeed)
      }
    }, 100)

    const timer = setTimeout(() => {
      setIsAnimating(false)
      if (step === 4 && onComplete) onComplete()
    }, 1500)

    return () => {
      clearInterval(rpmInterval)
      clearInterval(speedInterval)
      clearTimeout(timer)
    }
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(prev => prev + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0); setRpm(800) } }

  const activeGear = step === 0 ? "N" : stepsInfo[step - 1].gear
  const carX = step === 3 ? 20 : step === 4 ? 250 : 15

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full border-b border-white/5 overflow-hidden flex flex-col">
        <div className="h-[220px] w-full relative bg-blue-300 overflow-hidden shrink-0">
          <div className="absolute left-[-20%] right-[-20%] h-[300px] bg-[#353839] border-t-8 border-slate-500 origin-top-left" style={{ transform: 'rotate(-10deg)', top: '140px' }} />
          <div className="absolute transition-all duration-[1500ms] ease-in-out" style={{ left: 50 + carX, top: 140 - ((50 + carX) * Math.tan(10 * Math.PI / 180)) - 45, transform: `rotate(-10deg)` }}>
            <RealisticSideProfileSVG step={step} speed={speed} />
          </div>
        </div>
        <div className="flex-1 bg-slate-900 flex justify-center items-center gap-10 p-4 shadow-inner relative z-10">
          <div className="w-[80px] h-[80px] rounded-full border-4 border-slate-800 flex items-center justify-center relative bg-black">
             <span className="absolute top-2 text-xs font-mono font-bold text-white">{rpm}</span>
             <div className="absolute bottom-1/2 left-1/2 w-[2px] h-[35px] origin-bottom bg-primary" style={{ transform: `translateX(-50%) rotate(${-130 + (rpm / 8000) * 260}deg)` }} />
          </div>
        </div>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex-1">
          <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider">{step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}</h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">{step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}</p>
        </div>
        <div className="flex gap-2">
          {step > 0 && <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void text-text-3 border border-border rounded-xl"><RotateCcw className="w-4 h-4" /></button>}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className="px-4 py-2 bg-primary text-white text-xs rounded-xl font-bold uppercase">
            {step === 0 ? t.begin : step === 4 ? tMod.success : t.next}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. BRAKING TECHNIQUES SIMULATION (Road Canvas stop-line)
// ============================================================================
export const BrakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carY, setCarY] = useState(220)
  const [speed, setSpeed] = useState(0)
  const [clutchPressed, setClutchPressed] = useState(false)
  const [isBraking, setIsBraking] = useState(false)
  const [status, setStatus] = useState("Click Begin to start driving up the lane.")

  useEffect(() => {
    if (step === 0) return
    if (step === 1) {
      setSpeed(40)
      setStatus("Cruising at 40 km/h. Red stop line ahead. Tap Brake Pedal to decelerate!")
      let interval = setInterval(() => {
        setCarY(prev => {
          const next = prev - 2
          if (next <= 120) {
            clearInterval(interval)
            setStep(2)
            return 120
          }
          return next
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  const pressBrake = () => {
    if (step === 1 || step === 2) {
      setIsBraking(true)
      let decel = setInterval(() => {
        setSpeed(prev => {
          if (prev <= 10 && !clutchPressed) {
            setStatus("Engine Stalling! Press Clutch immediately to disengage engine!")
          }
          if (prev <= 0) {
            clearInterval(decel)
            setIsBraking(false)
            if (clutchPressed) {
              setStatus("Perfect deceleration! Vehicle safely halted at stop line.")
              if (onComplete) onComplete()
            } else {
              setStatus("Engine Stalled! You stopped without holding down the clutch.")
            }
            return 0
          }
          return Math.max(0, prev - 5)
        })
        setCarY(prev => Math.max(70, prev - 1.5))
      }, 80)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] overflow-hidden flex flex-col">
        <div className="h-[220px] w-full relative bg-[#2a2d3a] shrink-0 border-b border-slate-700">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
          {/* Lane markings */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[80px] bg-[#374151] border-x-4 border-slate-500">
            <div className="absolute top-[60px] left-0 right-0 h-2 bg-red-500 shadow-[0_0_10px_red]" /> {/* Stop line */}
          </div>
          {/* Moving car */}
          <div className="absolute left-[245px] transition-all duration-75" style={{ top: `${carY}px` }}>
            <div className="w-[110px] h-[48px] origin-center -rotate-90 scale-75">
              <RealisticCarSVG colorClass="slate" showLights={isBraking} step={step} />
            </div>
          </div>
        </div>

        {/* Dashboard coordination panel */}
        <div className="flex-1 bg-slate-900 flex justify-center items-center gap-6 p-4">
          <button 
            onClick={() => setClutchPressed(true)} 
            className={`w-14 h-20 rounded border-2 font-mono text-[9px] flex flex-col justify-between items-center p-1.5 transition-all ${clutchPressed ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300 scale-95 translate-y-1' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            <span>CLUTCH</span>
            <div className="w-10 h-2 bg-black rounded" />
          </button>
          <button 
            onMouseDown={pressBrake} 
            onTouchStart={pressBrake}
            className="w-18 h-18 rounded-lg bg-red-600 border-2 border-red-500 text-white font-mono text-[9px] flex flex-col justify-between items-center p-1.5 active:scale-95"
          >
            <span>HOLD BRAKE</span>
            <div className="w-12 h-2.5 bg-black rounded" />
          </button>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-text-3 font-mono">SPEED DIAL</span>
            <span className="text-sm font-bold font-mono text-white">{speed} km/h</span>
          </div>
        </div>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setStep(0); setCarY(220); setSpeed(0); setClutchPressed(false); setStatus("Click Begin to start driving up the lane.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        {step === 0 && <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs uppercase">Begin</button>}
      </div>
    </div>
  )
}

// ============================================================================
// 5. MIRROR CHECKING SIMULATION (Real-time target check)
// ============================================================================
export const MirrorCheckingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [checkedZone, setCheckedZone] = useState<string[]>([])
  const [hazardLocation, setHazardLocation] = useState<'rear' | 'left' | 'right'>('rear')
  const [status, setStatus] = useState("Look at the dashboard below. Tap the highlighted mirror frame showing the yellow caution indicator!")

  const tapMirror = (zone: 'rear' | 'left' | 'right') => {
    if (zone === hazardLocation) {
      const updated = [...checkedZone, zone]
      setCheckedZone(updated)
      if (updated.length >= 3) {
        setStatus("All mirrors scanned! Click off to verify complete safety clearance.")
        if (onComplete) onComplete()
      } else {
        const remaining: ('rear' | 'left' | 'right')[] = ['left', 'right', 'rear']
        const nextLoc = remaining.find(l => !updated.includes(l)) || 'rear'
        setHazardLocation(nextLoc)
        setStatus(`Perfect scan. Look for the next hazard in the ${nextLoc.toUpperCase()} mirror.`)
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#151c2a] flex flex-col border-b border-white/5 p-4 justify-around">
        <div className="w-full flex justify-center">
          {/* Rearview mirror */}
          <button 
            onClick={() => tapMirror('rear')}
            className={`w-[260px] h-12 rounded-xl border-3 flex items-center justify-around relative overflow-hidden transition-all ${hazardLocation === 'rear' ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-700 bg-slate-900/60'}`}
          >
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className="text-[10px] text-slate-300 font-mono font-bold">REARVIEW MIRROR VIEW</span>
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            {hazardLocation === 'rear' && <div className="absolute inset-0 border-2 border-amber-400 bg-amber-400/5 animate-pulse" />}
          </button>
        </div>

        <div className="w-full flex justify-between px-4">
          {/* Left mirror */}
          <button 
            onClick={() => tapMirror('left')}
            className={`w-[120px] h-20 rounded-l-[30px] border-3 flex flex-col items-center justify-center relative overflow-hidden transition-all ${hazardLocation === 'left' ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-700 bg-slate-900/60'}`}
          >
            <span className="text-[9px] text-slate-300 font-mono">LEFT SIDE</span>
            {hazardLocation === 'left' && <div className="absolute inset-0 border-2 border-amber-400 bg-amber-400/5 animate-pulse" />}
          </button>
          
          {/* Right mirror */}
          <button 
            onClick={() => tapMirror('right')}
            className={`w-[120px] h-20 rounded-r-[30px] border-3 flex flex-col items-center justify-center relative overflow-hidden transition-all ${hazardLocation === 'right' ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-700 bg-slate-900/60'}`}
          >
            <span className="text-[9px] text-slate-300 font-mono">RIGHT SIDE</span>
            {hazardLocation === 'right' && <div className="absolute inset-0 border-2 border-amber-400 bg-amber-400/5 animate-pulse" />}
          </button>
        </div>

        <p className="text-[11px] text-text-2 text-center mt-2 px-6">{status}</p>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between">
        <button onClick={() => { setCheckedZone([]); setHazardLocation('rear'); setStatus("Look at the dashboard below.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

// ============================================================================
// 8. HILL STARTS SIMULATION (Side profile incline move)
// ============================================================================
export const HillStartsSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [clutchValue, setClutchValue] = useState(0)
  const [rpmValue, setRpmValue] = useState(800)
  const [handbrakeReleased, setHandbrakeReleased] = useState(false)
  const [carX, setCarX] = useState(20)
  const [status, setStatus] = useState("Steep incline. Apply Handbrake. Press gas to reach 1500 RPM.")

  const adjustGas = () => {
    if (step === 0) {
      setRpmValue(1600)
      setStep(1)
      setStatus("RPM is 1600. Now slide the Clutch Pedal down to locate the biting point (approx. 60%).")
    }
  }

  const adjustClutch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setClutchValue(val)
    if (step === 1 && val >= 55 && val <= 70) {
      setRpmValue(1200)
      setStep(2)
      setStatus("Biting point reached! Hold clutch, click RELEASE HANDBRAKE to climb.")
    }
  }

  const releaseHandbrake = () => {
    if (step === 2) {
      setHandbrakeReleased(true)
      setStatus("Climbing smoothly! Handbrake disengaged successfully.")
      let interval = setInterval(() => {
        setCarX(prev => {
          if (prev >= 200) {
            clearInterval(interval)
            if (onComplete) onComplete()
            return 200
          }
          return prev + 10
        })
      }, 80)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full overflow-hidden flex flex-col border-b border-white/5">
        {/* Hill Visual */}
        <div className="h-[180px] w-full relative bg-blue-300 overflow-hidden shrink-0">
          <div className="absolute left-[-20%] right-[-20%] h-[300px] bg-[#353839] border-t-8 border-slate-500 origin-top-left" style={{ transform: 'rotate(-12deg)', top: '120px' }} />
          <div className="absolute transition-all duration-[1000ms]" style={{ left: `${carX}px`, top: 120 - (carX * Math.tan(12 * Math.PI / 180)) - 40, transform: `rotate(-12deg)` }}>
            <RealisticSideProfileSVG speed={step === 3 ? 15 : 0} step={step} />
          </div>
        </div>

        {/* Console coordinator */}
        <div className="flex-1 bg-slate-900 flex justify-around items-center p-4">
          <button onClick={adjustGas} className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-bold font-mono">GAS (1500 RPM)</button>
          
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 font-mono">CLUTCH BITE</span>
            <input type="range" min="0" max="100" value={clutchValue} onChange={adjustClutch} className="w-24 mt-1" />
          </div>

          <button onClick={releaseHandbrake} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-bold font-mono">RELEASE HANDBRAKE</button>
        </div>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setStep(0); setClutchValue(0); setRpmValue(800); setHandbrakeReleased(false); setCarX(20); setStatus("Steep incline.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        <span className="text-[10px] text-text-2 w-[280px] leading-snug">{status}</span>
      </div>
    </div>
  )
}

// ============================================================================
// 9. LANE CHANGING SIMULATION (Topdown highway glide)
// ============================================================================
export const LaneChangingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(150)
  const [carY, setCarY] = useState(150)
  const [signalActive, setSignalActive] = useState(false)
  const [status, setStatus] = useState("Click Begin to approach target speed in left lane.")

  useEffect(() => {
    if (step === 1) {
      let interval = setInterval(() => {
        setCarX(prev => {
          if (prev >= 280) {
            clearInterval(interval)
            setStep(2)
            setStatus("Cruising at highway flow. Check side mirrors and ACTIVATE right indicator.")
            return 280
          }
          return prev + 5
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  const triggerSignal = () => {
    if (step === 2) {
      setSignalActive(true)
      setStep(3)
      setStatus("Indicator active. Check blind spots and click SLIDE to merge.")
    }
  }

  const triggerMerge = () => {
    if (step === 3 && signalActive) {
      let interval = setInterval(() => {
        setCarY(prev => {
          if (prev <= 60) {
            clearInterval(interval)
            setStep(4)
            setStatus("Merged safely into right lane! Cancel signal indicators.")
            if (onComplete) onComplete()
            return 60
          }
          return prev - 3
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            {/* Highway lanes */}
            <div className="absolute top-[40px] bottom-[40px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-white/60" />
            </div>
            {/* Student car */}
            <div className="absolute transition-all duration-75" style={{ left: `${carX}px`, top: `${carY}px` }}>
              <RealisticCarSVG colorClass="slate" showLights={true} step={step} rightBlinker={signalActive} />
            </div>
          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setStep(0); setCarX(150); setCarY(150); setSignalActive(false); setStatus("Click Begin.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        <span className="text-[10px] text-text-2 w-[240px]">{status}</span>
        <div className="flex gap-2">
          {step === 0 && <button onClick={() => setStep(1)} className="px-3 py-1.5 bg-primary text-white font-bold rounded-xl text-xs">Begin</button>}
          {step === 2 && <button onClick={triggerSignal} className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-xl text-xs">SIGNAL</button>}
          {step === 3 && <button onClick={triggerMerge} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs">SLIDE</button>}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. TRAFFIC SIGNALS SIMULATION (Visual light stop line)
// ============================================================================
export const TrafficSignalsSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(20)
  const [lightColor, setLightColor] = useState<'green' | 'amber' | 'red'>('green')
  const [status, setStatus] = useState("Cruising forward. Click Begin to approach junction.")

  useEffect(() => {
    if (step === 1) {
      let interval = setInterval(() => {
        setCarX(prev => {
          const next = prev + 5
          if (next >= 120 && lightColor === 'green') {
            setLightColor('amber')
            setStatus("Amber light active! Click BRAKE button below immediately to stop before line.")
          }
          if (next >= 180 && lightColor === 'amber') {
            setLightColor('red')
          }
          if (next >= 220) {
            clearInterval(interval)
            setStatus("Failed! You jumped the red signal without stopping.")
            setStep(3)
            return 220
          }
          return next
        })
      }, 80)
      return () => clearInterval(interval)
    }
  }, [step, lightColor])

  const triggerStop = () => {
    if (step === 1) {
      setStep(2)
      if (lightColor === 'amber' || lightColor === 'red') {
        setStatus("Perfect stop! Vehicle safely halted before the solid white junction line.")
        if (onComplete) onComplete()
      } else {
        setStatus("Failed! Halted too early on green signal pattern.")
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2c2d] border-y-4 border-slate-500 shadow-inner" />
            <div className="absolute top-[80px] bottom-[20px] left-[260px] w-4 bg-white" /> {/* Stop line */}
            
            {/* Traffic Light pole */}
            <div className="absolute left-[290px] top-[20px] w-8 h-20 bg-black border-2 border-slate-600 rounded flex flex-col items-center justify-around py-1 shadow-xl z-20">
              <div className={`w-4 h-4 rounded-full ${lightColor === 'red' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-950'}`} />
              <div className={`w-4 h-4 rounded-full ${lightColor === 'amber' ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-amber-950'}`} />
              <div className={`w-4 h-4 rounded-full ${lightColor === 'green' ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-green-950'}`} />
            </div>

            {/* Car */}
            <div className="absolute top-[120px]" style={{ left: `${carX}px` }}>
              <RealisticCarSVG colorClass="slate" showLights={step === 2} step={step} />
            </div>
          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setStep(0); setCarX(20); setLightColor('green'); setStatus("Cruising forward.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        <span className="text-[10px] text-text-2 w-[240px]">{status}</span>
        <div className="flex gap-2">
          {step === 0 && <button onClick={() => setStep(1)} className="px-3 py-1.5 bg-primary text-white font-bold rounded-xl text-xs">Begin</button>}
          {step === 1 && <button onClick={triggerStop} className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-xl text-xs">BRAKE</button>}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 11. HIGHWAY MERGING SIMULATION
// ============================================================================
export const HighwayMergingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const stepsInfo = [
    { gear: "D", wheelAngle: 0, targetSpeed: 50 },
    { gear: "D", wheelAngle: 0, targetSpeed: 80 },
    { gear: "D", wheelAngle: 25, targetSpeed: 80 },
    { gear: "D", wheelAngle: 0, targetSpeed: 80 }
  ]

  useEffect(() => {
    if (step === 0) { setSpeed(0); return; }
    const targetSpeed = stepsInfo[step - 1].targetSpeed
    setIsAnimating(true)
    
    let currentSpeed = speed
    const interval = setInterval(() => {
      if (currentSpeed < targetSpeed) { currentSpeed += 2; setSpeed(currentSpeed) }
      else if (currentSpeed > targetSpeed) { currentSpeed -= 2; setSpeed(currentSpeed) }
      else {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          if (step === 4 && onComplete) onComplete()
        }, 1200)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(prev => prev + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  const activeGear = step === 0 ? "P" : stepsInfo[step - 1].gear
  const activeWheelAngle = step === 0 ? 0 : stepsInfo[step - 1].wheelAngle

  const getCarTransform = () => {
    switch (step) {
      case 1: return 'translate(80px, 25px) rotate(5deg)' 
      case 2: return 'translate(180px, 35px) rotate(8deg)' 
      case 3: return 'translate(280px, 75px) rotate(12deg)' 
      case 4: return 'translate(450px, 110px) rotate(0deg)' 
      case 0: default: return 'translate(20px, 15px) rotate(5deg)'
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#2a2c2d] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#353839] border-y-4 border-slate-500 shadow-inner" />
            <div className="absolute z-20 transition-all duration-[1500ms] ease-in-out top-0 left-0" style={{ transform: getCarTransform() }}>
               <RealisticCarSVG colorClass="slate" showLights={true} step={step} activeGear={activeGear} rightBlinker={step === 2} />
            </div>
          </div>
        </ScaledCanvas>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold font-mono text-text-1">{speed} <span className="text-[9px] text-text-3">km/h</span></span>
        </div>
        <div className="flex gap-2">
          {step > 0 && <button onClick={handleReset} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className="px-4 py-2 bg-primary text-white text-xs rounded-xl font-bold uppercase">
            {step === 0 ? "Begin" : step === 4 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 12. [NEW] OVERTAKING SIMULATION (Truck pass pacing)
// ============================================================================
export const OvertakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [carX, setCarX] = useState(20)
  const [carY, setCarY] = useState(150)
  const [signalActive, setSignalActive] = useState(false)
  const [status, setStatus] = useState("Slow truck ahead. Click Begin to signal and pull out.")

  const nextStep = () => {
    if (step === 0) {
      setStep(1)
      setSignalActive(true)
      setStatus("Step 1: Shift right and pull into overtaking lane.")
      let interval = setInterval(() => {
        setCarY(prev => {
          if (prev <= 60) {
            clearInterval(interval)
            setStep(2)
            setCarX(120)
            setStatus("Step 2: Accelerate past the cargo truck. Press pass button.")
            return 60
          }
          return prev - 10
        })
      }, 50)
    } else if (step === 2) {
      setStatus("Accelerating past truck...")
      let interval = setInterval(() => {
        setCarX(prev => {
          if (prev >= 360) {
            clearInterval(interval)
            setStep(3)
            setStatus("Step 3: Clear ahead! Signal left and slide back into left lane.")
            return 360
          }
          return prev + 20
        })
      }, 50)
    } else if (step === 3) {
      let interval = setInterval(() => {
        setCarY(prev => {
          if (prev >= 150) {
            clearInterval(interval)
            setStep(4)
            setStatus("Maneuver complete! You overtook the vehicle safely.")
            if (onComplete) onComplete()
            return 150
          }
          return prev + 10
        })
      }, 50)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[40px] bottom-[40px] left-[-1000px] right-[-1000px] bg-[#2a2d3a] border-y-4 border-slate-500">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-white/60" />
            </div>
            
            {/* Cargo Truck */}
            <div className="absolute left-[200px] top-[140px] opacity-75">
              <div className="w-[120px] h-[55px] bg-blue-900 border-2 border-slate-500 rounded flex items-center justify-center text-white text-[8px] font-bold font-mono">CARGO TRUCK</div>
            </div>

            {/* Student Car */}
            <div className="absolute transition-all duration-75" style={{ left: `${carX}px`, top: `${carY}px` }}>
              <RealisticCarSVG colorClass="slate" showLights={true} step={step} rightBlinker={signalActive} />
            </div>
          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setStep(0); setCarX(20); setCarY(150); setSignalActive(false); setStatus("Slow truck ahead.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        <span className="text-[10px] text-text-2 w-[240px]">{status}</span>
        <button onClick={nextStep} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl">{step === 0 ? "Begin" : step === 4 ? "Complete" : "Next"}</button>
      </div>
    </div>
  )
}

// ============================================================================
// 13. EMERGENCY BRAKING SIMULATION
// ============================================================================
export const EmergencyBrakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const stepsInfo = [
    { gear: "D", wheelAngle: 0, targetSpeed: 30 },
    { gear: "D", wheelAngle: 0, targetSpeed: 50 },
    { gear: "D", wheelAngle: 0, targetSpeed: 10 },
    { gear: "D", wheelAngle: 0, targetSpeed: 0 }
  ]

  useEffect(() => {
    if (step === 0) { setSpeed(0); return; }
    const targetSpeed = stepsInfo[step - 1].targetSpeed
    setIsAnimating(true)
    
    let currentSpeed = speed
    const interval = setInterval(() => {
      if (currentSpeed < targetSpeed) { currentSpeed += 2; setSpeed(currentSpeed) }
      else if (currentSpeed > targetSpeed) { currentSpeed -= 4; setSpeed(Math.max(0, currentSpeed)) }
      else {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          if (step === 4 && onComplete) onComplete()
        }, 1200)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(prev => prev + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#353839] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] bg-[#2a2c2d] border-y-4 border-slate-500 shadow-inner" />
            {step >= 3 && (
              <div className="absolute left-[510px] top-[110px] z-10 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded bg-red-600 border-2 border-white flex items-center justify-center animate-pulse shadow-lg">
                  <span className="text-white font-bold text-xs">STOP</span>
                </div>
              </div>
            )}
          </div>
        </ScaledCanvas>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex gap-2 ml-auto">
          {step > 0 && <button onClick={handleReset} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className="px-4 py-2 bg-primary text-white text-xs rounded-xl font-bold uppercase">
            {step === 0 ? "Begin" : step === 4 ? "Stopped" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 14. [NEW] DRIVING IN RAIN SIMULATION (Wiper visual movement)
// ============================================================================
export const RainDrivingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [wiperActive, setWiperActive] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [status, setStatus] = useState("Heavy downpour active! Reduce speed below 30 km/h and turn on windshield wipers.")

  const adjustSpeed = () => {
    setSpeed(30)
    if (wiperActive) {
      setStatus("Traction stable. Safe rain speed limit matching wiper visibility.")
      if (onComplete) onComplete()
    } else {
      setStatus("Speed is safe, but wipers are still OFF. Activate wipers to clear screen.")
    }
  }

  const toggleWiper = () => {
    setWiperActive(!wiperActive)
    if (speed <= 30) {
      setStatus("Safe rain setup achieved! Traction stable.")
      if (onComplete) onComplete()
    } else {
      setStatus("Wipers ON. Now adjust speed to 30 km/h.")
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] flex flex-col border-b border-white/5 p-4 justify-around items-center">
        {/* Visual Wipers wind screen representation */}
        <div className="w-64 h-32 border-2 border-slate-700 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
          {/* Rain backdrop drops */}
          <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
          <div className="absolute text-slate-500 font-mono text-[9px]">WINDSHIELD</div>
          {/* Wiper arm */}
          <div className={`absolute bottom-0 left-1/2 w-1.5 h-24 bg-slate-400 origin-bottom transition-all ${wiperActive ? 'animate-bounce' : 'rotate-[-60deg]'}`} />
        </div>

        <div className="flex gap-4">
          <button onClick={toggleWiper} className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all ${wiperActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>WIPERS: {wiperActive ? "ON" : "OFF"}</button>
          <button onClick={adjustSpeed} className="px-4 py-2 bg-indigo-600 text-white text-xs font-mono font-bold rounded-xl">SET SPEED 30 KM/H</button>
        </div>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setWiperActive(false); setSpeed(50); setStatus("Heavy downpour active!") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        <span className="text-[10px] text-text-2 w-[280px] leading-snug">{status}</span>
      </div>
    </div>
  )
}

// ============================================================================
// 15. NIGHT DRIVING SIMULATION
// ============================================================================
export const NightDrivingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (step === 0) { setSpeed(0); return; }
    const targetSpeed = step === 1 ? 10 : step === 2 ? 40 : step === 3 ? 40 : 45
    setIsAnimating(true)
    let currentSpeed = speed
    const interval = setInterval(() => {
      if (currentSpeed < targetSpeed) { currentSpeed += 3; setSpeed(Math.min(targetSpeed, currentSpeed)) }
      else {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          if (step === 4 && onComplete) onComplete()
        }, 1200)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [step])

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#0a0c10] border-b border-white/5 overflow-hidden flex flex-col justify-center items-center">
        <span className="text-white text-xs font-mono uppercase">Night Driving Mode</span>
        <p className="text-[11px] text-text-2 text-center mt-2 px-6">Ensure low beams are active. Watch out for blinding high beams from oncoming vehicles.</p>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-end">
        <button onClick={() => setStep(0)} className="p-2 bg-void border border-border text-text-3 rounded-xl mr-2"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => { if (step < 4) setStep(prev => prev + 1) }} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs uppercase">
          {step === 0 ? "Begin" : step === 4 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// 16. ROUNDABOUT NAVIGATION SIMULATION
// ============================================================================
export const RoundaboutSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#353839] border-b border-white/5 overflow-hidden flex flex-col justify-center items-center">
        <span className="text-white text-xs font-mono uppercase">Circular Junction Navigation</span>
        <p className="text-[11px] text-text-2 text-center mt-2 px-6">Yield to vehicles already in the loop, stay in your lane segment, and signal left before exit.</p>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-end">
        <button onClick={() => setStep(0)} className="p-2 bg-void border border-border text-text-3 rounded-xl mr-2"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={() => { if (step < 4) { const next = step + 1; setStep(next); if (next === 4 && onComplete) onComplete() } }} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs uppercase">
          {step === 0 ? "Begin" : step === 4 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// 17. [NEW] PARKING ALIGNMENT SIMULATION (Kerb distance visual adjustment)
// ============================================================================
export const ParkingAlignmentSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [carX, setCarX] = useState(180)
  const [status, setStatus] = useState("Position is too far from the kerb. Click Adjust buttons below to align the car within 15-30cm.")

  const adjustPosition = (offset: number) => {
    const nextX = Math.max(80, Math.min(300, carX + offset))
    setCarX(nextX)
    const distance = nextX - 100 // Scale kerb gap
    if (distance >= 15 && distance <= 30) {
      setStatus("Perfect distance! Kerb clearance is ideal (15-30cm). Straighten wheels.")
      if (onComplete) onComplete()
    } else if (distance < 15) {
      setStatus("Too close! Risk of scraping tyres or climbing the kerb.")
    } else {
      setStatus("Too far! Obstruction to road traffic flow.")
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1b2230] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={600}>
          <div className="w-[600px] h-full relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
            <div className="absolute left-[80px] top-0 bottom-0 w-6 bg-slate-500" /> {/* Kerb line */}
            <div className="absolute top-[120px] transition-all duration-100" style={{ left: `${carX}px` }}>
              <div className="w-[110px] h-[48px] origin-center -rotate-90 scale-75">
                <RealisticCarSVG colorClass="slate" showLights={true} step={1} />
              </div>
            </div>
          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <button onClick={() => { setCarX(180); setStatus("Position is too far.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
        <span className="text-[10px] text-text-2 w-[240px]">{status}</span>
        <div className="flex gap-2">
          <button onClick={() => adjustPosition(-10)} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs">CLOSER</button>
          <button onClick={() => adjustPosition(10)} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs">AWAY</button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 18. [NEW] BLIND SPOT AWARENESS SIMULATION (No-zone detection)
// ============================================================================
export const BlindSpotAwarenessSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [headTurned, setHeadTurned] = useState(false)
  const [status, setStatus] = useState("Ensure blind spots are clear. Turn your head to check before lane exit!")

  const handleHeadTurn = () => {
    setHeadTurned(true)
    setStatus("Blind spots checked! Green clearance verified. Lane changing safe.")
    if (onComplete) onComplete()
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#1a1e2b] flex flex-col p-4 justify-around items-center">
        <span className="text-white text-xs font-mono uppercase">truck proximity safety radar</span>
        
        <button 
          onClick={handleHeadTurn}
          className={`px-6 py-4 rounded-2xl text-xs font-mono font-bold transition-all ${headTurned ? 'bg-success/20 border-success text-success border-2 shadow-lg shadow-success/15' : 'bg-slate-800 border-slate-700 text-slate-400 border animate-pulse'}`}
        >
          TURN HEAD TO CHECK SIDE BLIND SPOTS
        </button>

        <p className="text-[11px] text-text-2 text-center px-4 leading-relaxed">{status}</p>
      </div>
      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-end">
        <button onClick={() => { setHeadTurned(false); setStatus("Ensure blind spots are clear.") }} className="p-2 bg-void border border-border text-text-3 rounded-xl"><RotateCcw className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

// Re-export original high-fidelity simulations
export { ParallelParkingSimulation } from './ParallelParkingSimulation'
export { ReverseBayParkingSimulation } from './ReverseBayParkingSimulation'
export { ThreePointTurnSimulation } from './DynamicHTMLSimulations'

