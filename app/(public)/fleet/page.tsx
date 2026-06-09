"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Car, ShieldCheck, Zap, Battery, Activity, Settings2, ShieldAlert, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const T = {
  EN: {
    headerSub: 'Hardware Infrastructure',
    headerTitle: 'The Training Fleet.',
    headerDesc: 'Experience next-generation dual-control vehicles engineered for absolute safety and unparalleled tactical feedback.',
    categorySim: 'Advanced Simulator',
    categoryRto: 'RTO Test Vehicle',
    drivetrain: 'Drivetrain',
    power: 'Power Output',
    safety: 'Safety Rating',
    ui: 'Instructor UI',
    uiActive: 'Active Override',
    uiPassive: 'Passive',
    trainingCaps: 'Training Capabilities',
    f1Name: 'Model-X Dual Control',
    f1Feat1: 'Instant torque response training',
    f1Feat2: 'Regenerative braking mastery',
    f1Feat3: 'Autopilot awareness modules',
    f2Name: 'Stealth Sedan Alpha',
    f2Feat1: 'Ultra-tight turning radius',
    f2Feat2: 'Digital rear-view array',
    f2Feat3: 'Instructor override system',
  },
  HI: {
    headerSub: 'हार्डवेयर इंफ्रास्ट्रक्चर',
    headerTitle: 'ट्रेनिंग फ्लीट।',
    headerDesc: 'पूर्ण सुरक्षा और बेजोड़ सामरिक प्रतिक्रिया के लिए इंजीनियर की गई अगली पीढ़ी के दोहरे नियंत्रण वाहनों का अनुभव करें।',
    categorySim: 'उन्नत सिम्युलेटर',
    categoryRto: 'RTO टेस्ट वाहन',
    drivetrain: 'ड्राइवट्रेन',
    power: 'पावर आउटपुट',
    safety: 'सुरक्षा रेटिंग',
    ui: 'प्रशिक्षक UI',
    uiActive: 'सक्रिय ओवरराइड',
    uiPassive: 'निष्क्रिय',
    trainingCaps: 'प्रशिक्षण क्षमताएं',
    f1Name: 'मॉडल-एक्स डुअल नियंत्रण',
    f1Feat1: 'त्वरित टॉर्क प्रतिक्रिया प्रशिक्षण',
    f1Feat2: 'पुनर्योजी ब्रेकिंग महारत',
    f1Feat3: 'ऑटोपायलट जागरूकता मॉड्यूल',
    f2Name: 'स्टेल्थ सेडान अल्फा',
    f2Feat1: 'अति-तंग टर्निंग रेडियस',
    f2Feat2: 'डिजिटल रियर-व्यू एरे',
    f2Feat3: 'प्रशिक्षक ओवरराइड सिस्टम',
  },
  TE: {
    headerSub: 'హార్డ్‌వేర్ ఇన్‌ఫ్రాస్ట్రక్చర్',
    headerTitle: 'ట్రైనింగ్ ఫ్లీట్.',
    headerDesc: 'సంపూర్ణ భద్రత మరియు సాటిలేని వ్యూహాత్మక ఫీడ్‌బ్యాక్ కోసం రూపొందించబడిన తదుపరి తరం డ్యూయల్-కంట్రోల్ వాహనాలను అనుభవించండి.',
    categorySim: 'అడ్వాన్స్‌డ్ సిమ్యులేటర్',
    categoryRto: 'RTO టెస్ట్ వాహనం',
    drivetrain: 'డ్రైవ్‌ట్రెయిన్',
    power: 'పవర్ అవుట్‌పుట్',
    safety: 'భద్రతా రేటింగ్',
    ui: 'ఇన్‌స్ట్రక్టర్ UI',
    uiActive: 'యాక్టివ్ ఓవర్‌రైడ్',
    uiPassive: 'పాసివ్',
    trainingCaps: 'శిక్షణ సామర్థ్యాలు',
    f1Name: 'మోడల్-ఎక్స్ డ్యూయల్ కంట్రోల్',
    f1Feat1: 'తక్షణ టార్క్ ప్రతిస్పందన శిక్షణ',
    f1Feat2: 'రీజెనరేటివ్ బ్రేకింగ్ నైపుణ్యం',
    f1Feat3: 'ఆటోపైలట్ అవగాహన మాడ్యూల్స్',
    f2Name: 'స్టెల్త్ సెడాన్ ఆల్ఫా',
    f2Feat1: 'అల్ట్రా-టైట్ టర్నింగ్ రేడియస్',
    f2Feat2: 'డిజిటల్ రియర్-వ్యూ శ్రేణి',
    f2Feat3: 'ఇన్‌స్ట్రక్టర్ ఓవర్‌రైడ్ సిస్టమ్',
  }
}

