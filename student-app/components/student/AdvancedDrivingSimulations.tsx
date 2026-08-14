"use client"

import React, { useState, useEffect } from 'react'
import { RotateCcw, ArrowRight, Check, Play, AlertTriangle, Moon, Sun } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

export interface SimulationProps { onComplete?: () => void }

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const ADV_T = {
  EN: {
    begin: "Begin", next: "Next", kmh: "km/h", telemetry: "Telemetry",
    threePoint: {
      initialTitle: "Three-Point Turn Setup",
      initialDesc: "Position in the centre of the road. Click 'Begin'.",
      done: "Turn Complete",
      steps: [
        { t: "1. Check Mirrors & Signal Right", d: "Check mirrors and blind spots. Activate right indicator before turning." },
        { t: "2. Full Right Lock — Drive Forward", d: "Turn steering wheel fully right. Drive forward slowly to the opposite kerb." },
        { t: "3. Full Left Lock — Reverse", d: "Shift to Reverse. Turn full left lock. Reverse slowly to the original kerb." },
        { t: "4. Straighten & Drive Away", d: "Shift to Drive. Straighten the wheel. Drive forward in the new direction." }
      ]
    },
    emergency: {
      initialTitle: "Emergency Braking Drill",
      initialDesc: "You are cruising at 60 km/h. Stay alert. Click 'Begin'.",
      safe: "Stopped Safely",
      steps: [
        { t: "1. Cruising at 60 km/h", d: "Maintain safe speed. Keep eyes scanning the road ahead at all times." },
        { t: "2. ⚠️ Hazard Spotted!", d: "Child on road ahead! Immediately lift off gas. You have 1.5 seconds to react." },
        { t: "3. ABS Active — Full Brake", d: "Press the brake pedal HARD to the floor. ABS prevents wheel lock. You can still steer." },
        { t: "4. Safely Stopped", d: "Vehicle stopped before the hazard. ABS kept all 4 wheels rolling. Check mirrors before moving." }
      ]
    },
    roundabout: {
      initialTitle: "Roundabout Approach",
      initialDesc: "You are approaching a roundabout. Click 'Begin'.",
      exited: "Exited Safely",
      steps: [
        { t: "1. Slow Down & Give Way", d: "Reduce speed to 20 km/h. Give way to ALL traffic already inside the roundabout." },
        { t: "2. Check Right & Enter", d: "Look right. When there is a clear gap, enter smoothly without stopping." },
        { t: "3. Navigate the Circle", d: "Stay in your lane. Check for your exit sign. Do not change lanes inside the roundabout." },
        { t: "4. Signal Left & Exit", d: "Indicate left well before your exit. Check mirror, then exit the roundabout smoothly." }
      ]
    },
    night: {
      initialTitle: "Night Drive Preparation",
      initialDesc: "It is dark outside. Night driving requires extra awareness. Click 'Begin'.",
      done: "Night Drive Complete",
      steps: [
        { t: "1. Switch On Low Beam Headlights", d: "Always use Low Beam headlights at night. Never drive without lights in the dark." },
        { t: "2. Dip Lights for Oncoming Traffic", d: "Oncoming car ahead! Switch to Low Beam immediately to avoid blinding the other driver." },
        { t: "3. High Beam on Clear Road", d: "Road ahead is clear. Switch to High Beam for maximum vision at speed." },
        { t: "4. Fog/Rain — Slow Down", d: "Visibility is reduced. Reduce speed, switch on fog lights, increase following distance to 4 seconds." }
      ]
    }
  },
  HI: {
    begin: "शुरू करें", next: "अगला", kmh: "किमी/घं", telemetry: "टेलीमेट्री",
    threePoint: {
      initialTitle: "तीन-बिंदु मोड़ सेटअप", initialDesc: "सड़क के मध्य में स्थिति लें। 'शुरू करें' पर क्लिक करें।", done: "मोड़ पूर्ण",
      steps: [
        { t: "1. दर्पण जांचें और दाहिना संकेत दें", d: "दर्पण और अंध स्थान जांचें। दाहिना संकेतक लगाएं।" },
        { t: "2. पूरा दाहिना लॉक — आगे बढ़ें", d: "स्टीयरिंग पूरा दाहिना घुमाएं। विपरीत किनारे तक धीरे बढ़ें।" },
        { t: "3. पूरा बाएं लॉक — पीछे हटें", d: "रिवर्स में जाएं, पूरा बाएं लॉक। मूल किनारे तक पीछे जाएं।" },
        { t: "4. सीधा करें और आगे बढ़ें", d: "ड्राइव में जाएं, पहिया सीधा करें। नई दिशा में आगे बढ़ें।" }
      ]
    },
    emergency: {
      initialTitle: "आपातकालीन ब्रेकिंग", initialDesc: "आप 60 किमी/घं की रफ्तार पर हैं। सतर्क रहें।", safe: "सुरक्षित रूप से रुका",
      steps: [
        { t: "1. 60 किमी/घं की रफ्तार", d: "गति बनाए रखें। आगे लगातार देखते रहें।" },
        { t: "2. ⚠️ खतरा सामने!", d: "सड़क पर बच्चा! तुरंत गैस छोड़ें। 1.5 सेकंड में प्रतिक्रिया करें।" },
        { t: "3. ABS ब्रेकिंग — पूरा दबाएं", d: "ब्रेक पेडल पूरी तरह दबाएं। ABS पहियों को लॉक होने से बचाता है।" },
        { t: "4. खतरे से पहले रुका", d: "वाहन सुरक्षित रूप से रुका। दर्पण जांचें।" }
      ]
    },
    roundabout: {
      initialTitle: "चौराहे की तैयारी", initialDesc: "आप एक चौराहे के पास आ रहे हैं।", exited: "सुरक्षित निकले",
      steps: [
        { t: "1. धीमा करें और रास्ता दें", d: "20 किमी/घं तक धीमा करें। अंदर के यातायात को रास्ता दें।" },
        { t: "2. दाहिना जांचें और प्रवेश करें", d: "दाहिने से रास्ता मिलने पर प्रवेश करें।" },
        { t: "3. गोल घूमें", d: "अपनी लेन में रहें। अपनी निकास देखें।" },
        { t: "4. बाएं संकेत दें और निकलें", d: "निकास से पहले बाएं संकेतक लगाएं। आसानी से निकलें।" }
      ]
    },
    night: {
      initialTitle: "रात की ड्राइविंग तैयारी", initialDesc: "बाहर अंधेरा है। सावधानी चाहिए।", done: "रात की ड्राइव सुरक्षित",
      steps: [
        { t: "1. हेडलाइट चालू करें", d: "लो बीम हेडलाइट चालू करें।" },
        { t: "2. सामने वाले के लिए लाइट कम करें", d: "सामने से गाड़ी आ रही है! तुरंत लो बीम करें।" },
        { t: "3. साफ सड़क पर हाई बीम", d: "सड़क साफ है। हाई बीम से अधिक दूरी तक दिखता है।" },
        { t: "4. धुंध/बारिश में धीमा चलें", d: "दृश्यता कम है। गति घटाएं। फॉग लाइट उपयोग करें।" }
      ]
    }
  },
  TE: {
    begin: "ప్రారంభించండి", next: "తదుపరి", kmh: "కిమీ/గం", telemetry: "టెలిమెట్రీ",
    threePoint: {
      initialTitle: "త్రి-పాయింట్ టర్న్", initialDesc: "రోడ్‌ మధ్యలో నిలబడండి.", done: "టర్న్ పూర్తైంది",
      steps: [
        { t: "1. అద్దాలు & కుడి సిగ్నల్", d: "అద్దాలు, బ్లైండ్ స్పాట్ తనిఖీ. కుడి ఇండికేటర్ వేయండి." },
        { t: "2. పూర్తి కుడి లాక్ — ముందుకు", d: "స్టీరింగ్ పూర్తిగా కుడికి. నెమ్మదిగా ముందుకు వెళ్ళండి." },
        { t: "3. పూర్తి ఎడమ లాక్ — వెనుకకు", d: "రివర్స్‌లో పూర్తి ఎడమ. వెనుకకు వెళ్ళండి." },
        { t: "4. నేరుగా & ముందుకు", d: "డ్రైవ్‌లో, స్టీరింగ్ నేరుగా. కొత్త దిశలో ముందుకు." }
      ]
    },
    emergency: {
      initialTitle: "అత్యవసర బ్రేకింగ్", initialDesc: "మీరు 60 కిమీ/గం వెళ్తున్నారు.", safe: "సురక్షితంగా ఆగింది",
      steps: [
        { t: "1. 60 కిమీ/గం వేగం", d: "వేగం కాపాడుకోండి. ముందు చూస్తూ ఉండండి." },
        { t: "2. ⚠️ ముందు ప్రమాదం!", d: "రోడ్‌పై పిల్లవాడు! వెంటనే గ్యాస్ వదలండి." },
        { t: "3. ABS బ్రేకింగ్", d: "బ్రేక్ పెడల్ పూర్తిగా నొక్కండి." },
        { t: "4. ప్రమాదానికి ముందే ఆగింది", d: "వాహనం సురక్షితంగా ఆగింది." }
      ]
    },
    roundabout: {
      initialTitle: "రౌండ్‌అబౌట్ అప్రోచ్", initialDesc: "మీరు రౌండ్‌అబౌట్ వద్దకు వస్తున్నారు.", exited: "సురక్షితంగా బయటకు",
      steps: [
        { t: "1. నెమ్మది & దారివ్వు", d: "20 కిమీ/గం కి తగ్గించండి. లోపల ట్రాఫిక్‌కు దారివ్వండి." },
        { t: "2. కుడి చూసి ప్రవేశించండి", d: "కుడి నుండి గ్యాప్ ఉంటే ప్రవేశించండి." },
        { t: "3. వృత్తాన్ని నావిగేట్ చేయండి", d: "మీ లేన్‌లో ఉండండి. ఎగ్జిట్ చూడండి." },
        { t: "4. ఎడమ సిగ్నల్ & బయటకు", d: "ఎగ్జిట్ ముందు ఎడమ ఇండికేటర్. నేరుగా బయటకు." }
      ]
    },
    night: {
      initialTitle: "రాత్రి డ్రైవింగ్", initialDesc: "చీకటిగా ఉంది. జాగ్రత్తగా ఉండండి.", done: "రాత్రి డ్రైవ్ సురక్షితం",
      steps: [
        { t: "1. హెడ్‌లైట్లు వేయండి", d: "లో బీమ్ హెడ్‌లైట్లు వేయండి." },
        { t: "2. ఎదురు వాహనానికి డిప్", d: "ఎదురు వాహనం! వెంటనే లో బీమ్ చేయండి." },
        { t: "3. హై బీమ్", d: "రోడ్ స్వచ్ఛంగా ఉంది. హై బీమ్ వేయండి." },
        { t: "4. వర్షంలో నెమ్మది", d: "దృశ్యత తక్కువ. వేగం తగ్గించండి." }
      ]
    }
  }
}

