"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Award, 
  Sparkles,
  Flame,
  FileCheck,
  Check,
  Smartphone,
  Download,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react'
import { signIn } from 'next-auth/react'

interface Question {
  q: string
  options: string[]
  ans: number
  exp: string
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    q: "What does a circular sign with a red border and the number '50' inside mean?",
    options: [
      "Recommended speed is 50 km/h",
      "Strict maximum speed limit of 50 km/h (Mandatory)",
      "Minimum speed limit of 50 km/h",
      "Speed limit for heavy vehicles only"
    ],
    ans: 1,
    exp: "Red circular borders indicate mandatory instructions. The number 50 represents the legal maximum speed limit you must not exceed."
  },
  {
    q: "You are approaching a zebra crossing and pedestrians are waiting to cross. What should you do?",
    options: [
      "Sound your horn to warn them and pass quickly",
      "Slow down slightly but maintain your path",
      "Stop the vehicle, wait for pedestrians to cross, then proceed safely",
      "Flash your headlights to tell them to cross"
    ],
    ans: 2,
    exp: "Zebra crossings give absolute right-of-way to pedestrians. You must bring your vehicle to a complete stop and allow them to cross."
  },
  {
    q: "What is the shape of a warning or cautionary traffic sign in India?",
    options: [
      "Octagonal",
      "Circular",
      "Rectangular",
      "Equilateral Triangular"
    ],
    ans: 3,
    exp: "All warning/cautionary signs are equilateral triangles pointing upwards, designed to alert drivers of road conditions ahead."
  }
]

