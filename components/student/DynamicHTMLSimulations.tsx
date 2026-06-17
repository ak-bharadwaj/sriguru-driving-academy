"use client"

import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, ArrowRight, Check, Play, ShieldAlert, AlertTriangle, Key } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

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
        { t: "2. शीशे जांचें और सिग्नल", d: "दायां संकेतक सक्रिय करें और दायां साइड मिरर जांचें।" },
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
      initialDesc: "హिल స్టార్ట్ కోసం సిద్ధం. 'ప్రారంభించండి' క్లిక్ చేయండి.",
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
// SHARED VISUAL COMPONENTS (ULTRA-REALISTIC SVG VECTORS)
// ============================================================================

export const RealisticCarSVG = ({ colorClass, showLights = false, activeGear = 'D', rightBlinker = false, step = 0 }: { colorClass: string, showLights?: boolean, activeGear?: string, rightBlinker?: boolean, step?: number }) => {
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
        {showLights && isStarted && (
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
      {rightBlinker && <div className="absolute right-[2px] bottom-[4px] w-2 h-2 bg-orange-500 rounded-full animate-ping" />}
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

/* ============================================================================
   1. VEHICLE STARTUP SIMULATION (Immersive Driver POV)
   ============================================================================ */
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
              <div className={`w-[58px] h-[58px] rounded-full border-2 relative flex items-center justify-center transition-all duration-1000 ${step >= 4 ? 'border-primary/50 bg-blue-950/40 shadow-[0_0_15px_rgba(56,189,248,0.3)_inset]' : 'border-slate-800 bg-slate-950'}`}>
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
              <div className={`w-[58px] h-[58px] rounded-full border-2 relative flex items-center justify-center transition-all duration-1000 ${step >= 4 ? 'border-primary/50 bg-blue-950/40 shadow-[0_0_15px_rgba(56,189,248,0.3)_inset]' : 'border-slate-800 bg-slate-950'}`}>
                <span className={`text-[8px] font-bold absolute top-2 transition-colors duration-1000 ${step >= 4 ? 'text-white drop-shadow-[0_0_4px_white]' : 'text-slate-700'}`}>0</span>
                <div className="absolute bottom-1/2 left-1/2 w-[3px] h-[22px] origin-bottom rounded-full transition-all duration-1000" style={{ transform: `translateX(-50%) rotate(-130deg)`, backgroundColor: step >= 4 ? '#38bdf8' : '#64748b', boxShadow: step >= 4 ? '0 0 8px #38bdf8' : 'none' }} />
              </div>
            </div>

            {/* STEERING WHEEL (transparent ring — you can see behind it) */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[185px] h-[185px] z-30" style={{ transform: 'translateX(-50%) perspective(350px) rotateX(12deg)' }}>
              {/* Column */}
              <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[44px] h-[90px] bg-slate-950 rounded-t-xl shadow-2xl" />
              {/* Ignition key beside column */}
              <div className="absolute top-[58%] left-[4px] w-[32px] h-[32px] bg-slate-950 rounded-full border-[3px] border-slate-700 flex items-center justify-center shadow-lg z-40" style={{ transform: 'perspective(100px)' }}>
                <div className={`relative w-[6px] h-[18px] rounded-sm transition-all duration-700 origin-center flex flex-col items-center ${step >= 4 ? 'rotate-90 bg-primary shadow-[0_0_10px_#38bdf8]' : 'bg-slate-400'}`}>
                  {/* Keychain hole */}
                  <div className="w-[3px] h-[3px] bg-slate-900 rounded-full mt-[1px]" />
                  {/* Dangling Keychain block that obeys gravity when turned */}
                  <div className={`absolute top-[100%] w-[12px] h-[26px] border-[2px] border-slate-500 rounded-b-md origin-top transition-transform duration-1000 ${step >= 4 ? 'rotate-[-90deg]' : 'rotate-0'}`}>
                    <div className="absolute bottom-0 w-full h-[14px] bg-slate-800 rounded-b-sm" />
                  </div>
                </div>
              </div>
              {/* Rim — thin, mostly transparent */}
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-800/80 shadow-[0_6px_20px_rgba(0,0,0,0.7)]" style={{ background: 'transparent' }}>
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

            {/* PEDALS (3D Floor Perspective) */}
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

        {/* First-person seatbelt strap crossing the driver (Left shoulder to right hip) */}
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


/* ============================================================================
   2. STEERING CONTROL SIMULATION (Slalom Drill)
   ============================================================================ */
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

  // Car weaves: starts center, dodges ABOVE cone1, then BELOW cone2, straightens
  // Cones are at y=140 (centerline). Car is 110px wide, 48px high.
  // Dodge above cone1 -> y=40 (bottom edge 88 < 140)
  // Dodge below cone2 -> y=200 (top edge 200 > 140)
  const getCarTransform = () => {
    switch (step) {
      case 1: return 'translate(30px, 130px) rotate(0deg)'    // approaching first cone
      case 2: return 'translate(240px, 180px) rotate(15deg)'  // weaving BELOW cone 1 (in top lane)
      case 3: return 'translate(460px, 80px)  rotate(-15deg)' // weaving ABOVE cone 2 (in bottom lane)
      case 4: return 'translate(680px, 130px) rotate(0deg)'   // straightening out
      case 0: default: return 'translate(-80px, 130px) rotate(0deg)' // start off-screen left
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full bg-[#353839] border-b border-white/5 overflow-hidden">
        <ScaledCanvas canvasWidth={700}>
          <div className="w-[700px] h-full relative" style={{ minHeight: '280px' }}>
          
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
          
          <div className="absolute top-[-100px] left-[-1000px] right-[-1000px] h-[100px] bg-green-900/30 border-b-[4px] border-slate-500 shadow-md" />
          <div className="absolute bottom-[-100px] left-[-1000px] right-[-1000px] h-[100px] bg-green-900/30 border-t-[4px] border-slate-500 shadow-md" />
          
          <div className="absolute top-[150px] left-[-1000px] right-[-1000px] h-0 border-t border-dashed border-white/40" />
          
          {/* Cone 1 */}
          <div className="absolute z-10" style={{top:'90px', left:'280px'}}>
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[28px] border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg" />
            <div className="w-[22px] h-[5px] bg-orange-700 rounded -mt-0.5" />
          </div>
          {/* Cone 2 */}
          <div className="absolute z-10" style={{top:'200px', left:'500px'}}>
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[28px] border-l-transparent border-r-transparent border-b-orange-500 drop-shadow-lg" />
            <div className="w-[22px] h-[5px] bg-orange-700 rounded -mt-0.5" />
          </div>
          
          <div 
            className="absolute z-20 transition-all duration-[1500ms] ease-in-out top-0 left-0"
            style={{ transform: getCarTransform() }}
          >
             <RealisticCarSVG colorClass="slate" showLights={true} step={step} activeGear={activeGear} />
          </div>

          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-9 h-9 text-text-2 transition-transform duration-[1500ms] ease-in-out" style={{ transform: `rotate(${activeWheelAngle}deg)` }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
              <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
              <line x1="18" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
              <line x1="82" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
            </svg>
            <span className="absolute -bottom-1 right-[-4px] text-[9px] font-mono bg-void border border-white/10 px-0.5 rounded text-accent">{activeWheelAngle}°</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-text-1 w-8">{speed} <span className="text-[9px] text-text-3">{t.kmh}</span></span>
              <div className="flex gap-1 bg-void border border-white/5 p-1 rounded text-[10px] font-mono font-bold">
                {["P", "R", "N", "D"].map(g => (
                  <span key={g} className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${activeGear === g ? 'bg-primary text-white' : 'text-text-3 opacity-40'}`}>{g}</span>
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider mt-1">{t.telemetry}</span>
          </div>
        </div>

        <div className="flex-1 max-w-[280px]">
          <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">{step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}</h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">{step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}</p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === 4 ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
            {step === 0 ? <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></> : step === 4 ? <><Check className="w-3 h-3" /><span>{tMod.passed}</span></> : <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   3. CLUTCH CONTROL SIMULATION (Hill Start)
   ============================================================================ */
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

  const getCarX = () => {
    switch(step) {
      case 3: return 20 
      case 4: return 250 
      default: return 15
    }
  }
  const carX = getCarX()

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      
      <div className="flex-1 relative w-full border-b border-white/5 overflow-hidden flex flex-col">
        
        {/* Top Pane: Visuals with explicitly forced 220px height */}
        <div className="h-[220px] w-full relative bg-blue-300 overflow-hidden shrink-0">
          <div className="absolute top-2 left-10 w-20 h-6 bg-white/40 rounded-full blur-sm" />
          
          <div className="absolute left-[-20%] right-[-20%] h-[300px] bg-[#353839] border-t-8 border-slate-500 origin-top-left" style={{ transform: 'rotate(-10deg)', top: '140px' }}>
             <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
          </div>

          <div 
            className={`absolute transition-all duration-[1500ms] ease-in-out`}
            style={{ 
              left: 50 + carX, 
              top: 140 - ((50 + carX) * Math.tan(10 * Math.PI / 180)) - 45, 
              transform: `rotate(-10deg) ${step === 3 ? 'rotate(-2deg)' : ''}` 
            }}
          >
             <RealisticSideProfileSVG step={step} speed={speed} />
          </div>
        </div>

        {/* Bottom Pane: Dials */}
        <div className="flex-1 bg-slate-900 flex justify-center items-center gap-10 p-4 shadow-inner relative z-10 shrink-0 min-h-[100px]">
          <div className="w-[80px] h-[80px] rounded-full border-4 border-slate-800 flex items-center justify-center relative bg-black shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <span className={`absolute top-2 text-xs font-mono font-bold text-white`}>{rpm}</span>
             <span className={`absolute bottom-2 text-[8px] font-mono font-bold text-slate-500`}>{t.rpm}</span>
             <div 
               className={`absolute bottom-1/2 left-1/2 w-[2px] h-[35px] origin-bottom transition-transform duration-300 bg-primary`}
               style={{ transform: `translateX(-50%) rotate(${-130 + (rpm / 8000) * 260}deg)`, boxShadow: '0 0 5px #38bdf8' }} 
             />
          </div>
          
          <div className="w-[120px] h-[80px] bg-black/50 rounded-xl border border-slate-800 flex items-end justify-around pb-2 px-4 shadow-inner">
             <div className="flex flex-col items-center gap-1">
               <div className={`w-6 h-12 bg-slate-700 rounded-sm border-b-4 border-slate-900 transition-transform duration-500 origin-top shadow-md ${step >= 2 ? 'scale-y-75 translate-y-2 bg-slate-600' : ''} ${step === 3 ? 'scale-y-90 translate-y-1 bg-slate-600' : ''}`} />
               <span className="text-[8px] text-slate-500 font-mono">CLUTCH</span>
             </div>
             <div className="flex flex-col items-center gap-1">
               <div className={`w-4 h-14 bg-slate-700 rounded-sm border-b-4 border-slate-900 transition-transform duration-500 origin-top shadow-md ${step >= 1 ? 'scale-y-90 translate-y-1 bg-slate-600' : ''} ${step === 4 ? 'scale-y-75 translate-y-2 bg-slate-600' : ''}`} />
               <span className="text-[8px] text-slate-500 font-mono">GAS</span>
             </div>
          </div>
        </div>

      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-9 h-9 text-text-2 transition-transform duration-[1500ms] ease-in-out" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
              <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
              <line x1="18" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
              <line x1="82" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
            </svg>
            <span className="absolute -bottom-1 right-[-4px] text-[9px] font-mono bg-void border border-white/10 px-0.5 rounded text-accent">0°</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-text-1 w-8">{speed} <span className="text-[9px] text-text-3">{t.kmh}</span></span>
              <div className="flex gap-1 bg-void border border-white/5 p-1 rounded text-[10px] font-mono font-bold">
                {["P", "R", "N", "1"].map(g => (
                  <span key={g} className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${activeGear === g ? 'bg-primary text-white' : 'text-text-3 opacity-40'}`}>{g}</span>
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider mt-1">{t.telemetry}</span>
          </div>
        </div>

        <div className="flex-1 max-w-[280px]">
          <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">{step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}</h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">{step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}</p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === 4 ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
            {step === 0 ? <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></> : step === 4 ? <><Check className="w-3 h-3" /><span>{tMod.success}</span></> : <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   4. HIGHWAY MERGING SIMULATION
   ============================================================================ */
export const HighwayMergingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = SIM_T[language] || SIM_T.EN
  const tMod = t.merge

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
        <ScaledCanvas canvasWidth={700}>
          <div className="w-[700px] h-full relative" style={{ minHeight: '280px' }}>
          
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />

          <div className="absolute top-[80px] bottom-[20px] left-[-1000px] right-[-1000px] border-t-[6px] border-b-[6px] border-slate-500 bg-[#353839] shadow-inner">
             <div className="absolute top-[50%] left-0 right-0 h-0 border-t-[6px] border-dashed border-white/60" />
          </div>
          
          <div className="absolute top-[30px] left-[-100px] w-[350px] h-[55px] bg-[#353839] border-t-[6px] border-slate-500 shadow-xl" style={{ transform: 'rotate(8deg)', transformOrigin: 'top right' }}>
             <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-pattern.png')]" />
          </div>
          
          <div className={`absolute transition-all duration-[5000ms] ease-linear drop-shadow-xl z-10`} style={{ left: step > 0 ? '700px' : '50px', top: '110px' }}>
             <RealisticCarSVG colorClass="red" showLights={true} step={1} activeGear="D" />
          </div>
          <div className={`absolute transition-all duration-[5000ms] ease-linear delay-500 drop-shadow-xl z-10`} style={{ left: step >= 2 ? '700px' : '-100px', top: '210px' }}>
             <RealisticCarSVG colorClass="blue" showLights={true} step={1} activeGear="D" />
          </div>

          <div 
            className="absolute z-20 transition-all duration-[1500ms] ease-in-out top-0 left-0"
            style={{ transform: getCarTransform() }}
          >
             <RealisticCarSVG colorClass="slate" showLights={true} step={step} activeGear={activeGear} rightBlinker={step === 2} />
          </div>

          </div>
        </ScaledCanvas>
      </div>

      <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-9 h-9 text-text-2 transition-transform duration-[1500ms] ease-in-out" style={{ transform: `rotate(${activeWheelAngle}deg)` }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
              <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
              <line x1="18" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
              <line x1="82" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8" />
            </svg>
            <span className="absolute -bottom-1 right-[-4px] text-[9px] font-mono bg-void border border-white/10 px-0.5 rounded text-accent">{activeWheelAngle}°</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-text-1 w-8">{speed} <span className="text-[9px] text-text-3">{t.kmh}</span></span>
              <div className="flex gap-1 bg-void border border-white/5 p-1 rounded text-[10px] font-mono font-bold">
                {["P", "R", "N", "D"].map(g => (
                  <span key={g} className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${activeGear === g ? 'bg-primary text-white' : 'text-text-3 opacity-40'}`}>{g}</span>
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider mt-1">{t.telemetry}</span>
          </div>
        </div>

        <div className="flex-1 max-w-[280px]">
          <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">{step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}</h4>
          <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">{step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}</p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handleReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleNext} disabled={isAnimating || step === 4} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === 4 ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
            {step === 0 ? <><Play className="w-3 h-3 fill-current" /><span>{t.begin}</span></> : step === 4 ? <><Check className="w-3 h-3" /><span>{tMod.merged}</span></> : <><span>{t.next}</span><ArrowRight className="w-3 h-3" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