export default function FleetPage() {
  const { language } = useLanguageStore()
  const t = T[language]

  // Interactive slider overrides states for simulation fun
  const [overrideF1, setOverrideF1] = useState(45)
  const [overrideF2, setOverrideF2] = useState(15)

  // Diagnostics logs
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<string[]>([
    "BATTERY STABLE: 42°C",
    "Dual Clutch: Active Engaged"
  ])

  useEffect(() => {
    const list = [
      "AUTOPILOT COGNITION: SYNCED",
      "TIRE FRICTION: 98% OPTIMAL",
      "REGEN RATIO: HIGH",
      "ACTUATORS: VERIFIED OK",
      "REAR-VIEW RADAR: SECURED"
    ]
    let idx = 0
    const interval = setInterval(() => {
      setDiagnosticsLogs(prev => [...prev.slice(-1), `[SYS] ${list[idx]}`])
      idx = (idx + 1) % list.length
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const FLEET = [
    {
      id: 'f1',
      name: t.f1Name,
      category: t.categorySim,
      specs: { drive: 'AWD Electric', hp: '320', safety: '5-Star NCAP', dualControl: true },
      features: [t.f1Feat1, t.f1Feat2, t.f1Feat3],
      color: 'from-cyan-500/10 via-transparent to-transparent',
      accentColor: 'text-cyan-500 dark:text-cyan-400',
      borderColor: 'border-slate-200 dark:border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_0_40px_rgba(6,182,212,0.15)]',
      batteryVal: 88,
      rangeVal: 480,
      overrideVal: overrideF1,
      setOverride: setOverrideF1
    },
    {
      id: 'f2',
      name: t.f2Name,
      category: t.categoryRto,
      specs: { drive: 'FWD Hybrid', hp: '145', safety: '5-Star NCAP', dualControl: true },
      features: [t.f2Feat1, t.f2Feat2, t.f2Feat3],
      color: 'from-amber-500/10 via-transparent to-transparent',
      accentColor: 'text-amber-500 dark:text-amber-400',
      borderColor: 'border-slate-200 dark:border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
      batteryVal: 64,
      rangeVal: 220,
      overrideVal: overrideF2,
      setOverride: setOverrideF2
    }
  ]

  return (
    <div className="min-h-screen bg-transparent text-text-1 font-body pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <header className="mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white dark:bg-void border border-slate-200 dark:border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-lg"
          >
            <Car className="w-10 h-10 text-text-1" />
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
            className="text-text-2 max-w-2xl text-lg md:text-xl leading-relaxed"
          >
            {t.headerDesc}
          </motion.p>
        </header>

        {/* Fleet Roster Overhaul */}
        <div className="flex flex-col gap-32">
          {FLEET.map((vehicle, idx) => (
            <motion.section 
              key={vehicle.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              
              {/* Studio Diagnostics HUD Screen */}
              <div className="w-full lg:w-1/2 relative">
                <div className={`aspect-[4/3] w-full rounded-[2.5rem] border ${vehicle.borderColor} bg-white/80 dark:bg-void/50 backdrop-blur-3xl relative overflow-hidden group p-6 flex flex-col justify-between select-none`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${vehicle.color} opacity-40 mix-blend-overlay`} />
                  


                  {/* Header Metrics */}
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[rgb(var(--color-text-3))] dark:text-text-3">
                      <Activity className="w-3.5 h-3.5 text-primary animate-pulse" /> DIAGNOSTICS: SECURE
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 bg-[rgb(var(--color-border))] text-slate-700 dark:text-text-2 uppercase">
                      Chassis: Sport Alpha
                    </span>
                  </div>

                  {/* Middle representation with live overrides and wireframes */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    {/* Glowing abstract wireframe mesh */}
                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      <Car className="w-56 h-56 text-[rgb(var(--color-text-1))]/5 dark:text-text-1/5 group-hover:text-[rgb(var(--color-text-1))]/10 dark:group-hover:text-text-1/10 transition-colors duration-500" />
                    </motion.div>

                    {/* Overlay Alert when instructor intensity is maximum */}
                    {vehicle.overrideVal > 80 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bg-red-500/15 dark:bg-red-500/25 border border-red-500/50 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 font-mono text-xs font-bold"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 animate-bounce" />
                        <div>
                          <div>OVERRIDE PRESSURE: CRITICAL!</div>
                          <div className="text-[9px] font-normal text-[rgb(var(--color-text-3))] dark:text-text-2">Instructor manual override takes primary priority.</div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer Stats widgets */}
                  <div className="grid grid-cols-3 gap-3 relative z-10 mt-auto">
                    <div className="bg-[rgb(var(--color-surface))] border border-slate-200 dark:border-white/5 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] dark:text-text-3 uppercase">Battery Left</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black font-display text-text-1">{vehicle.batteryVal}%</span>
                        <Battery className={`w-3.5 h-3.5 ${vehicle.accentColor}`} />
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-void/50 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="h-full rounded-full" style={{ width: `${vehicle.batteryVal}%`, backgroundColor: 'currentColor' }} />
                      </div>
                    </div>

                    <div className="bg-[rgb(var(--color-surface))] border border-slate-200 dark:border-white/5 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] dark:text-text-3 uppercase">Cabin Range</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black font-display text-text-1">{vehicle.rangeVal}km</span>
                        <Zap className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="text-[7.5px] font-mono text-slate-400 dark:text-text-3 leading-none mt-1 font-semibold">Estimated Eco-drive</span>
                    </div>

                    <div className="bg-[rgb(var(--color-surface))] border border-slate-200 dark:border-white/5 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] dark:text-text-3 uppercase">Dynamic Override</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black font-display text-text-1">{vehicle.overrideVal}%</span>
                        <Sliders className="w-3.5 h-3.5 text-[rgb(var(--color-text-3))] dark:text-text-2" />
                      </div>
                      <span className="text-[7.5px] font-mono text-slate-400 dark:text-text-3 leading-none mt-1 font-semibold">Intensity Level</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Vehicle Specs Panel */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10">
                <span className="text-xs font-mono tracking-widest text-[rgb(var(--color-text-3))] dark:text-text-3 uppercase mb-2">{vehicle.category}</span>
                <h2 className="text-4xl md:text-5xl font-black font-display text-text-1 tracking-tight mb-8">
                  {vehicle.name}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/80 dark:bg-surface/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                    <Battery className="w-5 h-5 text-primary mb-2" />
                    <div className="text-[10px] font-mono text-slate-400 dark:text-text-3 uppercase">{t.drivetrain}</div>
                    <div className="text-lg font-bold text-text-1 font-display">{vehicle.specs.drive}</div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-surface/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                    <Zap className="w-5 h-5 text-accent mb-2" />
                    <div className="text-[10px] font-mono text-slate-400 dark:text-text-3 uppercase">{t.power}</div>
                    <div className="text-lg font-bold text-text-1 font-display">{vehicle.specs.hp} HP</div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-surface/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mb-2" />
                    <div className="text-[10px] font-mono text-slate-400 dark:text-text-3 uppercase">{t.safety}</div>
                    <div className="text-lg font-bold text-text-1 font-display">{vehicle.specs.safety}</div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-surface/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                    <Settings2 className="w-5 h-5 text-text-1 mb-2" />
                    <div className="text-[10px] font-mono text-slate-400 dark:text-text-3 uppercase">{t.ui}</div>
                    <div className="text-lg font-bold text-text-1 font-display">{vehicle.specs.dualControl ? t.uiActive : t.uiPassive}</div>
                  </div>
                </div>

                {/* Simulated physical overrides controls */}
                <div className="bg-white/60 dark:bg-surface/15 border border-slate-200 dark:border-white/5 p-5 rounded-2xl mb-8 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-600 dark:text-text-2">
                    <span>Manual Override Intensity Simulator:</span>
                    <span className="font-bold font-display" style={{ color: vehicle.overrideVal > 80 ? '#f43f5e' : 'inherit' }}>{vehicle.overrideVal}%</span>
                  </div>
                  <input 
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={vehicle.overrideVal}
                    onChange={(e) => vehicle.setOverride(parseInt(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-200 dark:bg-void/50 rounded-lg cursor-pointer border border-[rgb(var(--color-border))]"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-400 dark:text-text-3 uppercase">
                    <span>Low Assist</span>
                    <span>Safety Intervention</span>
                    <span>Max Priority Override</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-widest text-text-1 mb-4 border-b border-slate-200 dark:border-white/5 pb-2">{t.trainingCaps}</h4>
                  <ul className="flex flex-col gap-3.5">
                    {vehicle.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-text-2 text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.section>
          ))}
        </div>

        {/* Live diagnostics console block */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-2xl mx-auto bg-white/90 dark:bg-void/50 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl relative"
        >
          <div className="flex justify-between items-center text-[8px] font-mono border-b border-slate-200 dark:border-white/10 pb-3">
            <span className="text-[rgb(var(--color-text-3))] dark:text-text-3">DIAGNOSTICS CHASSIS CHECK</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-bold animate-pulse">ONLINE SYNCED</span>
          </div>
          <div className="flex flex-col gap-1.5 font-mono text-[10px] text-slate-600 dark:text-text-2 leading-relaxed mt-4">
            <div className="text-primary/70 font-semibold">[SYS] DUAL HYBRID TELEMETRY LOADED</div>
            {diagnosticsLogs.map((log, lIdx) => (
              <motion.div 
                key={lIdx} 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }}
                className={log.includes('[SYS]') ? "text-slate-400 dark:text-text-3 font-semibold" : "text-emerald-600 dark:text-emerald-400"}
              >
                {log}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
