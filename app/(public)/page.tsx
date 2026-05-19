"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Shield, 
  Star, 
  Award, 
  BookOpen, 
  UserCheck, 
  Check, 
  Flame 
} from 'lucide-react'

// Import Road Sign SVGs
import * as RoadSigns from '@/lib/icons/road-signs'

// 1. FAQ ACCORDION DATA
const FAQ_DATA = [
  {
    q: "What is the typical course duration for beginners?",
    a: "Our beginner course spans 21 days, covering 15 on-road practical sessions, 4 indoor theoretical simulation modules, and complete RTO mock preparation clearance tests."
  },
  {
    q: "What is the structure for fees? Can I pay online?",
    a: "Sri Guru Driving Academy operates on a structured transparency policy. We note fees upfront in the physical brochure. Note that we do not process online payments through this web portal; all payments are processed directly at our corporate booking desk."
  },
  {
    q: "What vehicle types are available for training?",
    a: "We offer training in LMV (Light Motor Vehicle) categories across modern manual transmissions (Hatchbacks, Sedans) and automatics, complete with safety dual-control modules."
  },
  {
    q: "How does the RTO license test process work?",
    a: "We handle the administrative alignment. You will complete our RTO prep simulation center checks, clear the mock theoretical tests, and we will escort you with an academy vehicle for the official road-track license clearances."
  },
  {
    q: "Do you offer pick-and-drop services?",
    a: "Yes! The premium LMV manual and automatic courses include door-step pick-and-drop options in pre-scheduled time ranges with assigned instructors."
  },
  {
    q: "Are the training instructors certified?",
    a: "Every instructor at Sri Guru holds government-certified coaching credentials and has completed our internal 4-week advanced defensive driving curriculum checks."
  },
  {
    q: "What happens if I miss a scheduled session?",
    a: "You can reschedule easily via the cadet portal at least 12 hours in advance. Missed slots without notification are archived to ensure fair allocation of instructor timing."
  },
  {
    q: "Can I choose my training slot timing?",
    a: "Absolutely. Our slots range from 6:00 AM dawn sessions to 8:30 PM night-driving simulation blocks, which you can coordinate with your coach."
  }
]

// 2. TESTIMONIAL CYCLES DATA
const TESTIMONIALS = [
  {
    name: "Amanpreet Kaur",
    city: "Mohali",
    rating: 5,
    quote: "Sri Guru completely transformed my driving confidence. The practical progress scoreboard and defensive mirror check lessons made parallel parking feel like a breeze!"
  },
  {
    name: "Rohan Malhotra",
    city: "Chandigarh",
    rating: 5,
    quote: "The interactive RTO mock tests in the learning center are outstanding. I cleared my official theoretical signs exam in under 4 minutes with zero errors."
  },
  {
    name: "Priya Sharma",
    city: "Panchkula",
    rating: 5,
    quote: "Defensive manual control routines are taught with unmatched precision. My coach was incredibly calm, methodical, and detailed on clutch-holding angles."
  }
]

