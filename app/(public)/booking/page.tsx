"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Check, CheckCircle, ArrowRight, User, Phone, Mail, Clock, ArrowLeft, BookOpen, Award, Zap, Lock, Eye, EyeOff } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/languageStore'
import { Course, Offer } from '@/lib/data/academyStore'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']

const formatFriendlyDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

interface SlotItem {
  id: string
  dayOfWeek: string
  time: string
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string
}

const BOOKING_DICT = {
  EN: {
    scheduleTrial: "Schedule Trial Session",
    reviewCal: "Review calendar hours, lock coaching specialties, and kickstart advanced license drills.",
    step1Title: "Step 1: Student Personal Details",
    step1Desc: "Provide baseline contact registries",
    fullName: "Full Name",
    indianContact: "Indian Contact Number",
    emailAddr: "Email Address",
    selectProgram: "Select Program",
    step2Title: "Step 2: Coaching Curriculum Option",
    step2Desc: "Select a specific training category",
    loadingProg: "LOADING PROGRAMS...",
    back: "Back",
    skipCreate: "Skip & Create Account",
    selectSlot: "Select Trial Slot",
    step3Title: "Step 3: Schedule Calendar Grid",
    step3Desc: "Click an active slot below (Amber highlight = Selected)",
    fetching: "FETCHING ACTIVE ACADEMY HOURS...",
    full: "FULL",
    selected: "SELECTED",
    unavailable: "UNAVAILABLE",
    active: "ACTIVE",
    skipSlot: "Skip Slot Selection",
    validateSum: "Validate Summary",
    step4Title: "Step 4: Booking Summary Review",
    step4Desc: "Confirm your training specifications",
    yourName: "YOUR NAME",
    phoneReg: "PHONE REGISTER",
    emailReg: "EMAIL REGISTER",
    trainingMod: "TRAINING MODULE",
    scheduledSlot: "SCHEDULED SLOT:",
    maxCap: "Max Capacity",
    receiptLedger: "🧾 Tuition Receipt Ledger",
    baseFee: "Base tuition fee",
    promoDed: "Promo deduction",
    totalDue: "Total tuition due",
    secureProcess: "🔒 Registration securely processed via Sri Guru Driving School.",
    promoDesk: "Promo Voucher Desk",
    deductionApp: "Deduction Applied",
    enterPromo: "ENTER PROMO CODE",
    apply: "Apply",
    remove: "Remove",
    availVouchers: "Available Vouchers:",
    submitBooking: "Submit Booking",
    confirming: "Confirming...",
    slotAcquired: "SLOT REGISTRATION ACQUIRED",
    bookingConf: "Booking Confirmed!",
    trialVerified: "Your trial slot registration has been verified by the Sri Guru dashboard.",
    refId: "REFERENCE ID:",
    viewDash: "View Dashboard"
  },
  HI: {
    scheduleTrial: "ट्रायल सत्र अनुसूची करें",
    reviewCal: "कैलेंडर घंटे की समीक्षा करें, कोचिंग विशिष्टताओं को लॉक करें, और उन्नत लाइसेंस अभ्यास शुरू करें।",
    step1Title: "चरण 1: छात्र व्यक्तिगत विवरण",
    step1Desc: "बेसलाइन संपर्क रजिस्ट्रियां प्रदान करें",
    fullName: "पूरा नाम",
    indianContact: "भारतीय संपर्क नंबर",
    emailAddr: "ईमेल पता",
    selectProgram: "कार्यक्रम चुनें",
    step2Title: "चरण 2: कोचिंग पाठ्यक्रम विकल्प",
    step2Desc: "एक विशिष्ट प्रशिक्षण श्रेणी चुनें",
    loadingProg: "प्रोग्राम लोड हो रहे हैं...",
    back: "पीछे",
    skipCreate: "छोड़ें और खाता बनाएं",
    selectSlot: "ट्रायल स्लॉट चुनें",
    step3Title: "चरण 3: अनुसूची कैलेंडर ग्रिड",
    step3Desc: "नीचे एक सक्रिय स्लॉट पर क्लिक करें (एम्बर हाइलाइट = चयनित)",
    fetching: "सक्रिय अकादमी घंटे प्राप्त कर रहा है...",
    full: "पूर्ण",
    selected: "चयनित",
    unavailable: "अनुपलब्ध",
    active: "सक्रिय",
    skipSlot: "स्लॉट चयन छोड़ें",
    validateSum: "सारांश मान्य करें",
    step4Title: "चरण 4: बुकिंग सारांश समीक्षा",
    step4Desc: "अपने प्रशिक्षण विनिर्देशों की पुष्टि करें",
    yourName: "आपका नाम",
    phoneReg: "फ़ोन रजिस्टर",
    emailReg: "ईमेल रजिस्टर",
    trainingMod: "प्रशिक्षण मॉड्यूल",
    scheduledSlot: "निर्धारित स्लॉट:",
    maxCap: "अधिकतम क्षमता",
    receiptLedger: "🧾 ट्यूशन रसीद बहीखाता",
    baseFee: "बेस ट्यूशन शुल्क",
    promoDed: "प्रोमो कटौती",
    totalDue: "कुल ट्यूशन देय",
    secureProcess: "🔒 श्री गुरु ड्राइविंग अकादमी के माध्यम से पंजीकरण सुरक्षित रूप से संसाधित किया गया।",
    promoDesk: "प्रोमो वाउचर डेस्क",
    deductionApp: "कटौती लागू",
    enterPromo: "प्रोमो कोड दर्ज करें",
    apply: "लागू करें",
    remove: "हटाएं",
    availVouchers: "उपलब्ध वाउचर:",
    submitBooking: "बुकिंग सबमिट करें",
    confirming: "पुष्टि की जा रही है...",
    slotAcquired: "स्लॉट पंजीकरण प्राप्त हुआ",
    bookingConf: "बुकिंग की पुष्टि हो गई!",
    trialVerified: "आपके ट्रायल स्लॉट पंजीकरण को श्री गुरु डैशबोर्ड द्वारा सत्यापित किया गया है।",
    refId: "संदर्भ आईडी:",
    viewDash: "डैशबोर्ड देखें"
  },
  TE: {
    scheduleTrial: "ట్రయల్ సెషన్‌ను షెడ్యూల్ చేయండి",
    reviewCal: "క్యాలెండర్ గంటలను సమీక్షించండి, కోచింగ్ స్పెషాలిటీలను లాక్ చేయండి మరియు అధునాతన లైసెన్స్ డ్రిల్స్‌ను ప్రారంభించండి.",
    step1Title: "దశ 1: విద్యార్థి వ్యక్తిగత వివరాలు",
    step1Desc: "బేస్‌లైన్ పరిచయ రిజిస్ట్రీలను అందించండి",
    fullName: "పూర్తి పేరు",
    indianContact: "భారతీయ సంప్రదింపు సంఖ్య",
    emailAddr: "ఇమెయిల్ చిరునామా",
    selectProgram: "ప్రోగ్రామ్‌ను ఎంచుకోండి",
    step2Title: "దశ 2: కోచింగ్ కరికులం ఎంపిక",
    step2Desc: "నిర్దిష్ట శిక్షణ వర్గాన్ని ఎంచుకోండి",
    loadingProg: "ప్రోగ్రామ్‌లు లోడ్ అవుతున్నాయి...",
    back: "వెనుకకు",
    skipCreate: "వదిలేయండి & ఖాతాను సృష్టించండి",
    selectSlot: "ట్రయల్ స్లాట్‌ను ఎంచుకోండి",
    step3Title: "దశ 3: షెడ్యూల్ క్యాలెండర్ గ్రిడ్",
    step3Desc: "క్రింద యాక్టివ్ స్లాట్‌పై క్లిక్ చేయండి (అంబర్ హైలైట్ = ఎంచుకోబడింది)",
    fetching: "యాక్టివ్ అకాడమీ గంటలను పొందుతోంది...",
    full: "పూర్తి",
    selected: "ఎంచుకోబడింది",
    unavailable: "అందుబాటులో లేదు",
    active: "యాక్టివ్",
    skipSlot: "స్లాట్ ఎంపికను వదిలేయండి",
    validateSum: "సారాంశాన్ని ధృవీకరించండి",
    step4Title: "దశ 4: బుకింగ్ సారాంశం సమీక్ష",
    step4Desc: "మీ శిక్షణ వివరాలను నిర్ధారించండి",
    yourName: "మీ పేరు",
    phoneReg: "ఫోన్ రిజిస్టర్",
    emailReg: "ఇమెయిల్ రిజిస్టర్",
    trainingMod: "శిక్షణ మాడ్యూల్",
    scheduledSlot: "షెడ్యూల్ చేయబడిన స్లాట్:",
    maxCap: "గరిష్ట సామర్థ్యం",
    receiptLedger: "🧾 ట్యూషన్ రసీదు లెడ్జర్",
    baseFee: "బేస్ ట్యూషన్ ఫీజు",
    promoDed: "ప్రోమో తగ్గింపు",
    totalDue: "మొత్తం ట్యూషన్ బకాయి",
    secureProcess: "🔒 రిజిస్ట్రేషన్ శ్రీ గురు డ్రైవింగ్ అకాడమీ ద్వారా సురక్షితంగా ప్రాసెస్ చేయబడింది.",
    promoDesk: "ప్రోమో వోచర్ డెస్క్",
    deductionApp: "తగ్గింపు వర్తించబడింది",
    enterPromo: "ప్రోమో కోడ్ నమోదు చేయండి",
    apply: "వర్తించు",
    remove: "తొలగించు",
    availVouchers: "అందుబాటులో ఉన్న వోచర్లు:",
    submitBooking: "బుకింగ్ సమర్పించండి",
    confirming: "నిర్ధారిస్తోంది...",
    slotAcquired: "స్లాట్ రిజిస్ట్రేషన్ పొందబడింది",
    bookingConf: "బుకింగ్ నిర్ధారించబడింది!",
    trialVerified: "మీ ట్రయల్ స్లాట్ రిజిస్ట్రేషన్ శ్రీ గురు డాష్‌బోర్డ్ ద్వారా ధృవీకరించబడింది.",
    refId: "రిఫరెన్స్ ID:",
    viewDash: "డాష్‌బోర్డ్ చూడండి"
  }
}

