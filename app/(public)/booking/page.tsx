"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Check, CheckCircle, ArrowRight, User, Phone, Mail, Clock, ArrowLeft, BookOpen, Award, Zap, Lock, Eye, EyeOff, Info, Sun, Moon, Download } from 'lucide-react'
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
    viewDash: "View Dashboard",
    dailyPolicyTitle: "📅 Daily Recurrence Policy",
    dailyPolicyDesc: "Selecting a slot reserves your daily seat at this exact hour every day for the entire course duration.",
    summaryNote: "Note: Your selection implies daily attendance at this exact hour every single day for the entire program duration.",
    courseTitle: "Driving Course",
    licenseAddon: " + License",
    days: "Days",
    drivingTips: [
      {
        title: "The Parallel Parking Formula",
        desc: "Line up your rear bumper with the adjacent car's bumper, turn your steering wheel fully toward the curb, and reverse at a 45-degree angle until clear."
      },
      {
        title: "The Clutch Friction Zone",
        desc: "When moving from a standstill on a hill, slowly release the clutch until you feel the car vibrate slightly (the friction point) before letting go of the handbrake."
      },
      {
        title: "RTO Track '8' Rule",
        desc: "When driving in an '8' shape track, keep your steering wheel steady under 10 km/h and steer smoothly without using jerky movements."
      },
      {
        title: "Defensive Braking Rule",
        desc: "Always scan 12 seconds ahead on the road. It gives you enough reaction time to brake smoothly without locking the wheels."
      },
      {
        title: "Traffic Sign Priority",
        desc: "Remember: Stop signs demand a complete halt behind the white line, not just a slow rolling check."
      }
    ],
    submitStages: [
      { label: "Establishing secure tunnel", iconKey: "Lock" },
      { label: "Creating student profile", iconKey: "User" },
      { label: "Allocating learning roadmap", iconKey: "BookOpen" },
      { label: "Preparing sandbox environment", iconKey: "Award" },
      { label: "Finalizing booking confirmation", iconKey: "CheckCircle" }
    ]
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
    viewDash: "डैशबोर्ड देखें",
    dailyPolicyTitle: "📅 दैनिक पुनरावृत्ति नीति",
    dailyPolicyDesc: "एक स्लॉट चुनने से पाठ्यक्रम की पूरी अवधि के लिए हर दिन इसी सटीक समय पर आपकी दैनिक सीट सुरक्षित हो जाती है।",
    summaryNote: "नोट: आपके चयन का अर्थ है कि कार्यक्रम की पूरी अवधि के लिए हर दिन इसी सटीक समय पर दैनिक उपस्थिति आवश्यक है।",
    courseTitle: "प्रशिक्षण पाठ्यक्रम",
    licenseAddon: " + लाइसेंस",
    days: "दिन",
    drivingTips: [
      {
        title: "समानांतर पार्किंग फॉर्मूला",
        desc: "अपने पिछले बम्पर को पास की कार के बम्पर के साथ संरेखित करें, स्टीयरिंग को पूरी तरह से घुमाएं और 45-डिग्री कोण पर रिवर्स करें।"
      },
      {
        title: "क्लच घर्षण क्षेत्र",
        desc: "पहाड़ी पर रुकने के बाद चलते समय, क्लच को धीरे-धीरे तब तक छोड़ें जब तक कि आप कार का कंपन (घर्षण बिंदु) महसूस न करें।"
      },
      {
        title: "आरटीओ ट्रैक '8' नियम",
        desc: "एक '8' आकार के ट्रैक में ड्राइविंग करते समय, स्टीयरिंग को 10 किमी/घंटा से नीचे स्थिर रखें और सुचारू रूप से स्टीयर करें।"
      },
      {
        title: "रक्षात्मक ब्रेकिंग नियम",
        desc: "हमेशा सड़क पर 12 सेकंड आगे देखें। यह आपको बिना पहियों को लॉक किए सुचारू रूप से ब्रेक लगाने की अनुमति देता है।"
      },
      {
        title: "यातायात संकेत प्राथमिकता",
        desc: "याद रखें: स्टॉप संकेत सफेद रेखा के पीछे पूरी तरह से रुकने की मांग करते हैं, न कि केवल धीमी गति से रोलिंग की।"
      }
    ],
    submitStages: [
      { label: "सुरक्षित टनल स्थापित किया जा रहा है", iconKey: "Lock" },
      { label: "छात्र प्रोफ़ाइल बनाई जा रही है", iconKey: "User" },
      { label: "लर्निंग रोडमैप आवंटित किया जा रहा है", iconKey: "BookOpen" },
      { label: "सैंडबॉक्स वातावरण तैयार किया जा रहा है", iconKey: "Award" },
      { label: "बुकिंग पुष्टि को अंतिम रूप दिया जा रहा है", iconKey: "CheckCircle" }
    ]
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
    viewDash: "డాష్‌బోర్డ్ చూడండి",
    dailyPolicyTitle: "📅 రోజువారీ పునరావృత విధానం",
    dailyPolicyDesc: "ఒక స్లాట్‌ను ఎంచుకోవడం ద్వారా కోర్సు యొక్క మొత్తం వ్యవధిలో ప్రతిరోజూ ఇదే ఖచ్చితమైన సమయానికి మీ రోజువారీ సీటు రిజర్వ్ చేయబడుతుంది.",
    summaryNote: "గమనిక: మీరు ఎంచుకున్న సమయం అంటే ప్రోగ్రామ్ యొక్క మొత్తం వ్యవధిలో ప్రతిరోజూ ఇదే ఖచ్చితమైన గంటకు రోజువారీ హాజరు కావాలి.",
    courseTitle: "డ్రైవింగ్ కోర్సు",
    licenseAddon: " + లైసెన్స్",
    days: "రోజులు",
    drivingTips: [
      {
        title: "సమాంతర పార్కింగ్ ఫార్ములా",
        desc: "మీ వెనుక బంపర్‌ను ప్రక్కనే ఉన్న కారు బంపర్‌తో సమలేఖనం చేయండి, స్టీరింగ్‌ను పూర్తిగా తిప్పండి మరియు 45-డిగ్రీల కోణంలో రివర్స్ చేయండి."
      },
      {
        title: "క్లచ్ ఘర్షణ జోన్",
        desc: "కొండపై ఆగిపోయిన తర్వాత కదిలేటప్పుడు, హ్యాండ్‌బ్రేక్ వదిలే ముందు కారు కొద్దిగా కంపించడాన్ని మీరు భావించే వరకు క్లచ్‌ను నెమ్మదిగా విడుదల చేయండి."
      },
      {
        title: "RTO ట్రాక్ '8' రూల్",
        desc: "'8' ఆకారపు ట్రాక్‌లో డ్రైవింగ్ చేస్తున్నప్పుడు, మీ స్టీరింగ్ వీల్‌ను 10 కిమీ/గం లోపు స్థిరంగా ఉంచండి మరియు సజావుగా నడపండి."
      },
      {
        title: "డిఫెన్సివ్ బ్రేకింగ్ రూల్",
        desc: "ఎల్లప్పుడూ రహదారిపై 12 సెకన్ల ముందు స్కాన్ చేయండి. చక్రాలు లాక్ అవ్వకుండా సజావుగా బ్రేక్ వేయడానికి ఇది మీకు తగినంత ప్రతిచర్య సమయాన్ని ఇస్తుంది."
      },
      {
        title: "ట్రాఫిక్ సైన్ ప్రాధాన్యత",
        desc: "గుర్తుంచుకోండి: స్టాప్ సంకేతాలు తెల్లటి గీత వెనుక పూర్తిగా ఆగిపోవాలని డిమాండ్ చేస్తాయి, కేవలం నెమ్మదిగా వెళ్లడం కాదు."
      }
    ],
    submitStages: [
      { label: "సురక్షితమైన టన్నెల్‌ను ఏర్పాటు చేస్తోంది", iconKey: "Lock" },
      { label: "విద్యార్థి ప్రొఫైల్‌ను సృష్టిస్తోంది", iconKey: "User" },
      { label: "అభ్యాస రోడ్‌మ్యాప్‌ను కేటాయిస్తోంది", iconKey: "BookOpen" },
      { label: "శాండ్‌బాక్స్ వాతావరణాన్ని సిద్ధం చేస్తోంది", iconKey: "Award" },
      { label: "బుకింగ్ నిర్ధారణను ఖరారు చేస్తోంది", iconKey: "CheckCircle" }
    ]
  }
}


