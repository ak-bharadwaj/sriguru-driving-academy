"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Star, 
  ShieldCheck,
  Clock,
  Car,
  Award,
  Check,
  Download,
  Smartphone,
  ImageIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Course, BrandingState } from '@/lib/data/academyStore'

const FAQ_DATA = [
  { q: "How long does the beginner course take?", a: "The standard beginner course runs for 21 days. This includes 15 practical on-road sessions and 4 theoretical modules designed to prepare you fully for your license exam." },
  { q: "What is your fee structure?", a: "We believe in complete transparency. Our fees are clearly listed with no hidden charges. Payments are securely processed at our front desk." },
  { q: "Do you provide dual-control vehicles?", a: "Yes, 100% of our training fleet consists of late-model vehicles equipped with professional dual-control systems for your absolute safety." },
  { q: "Do you help with the driving license test?", a: "Absolutely. We manage all RTO test scheduling, and you will take your final driving exam in the exact same vehicle you trained in." },
  { q: "Is pick-up and drop-off available?", a: "Yes, we offer complimentary door-to-door shuttle service for all our premium and advanced training tiers." }
]

const TESTIMONIALS = [
  { name: "Amanpreet Kaur", role: "Student", rating: 5, quote: "The curriculum is meticulously structured. The instructors are incredibly patient, making parallel parking feel completely natural within days." },
  { name: "Rohan Malhotra", role: "Student", rating: 5, quote: "Passed my driving test on the very first attempt. The mock theory tests on their digital portal are exactly what you need to prepare." },
  { name: "Priya Sharma", role: "Student", rating: 5, quote: "A highly professional academy. The flexible scheduling and the calm demeanor of the instructors made learning to drive a joy." }
]

const QUIZ_QUESTIONS = [
  { q: "What should you do when approaching a yellow traffic light?", options: ["Speed up to cross", "Stop safely if possible", "Honk and proceed", "Ignore it"], answer: 1 },
  { q: "When are you allowed to pass a vehicle on the right?", options: ["Anytime", "Never", "When they are turning left", "On highways only"], answer: 2 },
  { q: "What is the safest following distance in normal conditions?", options: ["1 second", "2 seconds", "3-4 seconds", "10 seconds"], answer: 2 }
]

export interface InstructorProp {
  id: string
  name: string
  bio: string | null
  specialization: string | null
  yearsExp: number
}

interface LandingClientProps {
  courses: Course[]
  instructors: InstructorProp[]
  branding?: BrandingState
}