export default function PublicBookingSystem() {
  const [step, setStep] = useState(1)

  // Step 1: Personal details
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [step1SubPhase, setStep1SubPhase] = useState<'EMAIL' | 'DETAILS'>('EMAIL')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  
  // Real-time inline validations
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' })

  const { data: session } = useSession()

  // Auto-fill from active Google/OAuth session
  useEffect(() => {
    if (session?.user && !autoFilled) {
      if (session.user.email) setEmail(session.user.email)
      if (session.user.name) setName(session.user.name)
      setStep1SubPhase('DETAILS')
      setAutoFilled(true)
    }
  }, [session, autoFilled])

  // Step 2: Training Option selection
  const [selectedType, setSelectedType] = useState('course-beginner')

  // Step 3: Slots grid selection
  const [slots, setSlots] = useState<SlotItem[]>([])
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null)
  const [activeDay, setActiveDay] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Step 4: Submission Success overlay
  const [bookingResult, setBookingResult] = useState<{ ref: string; msg: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Dynamic Data & Languages
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof BOOKING_DICT
  const t = BOOKING_DICT[activeLang] || BOOKING_DICT.EN

  const [courses, setCourses] = useState<Course[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<Offer | null>(null)
  const [promoError, setPromoError] = useState('')

  const selectedCourse = courses.find(c => c.id === selectedType)
  const courseTitle = selectedCourse 
    ? (selectedCourse.title[activeLang] || selectedCourse.title['EN'] || selectedType) 
    : selectedType

  const basePrice = selectedCourse ? selectedCourse.price : 0
  const discountPercent = appliedPromo ? appliedPromo.discountPercent : 0
  const discountAmount = basePrice * (discountPercent / 100)
  const grandTotal = basePrice - discountAmount

  // Load courses & offers on mount
  useEffect(() => {
    // 1. Fetch courses
    fetch('/api/public/courses')
      .then(res => res.json())
      .then(data => {
        const defaults: Course[] = [
          { id: 'course-beginner', category: 'BEGINNER', title: { EN: 'The Foundation', HI: 'बुनियाद', TE: 'పునాది' }, tag: { EN: '21 Days LMV', HI: '21 दिन', TE: '21 రోజులు' }, desc: { EN: 'Complete basic to advanced manual shifting, parallel aligning, and safety mockups.', HI: 'बुनियाद', TE: 'పునాది' }, price: 4999, active: true },
          { id: 'course-advanced', category: 'ADVANCED', title: { EN: 'Advanced Refresh', HI: 'अधुनातन', TE: 'అధునాతన' }, tag: { EN: '14 Days LMV', HI: '14 दिन', TE: '14 రోజులు' }, desc: { EN: 'Precision highway maneuvers, high speed defensive braking, and extreme clutch friction controls.', HI: 'उन्नत', TE: 'అధునాతన' }, price: 6999, active: true },
          { id: 'course-rto', category: 'RTO_FAST_TRACK', title: { EN: 'RTO Rapid Prep', HI: 'RTO', TE: 'RTO' }, tag: { EN: '7 Days Bootcamp', HI: '7 दिन', TE: '7 రోజులు' }, desc: { EN: 'Mock signs examination center drills and high-precision parking track trials.', HI: 'RTO', TE: 'RTO' }, price: 2999, active: true }
        ]
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data)
          
          // Check query param first
          const searchParams = new URLSearchParams(window.location.search)
          const prog = searchParams.get('program')
          if (prog && data.some(d => d.id === prog)) {
            setSelectedType(prog)
          } else {
            setSelectedType(data[0].id)
          }
        } else {
          setCourses(defaults)
          setSelectedType(defaults[0].id)
        }
        setLoadingCourses(false)
      })
      .catch(e => {
        console.error('Failed to fetch courses:', e)
        const defaults: Course[] = [
          { id: 'course-beginner', category: 'BEGINNER', title: { EN: 'The Foundation', HI: 'बुनियाद', TE: 'పునాది' }, tag: { EN: '21 Days LMV', HI: '21 दिन', TE: '21 రోజులు' }, desc: { EN: 'Complete basic to advanced manual shifting, parallel aligning, and safety mockups.', HI: 'बुनियाद', TE: 'పునాది' }, price: 4999, active: true },
          { id: 'course-advanced', category: 'ADVANCED', title: { EN: 'Advanced Refresh', HI: 'अधुनातन', TE: 'అధునాతన' }, tag: { EN: '14 Days LMV', HI: '14 दिन', TE: '14 రోజులు' }, desc: { EN: 'Precision highway maneuvers, high speed defensive braking, and extreme clutch friction controls.', HI: 'उन्नत', TE: 'అధునాతన' }, price: 6999, active: true },
          { id: 'course-rto', category: 'RTO_FAST_TRACK', title: { EN: 'RTO Rapid Prep', HI: 'RTO', TE: 'RTO' }, tag: { EN: '7 Days Bootcamp', HI: '7 दिन', TE: '7 రోజులు' }, desc: { EN: 'Mock signs examination center drills and high-precision parking track trials.', HI: 'RTO', TE: 'RTO' }, price: 2999, active: true }
        ]
        setCourses(defaults)
        setSelectedType(defaults[0].id)
        setLoadingCourses(false)
      })

    // 2. Fetch offers
    fetch('/api/public/offers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOffers(data)
        }
      })
      .catch(e => {
        console.error('Failed to fetch offers:', e)
      })

    // 3. Parse ?promo= query param
    const searchParams = new URLSearchParams(window.location.search)
    const promo = searchParams.get('promo')
    if (promo) {
      setPromoCodeInput(promo.toUpperCase())
    }
  }, [])

  const handleApplyPromo = (code: string) => {
    const searchCode = code.trim().toUpperCase()
    if (!searchCode) {
      setAppliedPromo(null)
      setPromoError('')
      return
    }

    const matched = offers.find(o => o.promoCode.toUpperCase() === searchCode && o.active)
    if (matched) {
      setAppliedPromo(matched)
      setPromoError('')
    } else {
      setAppliedPromo(null)
      setPromoError('Invalid or expired coupon code')
    }
  }

  // Auto-apply promo code once offers are loaded
  useEffect(() => {
    if (offers.length > 0 && promoCodeInput) {
      handleApplyPromo(promoCodeInput)
    }
  }, [offers, promoCodeInput])

  // Fetch slots matching selected training program
  useEffect(() => {
    if (step === 3) {
      setLoadingSlots(true)
      fetch(`/api/public/slots`)
        .then(res => res.json())
        .then(data => {
          const activeOrFull = data.filter((s: SlotItem) => s.status !== 'CLOSED')
          setSlots(activeOrFull)
          if (activeOrFull.length > 0) {
            const dates = Array.from(new Set(activeOrFull.map((s: SlotItem) => s.dayOfWeek))).sort() as string[]
            if (dates.length > 0) {
              setActiveDay(dates[0])
            }
          }
          setLoadingSlots(false)
        })
        .catch(e => {
          console.error(e)
          setLoadingSlots(false)
        })
    }
  }, [step])

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
    
    // Validate password for manual signups
    if (!session?.user && (!password || password.trim().length < 6)) {
      toast.error("Please enter a secure password of at least 6 characters.")
      return
    }
    
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
          slotId: selectedSlot.id,
          password
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
    <div className="min-h-screen bg-void text-text-1 font-body pt-32 pb-24 px-6 relative flex flex-col items-center">
      
      {/* Background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Roster Container */}
      <div className="max-w-4xl w-full flex flex-col gap-8 relative z-10">
        
        {/* Title branding header */}
        <header className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">SRI GURU RESERVATION DESK</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1 uppercase">
            {t.scheduleTrial}
          </h1>
          <p className="text-xs text-text-2 mt-1.5 max-w-sm mx-auto">
            {t.reviewCal}
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
            
            {/* STEP 1: PERSONAL DETAILS (Identity-First Funnel) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 text-left"
              >
                {step1SubPhase === 'EMAIL' ? (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-text-1 uppercase font-display">Let's Get Started</h3>
                      <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">Provide your email or continue with one click via Google SSO</p>
                    </div>

                    <div className="flex flex-col gap-5">
                      {/* Premium Continue with Google Button */}
                      <button
                        type="button"
                        onClick={() => signIn('google')}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-void border border-border hover:border-white/20 rounded-xl font-bold text-xs text-text-1 hover:bg-white/[0.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
                      >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        Continue with Google
                      </button>

                      {/* Premium Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider">or register manually</span>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>

                      {/* Email Address Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-text-3 uppercase font-bold">{t.emailAddr}</label>
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
                        onClick={() => {
                          if (validateField('email', email) && !errors.email) {
                            setStep1SubPhase('DETAILS')
                          }
                        }}
                        className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-200"
                      >
                        Next
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-text-1 uppercase font-display">Roster Contact Details</h3>
                      <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">Provide personal registries to finalize operational mapping</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-text-3 uppercase font-bold">{t.fullName}</label>
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
                        <label className="text-[9px] font-mono text-text-3 uppercase font-bold">{t.indianContact}</label>
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
                    </div>

                    <div className="flex justify-between border-t border-border mt-8 pt-5">
                      <button
                        onClick={() => setStep1SubPhase('EMAIL')}
                        className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {t.back}
                      </button>
                      <button
                        onClick={() => {
                          const isNameValid = validateField('name', name)
                          const isPhoneValid = validateField('phone', phone)
                          if (isNameValid && isPhoneValid && !errors.name && !errors.phone) {
                            setStep(2)
                          }
                        }}
                        className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-200"
                      >
                        {t.selectProgram}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
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
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">{t.step2Title}</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">{t.step2Desc}</p>
                </div>

                <div className="flex flex-col gap-4">
                  {loadingCourses ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Clock className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-[9px] font-mono text-text-3">{t.loadingProg}</span>
                    </div>
                  ) : (
                    courses.map((opt) => {
                      const isSelected = selectedType === opt.id
                      const Icon = opt.category === 'BEGINNER' ? BookOpen : opt.category === 'ADVANCED' ? Award : Zap
                      const displayTitle = opt.title[activeLang] || opt.title['EN'] || ''
                      const displayTag = opt.tag[activeLang] || opt.tag['EN'] || ''
                      const displayDesc = opt.desc[activeLang] || opt.desc['EN'] || ''

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
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-text-1">{displayTitle}</span>
                                <span className="px-2 py-0.5 rounded-full bg-void text-[9px] font-bold text-accent border border-border">₹{opt.price}</span>
                              </div>
                              <span className="text-[10px] text-text-3 mt-0.5 font-mono">{displayTag} · {displayDesc}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t.back}
                    </button>
                    <button
                      onClick={async () => {
                        // Skip the UI flow and instantly log into the mock Student account
                        await signIn('credentials', { 
                          email: 'student@demo.com', 
                          password: 'mock',
                          callbackUrl: '/student/dashboard'
                        })
                      }}
                      className="px-5 py-3 bg-void border border-border text-text-3 hover:text-text-1 font-bold text-xs rounded-xl transition-all duration-200"
                    >
                      {t.skipCreate}
                    </button>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
                  >
                    {t.selectSlot}
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
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">{t.step3Title}</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">{t.step3Desc}</p>
                </div>

                {loadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Clock className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-[9px] font-mono text-text-3">{t.fetching}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Day Tabs (Horizontal Scroll) */}
                    {(() => {
                      const uniqueDates = Array.from(new Set(slots.map(s => s.dayOfWeek))).sort()

                      if (uniqueDates.length === 0) {
                        return (
                          <div className="text-center py-12 bg-void/50 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-text-3 font-bold">No slots active currently</span>
                            <p className="text-xs text-text-2 max-w-xs px-4">There are no operational calendar slots published yet. Please contact Sri Guru Driving School support to schedule sessions.</p>
                          </div>
                        )
                      }

                      const activeSlotsForDay = slots.filter(s => s.dayOfWeek === activeDay)

                      return (
                        <>
                          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-border/50">
                            {uniqueDates.map(dateStr => {
                              const isActive = activeDay === dateStr
                              return (
                                <button
                                  key={dateStr}
                                  onClick={() => setActiveDay(dateStr)}
                                  type="button"
                                  className={`px-4 py-2 rounded-t-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 border-b-2 ${
                                    isActive 
                                      ? 'bg-primary/10 text-primary border-primary' 
                                      : 'text-text-3 border-transparent hover:bg-white/[0.02] hover:text-text-2'
                                  }`}
                                >
                                  {formatFriendlyDate(dateStr)}
                                </button>
                              )
                            })}
                          </div>

                          {/* Time Slots Grid for Active Day */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {activeSlotsForDay.map(matchingSlot => {
                              const isSelected = Boolean(selectedSlot?.id === matchingSlot.id)
                              const isFull = matchingSlot.currentBooked >= matchingSlot.maxCapacity
                              
                              let buttonStyle = 'bg-surface border-border hover:border-primary text-text-2'
                              let cursorStyle = 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
                              let clickHandler = () => setSelectedSlot(matchingSlot)

                              if (isSelected) {
                                buttonStyle = 'bg-accent border-accent text-void font-bold shadow-lg shadow-accent/20'
                                cursorStyle = 'cursor-default'
                              } else if (isFull) {
                                buttonStyle = 'bg-void/40 border-border/40 text-text-3 opacity-40'
                                cursorStyle = 'cursor-not-allowed'
                                clickHandler = () => {}
                              }

                              return (
                                <button
                                  key={matchingSlot.id}
                                  onClick={clickHandler}
                                  type="button"
                                  className={`flex flex-col items-start p-4 border rounded-2xl transition-all duration-300 select-none ${buttonStyle} ${cursorStyle}`}
                                >
                                  <span className="text-sm font-bold font-mono">{matchingSlot.time}</span>
                                  <div className="flex justify-between items-center w-full mt-2 border-t border-border/20 pt-2">
                                    <span className="text-[9px] uppercase tracking-wider opacity-85 font-bold">
                                      {isFull ? t.full : isSelected ? t.selected : t.active}
                                    </span>
                                    <span className="text-[9px] font-mono text-text-3">
                                      {matchingSlot.currentBooked} / {matchingSlot.maxCapacity} Booked
                                    </span>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t.back}
                    </button>
                    <button
                      onClick={async () => {
                        await signIn('credentials', { 
                          email: 'student@demo.com', 
                          password: 'mock',
                          callbackUrl: '/student/dashboard'
                        })
                      }}
                      className="px-5 py-3 bg-void border border-border text-text-3 hover:text-text-1 font-bold text-xs rounded-xl transition-all duration-200"
                    >
                      {t.skipSlot}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedSlot) setStep(4)
                    }}
                    disabled={!selectedSlot}
                    className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-40"
                  >
                    {t.validateSum}
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
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">{t.step4Title}</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">{t.step4Desc}</p>
                </div>

                {/* SUMMARY DETAILS AND RECEIPTS */}
                <div className="bg-void/70 border border-border/80 p-6 rounded-2xl flex flex-col gap-5 shadow-[0_0_20px_rgba(var(--color-primary),0.08)]">
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    
                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase font-semibold">{t.yourName}</span>
                      <span className="text-text-1 font-bold">{name}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase font-semibold">{t.phoneReg}</span>
                      <span className="text-text-1 font-bold">{phone}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase font-semibold">{t.emailReg}</span>
                      <span className="text-text-1 font-bold">{email}</span>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <span className="text-[9px] text-text-3 uppercase font-semibold">{t.trainingMod}</span>
                      <span className="text-accent font-bold uppercase">{courseTitle}</span>
                    </div>

                  </div>

                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 p-3.5 rounded-xl mt-2 text-xs leading-relaxed text-text-2 shadow-[0_0_10px_rgba(var(--color-primary),0.05)]">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-bold text-text-1 uppercase font-mono">{t.scheduledSlot}</span>{' '}
                      <span className="text-text-1">{formatFriendlyDate(selectedSlot?.dayOfWeek || '')}</span> at <span className="text-text-1">{selectedSlot?.time}</span> ({t.maxCap} {selectedSlot?.maxCapacity})
                    </div>
                  </div>

                  {/* Receipt breakdown ledger */}
                  <div className="border-t border-border/45 pt-4 flex flex-col gap-2.5 font-mono text-xs">
                    <span className="text-[9px] text-text-3 uppercase tracking-wider block font-bold mb-1">
                      {t.receiptLedger}
                    </span>
                    <div className="flex justify-between items-center text-text-2">
                      <span className="uppercase text-[10px]">{t.baseFee}</span>
                      <span className="font-bold text-text-1">₹{basePrice}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between items-center text-success font-medium">
                        <span className="uppercase text-[10px]">{t.promoDed} ({appliedPromo.promoCode})</span>
                        <span className="font-bold">-₹{discountAmount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-accent font-bold border-t border-border/40 pt-2.5 text-sm tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <span className="uppercase text-[11px]">{t.totalDue}</span>
                      <span className="text-accent text-base">₹{grandTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="bg-void/40 border border-border/30 p-3 rounded-xl text-center text-text-3 text-[10px] font-mono leading-relaxed uppercase">
                    {t.secureProcess}
                  </div>
                </div>

                {/* Choose Account Password Card (Only for manual registrants) */}
                {!session?.user && (
                  <div className="border border-border/60 bg-void/50 p-5 rounded-2xl flex flex-col gap-3 shadow-[0_0_15px_rgba(var(--color-primary),0.04)]">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-accent animate-pulse" />
                        Choose Account Password
                      </span>
                      <span className="text-[8px] font-mono bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded uppercase font-bold">
                        Required
                      </span>
                    </div>
                    <p className="text-[10px] text-text-3 leading-relaxed">
                      Choose a secure password. You will use this password to immediately log in to your interactive Sri Guru student dashboard after booking submission.
                    </p>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter at least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-void/70 border border-border/60 focus:border-primary pl-4 pr-10 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-2 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* PROMO VOUCHER CONSOLE */}
                <div className="border border-border/60 bg-void/50 p-5 rounded-2xl flex flex-col gap-3.5 shadow-[0_0_15px_rgba(var(--color-primary),0.04)]">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-accent animate-pulse" />
                      {t.promoDesk}
                    </span>
                    {appliedPromo && (
                      <span className="text-[8px] font-mono bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded uppercase font-bold">
                        {t.deductionApp}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.enterPromo}
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value.toUpperCase())
                        setPromoError('')
                      }}
                      className="flex-1 bg-void/70 border border-border/60 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs font-mono text-text-1 placeholder-text-3 uppercase tracking-wider outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromo(promoCodeInput)}
                      className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex-shrink-0"
                    >
                      {t.apply}
                    </button>
                  </div>

                  {promoError && (
                    <span className="text-[10px] text-danger font-mono font-bold">{promoError}</span>
                  )}
                  {appliedPromo && (
                    <div className="flex items-center justify-between bg-success/15 border border-success/30 p-2.5 rounded-xl text-[10px] font-mono text-success">
                      <span className="font-bold uppercase">🎫 CODE: {appliedPromo.promoCode} (-{appliedPromo.discountPercent}%)</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null)
                          setPromoCodeInput('')
                        }}
                        className="text-danger hover:underline font-bold uppercase ml-2 text-[9px]"
                      >
                        {t.remove}
                      </button>
                    </div>
                  )}

                  {/* Available Vouchers Picker */}
                  {offers.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1 border-t border-border/30 pt-3">
                      <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider font-bold">
                        {t.availVouchers}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {offers.map((offer) => {
                          const isApplied = appliedPromo?.id === offer.id
                          return (
                            <button
                              key={offer.id}
                              type="button"
                              onClick={() => {
                                setPromoCodeInput(offer.promoCode)
                                handleApplyPromo(offer.promoCode)
                              }}
                              className={`px-3 py-1.5 rounded-xl border text-[9px] font-mono transition-all duration-200 uppercase tracking-wider font-bold ${
                                isApplied
                                  ? 'bg-success/20 border-success text-success shadow-sm shadow-success/10'
                                  : 'bg-void hover:bg-surface border-border/80 text-text-2 hover:text-text-1'
                              }`}
                            >
                              🎫 {offer.promoCode} (-{offer.discountPercent}%)
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t.back}
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={submitting}
                    className="px-8 py-3 bg-accent hover:bg-accent/90 text-void font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-accent/10 flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-40"
                  >
                    {submitting ? t.confirming : t.submitBooking}
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
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">{t.slotAcquired}</span>
                  <h2 className="text-2xl font-extrabold text-text-1 font-display tracking-tight mt-2 uppercase">
                    {t.bookingConf}
                  </h2>
                  <p className="text-xs text-text-2 leading-relaxed mt-2 font-body px-4">
                    {t.trialVerified}
                  </p>
                </div>

                <div className="w-full bg-void/60 border border-border p-5 rounded-2xl text-left flex flex-col gap-3 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="text-text-3 uppercase">{t.refId}</span>
                    <span className="text-accent font-bold uppercase">{bookingResult.ref}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-3 uppercase">RESOLUTION:</span>
                    <span className="text-text-1 font-bold uppercase">{bookingResult.msg.includes("Account") ? "LOGIN CREDENTIALS SENT TO EMAIL" : "CALL WITHIN 24 HOURS"}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-200 mt-4"
                >
                  Go to Login
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

