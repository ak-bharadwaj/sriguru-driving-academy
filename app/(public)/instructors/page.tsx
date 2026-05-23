"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Star, 
  Award, 
  ShieldAlert, 
  Crosshair, 
  Users, 
  Activity, 
  Zap, 
  Target, 
  ChevronRight, 
  Compass, 
  Radio, 
  Terminal, 
  UserCheck 
} from 'lucide-react'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'

// Core translation blocks to maintain flawless localization
const T = {
  EN: {
    headerSub: 'The Elite Roster',
    headerTitle: 'Meet the Masters.',
    headerDesc: 'Our instructors aren\'t just teachers; they are highly vetted tactical driving experts dedicated to your complete mechanical and situational mastery.',
    passRate: 'Pass Rate',
    specFocus: 'Specialization Focus',
    stat1: 'Active Masters',
    stat2: '1st Try Pass Rate',
    stat3: 'Students Trained',
    stat4: 'Average Rating',
    ins1Role: 'Lead Tactical Instructor',
    ins1Spec: 'Defensive Maneuvers & Highway Merging',
    ins1Bio: 'Former advanced pursuit driver turned civilian instructor. Specializes in instilling absolute confidence in high-traffic scenarios.',
    ins2Role: 'RTO Certification Specialist',
    ins2Spec: 'Mock Exams & Precision Parking',
    ins2Bio: 'Elena breaks down the complex RTO requirements into simple, actionable physics. Unmatched success rate for first-time examinees.',
    ins3Role: 'Foundation Coach',
    ins3Spec: 'Nervous Drivers & Core Fundamentals',
    ins3Bio: 'Patience and clarity define David’s approach. He builds the driving foundation block by block until the mechanics become instinct.',
  },
  HI: {
    headerSub: 'विशिष्ट रोस्टर',
    headerTitle: 'मास्टर्स से मिलें।',
    headerDesc: 'हमारे प्रशिक्षक केवल शिक्षक नहीं हैं; वे अत्यधिक प्रमाणित सामरिक ड्राइविंग विशेषज्ञ हैं जो आपकी पूर्ण यांत्रिक और स्थितिजन्य महारत के लिए समर्पित हैं।',
    passRate: 'पास दर',
    specFocus: 'विशेषज्ञता फोकस',
    stat1: 'सक्रिय मास्टर्स',
    stat2: 'पहली कोशिश में पास दर',
    stat3: 'प्रशिक्षित छात्र',
    stat4: 'औसत रेटिंग',
    ins1Role: 'प्रमुख सामरिक प्रशिक्षक',
    ins1Spec: 'रक्षात्मक युद्धाभ्यास और राजमार्ग विलय',
    ins1Bio: 'पूर्व उन्नत पीछा करने वाले चालक अब नागरिक प्रशिक्षक हैं। उच्च यातायात परिदृश्यों में पूर्ण आत्मविश्वास जगाने में माहिर हैं।',
    ins2Role: 'RTO प्रमाणन विशेषज्ञ',
    ins2Spec: 'मॉक परीक्षा और सटीक पार्किंग',
    ins2Bio: 'ऐलेना जटिल RTO आवश्यकताओं को सरल, कार्रवाई योग्य भौतिकी में तोड़ देती है। पहली बार परीक्षार्थियों के लिए बेजोड़ सफलता दर।',
    ins3Role: 'फाउंडेशन कोच',
    ins3Spec: 'घबराए हुए ड्राइवर और मुख्य मूल बातें',
    ins3Bio: 'धैर्य और स्पष्टता डेविड के दृष्टिकोण को परिभाषित करते हैं। वह ड्राइविंग की नींव को तब तक ब्लॉक दर ब्लॉक बनाते हैं जब तक कि यांत्रिकी वृत्ति न बन जाए।',
  },
  TE: {
    headerSub: 'ఎలైట్ రోస్టర్',
    headerTitle: 'మాస్టర్స్ ను కలవండి.',
    headerDesc: 'మా బోధకులు కేవలం ఉపాధ్యాయులు కాదు; వారు మీ పూర్తి యాంత్రిక మరియు పరిస్థితుల నైపుణ్యానికి అంకితమైన అత్యంత పరిశీలించబడిన వ్యూహాత్మక డ్రైవింగ్ నిపుణులు.',
    passRate: 'పాస్ రేట్',
    specFocus: 'స్పెషలైజేషన్ ఫోకస్',
    stat1: 'యాక్టివ్ మాస్టర్స్',
    stat2: 'మొదటి ప్రయత్నం ఉత్తీర్ణత రేటు',
    stat3: 'శిక్షణ పొందిన విద్యార్థులు',
    stat4: 'సగటు రేటింగ్',
    ins1Role: 'లీడ్ టాక్టికల్ ఇన్‌స్ట్రక్టర్',
    ins1Spec: 'డిఫెన్సివ్ యుక్తి & హైవే విలీనం',
    ins1Bio: 'మాజీ అధునాతన పర్స్యూట్ డ్రైవర్ పౌర బోధకుడిగా మారారు. అధిక ట్రాఫిక్ దృశ్యాలలో సంపూర్ణ విశ్వాసాన్ని కలిగించడంలో ప్రత్యేకత.',
    ins2Role: 'RTO సర్టిఫికేషన్ స్పెషలిస్ట్',
    ins2Spec: 'మాక్ పరీక్షలు & ఖచ్చితమైన పార్కింగ్',
    ins2Bio: 'ఎలెనా సంక్లిష్టమైన RTO అవసరాలను సరళమైన, చర్య తీసుకోదగిన భౌతిక శాస్త్రంగా విభజిస్తుంది. మొదటిసారి పరీక్షకులకు సాటిలేని విజయం రేటు.',
    ins3Role: 'ఫౌండేషన్ కోచ్',
    ins3Spec: 'భయపడే డ్రైవర్లు & కోర్ ఫండమెంటల్స్',
    ins3Bio: 'ఓపిక మరియు స్పష్టత డేవిడ్ విధానాన్ని నిర్వచిస్తాయి. డ్రైవింగ్ మెకానిక్స్ స్వభావంగా మారే వరకు అతను డ్రైవింగ్ పునాదిని బ్లాక్ బై బ్లాక్ నిర్మిస్తాడు.',
  }
}

