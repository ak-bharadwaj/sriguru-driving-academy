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
  ShieldAlert,
  Flame,
  FileCheck,
  Check,
  ChevronRight
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
  const [answersLog, setAnswersLog] = useState<{ questionIndex: number; selected: number; correct: boolean }[]>([])

  const handleStartQuiz = () => {
    setCurrentStep(1)
    setQIndex(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setScore(0)
    setAnswersLog([])
  }

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return
    setSelectedOpt(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return
    
    const correct = selectedOpt === SAMPLE_QUESTIONS[qIndex].ans
    if (correct) {
      setScore(prev => prev + 1)
    }
    
    setAnswersLog(prev => [...prev, {
      questionIndex: qIndex,
      selected: selectedOpt,
      correct
    }])
    
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

  const handleSocialLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const activeQuestion = SAMPLE_QUESTIONS[qIndex]

  return (
    <div className="min-h-screen bg-void text-text-1 relative overflow-x-hidden font-body pb-20">
      {/* Decorative ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free RTO Learning License Preparation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Pass Your RTO Learning License Test on the <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">First Attempt</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-3 text-base sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Stop memorizing PDFs. Test your instincts with real interactive mock exams, official road signs, and simulator-based practice.
        </motion.p>
      </div>

      {/* Interactive Main Area */}
      <div className="max-w-3xl mx-auto px-4 mt-12 sm:mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
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
                <p className="text-text-3 text-sm sm:text-base max-w-md mx-auto mb-8">
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
                <div className="flex justify-between items-center mb-6 text-xs font-mono text-text-3">
                  <span>SAMPLE TEST: QUESTION {qIndex + 1} OF {SAMPLE_QUESTIONS.length}</span>
                  <span>{Math.round(((qIndex + 1) / SAMPLE_QUESTIONS.length) * 100)}% COMPLETE</span>
                </div>
                <div className="w-full h-1 bg-border/40 rounded-full mb-8 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((qIndex + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <h4 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
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
                <p className="text-text-3 text-sm sm:text-base max-w-md mx-auto mb-8">
                  {score === SAMPLE_QUESTIONS.length 
                    ? "Perfect! You've got great instincts. Unlock the full question database to complete your training."
                    : "Not bad! Practice makes perfect. Review all rules and questions in the full app to secure a 100% pass mark."}
                </p>

                <div className="p-6 bg-white/5 border border-border/40 rounded-3xl mb-8 text-left">
                  <h5 className="font-bold text-white mb-4 text-sm font-mono uppercase tracking-widest">Unlock Premium Features Free:</h5>
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
                    onClick={handleSocialLogin}
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
            <h5 className="text-lg font-bold text-white mb-2">Interactive Syllabus</h5>
            <p className="text-text-3 text-sm leading-relaxed">Step-by-step modular cards detailing clutch control, gear changes, intersection rules, and hazard identification.</p>
          </div>
          <div className="p-6 bg-surface/40 border border-border/40 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h5 className="text-lg font-bold text-white mb-2">Official RTO Mock Exam</h5>
            <p className="text-text-3 text-sm leading-relaxed">Timed mock tests mimicking real state RTO criteria. Instantly tracks weak categories for targeted review.</p>
          </div>
          <div className="p-6 bg-surface/40 border border-border/40 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h5 className="text-lg font-bold text-white mb-2">3D & HTML Simulations</h5>
            <p className="text-text-3 text-sm leading-relaxed">Interactive parking, rain driving, and blind-spot visualizers designed to build muscle memory and instincts.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
