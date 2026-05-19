"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Phone, 
  Mail, 
  Check, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  HelpCircle,
  BookOpen,
  Award,
  Zap
} from 'lucide-react'

// Define training options
const TRAINING_OPTIONS = [
  {
    id: 'Beginner',
    name: 'Beginner Course',
    duration: '21 Days LMV',
    description: 'Complete basic to advanced manual shifting, parallel aligning, and safety mockups.',
    icon: BookOpen
  },
  {
    id: 'Advanced',
    name: 'Advanced Refresh',
    duration: '14 Days LMV',
    description: 'Precision highway maneuvers, high speed defensive braking, and extreme clutch friction controls.',
    icon: Award
  },
  {
    id: 'RTO Fast Track',
    name: 'RTO Rapid Prep',
    duration: '7 Days Bootcamp',
    description: 'Mock signs examination center drills and high-precision parking track trials.',
    icon: Zap
  }
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']

interface SlotItem {
  id: string
  dayOfWeek: string
  time: string
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string
}

export default function PublicBookingSystem() {
  const [step, setStep] = useState(1)

  // Step 1: Personal details
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  
  // Real-time inline validations
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' })

  // Step 2: Training Option selection
  const [selectedType, setSelectedType] = useState('Beginner')

  // Step 3: Slots grid selection
  const [slots, setSlots] = useState<SlotItem[]>([])
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Step 4: Submission Success overlay
  const [bookingResult, setBookingResult] = useState<{ ref: string; msg: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch slots matching selected training program
  useEffect(() => {
    if (step === 3) {
      setLoadingSlots(true)
      fetch(`/api/public/slots?type=${selectedType}`)
        .then(res => res.json())
        .then(data => {
          setSlots(data)
          setLoadingSlots(false)
        })
        .catch(e => {
          console.error(e)
          setLoadingSlots(false)
        })
    }
  }, [step, selectedType])

  // Inline Validators (Triggered on keystroke)
  const validateField = (field: 'name' | 'phone' | 'email', value: string) => {
    let err = ''
    if (field === 'name') {
      if (!value.trim()) err = 'Name is mandatory'
      else if (value.length < 3) err = 'Name must be at least 3 letters'
    } else if (field === 'phone') {
      const indianPhoneRegex = /^[6-9]\d{9}$/
      if (!value) err = 'Phone number is mandatory'
      else if (!indianPhoneRegex.test(value)) err = 'Phone must be a valid 10-digit Indian number (starts with 6-9)'
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) err = 'Email is mandatory'
      else if (!emailRegex.test(value)) err = 'Enter a valid email address'
    }
    setErrors(prev => ({ ...prev, [field]: err }))
    return err === ''
  }

  const handleNextStep1 = () => {
    const isNameValid = validateField('name', name)
    const isPhoneValid = validateField('phone', phone)
    const isEmailValid = validateField('email', email)

    if (isNameValid && isPhoneValid && isEmailValid && !errors.name && !errors.phone && !errors.email) {
      setStep(2)
    }
  }

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return
    
    setSubmitting(true)
    try {
      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          trainingType: selectedType,
          slotId: selectedSlot.id
        })
      })

      if (res.ok) {
        const data = await res.json()
        setBookingResult({
          ref: data.bookingRef,
          msg: data.message
        })
        setStep(5) // Move to full page success display state
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body py-24 px-6 relative flex flex-col items-center">
      
      {/* Background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Roster Container */}
      <div className="max-w-4xl w-full flex flex-col gap-8 relative z-10">
        
        {/* Title branding header */}
        <header className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">SRI GURU RESERVATION DESK</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1 uppercase">
            Schedule Trial Session
          </h1>
          <p className="text-xs text-text-2 mt-1.5 max-w-sm mx-auto">
            Review calendar hours, lock coaching specialties, and kickstart advanced license drills.
          </p>
        </header>

        {/* ----------------------------------------------------
            4-DOTS PROGRESS INDICATOR (No progress bar)
            ---------------------------------------------------- */}
        {step < 5 && (
          <div className="flex items-center justify-center gap-10 py-4 relative max-w-xs mx-auto">
            {/* Connecting background line */}
            <div className="absolute left-0 right-0 h-0.5 bg-border/40 top-1/2 -translate-y-1/2 z-0" />
            
            {[1, 2, 3, 4].map((num) => {
              const isActive = step === num
              const isCompleted = step > num

              return (
                <div key={num} className="relative z-10 flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-success text-white' 
                      : isActive 
                        ? 'bg-accent text-void shadow-lg shadow-accent/25 border border-accent animate-pulse' 
                        : 'bg-surface border border-border text-text-3'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : num}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ----------------------------------------------------
            DYNAMIC MULTI-STEP SLIDE DESK
            ---------------------------------------------------- */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-10 shadow-2xl relative min-h-[400px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">Step 1: Cadet Personal Details</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">Provide baseline contact registries</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-text-3 uppercase font-bold">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                      <input
                        type="text"
                        placeholder="Vikram Singh"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          validateField('name', e.target.value)
                        }}
                        className="w-full bg-void/60 border border-border focus:border-primary pl-10 pr-4 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 transition-all duration-200 outline-none"
                      />
                    </div>
                    {errors.name && <span className="text-[9px] text-danger font-mono font-bold mt-1">{errors.name}</span>}
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-text-3 uppercase font-bold">Indian Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          validateField('phone', e.target.value)
                        }}
                        className="w-full bg-void/60 border border-border focus:border-primary pl-10 pr-4 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 transition-all duration-200 outline-none"
                      />
                    </div>
                    {errors.phone && <span className="text-[9px] text-danger font-mono font-bold mt-1">{errors.phone}</span>}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[9px] font-mono text-text-3 uppercase font-bold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                      <input
                        type="email"
                        placeholder="vikram@outlook.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          validateField('email', e.target.value)
                        }}
                        className="w-full bg-void/60 border border-border focus:border-primary pl-10 pr-4 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 transition-all duration-200 outline-none"
                      />
                    </div>
                    {errors.email && <span className="text-[9px] text-danger font-mono font-bold mt-1">{errors.email}</span>}
                  </div>

                </div>

                <div className="flex justify-end border-t border-border mt-8 pt-5">
                  <button
                    onClick={handleNextStep1}
                    className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-200"
                  >
                    Select Program
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TRAINING TYPE (Large Tap Targets) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">Step 2: Coaching Curriculum Option</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">Select a specific training category</p>
                </div>

                <div className="flex flex-col gap-4">
                  {TRAINING_OPTIONS.map((opt) => {
                    const isSelected = selectedType === opt.id
                    const Icon = opt.icon

                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedType(opt.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 ${
                          isSelected 
                            ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' 
                            : 'bg-void/40 border-border hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary/15 text-primary' : 'bg-void text-text-3 border border-border'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-text-1">{opt.name}</span>
                            <span className="text-[10px] text-text-3 mt-0.5 font-mono">{opt.duration} · {opt.description}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
                  >
                    Select Trial Slot
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SLOT SELECTION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">Step 3: Schedule Calendar Grid</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">Click an active slot below (Amber highlight = Selected)</p>
                </div>

                {loadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Clock className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-[9px] font-mono text-text-3">FETCHING ACTIVE ACADEMY HOURS...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-border rounded-2xl bg-void/30 p-4 scrollbar-none">
                    <div className="min-w-[640px] grid grid-cols-[100px_repeat(7,1fr)] gap-2.5">
                      
                      {/* Top Day Headers */}
                      <div className="h-8 flex items-center justify-center text-[10px] font-mono text-text-3 uppercase font-bold">TIME</div>
                      {DAYS.map(day => (
                        <div key={day} className="h-8 flex items-center justify-center text-[9px] font-mono text-text-2 uppercase font-bold border-b border-border/40">
                          {day.substring(0, 3)}
                        </div>
                      ))}

                      {/* Hour rows */}
                      {HOURS.map(hour => {
                        return (
                          <React.Fragment key={hour}>
                            {/* Time column */}
                            <div className="h-10 flex items-center justify-center text-[9px] font-mono font-bold bg-white/[0.02] border border-border/60 rounded-lg text-text-3">
                              {hour}
                            </div>
                            
                            {/* Day slot buttons */}
                            {DAYS.map(day => {
                              const matchingSlot = slots.find(s => s.dayOfWeek === day && s.time === hour)
                              const isSelected = selectedSlot?.id === matchingSlot?.id
                              const isFull = matchingSlot?.status === 'FULL'
                              const isClosed = matchingSlot?.status === 'CLOSED' || matchingSlot?.status === 'DRAFT'
                              
                              let buttonStyle = 'bg-surface border-border hover:border-primary text-text-2'
                              let cursorStyle = 'cursor-pointer'
                              let clickHandler = () => {
                                if (matchingSlot) setSelectedSlot(matchingSlot)
                              }

                              if (isSelected) {
                                buttonStyle = 'bg-accent border-accent text-void font-bold shadow-lg shadow-accent/15'
                              } else if (isFull) {
                                buttonStyle = 'bg-void/40 border-border/40 text-text-3 opacity-40'
                                cursorStyle = 'cursor-not-allowed'
                                clickHandler = () => {}
                              } else if (isClosed || !matchingSlot) {
                                buttonStyle = 'bg-void/10 border-border/10 text-text-3 opacity-20'
                                cursorStyle = 'cursor-not-allowed'
                                clickHandler = () => {}
                              }

                              return (
                                <div
                                  key={day}
                                  onClick={clickHandler}
                                  className={`h-10 border rounded-lg text-[9px] font-mono flex items-center justify-center transition-all duration-200 select-none ${buttonStyle} ${cursorStyle}`}
                                >
                                  {isFull ? 'FULL' : isSelected ? 'SELECTED' : 'ACTIVE'}
                                </div>
                              )
                            })}
                          </React.Fragment>
                        )
                      })}

                    </div>
                  </div>
                )}

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (selectedSlot) setStep(4)
                    }}
                    disabled={!selectedSlot}
                    className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-40"
                  >
                    Validate Summary
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CONFIRM SUMMARY */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">Step 4: Booking Summary Review</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">Confirm your training specifications</p>
                </div>

                <div className="bg-void/50 border border-border p-6 rounded-2xl flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    
                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase">FULL NAME</span>
                      <span className="text-text-1 font-bold">{name}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase">PHONE REGISTER</span>
                      <span className="text-text-1 font-bold">{phone}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase">EMAIL ADRESS</span>
                      <span className="text-text-1 font-bold">{email}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase">TRAINING MODULE</span>
                      <span className="text-accent font-bold uppercase">{selectedType}</span>
                    </div>

                  </div>

                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 p-3.5 rounded-xl mt-2 text-xs leading-relaxed text-text-2">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-bold text-text-1 uppercase font-mono">SELECTED SLOT:</span>{' '}
                      {selectedSlot?.dayOfWeek} at {selectedSlot?.time} (Max Capacity {selectedSlot?.maxCapacity})
                    </div>
                  </div>

                  <div className="bg-void/40 border border-border p-3.5 rounded-xl text-center text-text-3 text-[10px] font-mono leading-relaxed mt-2 uppercase">
                    🔒 Our counseling desk will contact you to confirm your scheduled slot.
                  </div>
                </div>

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={submitting}
                    className="px-8 py-3 bg-accent hover:bg-accent/90 text-void font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-accent/10 flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-40"
                  >
                    {submitting ? 'Confirming...' : 'Submit Booking'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: FULL-PAGE SUCCESS DISPLAY STATE */}
            {step === 5 && bookingResult && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8 gap-6 max-w-md mx-auto"
              >
                <div className="w-[84px] h-[84px] rounded-full bg-success/15 border-2 border-success/40 flex items-center justify-center text-success animate-bounce">
                  <CheckCircle className="w-12 h-12 text-success" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">SLOT REGISTRATION ACQUIRED</span>
                  <h2 className="text-2xl font-extrabold text-text-1 font-display tracking-tight mt-2 uppercase">
                    Booking Confirmed!
                  </h2>
                  <p className="text-xs text-text-2 leading-relaxed mt-2 font-body px-4">
                    Your trial slot registration has been verified by the Sri Guru dashboard.
                  </p>
                </div>

                <div className="w-full bg-void/60 border border-border p-5 rounded-2xl text-left flex flex-col gap-3 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="text-text-3 uppercase">REFERENCE ID:</span>
                    <span className="text-accent font-bold uppercase">{bookingResult.ref}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-3 uppercase">RESOLUTION:</span>
                    <span className="text-text-1 font-bold">CALL WITHIN 24 HOURS</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-200 mt-4"
                >
                  Enter Cadet Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </div>
  )
}