const LABELS = {
  EN: {
    reflex: "Reflexes",
    precision: "Precision",
    stress: "Stress Control",
    mech: "Mechanical Mind",
    safety: "Safety Sense",
    dossier: "Tactical Pilot Dossier",
    license: "Racing License",
    status: "STATUS: ACTIVE MASTER",
    book: "Secure Session",
    safetyIndex: "Safety Index",
    missions: "Missions Completed",
    radarTitle: "Vector Telemetry Metrics",
  },
  HI: {
    reflex: "प्रतिक्रिया",
    precision: "सटीकता",
    stress: "तनाव नियंत्रण",
    mech: "यांत्रिक समझ",
    safety: "सुरक्षा भावना",
    dossier: "सामरिक पायलट डोजियर",
    license: "रेसिंग लाइसेंस",
    status: "स्थिति: सक्रिय मास्टर",
    book: "सत्र सुरक्षित करें",
    safetyIndex: "सुरक्षा सूचकांक",
    missions: "पूर्ण किए गए मिशन",
    radarTitle: "वेक्टर टेलीमेट्री मेट्रिक्स",
  },
  TE: {
    reflex: "రిఫ్లెక్స్",
    precision: "ఖచ్చితత్వం",
    stress: "ఒత్తిడి నియంత్రణ",
    mech: "యాంత్రిక జ్ఞానం",
    safety: "భద్రతా భావన",
    dossier: "వ్యూహాత్మక పైలట్ డాసియర్",
    license: "రేసింగ్ లైసెన్స్",
    status: "స్థితి: యాక్టివ్ మాస్టర్",
    book: "సెషన్ బుక్ చేయండి",
    safetyIndex: "భద్రతా సూచిక",
    missions: "పూర్తయిన మిషన్లు",
    radarTitle: "వెక్టర్ టెలిమెట్రీ మెట్రిక్స్",
  }
}