/* ============================================================
   TOP-DOWN CAR SVG (overhead bird's-eye view)
   Front of car = RIGHT side (positive X)
   ============================================================ */
const TopDownCar = ({ color = '#94a3b8', indicatorRight = false, indicatorLeft = false, blink = false }: {
  color?: string, indicatorRight?: boolean, indicatorLeft?: boolean, blink?: boolean
}) => {
  const indCol = blink ? '#fb923c' : 'transparent'
  return (
    <svg width="66" height="32" viewBox="0 0 66 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
      {/* Body */}
      <rect x="1" y="3" width="64" height="26" rx="9" fill={color} stroke="#0f172a" strokeWidth="1.5"/>
      {/* Rear glass */}
      <rect x="6"  y="6" width="14" height="20" rx="3" fill="#0f172a" opacity="0.8"/>
      {/* Roof */}
      <rect x="22" y="7" width="22" height="18" rx="3" fill={color} opacity="0.5"/>
      {/* Front glass */}
      <rect x="46" y="6" width="14" height="20" rx="3" fill="#0f172a" opacity="0.8"/>
      {/* Front headlights */}
      <rect x="61" y="5"  width="4" height="7" rx="1" fill="#fef08a"/>
      <rect x="61" y="20" width="4" height="7" rx="1" fill="#fef08a"/>
      {/* Rear lights */}
      <rect x="1" y="5"  width="4" height="7" rx="1" fill="#dc2626"/>
      <rect x="1" y="20" width="4" height="7" rx="1" fill="#dc2626"/>
      {/* Right indicator (bottom side when facing right) */}
      {indicatorRight && <rect x="60" y="20" width="4" height="7" rx="1" fill={indCol}/>}
      {/* Left indicator (top side when facing right) */}
      {indicatorLeft  && <rect x="60" y="5"  width="4" height="7" rx="1" fill={indCol}/>}
      {/* Wheels */}
      <rect x="9"  y="0"  width="14" height="7" rx="2" fill="#1e293b"/>
      <rect x="9"  y="25" width="14" height="7" rx="2" fill="#1e293b"/>
      <rect x="43" y="0"  width="14" height="7" rx="2" fill="#1e293b"/>
      <rect x="43" y="25" width="14" height="7" rx="2" fill="#1e293b"/>
    </svg>
  )
}