export default function PublicAcademyLandingPage() {
  
  // A. Counter Animators (Stats bar count-up)
  const [stats, setStats] = useState({ trained: 0, passRate: 0, experience: 0, instructors: 0 })
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        // Animate count-up using requestAnimationFrame
        let startTime: number | null = null
        const duration = 1500 // 1.5s animation

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          
          setStats({
            trained: Math.floor(progress * 1420),
            passRate: Math.floor(progress * 99),
            experience: Math.floor(progress * 15),
            instructors: Math.floor(progress * 12)
          })

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.2 })

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  // B. Testimonials active index switcher
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // C. Accordion Active state
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null)

  // D. Public Inquiry Form state
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [formStatus, setFormStatus] = useState<string | null>(null)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return

    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setFormStatus('Inquiry submitted! Our representative will call you shortly.')
        setForm({ name: '', phone: '', message: '' })
        setTimeout(() => setFormStatus(null), 5000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body relative overflow-x-hidden">
      
      {/* ----------------------------------------------------
          SECTION 1 — HERO VIEW (Full viewport height)
          ---------------------------------------------------- */}
      <section className="relative w-full h-[95vh] flex items-end justify-between overflow-hidden px-8 pb-16 md:pb-24 border-b border-border bg-void">
        
        {/* Animated road-lane background */}
        <div className="absolute inset-0 flex justify-center pointer-events-none select-none z-0">
          <svg className="w-[120px] h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Left and Right solid curb rails */}
            <line x1="10" y1="0" x2="10" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <line x1="90" y1="0" x2="90" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            
            {/* Moving dashed center highway lane */}
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeDasharray="8,12"
              className="animate-[roadMove_3.5s_linear_infinite]"
            />
          </svg>
        </div>

        {/* CSS Keyframes for infinite road forward travel */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes roadMove {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -40; }
          }
          @keyframes floatCar {
            0% { transform: translateY(0px) rotate(0.5deg); }
            50% { transform: translateY(-16px) rotate(-0.5deg); }
            100% { transform: translateY(0px) rotate(0.5deg); }
          }
          .custom-road-footer {
            background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.015) 0px, rgba(255, 255, 255, 0.015) 2px, transparent 2px, transparent 10px);
          }
        `}} />

        {/* Hero Left Content block (aligned left bottom 30%) */}
        <div className="relative z-10 max-w-2xl text-left flex flex-col gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            THE FUTURE OF DRIVING EDUCATION
          </span>
          
          <h1 className="text-4xl md:text-[72px] font-black text-text-1 font-display tracking-tight leading-[0.95] uppercase">
            Learn to Drive.<br />
            <span className="text-accent">Master the Road.</span>
          </h1>

          <p className="text-sm md:text-lg text-text-2 font-medium max-w-lg leading-relaxed">
            Sri Guru Driving Academy integrates custom visual scorecards, interactive RTO dashboards, and certified training vectors to unlock elite road mastery.
          </p>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-void font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-accent/15 transition-all duration-300 flex items-center gap-2 group"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Hero Right Content block (Floating Abstract Car Vector SVG) */}
        <div 
          className="hidden lg:flex w-[480px] h-[340px] items-center justify-center relative z-10 mr-12 select-none"
          style={{ animation: 'floatCar 3s infinite ease-in-out' }}
        >
          <svg className="w-full h-full text-primary" viewBox="0 0 160 100" fill="none">
            {/* Ambient neon backdrop glow */}
            <ellipse cx="80" cy="75" rx="55" ry="12" fill="rgba(37, 99, 235, 0.15)" filter="blur(16px)" />
            
            {/* Geometric conceptual car framework paths */}
            <path d="M20,68 L140,68 C148,68 152,62 144,54 L128,34 C124,30 118,26 112,26 L48,26 C42,26 36,30 32,34 L16,54 C8,62 12,68 20,68 Z" fill="rgba(13, 17, 23, 0.9)" stroke="var(--color-primary)" strokeWidth="1.5" />
            <path d="M48,28 L112,28 L124,44 L36,44 Z" fill="rgba(37,99,235,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            
            {/* Glowing amber hazard headlamps */}
            <circle cx="28" cy="56" r="3" fill="#F59E0B" className="animate-pulse" />
            <circle cx="132" cy="56" r="3" fill="#F59E0B" className="animate-pulse" />
            
            {/* Speed dashboard circles */}
            <circle cx="48" cy="68" r="9" fill="rgba(7,9,15,0.9)" stroke="var(--color-border)" strokeWidth="1.5" />
            <circle cx="112" cy="68" r="9" fill="rgba(7,9,15,0.9)" stroke="var(--color-border)" strokeWidth="1.5" />
            <circle cx="48" cy="68" r="3" fill="var(--color-primary)" />
            <circle cx="112" cy="68" r="3" fill="var(--color-primary)" />
          </svg>
        </div>

      </section>

      {/* ----------------------------------------------------
          SECTION 2 — STATS BAR (Count-up animators)
          ---------------------------------------------------- */}
      <section 
        ref={statsRef}
        className="w-full bg-surface border-b border-border py-8 px-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-primary font-mono tracking-tighter">
              {stats.trained}+
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-3 mt-1.5 font-bold">
              STUDENTS TRAINED
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-accent font-mono tracking-tighter">
              {stats.passRate}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-3 mt-1.5 font-bold">
              FIRST TIME PASS RATE
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-text-1 font-mono tracking-tighter">
              {stats.experience}+
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-3 mt-1.5 font-bold">
              YEARS EXPERIENCE
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-extrabold text-success font-mono tracking-tighter">
              {stats.instructors}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-3 mt-1.5 font-bold">
              CERTIFIED COACHES
            </span>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 3 — HOW IT WORKS (Horizontal Timeline)
          ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center border-b border-border">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">TRAINING TIMELINE</span>
        <h2 className="text-3xl font-extrabold text-text-1 font-display uppercase tracking-tight mt-1.5">
          THE CADET ROADMAP
        </h2>

        {/* Steps track grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12 relative">
          
          {/* Subtle horizontal timeline joining line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/40 hidden md:block -translate-y-6 z-0" />

          {[
            { nr: "01", name: "Enroll", desc: "Choose LMV category. Seed database profile logs." },
            { nr: "02", name: "Theory Mockups", desc: "Master 10 core road signs inside simulation dashboard." },
            { nr: "03", name: "Practical Loops", desc: "18 defensive clutch, shift, and alignment on-road lessons." },
            { nr: "04", name: "RTO Preparedness", desc: "Clear mock signs testing metrics with countdown clocks." },
            { nr: "05", name: "Official License", desc: "Validate academy clearances and secure state LMV permit." }
          ].map((step, idx) => (
            <div 
              key={step.nr} 
              className="bg-surface/50 border border-border p-5 rounded-2xl text-left relative z-10 flex flex-col gap-3 hover:border-primary transition-all duration-300 shadow-md"
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl font-black text-primary/30 font-display leading-none">{step.nr}</span>
                <span className="px-2 py-0.5 bg-void text-text-3 border border-border/80 rounded font-mono text-[8px]">STEP</span>
              </div>
              <h4 className="text-sm font-bold text-text-1 mt-1 uppercase font-display">{step.name}</h4>
              <p className="text-xs text-text-2 leading-relaxed font-body mt-0.5">
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 4 — TRAINING PROGRAMS (Asymmetric Grid)
          ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center border-b border-border">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">CADET OPTIONS</span>
        <h2 className="text-3xl font-extrabold text-text-1 font-display uppercase tracking-tight mt-1.5">
          Curated Coaching Curriculums
        </h2>

        {/* Asymmetric programs block (1st card large spanning 2 rows, 2nd & 3rd smaller) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12 items-stretch">
          
          {/* Card 1: Beginner LMV Manual (Large) */}
          <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] flex flex-col justify-between text-left lg:col-span-2 shadow-xl hover:border-primary transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-primary/10 rounded-full blur-[40px]" />
            
            <div>
              <div className="flex justify-between items-start">
                <span className="px-3.5 py-1.5 bg-primary/15 border border-primary/25 text-primary text-[9px] font-mono font-bold rounded-full uppercase tracking-wider">
                  ELITE RECONSTRUCTED
                </span>
                <span className="text-xs font-mono text-text-3 uppercase">21 DAYS TIMELINE</span>
              </div>

              <h3 className="text-3xl font-black text-text-1 font-display uppercase tracking-tight mt-4">
                Beginner Manual LMV
              </h3>
              <p className="text-xs text-text-2 mt-2 leading-relaxed max-w-md">
                Complete baseline zero-to-driver defensive roadmap. Includes full clutch friction training, night shifts, parallel alignment rings, and total RTO preparation tools.
              </p>

              <div className="border-t border-border/80 my-6 pt-5">
                <span className="text-[10px] font-mono text-text-3 uppercase font-bold block mb-2">CURRICULUM SPECIFICATION:</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-text-2">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>15 Premium On-Road Coaching Sessions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>4 Simulation Dashboard Theory Modules</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>Clutch holding friction point tests</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>Academy Escorted License Clearances</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '#contact'}
              className="mt-6 w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              Book LMV Demo Slot
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards 2 & 3 Col Wrapper */}
          <div className="flex flex-col gap-6">
            
            {/* Card 2: Advanced Refresh (Small) */}
            <div className="bg-surface border border-border p-5 rounded-3xl flex flex-col justify-between text-left shadow-md hover:border-accent transition-all duration-300">
              <div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-accent font-bold uppercase font-mono">14 DAYS ROADMAP</span>
                  <span className="text-text-3 font-mono">LMV ONLY</span>
                </div>
                <h4 className="text-lg font-bold text-text-1 uppercase font-display mt-2">Defensive Advanced LMV</h4>
                <p className="text-xs text-text-2 mt-1 leading-relaxed font-body">
                  Designed for license holders seeking freeway maneuvers, high speed braking, and extreme weather drills.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '#contact'}
                className="mt-4 text-[10px] font-mono text-accent hover:underline flex items-center gap-1 font-bold text-left"
              >
                BOOK DEMO REFRESHE <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card 3: RTO Fast Track (Small) */}
            <div className="bg-surface border border-border p-5 rounded-3xl flex flex-col justify-between text-left shadow-md hover:border-success transition-all duration-300">
              <div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-success font-bold uppercase font-mono">7 DAYS BOOTCAMP</span>
                  <span className="text-text-3 font-mono">RTO CLEARANCE</span>
                </div>
                <h4 className="text-lg font-bold text-text-1 uppercase font-display mt-2">RTO Rapid Prep Clear</h4>
                <p className="text-xs text-text-2 mt-1 leading-relaxed font-body">
                  Specialized mock tests, road-sign crash preparation, and parking track alignment focus sessions.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '#contact'}
                className="mt-4 text-[10px] font-mono text-success hover:underline flex items-center gap-1 font-bold text-left"
              >
                BOOK TEST SLATE <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 5 — INSTRUCTOR HIGHLIGHTS (CSS Snap Row)
          ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center border-b border-border">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">ELITE CADET COACHES</span>
        <h2 className="text-3xl font-extrabold text-text-1 font-display uppercase tracking-tight mt-1.5">
          Our Advanced Instructors
        </h2>

        {/* Scroll-snap horizontal row */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory mt-12 pb-6 scrollbar-none">
          
          {[
            { name: "Harpreet Singh", exp: "8 Years", spec: "Manual shift friction control", students: "280+ students trained" },
            { name: "Vikramjit Rathore", exp: "12 Years", spec: "Extreme defensive freeway braking", students: "420+ students trained" },
            { name: "Gurbaksh Dhillon", exp: "6 Years", spec: "RTO test track aligner", students: "180+ students trained" }
          ].map((ins, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 w-[280px] snap-center bg-surface border border-border p-5 rounded-2xl flex flex-col gap-4 text-left hover:border-primary transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-display text-sm">
                {ins.name[0]}
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-1 uppercase font-display leading-tight">{ins.name}</h4>
                <span className="text-[9px] font-mono text-accent uppercase font-bold mt-1 block">
                  {ins.exp} EXPERIENCE
                </span>
                <p className="text-xs text-text-2 mt-2 leading-relaxed">
                  Specializes in <span className="text-text-1 font-bold">{ins.spec}</span> modules. Verified coach.
                </p>
              </div>

              <div className="border-t border-border/80 pt-3 flex justify-between items-center text-[9px] font-mono text-text-3 uppercase">
                <span>{ins.students}</span>
                <span className="text-success font-bold">VERIFIED</span>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 6 — TESTIMONIALS (Stacked cyclic quotes)
          ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-lg mx-auto text-center border-b border-border">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">CADET REVIEWS</span>
        <h2 className="text-2xl font-extrabold text-text-1 font-display uppercase tracking-tight mt-1.5">
          Student Feedback
        </h2>

        {/* Stacked testimonials layout auto-cycling */}
        <div className="relative h-[240px] mt-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {TESTIMONIALS.map((test, idx) => {
              if (idx !== testimonialIdx) return null

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 1 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-surface border border-border p-6 rounded-3xl flex flex-col justify-between text-left shadow-lg"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-accent fill-accent" />
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-text-1 leading-relaxed font-medium italic my-4 font-body">
                    "{test.quote}"
                  </p>

                  <div className="flex justify-between items-center border-t border-border/60 pt-3">
                    <span className="text-xs font-bold text-text-1 uppercase font-display">{test.name}</span>
                    <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider">{test.city}</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 7 — RTO PREP PREVIEW
          ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center border-b border-border">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">RTO TESTING HUB</span>
        <h2 className="text-3xl font-extrabold text-text-1 font-display uppercase tracking-tight mt-1.5">
          Tease the RTO Simulation Center
        </h2>
        <p className="text-xs text-text-2 mt-2 max-w-lg mx-auto">
          Sri Guru dashboard integrates real vector-graphic signs mockups. Here are three baseline signs we master in the curriculum:
        </p>

        {/* 3 Sign previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-xl mx-auto">
          
          <div className="bg-surface border border-border p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <RoadSigns.STOP_SIGN className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-text-1">STOP SIGN</span>
          </div>

          <div className="bg-surface border border-border p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <RoadSigns.YIELD className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-text-1">YIELD AHEAD</span>
          </div>

          <div className="bg-surface border border-border p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <RoadSigns.SPEED_LIMIT limit={50} className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-text-1">SPEED LIMIT 50</span>
          </div>

        </div>

        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-3 bg-void hover:bg-white/[0.02] border border-border mt-8 text-xs font-bold rounded-xl flex items-center gap-1.5 mx-auto transition-all duration-200"
        >
          Mock Theoretical RTO signs
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* ----------------------------------------------------
          SECTION 8 — ACCORDION FAQ (Framer height anims)
          ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center border-b border-border">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">FREQUENT QUESTIONS</span>
        <h2 className="text-3xl font-extrabold text-text-1 font-display uppercase tracking-tight mt-1.5 mb-12">
          Academy FAQ Registry
        </h2>

        {/* FAQ Accordion list */}
        <div className="flex flex-col gap-3 text-left">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = activeFaqIdx === idx

            return (
              <div 
                key={idx} 
                className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center gap-4 text-xs font-bold text-text-1 uppercase font-display"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-3 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0, transformOrigin: 'top' }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p className="px-5 pb-5 text-xs text-text-2 leading-relaxed font-body">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 9 — CONTACT + MAP
          ---------------------------------------------------- */}
      <section id="contact" className="py-20 px-6 max-w-6xl mx-auto border-b border-border grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Contact Form */}
        <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] text-left relative overflow-hidden">
          <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider block">CONTACT THE STATION</span>
          <h3 className="text-2xl font-extrabold text-text-1 font-display mt-2 uppercase tracking-tight">
            Schedule LMV Trial
          </h3>
          <p className="text-xs text-text-2 mt-1 leading-relaxed mb-6 font-body">
            Have queries on fee specifications or slots availability? File an inquiry below.
          </p>

          <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-text-3 uppercase">Full Name</label>
              <input
                type="text"
                required
                placeholder="Vikram Singh"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-void/60 border border-border focus:border-primary px-4 py-2.5 rounded-xl text-xs text-text-1 placeholder-text-3 outline-none transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-text-3 uppercase">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-void/60 border border-border focus:border-primary px-4 py-2.5 rounded-xl text-xs text-text-1 placeholder-text-3 outline-none transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-text-3 uppercase">Message Details</label>
              <textarea
                placeholder="Describe license status or queries..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full h-24 bg-void/60 border border-border focus:border-primary p-3 rounded-xl text-xs text-text-1 placeholder-text-3 outline-none transition-all duration-200 resize-none"
              />
            </div>

            {formStatus && (
              <span className="text-[10px] text-success font-mono uppercase tracking-wider block mt-1 font-bold">
                {formStatus}
              </span>
            )}

            <button
              type="submit"
              className="mt-2 w-full py-3 bg-accent hover:bg-accent/90 text-void font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200"
            >
              Submit Inquiry
            </button>

          </form>
        </div>

        {/* Right: Map Placeholder Box */}
        <div className="bg-surface border border-border p-4 rounded-[32px] h-[400px] flex flex-col justify-between items-center text-center relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-void/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-8 h-8 text-primary animate-bounce" />
              <span className="text-xs font-mono uppercase tracking-widest text-text-3 font-bold mt-1">Google Maps placeholder</span>
              <span className="text-[9px] font-mono text-text-3 mt-0.5">SRI GURU ACADEMY CENTRAL STATION LOADS HERE</span>
            </div>
          </div>
          
          <div className="w-full h-full bg-void/30 border border-dashed border-border rounded-2xl" />
        </div>

      </section>

      {/* ----------------------------------------------------
          SECTION 10 — FOOTER (Subtle Road Texture)
          ---------------------------------------------------- */}
      <footer className="w-full bg-surface border-t border-border pt-16 pb-8 px-6 relative z-10 custom-road-footer overflow-hidden">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-start pb-12 border-b border-border/80">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-black text-primary font-display tracking-tight uppercase">
              Sri Guru Driving Academy
            </h4>
            <p className="text-xs text-text-2 leading-relaxed font-body max-w-xs">
              Delivering future-ready driving masteries through custom visualization layers and on-road theoretical test clearing systems.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider font-bold">RESOURCES</span>
            <a href="/dashboard" className="text-xs text-text-2 hover:text-text-1 transition-colors duration-200 text-left">Cadet Dashboard</a>
            <a href="/learn" className="text-xs text-text-2 hover:text-text-1 transition-colors duration-200 text-left">Theoretical Practice</a>
            <a href="/rto" className="text-xs text-text-2 hover:text-text-1 transition-colors duration-200 text-left">RTO Simulation tests</a>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-2.5 text-xs text-text-2">
            <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider font-bold">CONTACT INFO</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Mohali Bypass, Sector 70, Punjab
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent" />
              +91 98765 43210
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-success" />
              info@srigurudriving.com
            </span>
          </div>

        </div>

        {/* Center copyright line */}
        <div className="max-w-6xl mx-auto pt-6 text-center text-[10px] font-mono text-text-3">
          © 2024 Sri Guru Driving Academy. All rights reserved.
        </div>

      </footer>

    </div>
  )
}