export default function InstructorsPage() {
  const { language } = useLanguageStore()
  const t = T[language]
  const l = LABELS[language]

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<{ instructorId: string; statIndex: number | null }>({
    instructorId: '',
    statIndex: null
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const INSTRUCTORS = [
    {
      id: 'ins1',
      name: 'Marcus Vance',
      role: t.ins1Role,
      passRate: 98.4,
      safetyIndex: 9.9,
      missions: 870,
      specialty: t.ins1Spec,
      bio: t.ins1Bio,
      imagePlaceholder: 'MV',
      color: 'cyan',
      themeGradient: 'from-cyan-500/20 via-transparent to-void',
      accentColor: 'text-cyan-400',
      fillColor: 'rgba(6, 182, 212, 0.25)',
      strokeColor: '#06b6d4',
      badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      glowShadow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      achievements: [
        { name: 'Drift Sensei', icon: Award },
        { name: 'Highway Eagle', icon: Zap }
      ],
      // Radar parameters (0.4 to 1.0 scale mapping)
      stats: [0.98, 0.92, 0.95, 0.90, 0.96]
    },
    {
      id: 'ins2',
      name: 'Elena Rostova',
      role: t.ins2Role,
      passRate: 99.1,
      safetyIndex: 9.8,
      missions: 1120,
      specialty: t.ins2Spec,
      bio: t.ins2Bio,
      imagePlaceholder: 'ER',
      color: 'amber',
      themeGradient: 'from-amber-500/20 via-transparent to-void',
      accentColor: 'text-amber-400',
      fillColor: 'rgba(245, 158, 11, 0.25)',
      strokeColor: '#f59e0b',
      badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      glowShadow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      achievements: [
        { name: 'RTO Escrow Guardian', icon: ShieldCheck },
        { name: 'Parallel Prodigy', icon: Target }
      ],
      stats: [0.91, 0.99, 0.96, 0.92, 0.98]
    },
    {
      id: 'ins3',
      name: 'David Chen',
      role: t.ins3Role,
      passRate: 96.8,
      safetyIndex: 9.9,
      missions: 640,
      specialty: t.ins3Spec,
      bio: t.ins3Bio,
      imagePlaceholder: 'DC',
      color: 'emerald',
      themeGradient: 'from-emerald-500/20 via-transparent to-void',
      accentColor: 'text-emerald-400',
      fillColor: 'rgba(16, 185, 129, 0.25)',
      strokeColor: '#10b981',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      glowShadow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      achievements: [
        { name: 'Nerve Stabilizer', icon: Users },
        { name: 'Safety Sentinel', icon: ShieldAlert }
      ],
      stats: [0.88, 0.95, 0.99, 0.94, 0.99]
    }
  ]

  // Calculate standard 5-point radar coordinate map
  const getRadarPoints = (statsArray: number[], scale = 40, cx = 60, cy = 60) => {
    return statsArray.map((val, idx) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * idx) / 5
      const r = val * scale
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        labelX: cx + (scale + 12) * Math.cos(angle),
        labelY: cy + (scale + 12) * Math.sin(angle)
      }
    })
  }

  return (
    <div className="min-h-screen bg-transparent text-text-1 font-body pt-32 pb-24 overflow-x-hidden relative">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header telemetry node */}
        <header className="mb-24 flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-void border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
            <ShieldCheck className="w-10 h-10 text-primary relative z-10" />
            <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full blur-[1px] animate-pulse" />
          </motion.div>
          
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4"
          >
            {t.headerSub}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-display tracking-tight mb-6"
          >
            {t.headerTitle}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-2 text-lg md:text-xl leading-relaxed"
          >
            {t.headerDesc}
          </motion.p>
        </header>

        {/* High-Fidelity Pilot Dossiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {INSTRUCTORS.map((ins, idx) => {
            const radarPoints = getRadarPoints(ins.stats)
            const polygonPointsString = radarPoints.map(p => `${p.x},${p.y}`).join(' ')
            
            // Concentric grids for spider chart (values represented at 0.25, 0.5, 0.75, 1.0)
            const gridLines = [0.25, 0.5, 0.75, 1.0]

            return (
              <motion.div 
                key={ins.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.7 }}
                className="bg-surface/30 backdrop-blur-2xl border border-white/10 hover:border-primary/50 rounded-[2.2rem] p-1.5 transition-all duration-500 overflow-hidden relative group shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] flex flex-col justify-between"
              >
                {/* Glossy sheen reflection on hover */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[sheen_1.2s_ease-in-out] pointer-events-none z-20" />
                
                {/* Internal container with premium carbon matte vibes */}
                <div className="bg-void/60 rounded-[2rem] p-6 relative z-10 flex flex-col justify-between h-full border border-white/5">
                  
                  {/* Digital Racing License Header */}
                  <div>
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7.5px] font-mono text-text-3 uppercase tracking-widest leading-none">
                          {l.dossier}
                        </span>
                        <span className="text-xs font-mono font-bold text-text-2">
                          ID: SGDA-26-{ins.imagePlaceholder}
                        </span>
                      </div>
                      
                      {/* Interactive holographic barcode */}
                      <div className="flex items-center gap-[2px]">
                        <div className="w-[1.5px] h-6 bg-text-3/60" />
                        <div className="w-[3px] h-6 bg-text-3/60" />
                        <div className="w-[1px] h-6 bg-text-3/60" />
                        <div className="w-[2px] h-6 bg-primary" />
                        <div className="w-[1px] h-6 bg-text-3/60" />
                        <div className="w-[4px] h-6 bg-text-3/60" />
                        <div className="w-[1.5px] h-6 bg-primary" />
                      </div>
                    </div>

                    {/* Laser Hologram wireframe simulator in the Photo Area */}
                    <div className="aspect-[4/3] w-full bg-surface/20 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5 shadow-inner mb-6 group-hover:border-primary/20 transition-all duration-300">
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${ins.themeGradient} opacity-30 mix-blend-screen`} />
                      
                      {/* Holographic matrix grids */}
                      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

                      {/* Concentric telemetry tracking rings in background */}
                      <div className="absolute w-36 h-36 border border-white/5 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite]">
                        <div className="w-24 h-24 border border-dashed border-white/10 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 border border-white/5 rounded-full" />
                        </div>
                      </div>

                      {/* Active holographic wireframe laser scanning coordinate bar */}
                      <motion.div 
                        animate={{
                          y: ["-100%", "100%"]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${ins.color}-400/80 to-transparent blur-[1px] z-10`}
                        style={{ backgroundColor: ins.strokeColor }}
                      />

                      {/* Initials Placeholder styled like premium cyber pilot license */}
                      <span className="text-7xl font-display font-black text-white/5 group-hover:text-white/10 tracking-tighter select-none transition-colors duration-500 z-10 relative">
                        {ins.imagePlaceholder}
                      </span>

                      {/* Active green status indicator */}
                      <div className="absolute top-3 left-3 bg-void/80 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5 text-[8px] font-bold text-success font-mono">
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-ping" /> {l.status}
                      </div>

                      {/* Mini floating crosshair nodes */}
                      <div className="absolute top-2 right-2 text-text-3/30"><Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} /></div>
                      <div className="absolute bottom-2 left-2 text-[6.5px] font-mono text-text-3/40">SYS.LOAD: 100%</div>
                    </div>

                    {/* Bio details and specialties */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold font-display text-text-1 group-hover:text-primary transition-colors duration-300">
                        {ins.name}
                      </h3>
                      <span className={`text-[10px] font-mono uppercase tracking-[0.15em] block mb-4 ${ins.accentColor}`}>
                        {ins.role}
                      </span>
                      
                      <p className="text-xs text-text-2 leading-relaxed mb-6 h-16 line-clamp-3">
                        {ins.bio}
                      </p>
                    </div>

                    {/* Integrated Interactive Vector Telemetry Radar Chart */}
                    <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">
                          {l.radarTitle}
                        </span>
                        <div className="flex items-center gap-1 text-[8px] font-mono text-text-2">
                          <Radio className="w-3 h-3 text-primary animate-pulse" /> LIVE TELEMETRY
                        </div>
                      </div>

                      {/* SVG Canvas for Spider Web Graph */}
                      <div className="w-full flex justify-center py-2 relative">
                        {mounted && (
                          <svg viewBox="0 0 120 120" className="w-[160px] h-[160px] select-none overflow-visible">
                            
                            {/* Inner concentric polygon coordinate bounds */}
                            {gridLines.map((gridVal, gIdx) => {
                              const gridPoints = getRadarPoints([gridVal, gridVal, gridVal, gridVal, gridVal])
                              const gridPointsStr = gridPoints.map(p => `${p.x},${p.y}`).join(' ')
                              return (
                                <polygon
                                  key={gIdx}
                                  points={gridPointsStr}
                                  fill="none"
                                  stroke="rgba(255, 255, 255, 0.05)"
                                  strokeWidth="1"
                                  strokeDasharray={gIdx === 3 ? "0" : "2 2"}
                                />
                              )
                            })}

                            {/* Spoke lines linking center to boundaries */}
                            {radarPoints.map((p, pIdx) => (
                              <line
                                key={pIdx}
                                x1="60"
                                y1="60"
                                x2={p.x}
                                y2={p.y}
                                stroke="rgba(255, 255, 255, 0.04)"
                                strokeWidth="1"
                              />
                            ))}

                            {/* Render actual attributes path */}
                            <motion.polygon
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.8, delay: 0.4 }}
                              points={polygonPointsString}
                              fill={ins.fillColor}
                              stroke={ins.strokeColor}
                              strokeWidth="1.5"
                              className="transition-all duration-300"
                            />

                            {/* Hoverable target handles/nodes with micro stats display */}
                            {radarPoints.map((p, pIdx) => {
                              const isHovered = hoveredStat.instructorId === ins.id && hoveredStat.statIndex === pIdx
                              const labelList = [l.reflex, l.precision, l.stress, l.mech, l.safety]
                              const percentVal = Math.round(ins.stats[pIdx] * 100)

                              return (
                                <g 
                                  key={pIdx}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredStat({ instructorId: ins.id, statIndex: pIdx })}
                                  onMouseLeave={() => setHoveredStat({ instructorId: '', statIndex: null })}
                                >
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={isHovered ? 4.5 : 2.5}
                                    fill={ins.strokeColor}
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="0.5"
                                    className="transition-all duration-200"
                                  />

                                  {/* Small label indicators placed strategically at key vertices */}
                                  <text
                                    x={p.labelX}
                                    y={p.labelY}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.3)"}
                                    fontSize="5.5"
                                    fontWeight="bold"
                                    className="font-mono transition-colors duration-200 uppercase tracking-widest"
                                  >
                                    {labelList[pIdx].substring(0, 3)}
                                  </text>

                                  {/* Floating interactive tooltip */}
                                  {isHovered && (
                                    <g>
                                      <rect
                                        x={60 - 28}
                                        y={60 - 12}
                                        width="56"
                                        height="18"
                                        rx="4"
                                        fill="rgba(11, 15, 25, 0.9)"
                                        stroke={ins.strokeColor}
                                        strokeWidth="0.5"
                                      />
                                      <text
                                        x="60"
                                        y={60 - 5}
                                        textAnchor="middle"
                                        fill="#ffffff"
                                        fontSize="4.5"
                                        fontWeight="bold"
                                        className="font-mono uppercase tracking-wider"
                                      >
                                        {labelList[pIdx]}
                                      </text>
                                      <text
                                        x="60"
                                        y={60 + 2}
                                        textAnchor="middle"
                                        fill={ins.strokeColor}
                                        fontSize="5.5"
                                        fontWeight="black"
                                        className="font-mono"
                                      >
                                        {percentVal}%
                                      </text>
                                    </g>
                                  )}
                                </g>
                              )
                            })}
                          </svg>
                        )}
                      </div>

                      {/* Attribute text labels legend to easily read metrics without canvas triggers */}
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-text-3 border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ins.strokeColor }} />
                          <span>{l.reflex}: {Math.round(ins.stats[0]*100)}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ins.strokeColor }} />
                          <span>{l.precision}: {Math.round(ins.stats[1]*100)}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ins.strokeColor }} />
                          <span>{l.stress}: {Math.round(ins.stats[2]*100)}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ins.strokeColor }} />
                          <span>{l.safetyIndex}: {ins.safetyIndex}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Dossier Specialties focus metadata */}
                    <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Crosshair className="w-4 h-4 text-text-3" />
                        <span className="text-[8px] font-mono uppercase tracking-wider text-text-3">
                          {t.specFocus}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-text-1 tracking-tight leading-relaxed block">
                        {ins.specialty}
                      </span>
                    </div>

                    {/* Shiny badges/achievements list */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {ins.achievements.map((ach, aIdx) => {
                        const Icon = ach.icon
                        return (
                          <div
                            key={aIdx}
                            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-wider uppercase ${ins.badgeColor}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {ach.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Core metric actions & book session footer */}
                  <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[8px] text-text-3 font-mono uppercase tracking-widest block mb-1">
                          {t.passRate}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full border border-success/30 flex items-center justify-center text-success bg-success/10 text-[9px] font-mono font-bold">
                            ★
                          </div>
                          <span className="text-xl font-extrabold text-success font-mono">
                            {ins.passRate}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] text-text-3 font-mono uppercase tracking-widest block mb-1">
                          {l.missions}
                        </span>
                        <span className="text-xl font-extrabold text-text-1 font-mono">
                          {ins.missions}+
                        </span>
                      </div>
                    </div>

                    {/* Book session primary link */}
                    <Link
                      href="/booking"
                      className={`w-full py-3.5 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider font-mono bg-surface hover:bg-primary hover:text-void hover:border-primary transition-all duration-300 group/btn`}
                    >
                      <UserCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      {l.book}
                      <ChevronRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Global Masters statistics deck */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-28 border-t border-white/5 pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 select-none"
        >
          <div className="bg-surface/10 border border-white/5 rounded-2xl p-6 text-center hover:border-primary/20 transition-all duration-300 flex flex-col items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-4xl font-display font-black text-text-1 mb-1 tracking-tight">12+</h4>
            <span className="text-[8px] font-mono uppercase tracking-widest text-text-3 leading-none">{t.stat1}</span>
          </div>

          <div className="bg-surface/10 border border-white/5 rounded-2xl p-6 text-center hover:border-success/20 transition-all duration-300 flex flex-col items-center">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-4xl font-display font-black text-text-1 mb-1 tracking-tight">97%</h4>
            <span className="text-[8px] font-mono uppercase tracking-widest text-text-3 leading-none">{t.stat2}</span>
          </div>

          <div className="bg-surface/10 border border-white/5 rounded-2xl p-6 text-center hover:border-accent/20 transition-all duration-300 flex flex-col items-center">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-4xl font-display font-black text-text-1 mb-1 tracking-tight">10k+</h4>
            <span className="text-[8px] font-mono uppercase tracking-widest text-text-3 leading-none">{t.stat3}</span>
          </div>

          <div className="bg-surface/10 border border-white/5 rounded-2xl p-6 text-center hover:border-primary/20 transition-all duration-300 flex flex-col items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-yellow-400 mb-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <h4 className="text-4xl font-display font-black text-text-1 mb-1 tracking-tight flex items-center gap-1 justify-center">5.0</h4>
            <span className="text-[8px] font-mono uppercase tracking-widest text-text-3 leading-none">{t.stat4}</span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