export default function RTOExamLanding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0) // 0: intro, 1: quiz, 2: results
  const [qIndex, setQIndex] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)

  const handleStartQuiz = () => {
    setCurrentStep(1)
    setQIndex(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setScore(0)
  }

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return
    setSelectedOpt(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return
    const correct = selectedOpt === SAMPLE_QUESTIONS[qIndex].ans
    if (correct) setScore(prev => prev + 1)
    setIsAnswered(true)
  }

  const handleNextQuestion = () => {
    if (qIndex < SAMPLE_QUESTIONS.length - 1) {
      setQIndex(prev => prev + 1)
      setSelectedOpt(null)
      setIsAnswered(false)
    } else {
      setCurrentStep(2)
    }
  }

  const activeQuestion = SAMPLE_QUESTIONS[qIndex]

  return (
    <div className="min-h-screen bg-void text-text-1 relative overflow-x-hidden font-body pb-32">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="w-full border-b border-border/40 bg-surface/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20">
              R
            </div>
            <span className="font-display font-black text-sm sm:text-base tracking-wider uppercase text-white">
              RTO Exam Prep
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://srigurudrivingschool.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-text-2 hover:text-white transition-colors"
            >
              Learn Practical Driving <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-border/80 text-white rounded-xl font-bold text-xs sm:text-sm transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Practical Driving Notice Banner for Mobile / Smaller Screens */}
      <div className="max-w-4xl mx-auto px-4 mt-6 md:hidden">
        <a
          href="https://srigurudrivingschool.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between gap-4 text-xs font-bold text-primary group"
        >
          <span className="flex items-center gap-2">
            🚗 Want to learn physical driving locally? Visit Sri Guru Driving School!
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Hero Title Area */}
      <div className="max-w-6xl mx-auto px-4 pt-12 sm:pt-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/20 text-[10px] sm:text-xs font-mono text-primary uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>100% Free RTO Learning License Preparation Portal</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Pass Your RTO Learning License Test on the <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">First Attempt</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-3 text-sm sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Stop memorizing boring question PDFs. Boost your road confidence with real interactive mock exams, official road signs, and simulator-based practice.
        </motion.p>
      </div>

      {/* Interactive Main Area */}
      <div className="max-w-3xl mx-auto px-4 mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface/60 backdrop-blur-xl border border-border/60 shadow-app-hover rounded-[32px] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {/* Step 0: Intro to Mock Test */}
            {currentStep === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 sm:p-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                  Take a Quick 3-Question Demo Exam
                </h3>
                <p className="text-text-3 text-xs sm:text-sm max-w-md mx-auto mb-8">
                  Experience our premium interactive interface. No signup required to try the demo test!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    Start Free Demo Test <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-border rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Skip & Log In / Sign Up
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Active Quiz */}
            {currentStep === 1 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 sm:p-10"
              >
                {/* Progress bar */}
                <div className="flex justify-between items-center mb-6 text-[10px] font-mono text-text-3">
                  <span>SAMPLE TEST: QUESTION {qIndex + 1} OF {SAMPLE_QUESTIONS.length}</span>
                  <span>{Math.round(((qIndex + 1) / SAMPLE_QUESTIONS.length) * 100)}% COMPLETE</span>
                </div>
                <div className="w-full h-1.5 bg-border/40 rounded-full mb-8 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((qIndex + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <h4 className="text-base sm:text-lg font-bold text-white mb-6 leading-snug">
                  {activeQuestion.q}
                </h4>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {activeQuestion.options.map((opt, idx) => {
                    let btnStyle = "bg-white/5 border-border hover:bg-white/10 hover:border-text-3"
                    let badge = null

                    if (selectedOpt === idx) {
                      btnStyle = "bg-primary/10 border-primary text-primary"
                    }

                    if (isAnswered) {
                      if (idx === activeQuestion.ans) {
                        btnStyle = "bg-success/15 border-success text-success"
                        badge = <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />
                      } else if (selectedOpt === idx) {
                        btnStyle = "bg-danger/15 border-danger/40 text-danger"
                        badge = <XCircle className="w-5 h-5 shrink-0 text-danger" />
                      } else {
                        btnStyle = "bg-white/2 opacity-40 border-border/40 cursor-default"
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all duration-200 flex items-center justify-between gap-4 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {badge}
                      </button>
                    )
                  })}
                </div>

                {/* Action panel & Explanation */}
                <div className="mt-8 pt-6 border-t border-border/60">
                  <AnimatePresence mode="wait">
                    {!isAnswered ? (
                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedOpt === null}
                          className="px-6 py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:hover:translate-y-0 text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-md hover:-translate-y-0.5"
                        >
                          Check Answer
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col gap-5"
                      >
                        <div className="p-4 bg-white/5 rounded-2xl border border-border/40 text-sm leading-relaxed">
                          <p className="text-xs font-mono text-text-3 mb-1 uppercase tracking-widest">EXPLANATION</p>
                          <p className="text-text-2">{activeQuestion.exp}</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleNextQuestion}
                            className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-md flex items-center gap-2 hover:-translate-y-0.5"
                          >
                            {qIndex === SAMPLE_QUESTIONS.length - 1 ? 'Finish & See Results' : 'Next Question'}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Step 2: Final Results & CTA */}
            {currentStep === 2 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 sm:p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-2">
                  Demo Score: {score} / {SAMPLE_QUESTIONS.length}
                </h3>
                <p className="text-text-3 text-xs sm:text-sm max-w-md mx-auto mb-8">
                  {score === SAMPLE_QUESTIONS.length 
                    ? "Perfect! You've got great instincts. Unlock the full question database to complete your training."
                    : "Not bad! Practice makes perfect. Review all rules and questions in the full app to secure a 100% pass mark."}
                </p>

                <div className="p-6 bg-white/5 border border-border/40 rounded-3xl mb-8 text-left">
                  <h5 className="font-bold text-white mb-4 text-xs font-mono uppercase tracking-widest">Unlock Premium Features Free:</h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-text-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>300+ Complete RTO Questions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>15+ Complete Mock Exams</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>3D Parking & Highway Simulators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Personalized Weakness Analysis</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    Start Full Practice (Login with Google) <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-border rounded-2xl font-bold text-sm transition-all duration-300"
                  >
                    Login / Create Account with Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Grid Features section */}
      <div className="max-w-5xl mx-auto px-4 mt-24">
        <h4 className="text-center text-xs font-mono uppercase tracking-widest text-primary mb-12">FEATURES BUILT FOR SUCCESS</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface/40 border border-border/40 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h5 className="text-base font-bold text-white mb-2">Interactive Syllabus</h5>
            <p className="text-text-3 text-xs leading-relaxed">Step-by-step modular cards detailing clutch control, gear changes, intersection rules, and hazard identification.</p>
          </div>
          <div className="p-6 bg-surface/40 border border-border/40 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h5 className="text-base font-bold text-white mb-2">Official RTO Mock Exam</h5>
            <p className="text-text-3 text-xs leading-relaxed">Timed mock tests mimicking real state RTO criteria. Instantly tracks weak categories for targeted review.</p>
          </div>
          <div className="p-6 bg-surface/40 border border-border/40 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h5 className="text-base font-bold text-white mb-2">3D & HTML Simulations</h5>
            <p className="text-text-3 text-xs leading-relaxed">Interactive parking, rain driving, and blind-spot visualizers designed to build muscle memory and instincts.</p>
          </div>
        </div>
      </div>

      {/* APK Android App Trust Banner & Direct Download Section */}
      <div className="max-w-4xl mx-auto px-4 mt-28">
        <div className="bg-surface/50 border border-border/60 rounded-[32px] p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex-1 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 uppercase tracking-widest rounded-full self-start">
                <Smartphone className="w-3.5 h-3.5" />
                <span>OFFICIAL ANDROID APP</span>
              </div>
              <h4 className="text-2xl font-display font-bold text-white">Practice Offline Anywhere</h4>
              <p className="text-text-3 text-xs sm:text-sm leading-relaxed max-w-xl">
                Get our official Android app for instant offline mock tests and quick revisions. Works directly without an internet connection.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
              <a
                href="/downloads/app-release.apk"
                download
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl text-center font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-4.5 h-4.5" /> Download App APK (7.7 MB)
              </a>
              <span className="text-[10px] text-center font-mono text-text-3">v1.0.0 Stable Build | Signed Release</span>
            </div>
          </div>

          {/* Sideload APK Security Guidance block to prevent virus concerns */}
          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col gap-4">
            <div className="flex gap-3 items-start p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">100% Safe & Ad-Free Certification</h5>
                <p className="text-[11px] text-text-3 leading-relaxed">
                  Our application is certified clean. It requires zero dangerous permissions (no contact reading, no camera access, no location tracking) and is completely free of tracking scripts or third-party ads.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Why does my phone say "Play Protect / Unknown Source Warning"?</h5>
                <p className="text-[11px] text-text-3 leading-relaxed">
                  Because this app is installed directly from our website (sideloaded) rather than the Google Play Store, Android shows a generic caution warning. This is standard security for all developer apps. To install:
                </p>
                <ol className="text-[11px] text-text-3 list-decimal list-inside pl-1 mt-1.5 flex flex-col gap-1 font-medium">
                  <li>Tap the downloaded file to start installation.</li>
                  <li>When the warning popup appears, tap <span className="text-white font-bold">"More details"</span> (or the small arrow).</li>
                  <li>Tap <span className="text-emerald-400 font-bold">"Install anyway"</span> to complete setup securely.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