export default function LandingClient({ courses, instructors, branding }: LandingClientProps) {
  const router = useRouter()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  
  // Quiz State
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizResult, setShowQuizResult] = useState(false)

  const handleQuizAnswer = (idx: number) => {
    if (idx === QUIZ_QUESTIONS[quizStep].answer) {
      setQuizScore(prev => prev + 1)
    }
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1)
    } else {
      setShowQuizResult(true)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizScore(0)
    setShowQuizResult(false)
  }

  const scrollToBooking = () => window.location.href = '/booking'

  const academyName = branding?.academyName || "Sri Guru Academy"
  const logoUrl = branding?.logoUrl

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#030014] text-slate-900 dark:text-slate-50 font-body selection:bg-violet-500/30 selection:text-violet-900 dark:selection:text-violet-100 relative overflow-x-hidden">
      
      {/* ----------------------------------------------------
          AURORA MESH GRADIENTS (Global Background)
          ---------------------------------------------------- */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-500/20 dark:bg-violet-600/20 blur-[140px] pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/20 dark:bg-teal-500/15 blur-[140px] pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0" />
      <div className="fixed top-[40%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/15 blur-[140px] pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0" />

      {/* ----------------------------------------------------
          PHOTOGRAPHIC HERO SECTION (SPATIAL GLASS)
          ---------------------------------------------------- */}
      <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Full Bleed Background Image with Extreme Smooth Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/academy-hero.png')" }}
        />
        {/* Deep Cinematic Overlay with a hint of midnight blue */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#030014]/40 via-black/40 to-[#030014]/90 dark:to-[#030014]" />
        <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-[2px]" />
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 w-full px-6 py-20 mt-20">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
            Premium Driving Education
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-[7rem] font-medium tracking-tighter leading-[0.95] mb-8 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            Drive with <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 drop-shadow-lg">Absolute Precision.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl leading-relaxed font-light drop-shadow-md"
          >
            {academyName} represents the pinnacle of driver education. Structured curriculums, dual-control fleets, and elite instructors.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-wrap justify-center"
          >
            <button 
              onClick={scrollToBooking}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] transition-all duration-500 flex items-center justify-center gap-3 text-sm tracking-wide uppercase"
            >
              Book a Trial <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#download-app" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium rounded-full backdrop-blur-xl transition-all duration-500 flex items-center justify-center gap-2 text-sm tracking-wide uppercase"
            >
              <Download className="w-4 h-4" /> Download App
            </a>
            <a 
              href="#courses" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white font-medium rounded-full backdrop-blur-xl transition-all duration-500 text-center text-sm tracking-wide uppercase hidden md:block"
            >
              Curriculum
            </a>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------
          BENTO GRID: SPATIAL FEATURES
          ---------------------------------------------------- */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tighter mb-6">Engineering Trust.</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xl font-light leading-relaxed max-w-2xl">
              We provide an uncompromised, strictly structured learning environment built on safety and analytical precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
            {/* Feature 1 */}
            <div className="md:col-span-2 md:row-span-2 bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] p-12 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-violet-500/20">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-medium mb-6 font-display tracking-tight">Dual-Control Fleet</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-light max-w-md">
                  Our entire fleet is equipped with professional dual controls. Your instructor maintains absolute authority to intervene instantly, ensuring 100% safety during exposure to complex traffic scenarios.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-2 md:row-span-1 bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />
              <div className="flex items-center gap-6 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl border border-white/50 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium font-display tracking-tight">Elite Instructors</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light text-lg relative z-10">
                Government-certified professionals selected exclusively for their rigorous defensive driving expertise and pedagogical restraint.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-10 flex flex-col justify-center items-center text-center shadow-xl shadow-indigo-500/20">
              <Clock className="w-10 h-10 text-white mb-6" />
              <h3 className="text-2xl font-medium text-white font-display tracking-tight mb-3">Fluid</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">Book sessions seamlessly.</p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-1 md:row-span-1 bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center items-center text-center">
              <Car className="w-10 h-10 mb-6 text-violet-600 dark:text-violet-400" />
              <h3 className="text-2xl font-medium font-display tracking-tight mb-3">Modern</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Train in pristine vehicles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SPATIAL CURRICULUM
          ---------------------------------------------------- */}
      <section id="courses" className="py-32 px-6 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tighter mb-6">The Curriculum.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-light">Select a highly-calibrated program tailored to your precise experience level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses?.slice(0,3).map((course, i) => (
              <div 
                key={course.id}
                className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col hover:border-violet-500/30 dark:hover:border-violet-400/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none" />
                
                <div className="mb-10 pb-10 border-b border-black/5 dark:border-white/10 relative z-10">
                  <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full mb-6 uppercase tracking-[0.2em] border border-violet-200 dark:border-violet-800">
                    {course.durationDays} Days
                  </span>
                  <h3 className="font-display text-3xl font-medium mb-4 tracking-tight leading-none">{course.name}</h3>
                  <div>
                    <span className="text-5xl font-medium tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-12 flex-1 leading-relaxed font-light text-lg relative z-10">
                  {course.description || "Comprehensive dynamic training covering advanced fundamentals, traffic theory, and defensive maneuvers."}
                </p>
                
                <ul className="space-y-5 mb-12 relative z-10">
                  <li className="flex items-center gap-4">
                    <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="font-light text-lg">Dual-control training</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="font-light text-lg">RTO Exam Prep</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="font-light text-lg">Digital portal access</span>
                  </li>
                </ul>

                <button 
                  onClick={scrollToBooking}
                  className="w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-full hover:scale-[1.02] transition-transform duration-300 tracking-wide text-sm uppercase shadow-lg shadow-violet-500/20 relative z-10"
                >
                  Select Program
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          INTERACTIVE KNOWLEDGE CHECK
          ---------------------------------------------------- */}
      <section className="py-32 px-6 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tighter mb-4">Test Your Instincts.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-light">Take our quick knowledge check to see if you're ready for the road.</p>
          </div>

          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] p-10 md:p-16 border border-white/40 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!showQuizResult ? (
                <motion.div 
                  key="question"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <span className="text-violet-600 dark:text-violet-400 font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                    Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-medium mb-10">{QUIZ_QUESTIONS[quizStep].q}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUIZ_QUESTIONS[quizStep].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        className="px-6 py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl hover:bg-violet-50 dark:hover:bg-white/10 hover:border-violet-300 dark:hover:border-violet-500/50 transition-all duration-300 text-left text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-8">
                    <span className="text-4xl font-bold text-white">{quizScore}/{QUIZ_QUESTIONS.length}</span>
                  </div>
                  <h3 className="font-display text-3xl font-medium mb-4">
                    {quizScore === QUIZ_QUESTIONS.length ? "Perfect Score! You're ready." : "Good try! We can help you perfect it."}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-10">
                    Knowing the rules is just step one. Mastering them behind the wheel is where we come in.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={resetQuiz} className="px-8 py-3 bg-white/50 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full font-medium hover:bg-white dark:hover:bg-white/20 transition-colors">
                      Retry Quiz
                    </button>
                    <button onClick={scrollToBooking} className="px-8 py-3 bg-violet-600 text-white rounded-full font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/30">
                      Book a Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          IMMERSIVE GALLERY
          ---------------------------------------------------- */}
      <section id="gallery" className="py-32 px-6 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tighter mb-6">Inside the Academy.</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xl font-light">Experience our premium training facilities and dual-control fleet.</p>
            </div>
            <a href="/gallery" className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:underline">
              View full gallery <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-[400px] bg-slate-200 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/10 relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop" alt="Training Vehicle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <span className="text-white font-medium text-lg">Late-Model Fleet</span>
              </div>
            </div>
            <div className="h-[400px] bg-slate-200 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/10 relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop" alt="Instructor Session" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <span className="text-white font-medium text-lg">One-on-One Coaching</span>
              </div>
            </div>
            <div className="h-[400px] bg-slate-200 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/10 relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop" alt="Safety Briefing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <span className="text-white font-medium text-lg">Advanced Simulators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          TESTIMONIALS & FAQ
          ---------------------------------------------------- */}
      <section className="py-32 px-6 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
            
          {/* Reviews Side */}
          <div>
            <h2 className="font-display text-4xl font-medium mb-12 tracking-tighter">The Verdict.</h2>
            <div className="space-y-8">
              {TESTIMONIALS.slice(0, 2).map((t, idx) => (
                <div key={idx} className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <p className="leading-relaxed mb-8 font-light text-lg">"{t.quote}"</p>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-medium text-sm tracking-wide uppercase">{t.name}</h5>
                      <div className="flex gap-1 mt-2">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Side */}
          <div id="faq">
            <h2 className="font-display text-4xl font-medium mb-12 tracking-tighter">Details.</h2>
            <div className="space-y-4">
              {FAQ_DATA.slice(0, 4).map((faq, idx) => {
                const isOpen = activeFaq === idx
                return (
                  <div 
                    key={idx}
                    className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-8 py-6 flex justify-between items-center text-left"
                    >
                      <span className="font-medium text-lg pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-violet-500 transition-transform duration-500 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-light leading-relaxed text-lg pt-2">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          DOWNLOAD APP CTA (SPATIAL)
          ---------------------------------------------------- */}
      <section id="download-app" className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            {/* Glowing orbs inside the dark box */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="max-w-lg">
                <h2 className="font-display text-4xl md:text-5xl font-medium text-white tracking-tighter mb-6">Learn on the go.</h2>
                <p className="text-violet-200 font-light text-lg leading-relaxed mb-10">
                  Download the {academyName} mobile app to access mock tests, track your driving hours, and manage your bookings seamlessly from your phone.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/downloads/app-release.apk" download className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Download className="w-5 h-5" /> Download APK
                  </a>
                </div>
              </div>
              <div className="hidden md:flex w-64 h-64 bg-white/5 backdrop-blur-md rounded-3xl border border-white/20 items-center justify-center">
                <Smartphone className="w-32 h-32 text-white/50" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          RICH COLORED FOOTER
          ---------------------------------------------------- */}
      <footer className="bg-slate-950 dark:bg-[#0a051e] text-slate-400 py-24 px-6 relative z-20 border-t-4 border-violet-600">
        
        {/* Subtle Footer Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10">
          
          <div className="flex items-center gap-6">
            {logoUrl ? (
              <img src={logoUrl} alt={`${academyName} Logo`} className="w-12 h-12 object-contain rounded" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Car className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <span className="font-display font-medium text-2xl text-white tracking-tighter block leading-none">
                {academyName}
              </span>
              <span className="text-violet-200/50 text-sm font-light mt-2 block">The standard in precision driving.</span>
            </div>
          </div>

          <div className="flex gap-10 text-sm font-medium tracking-wide uppercase text-violet-200/70">
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#courses" className="hover:text-white transition-colors">Curriculum</a>
            <a href="/login" className="hover:text-white transition-colors">Portal</a>
            <a href="#download-app" className="hover:text-white transition-colors">App</a>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-light text-slate-500 relative z-10">
          <span>&copy; {new Date().getFullYear()} {academyName}. All rights reserved.</span>
          <span className="uppercase tracking-[0.2em] text-violet-400/50">Engineered with Precision</span>
        </div>
      </footer>

    </div>
  )
}