/* Shared steering wheel mini icon used in the bottom bar */
const WheelIcon = ({ angle }: { angle: number }) => (
  <svg className="w-9 h-9 text-text-2 transition-transform duration-[1500ms] ease-in-out" style={{ transform: `rotate(${angle}deg)` }} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8"/>
    <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8"/>
    <line x1="18" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8"/>
    <line x1="82" y1="68" x2="50" y2="50" stroke="currentColor" strokeWidth="8"/>
    <circle cx="50" cy="50" r="8" fill="currentColor"/>
  </svg>
)

/* Shared bottom control bar */
const ControlBar = ({
  step, maxStep, speed, gear, wheelAngle, isAnimating, onNext, onReset,
  title, desc, doneLabel, beginLabel, nextLabel, t
}: {
  step: number, maxStep: number, speed: number, gear: string, wheelAngle: number,
  isAnimating: boolean, onNext: () => void, onReset: () => void,
  title: string, desc: string, doneLabel: string, beginLabel: string, nextLabel: string,
  t: { kmh: string, telemetry: string }
}) => (
  <div className="h-[90px] bg-[#07090e] border-t border-white/10 px-4 py-2 flex items-center justify-between gap-4 relative z-30">
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0 bg-void border border-white/10 rounded-full flex items-center justify-center shadow-inner">
        <WheelIcon angle={wheelAngle} />
        <span className="absolute -bottom-1 right-[-4px] text-[9px] font-mono bg-void border border-white/10 px-0.5 rounded text-accent">{wheelAngle}°</span>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold font-mono text-text-1 w-8">{speed} <span className="text-[9px] text-text-3">{t.kmh}</span></span>
          <div className="flex gap-1 bg-void border border-white/5 p-1 rounded text-[10px] font-mono font-bold">
            {["P","R","N","D"].map(g => (
              <span key={g} className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${gear === g ? 'bg-primary text-white' : 'text-text-3 opacity-40'}`}>{g}</span>
            ))}
          </div>
        </div>
        <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider mt-1">{t.telemetry}</span>
      </div>
    </div>
    <div className="flex-1 max-w-[300px]">
      <h4 className="text-[11px] sm:text-xs font-bold text-accent font-display uppercase tracking-wider leading-none">{title}</h4>
      <p className="text-[10px] sm:text-xs text-text-2 font-body mt-1 leading-snug line-clamp-2">{desc}</p>
    </div>
    <div className="flex gap-2">
      {step > 0 && (
        <button onClick={onReset} disabled={isAnimating} className="p-2 bg-void hover:bg-white/[0.02] border border-border text-text-3 hover:text-text-1 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none">
          <RotateCcw className="w-4 h-4"/>
        </button>
      )}
      <button onClick={onNext} disabled={isAnimating || step === maxStep} className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:pointer-events-none ${step === maxStep ? 'bg-success/20 border border-success/30 text-success' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/10 disabled:opacity-40'}`}>
        {step === 0 ? <><Play className="w-3 h-3 fill-current"/><span>{beginLabel}</span></>
         : step === maxStep ? <><Check className="w-3 h-3"/><span>{doneLabel}</span></>
         : <><span>{nextLabel}</span><ArrowRight className="w-3 h-3"/></>}
      </button>
    </div>
  </div>
)

/* ============================================================
   1. THREE-POINT TURN SIMULATION
   ============================================================ */
export const ThreePointTurnSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = ADV_T[language as keyof typeof ADV_T] || ADV_T.EN
  const tMod = t.threePoint

  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [blink, setBlink] = useState(false)

  // Blink indicator on step 1
  useEffect(() => {
    if (step === 1) {
      const id = setInterval(() => setBlink(b => !b), 500)
      return () => clearInterval(id)
    }
    setBlink(false)
  }, [step])

  const stepsInfo = [
    { gear: 'D', wheelAngle: 0,    targetSpeed: 5 },
    { gear: 'D', wheelAngle: 450,  targetSpeed: 5 },
    { gear: 'R', wheelAngle: -450, targetSpeed: 4 },
    { gear: 'D', wheelAngle: 0,    targetSpeed: 8 },
  ]

  useEffect(() => {
    if (step === 0) { setSpeed(0); return }
    const tgt = stepsInfo[step - 1].targetSpeed
    setIsAnimating(true)
    let s = speed
    const id = setInterval(() => {
      if (s < tgt) { s++; setSpeed(s) }
      else {
        clearInterval(id)
        setTimeout(() => {
          let d = tgt
          const id2 = setInterval(() => {
            if (d > 0) { d--; setSpeed(d) }
            else { clearInterval(id2); setIsAnimating(false); if (step === 4 && onComplete) onComplete() }
          }, 150)
        }, 1200)
      }
    }, 120)
    return () => clearInterval(id)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(p => p + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  // Car positions: top-left of 66x32 car wrapper.
  // Step 0/1: Start top lane (Y=104 -> Center 120), facing right (0deg).
  // Step 2: Full Right Lock -> moves to bottom kerb (Y=174 -> Center 190), facing down-right (70deg).
  // Step 3: Full Left Lock in Reverse -> moves back to top kerb (Y=114 -> Center 130), facing down-left (140deg).
  // Step 4: Drive away -> bottom lane (Y=179 -> Center 195), facing left (180deg).
  const getCarStyle = () => {
    switch (step) {
      case 1: return { transform: 'translate(120px, 104px) rotate(0deg)',   transformOrigin: '33px 16px' }
      case 2: return { transform: 'translate(260px, 174px) rotate(70deg)', transformOrigin: '33px 16px' }
      case 3: return { transform: 'translate(160px, 114px) rotate(140deg)', transformOrigin: '33px 16px' }
      case 4: return { transform: 'translate(20px, 179px) rotate(180deg)', transformOrigin: '33px 16px' }
      default: return { transform: 'translate(-30px, 104px) rotate(0deg)',  transformOrigin: '33px 16px' }
    }
  }

  const curGear   = step === 0 ? 'P' : stepsInfo[step - 1].gear
  const curAngle  = step === 0 ? 0   : stepsInfo[step - 1].wheelAngle

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full border-b border-white/5 overflow-hidden">
        <div className="w-full h-full relative bg-[#353839] flex justify-center">

          {/* Green verges */}
          <div className="absolute top-0 left-0 right-0 h-[90px] bg-green-900/60 border-b-4 border-slate-600"/>
          <div className="absolute bottom-0 left-0 right-0 h-[90px] bg-green-900/60 border-t-4 border-slate-600"/>

          {/* Road texture */}
          <div className="absolute top-[90px] bottom-[90px] left-0 right-0 bg-[#3d4043]"/>

          {/* Road dashed centre line */}
          <div className="absolute top-[148px] left-0 right-0 border-t-2 border-dashed border-yellow-500/60"/>

          {/* Kerb marks */}
          {[...Array(14)].map((_, i) => (
            <div key={i} className="absolute w-[40px] h-[8px]" style={{ top: '87px', left: `${i * 52}px`, background: 'repeating-linear-gradient(90deg,#fff 0,#fff 10px,#ef4444 10px,#ef4444 20px)' }}/>
          ))}
          {[...Array(14)].map((_, i) => (
            <div key={i} className="absolute w-[40px] h-[8px]" style={{ bottom: '87px', left: `${i * 52}px`, background: 'repeating-linear-gradient(90deg,#fff 0,#fff 10px,#ef4444 10px,#ef4444 20px)' }}/>
          ))}

          {/* Ghost arc path lines for the two swing arcs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {/* Arc 1: forward right swing (step 2 path) */}
            {step >= 2 && (
              <path d="M 153,120 Q 220,120 293,190" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" fill="none" opacity="0.6"/>
            )}
            {/* Arc 2: reverse left swing (step 3 path) */}
            {step >= 3 && (
              <path d="M 293,190 Q 220,204 193,130" stroke="#f97316" strokeWidth="2" strokeDasharray="8 6" fill="none" opacity="0.6"/>
            )}
            {/* Final drive direction arrow */}
            {step >= 4 && (
              <g>
                <path d="M 193,130 Q 160,195 53,195" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arr)" fill="none"/>
                <defs>
                  <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#4ade80"/>
                  </marker>
                </defs>
              </g>
            )}
          </svg>

          {/* THE CAR */}
          <div
            className="absolute z-20 transition-all duration-[1800ms] ease-in-out top-0 left-0"
            style={getCarStyle()}
          >
            <TopDownCar
              color="#94a3b8"
              indicatorRight={step === 1}
              blink={blink}
            />
          </div>

          {/* Step labels overlaid */}
          {step >= 2 && (
            <div className="absolute top-[45px] left-[330px] text-[9px] font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full z-30">
              → Opposite kerb
            </div>
          )}
          {step >= 3 && (
            <div className="absolute bottom-[45px] left-[60px] text-[9px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/30 px-2 py-0.5 rounded-full z-30">
              ← Original kerb
            </div>
          )}
        </div>
      </div>

      <ControlBar
        step={step} maxStep={4} speed={speed} gear={curGear} wheelAngle={curAngle}
        isAnimating={isAnimating} onNext={handleNext} onReset={handleReset}
        title={step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}
        desc={step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}
        doneLabel={tMod.done} beginLabel={t.begin} nextLabel={t.next} t={t}
      />
    </div>
  )
}

/* ============================================================
   2. EMERGENCY BRAKING SIMULATION
   ============================================================ */
export const EmergencyBrakingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = ADV_T[language as keyof typeof ADV_T] || ADV_T.EN
  const tMod = t.emergency

  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [absFlash, setAbsFlash] = useState(false)

  useEffect(() => {
    if (step === 3) {
      const id = setInterval(() => setAbsFlash(f => !f), 120)
      return () => clearInterval(id)
    }
    setAbsFlash(false)
  }, [step])

  const targetSpeeds = [60, 60, 20, 0]

  useEffect(() => {
    if (step === 0) { setSpeed(0); return }
    const tgt = targetSpeeds[step - 1]
    setIsAnimating(true)
    let s = speed
    const delta = tgt > s ? 3 : tgt === s ? 0 : (step === 3 ? 4 : 2)
    if (delta === 0) { setTimeout(() => { setIsAnimating(false); if (step === 4 && onComplete) onComplete() }, 1500); return }
    const id = setInterval(() => {
      if (tgt > s) { s = Math.min(s + delta, tgt); setSpeed(s) }
      else if (tgt < s) { s = Math.max(s - delta, tgt); setSpeed(s) }
      else { clearInterval(id); setTimeout(() => { setIsAnimating(false); if (step === 4 && onComplete) onComplete() }, 1000) }
    }, 80)
    return () => clearInterval(id)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(p => p + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  // Car position: starts at left, moves right with speed, brakes in step 3
  const getCarX = () => {
    switch (step) {
      case 1: return 60
      case 2: return 160
      case 3: return 260
      case 4: return 260 // stopped
      default: return 20
    }
  }

  // Skid marks length (grows during braking)
  const skidLen = step >= 3 ? 80 : 0

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full border-b border-white/5 overflow-hidden bg-[#3d4043]">

        {/* Sky horizon */}
        <div className="absolute top-0 left-0 right-0 h-[60px] bg-blue-300/80"/>
        {/* Trees/bushes silhouette */}
        <div className="absolute top-[20px] left-0 right-0 h-[45px] bg-green-900/70 border-b-2 border-green-800"/>

        {/* Road surface */}
        <div className="absolute top-[60px] left-0 right-0 bottom-0 bg-[#3d4043]"/>

        {/* Road kerb line */}
        <div className="absolute top-[60px] left-0 right-0 h-[4px] bg-white/60"/>
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/60"/>

        {/* Animated road centre dashes */}
        <div className="absolute top-[120px] left-0 right-0 overflow-hidden h-[4px]">
          <div
            className={`flex gap-[40px] h-full ${step >= 1 && step <= 2 ? 'animate-[slide_0.4s_linear_infinite]' : ''}`}
            style={{ width: '200%' }}
          >
            {[...Array(30)].map((_, i) => <div key={i} className="w-[60px] h-full bg-yellow-400/70 flex-shrink-0"/>)}
          </div>
        </div>

        {/* Skid marks (appear during hard braking) */}
        {skidLen > 0 && (
          <>
            <div className="absolute top-[95px] left-0 h-[6px] rounded bg-slate-900/60 transition-all duration-[800ms]" style={{ width: `${260 - 16 + skidLen * 0.6}px` }}/>
            <div className="absolute top-[135px] left-0 h-[6px] rounded bg-slate-900/60 transition-all duration-[800ms]" style={{ width: `${260 - 16 + skidLen * 0.6}px` }}/>
          </>
        )}

        {/* HAZARD: child/person on road */}
        {step >= 2 && (
          <div className="absolute z-20 transition-all duration-700" style={{ left: '420px', top: '80px' }}>
            {/* Simple person silhouette */}
            <svg width="24" height="50" viewBox="0 0 24 50" fill="none">
              <circle cx="12" cy="7" r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5"/>
              <rect x="6" y="14" width="12" height="20" rx="4" fill="#ef4444" stroke="#0f172a" strokeWidth="1"/>
              <rect x="2" y="34" width="7" height="14" rx="3" fill="#1e3a5f" stroke="#0f172a" strokeWidth="1"/>
              <rect x="15" y="34" width="7" height="14" rx="3" fill="#1e3a5f" stroke="#0f172a" strokeWidth="1"/>
            </svg>
            {/* Warning triangle */}
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${step === 2 ? 'animate-bounce' : ''}`}>
              <AlertTriangle className="w-6 h-6 text-red-500 drop-shadow-lg"/>
            </div>
          </div>
        )}

        {/* ABS Warning on screen during step 3 */}
        {step === 3 && (
          <div className={`absolute top-4 right-4 z-30 px-3 py-1 rounded-lg font-bold text-xs font-mono border transition-opacity ${absFlash ? 'bg-amber-500 border-amber-400 text-black' : 'bg-amber-900/30 border-amber-800 text-amber-600'}`}>
            ABS ACTIVE
          </div>
        )}

        {/* THE CAR (side profile) */}
        <div
          className="absolute z-20 transition-all duration-[1200ms] ease-in-out"
          style={{
            left: `${getCarX()}px`,
            top: '70px',
            transform: step >= 3 ? 'rotate(-2deg)' : 'rotate(0deg)'
          }}
        >
          {/* Simple side profile car SVG */}
          <svg width="140" height="55" viewBox="0 0 140 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wheels */}
            <circle cx="28" cy="46" r="10" fill="#1e293b"/>
            <circle cx="28" cy="46" r="5" fill="#475569"/>
            <circle cx="108" cy="46" r="10" fill="#1e293b"/>
            <circle cx="108" cy="46" r="5" fill="#475569"/>
            {/* Body */}
            <path d="M 10 36 L 130 36 C 136 36 138 30 135 24 L 120 15 L 100 5 L 58 5 L 32 15 L 14 22 C 9 25 7 31 10 36 Z" fill="#94a3b8" stroke="#334155" strokeWidth="1.5"/>
            {/* Windscreen */}
            <path d="M 35 17 L 62 6 L 97 6 L 117 17 Z" fill="#0f172a" opacity="0.9"/>
            <line x1="79" y1="6" x2="79" y2="17" stroke="#94a3b8" strokeWidth="1.5"/>
            {/* Headlights */}
            <rect x="130" y="20" width="6" height="8" rx="2" fill="#fef08a" filter="drop-shadow(3px 0 6px #fef08a)"/>
            {/* Tail lights */}
            <rect x="4" y="22" width="5" height="8" rx="2" fill={step >= 2 ? '#ef4444' : '#7f1d1d'} filter={step >= 2 ? 'drop-shadow(-3px 0 6px #ef4444)' : ''}/>
            {/* Braking glow on wheels during ABS */}
            {step === 3 && absFlash && (
              <>
                <circle cx="28" cy="46" r="12" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
                <circle cx="108" cy="46" r="12" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
              </>
            )}
          </svg>
        </div>

        {/* Big Speedometer display */}
        <div className="absolute bottom-4 right-6 z-30 w-[90px] h-[90px] rounded-full bg-black/80 border-4 border-slate-700 flex flex-col items-center justify-center shadow-2xl">
          <span className={`text-2xl font-black font-mono transition-colors ${speed > 40 ? 'text-red-400' : speed > 15 ? 'text-amber-400' : 'text-green-400'}`}>{speed}</span>
          <span className="text-[9px] text-slate-500 font-mono">{t.kmh}</span>
          <div className={`mt-1 w-2 h-2 rounded-full ${speed > 0 ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}/>
        </div>

        {/* Stopping distance label */}
        {step === 4 && (
          <div className="absolute top-4 left-4 z-30 bg-success/20 border border-success/40 text-success text-xs font-bold px-3 py-1.5 rounded-lg font-mono">
            ✓ Stopped in time!
          </div>
        )}
      </div>

      <ControlBar
        step={step} maxStep={4} speed={speed} gear="D" wheelAngle={0}
        isAnimating={isAnimating} onNext={handleNext} onReset={handleReset}
        title={step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}
        desc={step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}
        doneLabel={tMod.safe} beginLabel={t.begin} nextLabel={t.next} t={t}
      />

      <style>{`@keyframes slide { from { transform: translateX(0) } to { transform: translateX(-100px) } }`}</style>
    </div>
  )
}

/* ============================================================
   3. ROUNDABOUT NAVIGATION SIMULATION
   ============================================================ */
export const RoundaboutSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = ADV_T[language as keyof typeof ADV_T] || ADV_T.EN
  const tMod = t.roundabout

  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [blink, setBlink] = useState(false)

  // Blink left indicator on step 4 (exiting)
  useEffect(() => {
    if (step === 4) {
      const id = setInterval(() => setBlink(b => !b), 500)
      return () => clearInterval(id)
    }
    setBlink(false)
  }, [step])

  useEffect(() => {
    if (step === 0) { setSpeed(0); return }
    const targets = [30, 20, 20, 20]
    const tgt = targets[step - 1]
    setIsAnimating(true)
    let s = speed
    const id = setInterval(() => {
      if (s < tgt) { s++; setSpeed(s) }
      else if (s > tgt) { s--; setSpeed(s) }
      else { clearInterval(id); setTimeout(() => { setIsAnimating(false); if (step === 4 && onComplete) onComplete() }, 1000) }
    }, 80)
    return () => clearInterval(id)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(p => p + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  // Car positions along the roundabout arc (enter south, exit west)
  // Roundabout centre: (310, 145). Inner drive lane radius: ~82px
  // If r=82, SW point (135deg) is X=252, Y=203. Car center should be there.
  // Car width=66, height=32 (center 33, 16). Top-left = X-33, Y-16.
  const getCarStyle = (): React.CSSProperties => {
    switch (step) {
      case 1: return { transform: 'translate(258px, 234px) rotate(-90deg) scale(0.6)', transformOrigin: '33px 16px' } // approaching south (X=258 centers in left lane)
      case 2: return { transform: 'translate(258px, 199px) rotate(-90deg) scale(0.6)', transformOrigin: '33px 16px' } // at give-way
      case 3: return { transform: 'translate(219px, 187px) rotate(-135deg) scale(0.6)', transformOrigin: '33px 16px' } // inside circle (SW arc)
      case 4: return { transform: 'translate(140px, 110px) rotate(-180deg) scale(0.6)', transformOrigin: '33px 16px' } // exiting west (Y=110 centers in top lane)
      default: return { transform: 'translate(258px, 280px) rotate(-90deg) scale(0.6)', transformOrigin: '33px 16px' }
    }
  }

  const curAngle = step === 0 ? 0 : step <= 2 ? -20 : step === 3 ? -45 : 0

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full border-b border-white/5 overflow-hidden">
        <div className="w-full h-full relative bg-green-900/40">

          {/* Background asphalt for roads */}
          {/* South road */}
          <div className="absolute bg-[#3d4043] border-l-4 border-r-4 border-slate-600" style={{ left: '280px', top: '195px', width: '70px', bottom: 0 }}/>
          {/* North road */}
          <div className="absolute bg-[#3d4043] border-l-4 border-r-4 border-slate-600" style={{ left: '280px', top: 0, width: '70px', height: '80px' }}/>
          {/* West road */}
          <div className="absolute bg-[#3d4043] border-t-4 border-b-4 border-slate-600" style={{ left: 0, top: '120px', width: '200px', height: '70px' }}/>
          {/* East road */}
          <div className="absolute bg-[#3d4043] border-t-4 border-b-4 border-slate-600" style={{ left: '425px', top: '120px', right: 0, height: '70px' }}/>

          {/* THE ROUNDABOUT RING */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Outer ring - asphalt */}
            <circle cx="310" cy="145" r="115" fill="#3d4043"/>
            {/* White outer edge */}
            <circle cx="310" cy="145" r="115" fill="none" stroke="#64748b" strokeWidth="4"/>
            {/* Inner island */}
            <circle cx="310" cy="145" r="45" fill="#16a34a" stroke="#4ade80" strokeWidth="2"/>
            {/* Centre island detail */}
            <circle cx="310" cy="145" r="30" fill="#15803d" stroke="#4ade80" strokeWidth="1" strokeDasharray="6 4" opacity="0.6"/>
            {/* Directional arrows in roundabout */}
            <text x="310" y="110" textAnchor="middle" fill="#4ade80" fontSize="18" opacity="0.7">↻</text>
            {/* Lane markings - dashed arc */}
            <circle cx="310" cy="145" r="82" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="12 10" opacity="0.5"/>
            {/* Give-way dashed line at south entry */}
            <line x1="284" y1="200" x2="346" y2="200" stroke="white" strokeWidth="2" strokeDasharray="8 6"/>
            {/* Road direction arrows on entries */}
            <text x="315" y="245" textAnchor="middle" fill="white" fontSize="14" opacity="0.5">↑</text>
            <text x="460" y="158" textAnchor="middle" fill="white" fontSize="14" opacity="0.5">→</text>
            <text x="160" y="158" textAnchor="middle" fill="white" fontSize="14" opacity="0.5">←</text>
            <text x="315" y="65"  textAnchor="middle" fill="white" fontSize="14" opacity="0.5">↓</text>
            {/* Exit label */}
            <text x="130" y="142" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold" opacity="0.8">← EXIT</text>
            {/* Car path arc (ghost) */}
            {step >= 3 && (
              <path d="M 285,215 Q 285,203 252,203 Q 228,203 228,145 Q 228,120 173,120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 5" fill="none" opacity="0.6"/>
            )}
          </svg>

          {/* THE CAR */}
          <div
            className="absolute z-20 transition-all duration-[1800ms] ease-in-out top-0 left-0"
            style={getCarStyle()}
          >
            <TopDownCar
              color="#94a3b8"
              indicatorLeft={step === 4}
              blink={blink}
            />
          </div>

          {/* Traffic in roundabout (static parked cars for reference) */}
          <div className="absolute z-10" style={{ left: '350px', top: '145px', transform: 'rotate(90deg) scale(0.6)' }}>
            <TopDownCar color="#ef4444"/>
          </div>

          {/* Labels */}
          {step === 1 && (
            <div className="absolute bottom-6 left-[260px] text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full z-30 whitespace-nowrap">
              Give Way Line
            </div>
          )}
          {step === 4 && (
            <div className="absolute top-6 right-20 text-[9px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded-full z-30">
              ← Left indicator
            </div>
          )}
        </div>
      </div>

      <ControlBar
        step={step} maxStep={4} speed={speed} gear="D" wheelAngle={curAngle}
        isAnimating={isAnimating} onNext={handleNext} onReset={handleReset}
        title={step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}
        desc={step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}
        doneLabel={tMod.exited} beginLabel={t.begin} nextLabel={t.next} t={t}
      />
    </div>
  )
}

/* ============================================================
   4. NIGHT DRIVING SIMULATION
   ============================================================ */
export const NightDrivingSimulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const { language } = useLanguageStore()
  const t = ADV_T[language as keyof typeof ADV_T] || ADV_T.EN
  const tMod = t.night

  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [rainDrop, setRainDrop] = useState(0)

  // Rain animation step 4
  useEffect(() => {
    if (step === 4) {
      const id = setInterval(() => setRainDrop(r => (r + 1) % 20), 80)
      return () => clearInterval(id)
    }
  }, [step])

  useEffect(() => {
    if (step === 0) { setSpeed(0); return }
    const targets = [60, 60, 80, 40]
    const tgt = targets[step - 1]
    setIsAnimating(true)
    let s = speed
    const id = setInterval(() => {
      if (s < tgt) { s += 2; setSpeed(Math.min(s, tgt)) }
      else if (s > tgt) { s -= 2; setSpeed(Math.max(s, tgt)) }
      else { clearInterval(id); setTimeout(() => { setIsAnimating(false); if (step === 4 && onComplete) onComplete() }, 1000) }
    }, 80)
    return () => clearInterval(id)
  }, [step])

  const handleNext = () => { if (!isAnimating && step < 4) setStep(p => p + 1) }
  const handleReset = () => { if (!isAnimating) { setStep(0); setSpeed(0) } }

  const lightsOn   = step >= 1
  const highBeam   = step === 3
  const oncomingCar = step === 2
  const foggy      = step === 4

  return (
    <div className="w-full h-full flex flex-col justify-between bg-void/90 relative overflow-hidden select-none">
      <div className="flex-1 relative w-full border-b border-white/5 overflow-hidden">

        {/* Sky */}
        <div className={`absolute inset-0 transition-colors duration-[2000ms] ${foggy ? 'bg-slate-700' : 'bg-[#0a0f1e]'}`}/>

        {/* Stars (only when no fog) */}
        {!foggy && !oncomingCar && [16, 80, 140, 200, 340, 420, 500, 580, 640, 720, 280, 90, 450, 630].map((x, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60" style={{ left: x, top: (i * 13) % 80 + 5 }}/>
        ))}

        {/* Fog overlay */}
        {foggy && <div className="absolute inset-0 bg-slate-500/40 backdrop-blur-[2px] z-10"/>}

        {/* Rain */}
        {foggy && [...Array(40)].map((_, i) => (
          <div key={i} className="absolute w-[1px] bg-blue-300/50" style={{
            left: `${((i * 67 + rainDrop * 7) % 100)}%`,
            top: `${((i * 31 + rainDrop * 11) % 70)}%`,
            height: `${8 + (i % 3) * 4}px`,
            transform: 'rotate(15deg)',
          }}/>
        ))}

        {/* Road (perspective vanishing point) */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
          {/* Road surface */}
          <path d="M 0,300 L 200,140 L 450,140 L 700,300 Z" fill="#1e2026"/>
          {/* Road edge lines */}
          <line x1="0" y1="300" x2="200" y2="140" stroke="#e2e8f0" strokeWidth="3"/>
          <line x1="700" y1="300" x2="450" y2="140" stroke="#e2e8f0" strokeWidth="3"/>
          {/* Dashed centre line */}
          <line x1="325" y1="141" x2="350" y2="300" stroke="#fef08a" strokeWidth="2" strokeDasharray="20 15" opacity="0.7"/>
          {/* Road cat-eyes */}
          {[155, 175, 200, 230, 265].map((y, i) => (
            <ellipse key={i} cx="335" cy={y} rx="2" ry="1"
              fill={lightsOn ? '#fef08a' : '#334155'}
              filter={lightsOn ? 'drop-shadow(0 0 4px #fef08a)' : ''}
              opacity={lightsOn ? 1 : 0.3}
            />
          ))}
        </svg>

        {/* Headlight beam cone */}
        {lightsOn && (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }}>
            <defs>
              <radialGradient id="beam" cx="50%" cy="100%" r="80%" fx="50%" fy="100%">
                <stop offset="0%" stopColor={highBeam ? '#fefce8' : '#fef9c3'} stopOpacity={highBeam ? 0.45 : 0.3}/>
                <stop offset="100%" stopColor="#fef9c3" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <ellipse cx="330" cy={highBeam ? 100 : 160} rx={highBeam ? 220 : 160} ry={highBeam ? 210 : 160}
              fill="url(#beam)"/>
          </svg>
        )}

        {/* Oncoming car with blinding high beams */}
        {oncomingCar && (
          <div className="absolute z-20 transition-all duration-[2000ms]" style={{ left: '400px', top: '155px' }}>
            {/* Perspective front profile of car */}
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <rect x="0" y="15" width="40" height="12" rx="3" fill="#334155"/>
              <path d="M 6 15 L 10 5 L 30 5 L 34 15 Z" fill="#1e293b"/>
              <rect x="2" y="27" width="6" height="3" fill="#0f172a"/>
              <rect x="32" y="27" width="6" height="3" fill="#0f172a"/>
              <circle cx="8" cy="20" r="4" fill="#fefce8" filter="drop-shadow(0 0 12px #fefce8) drop-shadow(0 0 20px #fef08a)"/>
              <circle cx="32" cy="20" r="4" fill="#fefce8" filter="drop-shadow(0 0 12px #fefce8) drop-shadow(0 0 20px #fef08a)"/>
            </svg>
            {/* Blinding glare overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(254,252,232,0.8) 0%, transparent 60%)',
              width: '180px', height: '180px', top: '-75px', left: '-70px'
            }}/>
          </div>
        )}

        {/* DRIVER'S DASHBOARD bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[55px] bg-slate-950 border-t-4 border-slate-800 z-20 flex items-center justify-between px-8">
          {/* Steering wheel silhouette */}
          <div className="w-[50px] h-[50px] rounded-full border-[8px] border-slate-700 flex items-center justify-center relative -translate-y-3">
            <div className="w-full h-[6px] bg-slate-700 absolute"/>
            <div className="w-[6px] h-full bg-slate-700 absolute"/>
            <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700 z-10"/>
          </div>

          {/* Dashboard warning lights */}
          <div className="flex gap-3 items-center -translate-y-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold transition-colors ${lightsOn ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-600'}`}>
              {lightsOn ? '●' : '○'}
            </div>
            <div className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono transition-colors ${highBeam ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
              HB
            </div>
            <div className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono transition-colors ${foggy ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-600'}`}>
              FOG
            </div>
          </div>

          {/* Speed */}
          <div className="flex flex-col items-center -translate-y-3">
            <span className={`text-2xl font-black font-mono ${speed > 60 ? 'text-amber-400' : 'text-white'}`}>{speed}</span>
            <span className="text-[8px] text-slate-500">{t.kmh}</span>
          </div>

          {/* Headlight mode label */}
          <div className={`text-[10px] font-bold font-mono -translate-y-3 transition-all ${lightsOn ? (highBeam ? 'text-blue-400' : 'text-green-400') : 'text-slate-600'}`}>
            {!lightsOn ? 'LIGHTS OFF' : highBeam ? '✦ HIGH BEAM' : '● LOW BEAM'}
          </div>
        </div>

        {/* Headlight switch UI overlay top-right */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-1">
          <div className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${!lightsOn ? 'bg-slate-800 border-slate-700 text-slate-500' : 'border-transparent text-transparent'}`}>OFF</div>
          <div className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${lightsOn && !highBeam ? 'bg-green-800 border-green-600 text-green-300 shadow-[0_0_8px_#16a34a]' : 'border-transparent text-transparent'}`}>LOW</div>
          <div className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${highBeam ? 'bg-blue-800 border-blue-600 text-blue-200 shadow-[0_0_8px_#2563eb]' : 'border-transparent text-transparent'}`}>HIGH</div>
        </div>

        {/* Step 2 warning: dip your lights */}
        {step === 2 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-900/80 border border-red-500 text-red-200 text-xs font-bold px-4 py-2 rounded-xl font-mono animate-pulse">
            ⚠️  DIP TO LOW BEAM NOW
          </div>
        )}
      </div>

      <ControlBar
        step={step} maxStep={4} speed={speed} gear="D" wheelAngle={0}
        isAnimating={isAnimating} onNext={handleNext} onReset={handleReset}
        title={step === 0 ? tMod.initialTitle : tMod.steps[step - 1].t}
        desc={step === 0 ? tMod.initialDesc : tMod.steps[step - 1].d}
        doneLabel={tMod.done} beginLabel={t.begin} nextLabel={t.next} t={t}
      />
    </div>
  )
}
