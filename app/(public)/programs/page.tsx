"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ShieldCheck, Zap, ArrowRight, Tag, Clock, CheckCircle2, MapPin, Compass, Flag } from 'lucide-react'
import Link from 'next/link'
import { Course, Offer } from '@/lib/data/academyStore'
import { useLanguageStore } from '@/store/languageStore'

const T = {
  EN: {
    badge: 'Course Catalog',
    title: 'Our Driving Programs',
    subtitle: 'Pick your learning path. From first-time drivers to license exam prep, we have the right program for you.',
    offersTitle: 'Active Offers & Discounts',
    discount: 'Discount',
    coursesTitle: 'All Programs',
    duration: '28 Days Avg.',
    features: ['Private dual-control sessions', 'RTO mock exam access', 'Interactive skill tracking'],
    price: 'Price',
    enroll: 'Enroll Now',
  },
  HI: {
    badge: 'पाठ्यक्रम सूची',
    title: 'हमारे ड्राइविंग प्रोग्राम',
    subtitle: 'अपना सीखने का रास्ता चुनें। पहली बार ड्राइव करने वालों से लेकर लाइसेंस परीक्षा तक, हमारे पास सही प्रोग्राम है।',
    offersTitle: 'सक्रिय ऑफर और छूट',
    discount: 'छूट',
    coursesTitle: 'सभी प्रोग्राम',
    duration: 'औसत 28 दिन',
    features: ['निजी दोहरे नियंत्रण सत्र', 'RTO मॉक परीक्षा एक्सेस', 'इंटरैक्टिव कौशल ट्रैकिंग'],
    price: 'मूल्य',
    enroll: 'अभी नामांकन करें',
  },
  TE: {
    badge: 'కోర్సు జాబితా',
    title: 'మా డ్రైవింగ్ ప్రోగ్రామ్‌లు',
    subtitle: 'మీ నేర్చుకోవడానికి మార్గాన్ని ఎంచుకోండి. మొదటిసారి నడిపేవారి నుండి లైసెన్స్ పరీక్ష వరకు, సరైన ప్రోగ్రామ్ ఉంది.',
    offersTitle: 'ఆఫర్‌లు మరియు తగ్గింపులు',
    discount: 'తగ్గింపు',
    coursesTitle: 'అన్ని ప్రోగ్రామ్‌లు',
    duration: 'సగటు 28 రోజులు',
    features: ['ప్రైవేట్ డ్యుయల్-కంట్రోల్ సెషన్లు', 'RTO మాక్ పరీక్ష యాక్సెస్', 'ఇంటరాక్టివ్ స్కిల్ ట్రాకింగ్'],
    price: 'ధర',
    enroll: 'ఇప్పుడు చేరండి',
  },
}