const getStageIcon = (key: string) => {
  switch (key) {
    case 'Lock': return Lock
    case 'User': return User
    case 'BookOpen': return BookOpen
    case 'Award': return Award
    case 'CheckCircle': return CheckCircle
    default: return Info
  }
}

export default function PublicBookingSystem() {
  const [step, setStep] = useState(1)
  const [submitStage, setSubmitStage] = useState(0)
  const [activeTipIndex, setActiveTipIndex] = useState(0)

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
  const [passwordError, setPasswordError] = useState('')

  const { data: session } = useSession()

  // Auto-fill from active Google/OAuth session
  useEffect(() => {
    if (session?.user && !autoFilled) {
      if ((session.user as any).role === 'STUDENT') {
        if (session.user.email) setEmail(session.user.email)
        if (session.user.name) setName(session.user.name)
        setStep1SubPhase('DETAILS')
      }
      setAutoFilled(true)
    }
  }, [session, autoFilled])

  // Step 2: Duration selection + license add-on
  const [selectedType] = useState('course-driving')
  const [selectedDuration, setSelectedDuration] = useState<7 | 10 | 15 | 30>(7)
  const [includeLicense, setIncludeLicense] = useState(false)

  // Step 3: Preferred time slot selection (replacing slots grid)
  const [preferredTime, setPreferredTime] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING')

  // Step 4: Submission Success overlay
  const [bookingResult, setBookingResult] = useState<{ ref: string; msg: string } | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Dynamic Data & Languages
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof BOOKING_DICT
  const t = BOOKING_DICT[activeLang] || BOOKING_DICT.EN
  const DRIVING_TIPS = t.drivingTips || []
  const SUBMIT_STAGES = t.submitStages || []

  const [offers, setOffers] = useState<Offer[]>([])
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<Offer | null>(null)
  const [promoError, setPromoError] = useState('')

  const BASE_DRIVING_PRICE = 3500
  const LICENSE_ADDON_PRICE = 1500
  const courseTitle = `${t.courseTitle || 'Driving Course'} (${selectedDuration} ${t.days || 'Days'})${includeLicense ? (t.licenseAddon || ' + License') : ''}`

  const basePrice = BASE_DRIVING_PRICE + (includeLicense ? LICENSE_ADDON_PRICE : 0)
  const discountPercent = appliedPromo ? appliedPromo.discountPercent : 0
  const discountAmount = basePrice * (discountPercent / 100)
  const grandTotal = basePrice - discountAmount

  // Load offers on mount
  useEffect(() => {

    // Fetch offers
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

    // Parse ?promo= query param
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
    setSubmitting(true)
    
    setSubmitting(true)
    setSubmitStage(0)

    // Setup stages stepping
    const stageInterval = setInterval(() => {
      setSubmitStage(prev => {
        if (prev < 4) return prev + 1
        return prev
      })
    }, 1000)

    // We want a minimum delay of 5000ms for staging animation
    const delayPromise = new Promise(resolve => setTimeout(resolve, 5000))

    try {
      const apiPromise = fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          trainingType: selectedType,
          duration: selectedDuration,
          includeLicense,
          preferredTime,
          password
        })
      })

      // Wait for both the minimum delay AND the API request
      const [res] = await Promise.all([apiPromise, delayPromise])
      clearInterval(stageInterval)
      setSubmitStage(4) // Ensure final stage is marked complete

      if (res.ok) {
        const data = await res.json()
        setBookingResult({
          ref: data.bookingRef,
          msg: data.message
        })
        
        // Auto-login the user in the background so they can go directly to the dashboard
        try {
          await signIn('credentials', {
            redirect: false,
            email,
            password: password || 'sriguru123'
          })
        } catch (authErr) {
          console.error("Background auto-login failed:", authErr)
        }

        // Open WhatsApp to notify admin with booking details
        if (data.whatsappUrl) {
          setWhatsappUrl(data.whatsappUrl)
          window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer')
        }

        setStep(5) // Move to full page success display state
      } else {
        const errData = await res.json().catch(() => ({}))
        const errMsg = errData?.error || "An unexpected error occurred during submission."
        toast.error(errMsg)
      }
    } catch (e) {
      clearInterval(stageInterval)
      console.error(e)
      toast.error("Failed to connect to the server. Please check your internet connection.")
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
          {/* Address & Location Notice */}
          <div className="mt-4 inline-flex flex-col sm:flex-row items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 text-left max-w-lg mx-auto">
            <span className="text-lg shrink-0">📍</span>
            <div>
              <p className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">We Only Have 1 School — Nandyal</p>
              <p className="text-[11px] text-text-2 font-body leading-relaxed mt-0.5">
                Shop No.27282-P2, Near Anu Hospital, Bommalasatram, Kadapa Road, <strong className="text-text-1">Nandyal, Andhra Pradesh</strong>.
                Training is <strong className="text-amber-400">available only in Nandyal</strong> — we do not operate in other cities or states.
              </p>
            </div>
          </div>
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
            {submitting ? (
              <motion.div
                key="submitting-loader"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center text-center py-6 gap-6 max-w-md mx-auto my-auto w-full"
              >
                {/* Loader Animation */}
                <div className="relative w-14 h-14">
                  <span className="absolute inset-0 rounded-full border-4 border-accent/20 animate-pulse"></span>
                  <span className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></span>
                </div>
                
                <div className="flex flex-col gap-1.5 w-full">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold animate-pulse">
                    Processing Sri Guru Ledger
                  </span>
                  <h3 className="text-base font-bold text-text-1 font-display uppercase tracking-tight">
                    Preparing Student Profile
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-void rounded-full h-2 overflow-hidden border border-border/80 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-primary via-accent to-success h-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(submitStage + 1) * 20}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-text-3 uppercase mt-1">
                    <span>Initiated</span>
                    <span>{Math.min((submitStage + 1) * 20, 100)}% Complete</span>
                  </div>
                </div>

                {/* Checklist of Stages */}
                <div className="w-full bg-void/40 border border-border/60 rounded-2xl p-4 flex flex-col gap-3 text-left">
                  {SUBMIT_STAGES.map((s, index) => {
                    const isCompleted = submitStage > index
                    const isActive = submitStage === index
                    const Icon = getStageIcon(s.iconKey)

                    return (
                      <div key={index} className="flex items-center gap-3 transition-opacity duration-300">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-success/20 border-success text-success'
                            : isActive
                              ? 'bg-accent/20 border-accent text-accent animate-pulse'
                              : 'bg-void/40 border-border/60 text-text-3 opacity-50'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Icon className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} />
                          )}
                        </div>
                        <span className={`text-[11px] font-mono uppercase tracking-wider transition-colors duration-300 ${
                          isCompleted
                            ? 'text-success/80 line-through decoration-success/25'
                            : isActive
                              ? 'text-text-1 font-bold'
                              : 'text-text-3 opacity-50'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Interactive Tip Card to Divert Time */}
                <div className="w-full bg-void/50 border border-border/80 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden text-left shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-bold flex items-center gap-1.5">
                      💡 Driving Tip of the Day
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTipIndex(prev => (prev + 1) % DRIVING_TIPS.length)}
                      className="text-[9px] font-mono text-primary hover:text-primary/80 transition-colors uppercase font-bold border border-primary/20 px-2 py-0.5 rounded cursor-pointer select-none"
                    >
                      Next Tip ➔
                    </button>
                  </div>
                  <p className="text-xs font-bold text-text-1 font-display mt-0.5">
                    {DRIVING_TIPS[activeTipIndex].title}
                  </p>
                  <p className="text-[11px] text-text-2 leading-relaxed font-body">
                    {DRIVING_TIPS[activeTipIndex].desc}
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
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

            {/* STEP 2: PLAN SELECTION + DURATION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5 text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-1 uppercase font-display">{t.step2Title}</h3>
                  <p className="text-[10px] text-text-3 mt-1 font-mono uppercase">{t.step2Desc}</p>
                </div>

                {/* ─── PLAN CARDS ─── */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-mono text-text-3 uppercase font-bold tracking-wider">Choose Your Plan</span>

                  {/* Plan 1: Just Driving */}
                  <div
                    onClick={() => setIncludeLicense(false)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                      !includeLicense
                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5'
                        : 'bg-void/40 border-border hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !includeLicense ? 'bg-primary/15 text-primary' : 'bg-void text-text-3 border border-border'
                    }`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-bold text-text-1">Just Driving</span>
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-extrabold border border-accent/20">₹3,500</span>
                      </div>
                      <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                        On-road driving training only — steering control, road confidence, gear handling & RTO track practice.
                      </p>
                    </div>
                    {!includeLicense && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Plan 2: Driving + License */}
                  <div
                    onClick={() => setIncludeLicense(true)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                      includeLicense
                        ? 'bg-accent/5 border-accent shadow-lg shadow-accent/5'
                        : 'bg-void/40 border-border hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      includeLicense ? 'bg-accent/15 text-accent' : 'bg-void text-text-3 border border-border'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-1">Driving + License Process</span>
                          <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[8px] font-extrabold uppercase tracking-wider">POPULAR</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-extrabold border border-accent/20">₹5,000</span>
                      </div>
                      <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                        Everything in Driving + RTO learner license, permanent license application, documentation & exam support.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['LL Application', 'DL Application', 'RTO Docs Help', 'Exam Prep'].map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[8px] font-bold uppercase tracking-wider border border-accent/10">{tag}</span>
                        ))}
                      </div>
                    </div>
                    {includeLicense && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── DURATION PICKER ─── */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-text-2 uppercase tracking-wide">Select Duration</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {([
                      { days: 7,  kmPerDay: 22 },
                      { days: 10, kmPerDay: 15 },
                      { days: 15, kmPerDay: 10 },
                      { days: 30, kmPerDay: 5  }
                    ] as const).map(({ days, kmPerDay }) => {
                      const isActive = selectedDuration === days
                      const totalKm = days * kmPerDay
                      return (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setSelectedDuration(days)}
                          className={`flex flex-col items-center justify-center py-5 px-3 rounded-2xl border cursor-pointer transition-all duration-300 gap-1 ${
                            isActive
                              ? 'bg-primary/10 border-primary shadow-xl shadow-primary/5 scale-[1.03]'
                              : 'bg-void/40 border-border hover:border-primary/50 hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className={`text-3xl font-bold font-display leading-none ${
                            isActive ? 'text-primary' : 'text-text-1'
                          }`}>{days}</span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            isActive ? 'text-primary/90' : 'text-text-3'
                          }`}>Days</span>
                          <div className="w-full border-t border-border/30 my-2" />
                          <span className={`text-sm font-bold font-display ${
                            isActive ? 'text-primary' : 'text-text-2'
                          }`}>{kmPerDay} km</span>
                          <span className={`text-xs font-medium ${
                            isActive ? 'text-primary/80' : 'text-text-3'
                          }`}>per day</span>
                          <span className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-3'
                          }`}>({totalKm} km total)</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Clarifying course duration guidelines */}
                  <div className="mt-4 bg-primary/5 border border-primary/20 p-5 rounded-2xl flex flex-col gap-3 font-sans text-sm text-text-2">
                    <span className="text-sm font-bold text-primary tracking-wide flex items-center gap-1.5">
                      💡 Course Selection Guide
                    </span>
                    <div className="grid grid-cols-1 gap-3 leading-relaxed">
                      <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3 text-left">
                        <span className="font-bold text-text-1 text-sm">7 Days Refresher</span>
                        <span className="text-xs text-text-3 font-sans normal-case">Crash course for people who already know basic driving but need a quick refresher.</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3 text-left">
                        <span className="font-bold text-text-1 text-sm">10 Days Confidence Builder</span>
                        <span className="text-xs text-text-3 font-sans normal-case">Standard practice for semi-confident drivers to gain road confidence.</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3 text-left">
                        <span className="font-bold text-text-1 text-sm">15 Days Complete Beginner (Recommended)</span>
                        <span className="text-xs text-text-3 font-sans normal-case">Beginner's ideal course. Recommended to learn driving from scratch.</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3 text-left">
                        <span className="font-bold text-text-1 text-sm">30 Days Elite Mastery</span>
                        <span className="text-xs text-text-3 font-sans normal-case">Ultimate mastery course covering advanced highway, parking, and night driving.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t.back}
                  </button>
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

            {/* STEP 3: PREFERRED TIME SLOT */}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Morning Option */}
                  <div
                    onClick={() => setPreferredTime('MORNING')}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 ${
                      preferredTime === 'MORNING'
                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5 scale-[1.02]'
                        : 'bg-void/40 border-border hover:bg-white/[0.02] hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      preferredTime === 'MORNING' ? 'bg-primary/15 text-primary' : 'bg-void text-text-3 border border-border'
                    }`}>
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-1 uppercase font-display tracking-tight">Morning Session</span>
                      <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                        6:00 AM - 12:00 PM
                      </p>
                      <p className="text-[10px] text-text-2 font-body mt-2 leading-relaxed italic">
                        Best for cooler weather and starting early.
                      </p>
                    </div>
                    {preferredTime === 'MORNING' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Afternoon Option */}
                  <div
                    onClick={() => setPreferredTime('AFTERNOON')}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 ${
                      preferredTime === 'AFTERNOON'
                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5 scale-[1.02]'
                        : 'bg-void/40 border-border hover:bg-white/[0.02] hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      preferredTime === 'AFTERNOON' ? 'bg-primary/15 text-primary' : 'bg-void text-text-3 border border-border'
                    }`}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-1 uppercase font-display tracking-tight">Afternoon Session</span>
                      <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                        12:00 PM - 4:00 PM
                      </p>
                      <p className="text-[10px] text-text-2 font-body mt-2 leading-relaxed italic">
                        Ideal for flexible mid-day schedules.
                      </p>
                    </div>
                    {preferredTime === 'AFTERNOON' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Evening Option */}
                  <div
                    onClick={() => setPreferredTime('EVENING')}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 ${
                      preferredTime === 'EVENING'
                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5 scale-[1.02]'
                        : 'bg-void/40 border-border hover:bg-white/[0.02] hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      preferredTime === 'EVENING' ? 'bg-primary/15 text-primary' : 'bg-void text-text-3 border border-border'
                    }`}>
                      <Moon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-1 uppercase font-display tracking-tight">Evening Session</span>
                      <p className="text-[10px] text-text-3 font-mono mt-1 leading-relaxed">
                        4:00 PM - 7:00 PM
                      </p>
                      <p className="text-[10px] text-text-2 font-body mt-2 leading-relaxed italic">
                        Best for working professionals & students.
                      </p>
                    </div>
                    {preferredTime === 'EVENING' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between border-t border-border mt-8 pt-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t.back}
                    </button>
                  </div>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
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
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-bold text-text-1 uppercase font-mono">PREFERRED TIME SLOT:</span>{' '}
                      <span className="text-text-1 uppercase font-bold">{preferredTime} SESSION</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-text-3 font-mono leading-relaxed bg-void/50 border border-border/40 p-3.5 rounded-xl">
                    ⚠️ Note: Our instructors will coordinate with you to assign the exact timing within your preferred window.
                  </div>

                  {/* Receipt breakdown ledger */}
                  <div className="border-t border-border/45 pt-4 flex flex-col gap-2.5 font-mono text-xs">
                    <span className="text-[9px] text-text-3 uppercase tracking-wider block font-bold mb-1">
                      {t.receiptLedger}
                    </span>
                    <div className="flex justify-between items-center text-text-2">
                      <span className="uppercase text-[10px]">Driving Course ({selectedDuration} Days)</span>
                      <span className="font-bold text-text-1">₹3,500</span>
                    </div>
                    {includeLicense && (
                      <div className="flex justify-between items-center text-text-2">
                        <span className="uppercase text-[10px]">License Process Add-on</span>
                        <span className="font-bold text-text-1">+₹1,500</span>
                      </div>
                    )}
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
                className="flex flex-col items-center justify-center text-center py-8 gap-6 max-w-lg mx-auto"
              >
                <div className="w-[84px] h-[84px] rounded-full bg-success/15 border-2 border-success/40 flex items-center justify-center text-success animate-bounce">
                  <CheckCircle className="w-12 h-12 text-success" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">{t.slotAcquired}</span>
                  <h2 className="text-2xl font-extrabold text-text-1 font-display tracking-tight mt-2 uppercase">
                    Booking Confirmed!
                  </h2>
                  <p className="text-xs text-text-2 leading-relaxed mt-2 font-body px-4">
                    Your details are recorded. To continue learning, practicing RTO exams, or tracking your schedule, please use our dedicated student portal or download our Android app.
                  </p>
                </div>

                {whatsappUrl && (
                  <button
                    onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    💬 Send Confirmation via WhatsApp
                  </button>
                )}

                <div className="w-full bg-void/60 border border-border p-5 rounded-2xl text-left flex flex-col gap-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-text-3 uppercase">{t.refId}</span>
                    <span className="text-accent font-bold uppercase">{bookingResult.ref}</span>
                  </div>
                </div>

                <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
                  <a
                    href="https://srigururto.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-5 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 text-center"
                  >
                    Open Student Web Portal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  
                  <a
                    href="/downloads/sriguru-rto-app.apk"
                    download
                    className="flex-1 px-5 py-3.5 bg-void border border-border text-text-1 hover:border-primary/50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 text-center"
                  >
                    Download Android App (APK)
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}
          </>)}
          </AnimatePresence>

        </div>

      </div>
    </div>
  )
}