export default function ProgramsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguageStore()
  const t = T[language]

  // Hovered path index inside program maps
  const [hoveredCourseMap, setHoveredCourseMap] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const [courseRes, offerRes] = await Promise.all([
          fetch('/api/public/courses'),
          fetch('/api/public/offers')
        ])
        
        if (courseRes.ok) {
          const cData = await courseRes.json()
          setCourses(cData.filter((c: Course) => c.active))
        }
        
        if (offerRes.ok) {
          const oData = await offerRes.json()
          setOffers(oData.filter((o: Offer) => o.active))
        }
      } catch (err) {
        console.error('Failed to load public programs', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  const getCircuitSVGPath = (cat: string) => {
    if (cat === 'BEGINNER') {
      return "M20,40 C60,10 100,70 140,40 C180,10 220,70 280,40"
    }
    if (cat === 'ADVANCED') {
      return "M20,60 C40,20 100,10 140,50 C180,80 240,20 280,50"
    }
    return "M15,20 L100,20 L100,60 L200,60 L200,20 L285,20"
  }

  const getMilestones = (cat: string) => {
    if (cat === 'BEGINNER') {
      return ["Clutch Control Mastery", "Standard Parallel Parking", "RTO Parallel Test Guide"]
    }
    if (cat === 'ADVANCED') {
      return ["Freeway High-Speed Slalom", "Hydroplane Braking Reflexes", "Tactical Collision Avoidance"]
    }
    return ["Mock ESC S-Track Run", "Precision Reverse Parking", "Flawless exam checkouts"]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-text-1 relative font-body overflow-x-hidden pt-32 pb-20">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Page Header */}
        <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold font-mono uppercase tracking-widest mb-6"
          >
            <ShieldCheck className="w-4 h-4" /> {t.badge}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight font-display text-text-1 mb-6"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-2 leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
        </header>

        {/* Hot Offers Section */}
        {offers.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-text-1">{t.offersTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, idx) => (
                <motion.div 
                  key={offer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="bg-void/60 backdrop-blur-2xl border border-accent/40 rounded-3xl p-8 relative overflow-hidden group hover:border-accent hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] transition-all duration-500"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-500" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                      <Tag className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-void border border-accent text-accent text-[10px] font-mono font-bold tracking-widest uppercase rounded-full">
                      {offer.promoCode}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-display text-text-1 mb-2">{offer.title[language.toUpperCase() as 'EN'|'HI'|'TE'] || offer.title.EN}</h3>
                  <p className="text-sm text-text-2 mb-8 line-clamp-2 leading-relaxed">{offer.desc[language.toUpperCase() as 'EN'|'HI'|'TE'] || offer.desc.EN}</p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-text-3 font-mono uppercase tracking-widest block mb-1">{t.discount}</span>
                      <span className="text-4xl font-extrabold text-accent font-display">{offer.discountPercent}%</span>
                    </div>
                    <Link href="/booking" className="w-10 h-10 rounded-full bg-void border border-accent text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-void transition-all duration-300">
                      <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Main Curriculum Grid Overhaul */}
        <section>
          <div className="flex items-center gap-3 mb-12 border-b border-white/5 pb-6">
            <h2 className="text-3xl font-bold font-display text-text-1">{t.coursesTitle}</h2>
            <span className="px-3 py-1 bg-surface border border-white/10 text-text-2 text-xs font-mono rounded-full">{courses.length} {language === 'EN' ? 'Programs' : language === 'HI' ? 'प्रोग्राम' : 'ప్రోగ్రామ్‌లు'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course, idx) => {
              const lang = language.toUpperCase() as 'EN' | 'HI' | 'TE'
              const displayTitle = course.title[lang] || course.title.EN
              const displayDesc = course.desc[lang] || course.desc.EN
              const milestones = getMilestones(course.category)
              const pathString = getCircuitSVGPath(course.category)

              return (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  onMouseEnter={() => setHoveredCourseMap(course.id)}
                  onMouseLeave={() => setHoveredCourseMap(null)}
                  className="bg-surface/20 backdrop-blur-2xl border border-white/10 hover:border-primary/50 rounded-3xl p-1 relative group transition-all duration-500 overflow-hidden"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="bg-void/50 h-full rounded-[23px] p-8 relative z-10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary border-b border-primary/30 pb-1">
                          {course.category} Program
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-2 bg-surface px-3 py-1.5 rounded-full border border-white/5">
                          <Clock className="w-3.5 h-3.5" /> {t.duration}
                        </span>
                      </div>

                      <h3 className="text-3xl font-bold font-display text-text-1 mb-4 leading-tight group-hover:text-primary transition-colors">
                        {displayTitle}
                      </h3>
                      <p className="text-text-2 mb-8 leading-relaxed font-body text-sm md:text-base">
                        {displayDesc}
                      </p>
                    </div>

                    {/* Integrated Map telemetric system visualization */}
                    <div className="relative w-full h-[100px] bg-void border border-white/5 rounded-2xl p-4 flex flex-col gap-1 mb-8 overflow-hidden">
                      <span className="text-[8px] font-mono text-text-3 uppercase tracking-widest">Syllabus Track Coordinates</span>
                      
                      <div className="w-full h-[60px] relative flex items-center justify-center">
                        <svg viewBox="0 0 300 80" className="w-full h-full text-white/5">
                          <path 
                            d={pathString} 
                            fill="none" 
                            stroke="rgba(255, 255, 255, 0.05)" 
                            strokeWidth="2.5" 
                            strokeDasharray="4 4" 
                          />
                          <path 
                            d={pathString} 
                            fill="none" 
                            stroke="url(#prog-gradient)" 
                            strokeWidth="2.5" 
                          />
                          <motion.circle
                            r="5"
                            fill="#06b6d4"
                            style={{
                              offsetPath: `path('${pathString}')`
                            }}
                            animate={{
                              offsetDistance: ["0%", "100%"]
                            }}
                            transition={{
                              duration: hoveredCourseMap === course.id ? 3 : 8,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                          <defs>
                            <linearGradient id="prog-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.1" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Interactive milestone coordinates dots */}
                        <div className="absolute top-2 left-10 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <div className="absolute bottom-2 right-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        <div className="absolute top-3 right-8 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      </div>
                    </div>

                    <div>
                      {/* Integrated checklist milestones */}
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-3 mb-4">Milestone Checkpoints</h4>
                      <ul className="space-y-3 mb-8">
                        {milestones.map((feat, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs text-text-2 font-mono">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {feat}
                          </li>
                        ))}
                      </ul>

                      <div className="flex justify-between items-center border-t border-white/5 pt-6">
                        <div>
                          <span className="text-[10px] text-text-3 font-mono uppercase tracking-widest block mb-1">{t.price}</span>
                          <span className="text-3xl font-extrabold text-text-1 font-mono">₹{course.price.toLocaleString('en-IN')}</span>
                        </div>
                        <Link 
                          href="/booking"
                          className="px-8 py-4 bg-primary text-void font-bold rounded-xl flex items-center gap-2 hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_4px_30px_rgba(6,182,212,0.5)] text-sm uppercase tracking-wider font-display"
                        >
                          {t.enroll} <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
