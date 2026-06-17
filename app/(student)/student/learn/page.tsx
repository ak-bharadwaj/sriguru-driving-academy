"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  Award as AwardIcon,
  BookOpen,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  HelpCircle,
  Play,
  X,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Check,
  Calendar,
  Clock,
  Flame,
  Download,
  Upload,
  MessageSquare,
  Car,
  Sliders,
  User,
  CheckSquare
} from 'lucide-react'

// Import Zustand stores

import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    acqHub: "Acquisition Hub",
    academyTitle: "Academy Learning Center",
    academyDesc: "Toggle between theory study and active practical driving simulations.",
    studentCadet: "Student Cadet:",
    level: "LEVEL",
    practicalTraining: "Practical Training",
    rtoMaterial: "RTO Material",
    mockExam: "Mock Exam",
    seekingDb: "Seeking database...",
    dbStalled: "Database connection stalled",
    retryConnection: "Retry Connection",
    availableTasks: "Available Tasks:",
    skills: "Skills",
    resetProgress: "Reset Progress",
    mastered: "Mastered",
    xp: "XP",
    phase: "PHASE:",
    beginTraining: "Begin Training",
    searchTheory: "Search theory questions...",
    searchSigns: "Search road signs...",
    theoryQA: "Theory Q&A",
    roadSigns: "Road Signs",
    noQuestions: "No questions match your search.",
    question: "QUESTION",
    of: "OF",
    previous: "Previous",
    next: "Next",
    rtoRationale: "EXPLANATION",
    category: "CATEGORY:",
    selectAnswer: "Select an answer above",
    noSignboards: "No signboards match your search.",
    all: "All",
    signs: "Signs",
    parking: "Parking",
    emergencies: "Emergencies",
    laws: "Laws",
    rtoValidation: "RTO VALIDATION CHALLENGE",
    masterPrefix: 'To master "',
    masterSuffix: '", verify you understand the core regulatory practice:',
    fullyCompleted: "I have fully completed and understand this module.",
    needReview: "I need to review instructions again.",
    excellent: "Excellent!",
    masterySuccess: "Mastery verification successful. Adding +",
    incorrect: "Incorrect.",
    checkMirror: "Check mirror instructions and try again.",
    stepByStep: "Step-by-Step Guide",
    mistakeAlert: "Mistake Alert:",
    safetyWarning: "Safety Warning:",
    backToSteps: "Back to Steps",
    tryAgain: "Try Again",
    verifyAnswer: "Verify Answer",
    closeDetails: "Close Details",
    runSimFirst: "Run Simulation First",
    takeChallenge: "Take Challenge"
  },
  HI: {
    acqHub: "अधिग्रहण केंद्र",
    academyTitle: "अकादमी शिक्षण केंद्र",
    academyDesc: "सिद्धांत अध्ययन और सक्रिय व्यावहारिक ड्राइविंग सिमुलेशन के बीच टॉगल करें।",
    studentCadet: "छात्र कैडेट:",
    level: "स्तर",
    practicalTraining: "व्यावहारिक प्रशिक्षण",
    rtoMaterial: "RTO परीक्षण सामग्री",
    mockExam: "मॉक परीक्षा",
    seekingDb: "डेटाबेस पथ खोज रहे हैं...",
    dbStalled: "डेटाबेस कनेक्शन रुका हुआ है",
    retryConnection: "पुनः प्रयास करें",
    availableTasks: "उपलब्ध कार्य:",
    skills: "कौशल",
    resetProgress: "प्रगति रीसेट करें",
    mastered: "महारत हासिल",
    xp: "XP",
    phase: "चरण:",
    beginTraining: "प्रशिक्षण शुरू करें",
    searchTheory: "सिद्धांत प्रश्न खोजें...",
    searchSigns: "सड़क संकेत खोजें...",
    theoryQA: "सिद्धांत प्रश्नोत्तर",
    roadSigns: "सड़क के संकेत",
    noQuestions: "आपकी खोज से कोई प्रश्न मेल नहीं खाता।",
    question: "प्रश्न",
    of: "का",
    previous: "पिछला",
    next: "अगला",
    rtoRationale: "स्पष्टीकरण:",
    category: "श्रेणी:",
    selectAnswer: "एक उत्तर चुनें",
    noSignboards: "आपके चयनित फ़िल्टर से कोई भी साइनबोर्ड मेल উভয় मेल नहीं खाता।",
    all: "सभी",
    signs: "संकेत",
    parking: "पार्किंग",
    emergencies: "आपात स्थिति",
    laws: "कानून",
    rtoValidation: "RTO सत्यापन चुनौती",
    masterPrefix: '"',
    masterSuffix: '" में महारत हासिल करने के लिए, सत्यापित करें कि आप मूल नियामक अभ्यास को समझते हैं:',
    fullyCompleted: "मैंने इस मॉड्यूल को पूरी तरह से पूरा कर लिया है और समझ लिया है।",
    needReview: "मुझे निर्देशों की फिर से समीक्षा करने की आवश्यकता है।",
    excellent: "उत्कृष्ट!",
    masterySuccess: "महारत सत्यापन सफल हुआ। जोड़ा जा रहा है +",
    incorrect: "ग़लत।",
    checkMirror: "दर्पण निर्देशों की जाँच करें और पुनः प्रयास करें।",
    stepByStep: "चरण-दर-चरण निर्देश",
    mistakeAlert: "गलती चेतावनी:",
    safetyWarning: "सुरक्षा चेतावनी:",
    backToSteps: "चरणों पर वापस",
    tryAgain: "पुनः प्रयास करें",
    verifyAnswer: "उत्तर सत्यापित करें",
    closeDetails: "विवरण बंद करें",
    runSimFirst: "पहले सिम चलाएं",
    takeChallenge: "चुनौती लें"
  },
  TE: {
    acqHub: "అక్విజిషన్ హబ్",
    academyTitle: "అకాడమీ లెర్నింగ్ సెంటర్",
    academyDesc: "థియరీ అధ్యయనాలు మరియు యాక్టివ్ ప్రాక్టికల్ డ్రైవింగ్ సిమ్యులేషన్స్ మధ్య టోగుల్ చేయండి.",
    studentCadet: "విద్యార్థి క్యాడెట్:",
    level: "స్థాయి",
    practicalTraining: "ప్రాక్టికల్ శిక్షణ",
    rtoMaterial: "RTO పరీక్ష మెటీరియల్",
    mockExam: "మాక్ పరీక్ష",
    seekingDb: "డేటాబేస్ మార్గాలను వెతుకుతోంది...",
    dbStalled: "డేటాబేస్ కనెక్షన్ నిలిచిపోయింది",
    retryConnection: "మళ్లీ ప్రయత్నించండి",
    availableTasks: "అందుబాటులో ఉన్న పనులు:",
    skills: "నైపుణ్యాలు",
    resetProgress: "పురోగతిని రీసెట్ చేయండి",
    mastered: "ప్రావీణ్యం పొందారు",
    xp: "XP",
    phase: "దశ:",
    beginTraining: "శిక్షణ ప్రారంభించండి",
    searchTheory: "సిద్ధాంత ప్రశ్నలను శోధించండి...",
    searchSigns: "రహదారి సంకేతాలను శోధించండి...",
    theoryQA: "సిద్ధాంతం Q&A",
    roadSigns: "రహదారి సంకేతాలు",
    noQuestions: "మీ శోధనకు ఏ ప్రశ్నలు సరిపోలలేదు.",
    question: "ప్రశ్న",
    of: "యొక్క",
    previous: "మునుపటి",
    next: "తర్వాత",
    rtoRationale: "వివరణ:",
    category: "వర్గం:",
    selectAnswer: "సమాధానాన్ని ఎంచుకోండి",
    noSignboards: "మీరు ఎంచుకున్న ఫిల్టర్‌లకు ఏ సైన్‌బోర్డ్‌లు సరిపోలలేదు.",
    all: "అన్నీ",
    signs: "సంకేతాలు",
    parking: "పార్కింగ్",
    emergencies: "అత్యవసరాలు",
    laws: "చట్టాలు",
    rtoValidation: "RTO ధ్రువీకరణ సవాలు",
    masterPrefix: '"',
    masterSuffix: '" లో ప్రావీణ్యం పొందడానికి, మీరు ప్రధాన నియంత్రణ అభ్యాసాన్ని అర్థం చేసుకున్నారని ధృవీకరించండి:',
    fullyCompleted: "నేను ఈ మాడ్యూల్‌ను పూర్తిగా పూర్తి చేసాను మరియు అర్థం చేసుకున్నాను.",
    needReview: "నేను సూచనలను మళ్లీ సమీక్షించాల్సిన అవసరం ఉంది.",
    excellent: "అద్భుతమైన!",
    masterySuccess: "మాస్టరీ ధృవీకరణ విజయవంతమైంది. జోడిస్తోంది +",
    incorrect: "తప్పు.",
    checkMirror: "అద్దం సూచనలను తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి.",
    stepByStep: "దశల వారీ సూచనలు",
    mistakeAlert: "పొరపాటు హెచ్చరిక:",
    safetyWarning: "భద్రతా హెచ్చరిక:",
    backToSteps: "దశలకు తిరిగి వెళ్ళు",
    tryAgain: "మళ్ళీ ప్రయత్నించండి",
    verifyAnswer: "సమాధానాన్ని ధృవీకరించండి",
    closeDetails: "వివరాలను మూసివేయండి",
    runSimFirst: "ముందుగా సిమ్ రన్ చేయండి",
    takeChallenge: "ఛాలెంజ్ తీసుకోండి"
  }
}

import { useXPStore } from '@/lib/stores/xp-store'
import Link from 'next/link'

// Import components
import { ParallelParkingSimulation } from '@/components/student/ParallelParkingSimulation'
import { ReverseBayParkingSimulation } from '@/components/student/ReverseBayParkingSimulation'
import { 
  VehicleStartupSimulation, 
  SteeringControlSimulation, 
  ClutchControlSimulation, 
  HighwayMergingSimulation 
} from '@/components/student/DynamicHTMLSimulations'
import { SignCard } from '@/components/student/SignCard'

// Import signs & questions data from RTO page
import { RoadSignItem, QuizQuestionItem, ROAD_SIGNS_DATA, QUIZ_QUESTIONS } from '@/lib/data/rto-data'

interface LearningCardData {
  id: string
  slug: string
  title: string
  category: string
  phase: string
  xpReward: number
  steps: string[] | string
  commonMistakes: string
  instructorTips: string
  safetyWarnings: string
  quizQuestion?: string
  quizOptions?: string[] | string
  quizAnswer?: string
  orderIndex: number
}

export default function StudentLearnPortal() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN
  // Main tab switcher
  const [activeSection, setActiveSection] = useState<'practical' | 'rto'>('practical')
  
  // RTO sub-tab switcher
  const [rtoSubTab, setRtoSubTab] = useState<'theory' | 'signs'>('theory')
  
  // Search query for signs or theory questions
  const [searchQuery, setSearchQuery] = useState('')
  
  // Selected category for signs filter
  const [selectedSignCategory, setSelectedSignCategory] = useState('All')
  
  // Active expanded question in theory accordion (legacy)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  
  // New paginated quiz view states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showCurrentAnswer, setShowCurrentAnswer] = useState(false)

  // Practical cards data
  const [cards, setCards] = useState<LearningCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Selected card for detail visualizer modal
  const [selectedCard, setSelectedCard] = useState<LearningCardData | null>(null)

  // Course active state switcher
  const [hasActiveCourse, setHasActiveCourse] = useState(false)
  const [bookedCourse, setBookedCourse] = useState<{
    transmission: 'manual' | 'automatic'
    duration: 'standard' | 'premium' | 'express'
    pickDrop: boolean
    vipWeekend: boolean
    branch: 'mohali' | 'chandigarh'
    fee: number
    enrolledAt: string
    sessionsCompleted: number
  } | null>(null)

  // Interactive Course Builder & Estimator states
  const [courseTransmission, setCourseTransmission] = useState<'manual' | 'automatic'>('manual')
  const [courseDuration, setCourseDuration] = useState<'standard' | 'premium' | 'express'>('standard')
  const [coursePickDrop, setCoursePickDrop] = useState(false)
  const [courseVIPWeekend, setCourseVIPWeekend] = useState(false)
  const [courseBranch, setCourseBranch] = useState<'mohali' | 'chandigarh'>('mohali')
  const [courseCheckoutSubmitted, setCourseCheckoutSubmitted] = useState(false)

  // Interactive Quiz / Simulation states
  const [simCompleted, setSimCompleted] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  // Card select wrapper resets states
  const handleSelectCard = (card: LearningCardData) => {
    setSelectedCard(card)
    setSimCompleted(false)
    setShowQuiz(false)
    setSelectedAnswerIndex(null)
    setQuizFeedback('idle')
  }

  // Local storage completion persistence
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const { addXP, addToast, level } = useXPStore()

  // Dynamic course fee calculations
  const estimatedFee = useMemo(() => {
    let base = 4999
    if (courseDuration === 'premium') {
      base = 6499
    } else if (courseDuration === 'express') {
      base = 1999
    }

    // Transmission premium
    if (courseTransmission === 'automatic') {
      base += 1000
    }

    // Addons
    if (coursePickDrop) base += 1000
    if (courseVIPWeekend) base += 500

    return base
  }, [courseTransmission, courseDuration, coursePickDrop, courseVIPWeekend])

  // Helper calculations for booked course
  const courseDetails = useMemo(() => {
    if (!bookedCourse) return null
    
    let title = "LMV Comprehensive Starter"
    let totalSlots = 15
    if (bookedCourse.duration === 'premium') {
      title = "LMV Elite Premium Masterclass"
      totalSlots = 20
    } else if (bookedCourse.duration === 'express') {
      title = "LMV Refresher Fast Track"
      totalSlots = 8
    }

    const transmissionText = bookedCourse.transmission === 'manual' ? 'Manual' : 'Automatic'
    const vehicleName = bookedCourse.transmission === 'manual' ? 'Suzuki Swift LXi' : 'Suzuki Swift Auto'
    const vehiclePlate = bookedCourse.transmission === 'manual' ? 'CH-01-A-4832 • Dual Control Pedal' : 'CH-01-A-9912 • Automatic Safety Car'
    const percent = totalSlots > 0 ? (bookedCourse.sessionsCompleted / totalSlots) * 100 : 0

    // Schedule status calculation
    let scheduleStatus = "4 Days Overdue"
    let scheduleDesc = "Cadence recommends a lesson every 3 days. Your last session was 7 days ago."
    let isWarning = true
    let isOk = false

    if (bookedCourse.sessionsCompleted === 0) {
      scheduleStatus = "Ready to Start"
      scheduleDesc = "Visit our desk to schedule your first simulator briefing with Vikram."
      isWarning = false
      isOk = true
    }

    return {
      title,
      totalSlots,
      transmissionText,
      vehicleName,
      vehiclePlate,
      percent,
      scheduleStatus,
      scheduleDesc,
      isWarning,
      isOk
    }
  }, [bookedCourse])

  // Fetch learning cards from API route
  const fetchCards = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/student/learning-cards')
      if (!res.ok) throw new Error('Failed to retrieve learning cards')
      const data = await res.json()
      setCards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
    
    // Load completed card IDs from localStorage
    const saved = localStorage.getItem('completed_skills')
    if (saved) {
      try {
        setCompletedIds(JSON.parse(saved))
      } catch (e) {}
    }

    // Load active course state
    const active = localStorage.getItem('has_booked_course')
    if (active !== null) {
      setHasActiveCourse(JSON.parse(active))
    } else {
      setHasActiveCourse(true) // Default to true so user can see simulations
    }

    const courseData = localStorage.getItem('booked_course_details')
    if (courseData) {
      try {
        setBookedCourse(JSON.parse(courseData))
      } catch (e) {}
    } else {
      setBookedCourse({
        transmission: 'manual',
        duration: 'standard',
        pickDrop: false,
        vipWeekend: false,
        branch: 'mohali',
        fee: 4999,
        enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sessionsCompleted: 6
      })
    }
  }, [])

  const handleMasterSkill = (card: LearningCardData) => {
    if (!completedIds.includes(card.id)) {
      const next = [...completedIds, card.id]
      setCompletedIds(next)
      localStorage.setItem('completed_skills', JSON.stringify(next))
      addXP(card.xpReward)
      addToast({
        title: `Skill ${t.mastered}!`,
        description: `Gained +${card.xpReward} XP for mastering.`,
        type: 'xp'
      })
    } else {
      addToast({
        title: `Already ${t.mastered}`,
        description: 'You have already collected XP for this skill.',
        type: 'xp'
      })
    }
  }

  // Reset all completed skills
  const handleResetProgress = () => {
    setCompletedIds([])
    localStorage.removeItem('completed_skills')
    addToast({
      title: 'Progress Reset',
      description: 'Your practical training progress has been cleared.',
      type: 'xp'
    })
  }

  // Progress metrics calculations
  const totalCards = cards.length
  const completedCount = completedIds.length
  const progressPercent = totalCards > 0 ? Math.min((completedCount / totalCards) * 100, 100) : 0
  const roadPathLength = 580
  const carX = 20 + (560 * progressPercent) / 100
  const carY = 20 + 8 * Math.sin((progressPercent * Math.PI * 2.8) / 100)

  // Filter theory questions based on search query
  const filteredQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q: QuizQuestionItem) => {
      const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.options.some((opt: string) => opt.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchSearch
    })
  }, [searchQuery])

  // Filter road signs based on category and search query
  const filteredSigns = useMemo(() => {
    return ROAD_SIGNS_DATA.filter((sign: RoadSignItem) => {
      const matchCategory = selectedSignCategory === t.all || sign.category === selectedSignCategory
      const matchSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sign.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedSignCategory, searchQuery])

  // Toggle theory questions accordion
  const toggleQuestion = (id: string) => {
    setExpandedQuestionId(prev => (prev === id ? null : id))
  }

  // Safe parsing helper for steps/mistakes content
  const parseCardContent = (card: LearningCardData) => {
    let stepsArray: string[] = []
    if (Array.isArray(card.steps)) {
      stepsArray = card.steps
    } else if (typeof card.steps === 'string') {
      try {
        stepsArray = JSON.parse(card.steps)
      } catch (e) {
        stepsArray = card.steps.split(',').map(s => s.trim())
      }
    }

    let optionsArray: string[] = []
    if (card.quizOptions) {
      if (Array.isArray(card.quizOptions)) {
        optionsArray = card.quizOptions
      } else if (typeof card.quizOptions === 'string') {
        try {
          optionsArray = JSON.parse(card.quizOptions)
        } catch (e) {
          optionsArray = card.quizOptions.split(',').map(o => o.trim())
        }
      }
    }

    return {
      steps: stepsArray,
      commonMistakes: card.commonMistakes || 'None reported.',
      safetyWarning: card.safetyWarnings || 'Proceed with standard caution.',
      instructorTip: card.instructorTips || 'Follow mirror checklist.',
      quizOptions: optionsArray
    }
  }

  const getSmartExplanation = (q: QuizQuestionItem) => {
    const qText = q.question.toLowerCase()
    const ans = q.options[q.correctIndex]
    
    if (qText.includes("uncontrolled intersection") || qText.includes("right of way")) {
      return `At uncontrolled intersections, the universal rule is to yield to vehicles approaching from your right. This prevents deadlocks and ensures a systematic flow of traffic without signals.`
    }
    if (qText.includes("overtaking")) {
      return `Overtaking must strictly be done from the right side because India follows left-hand traffic. Overtaking from the left creates severe blind-spot hazards.`
    }
    if (qText.includes("u-turn")) {
      return `U-turns require a wide turning radius and temporarily expose your vehicle to oncoming traffic. You must ensure the road is completely clear before executing it.`
    }
    if (qText.includes("pedestrian") || qText.includes("zebra crossing")) {
      return `Pedestrians always have the highest priority on the road. You must completely stop at zebra crossings to ensure their absolute safety.`
    }
    if (qText.includes("emergency") || qText.includes("ambulance") || qText.includes("fire")) {
      return `Emergency vehicles are on life-saving missions. It is your legal and moral obligation to pull over to the left and clear a path immediately.`
    }
    if (qText.includes("speed")) {
      return `Speed limits are scientifically calculated based on road conditions, pedestrian density, and braking distance. Exceeding them exponentially increases the risk of fatal accidents.`
    }
    if (qText.includes("fog") || qText.includes("night") || qText.includes("rain")) {
      return `Low visibility conditions drastically reduce your reaction time. Using low-beams prevents blinding oncoming drivers, and maintaining a larger following distance gives you crucial braking time.`
    }
    if (qText.includes("mobile") || qText.includes("phone")) {
      return `Using a mobile phone causes severe cognitive and visual distraction. It dramatically increases reaction time and is a leading cause of fatal accidents.`
    }
    if (qText.includes("horn") || qText.includes("honk")) {
      return `Horns should only be used to warn others of imminent danger, not out of frustration. Honking near hospitals or schools is strictly prohibited to prevent noise pollution.`
    }
    if (qText.includes("lane")) {
      return `Lane discipline is crucial for highway safety. Always use indicators before changing lanes and ensure the blind spot is clear to prevent sideswipes.`
    }
    if (qText.includes("parking")) {
      return `Parking regulations ensure roads remain clear for moving traffic and emergency vehicles. Parking near intersections, bridges, or fire hydrants creates dangerous bottlenecks.`
    }
    if (qText.includes("alcohol") || qText.includes("drunk")) {
      return `Alcohol severely impairs motor skills, judgment, and reaction times. Driving under the influence is a major criminal offense due to the extreme danger it poses.`
    }

    // Professional Fallback
    return `According to Motor Vehicles Act guidelines regarding ${q.topic.toLowerCase()}, the mandated action is "${ans}". This regulatory standard is enforced to maintain predictable driver behavior and minimize collision risks.`
  }

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-24 overflow-x-hidden font-body">
      
      {/* Visual background glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Page Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 flex flex-col gap-6 items-center">
        
        {/* Page Header */}
        <header className="w-full pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Acquisition Hub</span>
            <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight mt-0.5">
              {t.academyTitle}
            </h1>
            <p className="text-xs text-text-2 mt-1">
              {t.academyDesc}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:items-center">


            <div className="bg-surface/50 border border-border px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
              <span className="text-[10px] font-mono text-text-3">{t.studentCadet}</span>
              <span className="text-xs font-bold text-accent font-mono">
                {t.level} {level}
              </span>
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------
            TAB NAVIGATION BAR (Sleek Glassmorphic Pill)
            ---------------------------------------------------- */}
        <div className="w-full max-w-2xl flex flex-wrap justify-center gap-2 sm:gap-3 self-center">
          <button
            onClick={() => {
              setActiveSection('practical')
              setSearchQuery('')
            }}
            className={`flex-1 min-w-[140px] max-w-[200px] py-3 px-4 rounded-full text-[11px] sm:text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
              activeSection === 'practical'
                ? 'bg-primary border border-primary text-white shadow-primary/20'
                : 'bg-surface/60 border border-border/80 text-text-2 hover:text-text-1 backdrop-blur-sm'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.practicalTraining}</span>
          </button>
          
          <button
            onClick={() => {
              setActiveSection('rto')
              setSearchQuery('')
            }}
            className={`flex-1 min-w-[140px] max-w-[200px] py-3 px-4 rounded-full text-[11px] sm:text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
              activeSection === 'rto'
                ? 'bg-primary border border-primary text-white shadow-primary/20'
                : 'bg-surface/60 border border-border/80 text-text-2 hover:text-text-1 backdrop-blur-sm'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.rtoMaterial}</span>
          </button>
          
          <Link
            href="/student/rto"
            className="flex-1 min-w-[140px] max-w-[200px] py-3 px-4 rounded-full text-[11px] sm:text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm bg-surface/60 border border-border/80 text-text-2 hover:text-text-1 backdrop-blur-sm"
          >
            <AwardIcon className="w-4 h-4 text-accent shrink-0" />
            <span className="whitespace-nowrap text-accent">{t.mockExam}</span>
          </Link>
        </div>

{/* ----------------------------------------------------
            SECTION 1: PRACTICAL TRAINING VIEW
            ---------------------------------------------------- */}
        {activeSection === 'practical' && (
          <div className="w-full flex flex-col gap-6 items-center">
            
            {/* --- GOOGLE-LEVEL SKILL DIRECTORY GRID --- */}
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <RotateCcw className="w-10 h-10 text-primary animate-spin" />
                <h4 className="text-sm font-mono text-text-3">{t.seekingDb}</h4>
              </div>
            ) : error ? (
              <div className="bg-danger/10 border border-danger/20 p-6 rounded-3xl text-center max-w-sm">
                <h4 className="text-base font-bold text-danger">{t.dbStalled}</h4>
                <p className="text-xs text-text-2 mt-2">{error}</p>
                <button onClick={fetchCards} className="mt-4 px-4 py-2 bg-danger text-white rounded-xl text-xs font-semibold">
                  {t.retryConnection}
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-6">
                
                {/* Reset Progress & Header Tools */}
                <div className="w-full flex justify-between items-center bg-surface border border-border/80 px-4 py-3 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-mono text-text-2">
                    {t.availableTasks} <span className="font-bold text-primary">{cards.length} {t.skills}</span>
                  </span>
                  {completedCount > 0 && (
                    <button
                      onClick={handleResetProgress}
                      className="text-[10px] font-mono text-danger hover:underline uppercase font-bold tracking-wider"
                    >
                      {t.resetProgress}
                    </button>
                  )}
                </div>

                {/* Main Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {cards.map((card) => {
                    const isCompleted = completedIds.includes(card.id)
                    const hasSim = ['parallel-parking', 'reverse-parking', 'vehicle-startup', 'steering-control', 'clutch-control', 'highway-merging'].includes(card.slug)
                    
                    return (
                      <motion.div
                        key={card.id}
                        whileHover={{ y: -3, scale: 1.01 }}
                        onClick={() => handleSelectCard(card)}
                        className={`bg-surface border p-5 rounded-2xl flex flex-col justify-between h-48 cursor-pointer select-none transition-all duration-300 relative group overflow-hidden ${
                          isCompleted 
                            ? 'border-success/40 shadow-xs' 
                            : 'border-border/80 hover:border-primary hover:shadow-md'
                        }`}
                      >
                        {/* Status indicators */}
                        <div className="flex justify-between items-start w-full relative z-10">
                          <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold uppercase">
                            {card.category}
                          </span>
                          
                          <div className="flex gap-1.5 items-center">
                            {isCompleted ? (
                              <span className="text-[9px] font-bold text-success bg-success/15 border border-success/25 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                {t.mastered}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-text-3 font-mono bg-void border border-border px-1.5 py-0.5 rounded-full">
                                +{card.xpReward} XP
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title and details */}
                        <div className="mt-3 relative z-10 flex-1 flex flex-col justify-end">
                          <span className="text-[11px] font-mono text-text-3 uppercase tracking-wider block">
                            {t.phase} {card.phase}
                          </span>
                          <h3 className="text-lg font-extrabold text-text-1 font-display tracking-tight leading-snug group-hover:text-primary transition-colors mt-1">
                            {card.title}
                          </h3>
                        </div>

                        {/* Card bottom arrow */}
                        <div className="flex justify-between items-center border-t border-border/40 pt-3 mt-3 w-full text-xs font-mono font-bold text-text-3 group-hover:text-primary transition-colors">
                          <span>{t.beginTraining}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>

                        {/* Subtle interactive grid line overlays */}
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-primary/0 to-primary/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </motion.div>
                    )
                  })}
                </div>

              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 2: RTO TEST MATERIAL VIEW
            ---------------------------------------------------- */}
        {activeSection === 'rto' && (
          <div className="w-full flex flex-col gap-6">
            
            {/* Search Bar & Sub-Tab Navigation */}
            <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center bg-surface border border-border p-4 rounded-2xl shadow-xs">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-text-3 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={rtoSubTab === 'theory' ? t.searchTheory : t.searchSigns}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentQuestionIndex(0)
                    setShowCurrentAnswer(false)
                  }}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-void border border-border rounded-xl focus:outline-none focus:border-primary text-text-1 transition-all"
                />
              </div>

              {/* Sub-Tabs: {t.theoryQA} vs {t.roadSigns} */}
              <div className="flex gap-1.5 bg-void p-1.5 rounded-2xl border border-border/60 w-full md:w-auto shadow-inner">
                <button
                  onClick={() => {
                    setRtoSubTab('theory')
                    setSearchQuery('')
                  }}
                  className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold uppercase transition-all ${
                    rtoSubTab === 'theory'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-text-3 hover:text-text-1 hover:bg-surface'
                  }`}
                >
                  {t.theoryQA}
                </button>
                <button
                  onClick={() => {
                    setRtoSubTab('signs')
                    setSearchQuery('')
                  }}
                  className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold uppercase transition-all ${
                    rtoSubTab === 'signs'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-text-3 hover:text-text-1 hover:bg-surface'
                  }`}
                >
                  {t.roadSigns}
                </button>
              </div>

            </div>

            {/* --- SUB-TAB: THEORY QUESTIONS & ANSWERS --- */}
            {rtoSubTab === 'theory' && (
              <div className="w-full flex flex-col gap-4">
                
                {filteredQuestions.length === 0 ? (
                  <div className="w-full bg-surface border border-border rounded-2xl p-12 text-center text-text-3">
                    {t.noQuestions}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Progress & Navigation Header */}
                    <div className="flex justify-between items-center bg-surface border border-border rounded-2xl px-4 py-3 shadow-sm">
                      <span className="text-sm font-bold text-text-2 font-mono">
                        {t.question} {currentQuestionIndex + 1} <span className="text-text-3">{t.of} {filteredQuestions.length}</span>
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                            setShowCurrentAnswer(false)
                          }}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-void border border-border text-text-2 hover:text-text-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {t.previous}
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentQuestionIndex(Math.min(filteredQuestions.length - 1, currentQuestionIndex + 1))
                            setShowCurrentAnswer(false)
                          }}
                          disabled={currentQuestionIndex === filteredQuestions.length - 1}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all"
                        >
                          {t.next}
                        </button>
                      </div>
                    </div>

                    {/* Flashcard Style Render */}
                    {filteredQuestions[currentQuestionIndex] && (() => {
                      const currentQ = filteredQuestions[currentQuestionIndex]
                      return (
                        <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 flex flex-col shadow-md">
                          
                          <div className="flex justify-between items-start gap-3 border-b border-border/40 pb-5 mb-5">
                            <div className="flex gap-3 items-start">
                              <HelpCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                              <h4 className="text-base sm:text-lg font-bold text-text-1 leading-relaxed">
                                {currentQ.question}
                              </h4>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            {currentQ.options.map((opt: string, oIdx: number) => {
                              const isCorrect = oIdx === currentQ.correctIndex
                              const showStatus = showCurrentAnswer
                              
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => setShowCurrentAnswer(true)}
                                  disabled={showCurrentAnswer}
                                  className={`px-4 py-3.5 rounded-2xl text-sm flex gap-3 items-center transition-all text-left w-full ${
                                    showStatus 
                                      ? isCorrect 
                                        ? 'bg-success/15 border border-success/40 text-success font-bold shadow-sm'
                                        : 'bg-void/40 border border-border/50 text-text-3'
                                      : 'bg-void/60 border border-border text-text-1 hover:bg-surface cursor-pointer hover:border-primary/50'
                                  }`}
                                >
                                  {showStatus && isCorrect ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-success fill-success/15" />
                                  ) : (
                                    <span className={`w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 ${showStatus ? 'border-border/50 text-text-3' : 'border-border/80 text-text-3 bg-surface'}`}>
                                      {oIdx + 1}
                                    </span>
                                  )}
                                  <span className="leading-snug">{opt}</span>
                                </button>
                              )
                            })}
                          </div>

                          <AnimatePresence>
                            {showCurrentAnswer && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-5 mt-5 text-sm text-text-1 leading-relaxed">
                                  <span className="font-bold text-primary uppercase font-mono tracking-wider block mb-2 text-xs">{t.rtoRationale}</span>
                                  {getSmartExplanation(currentQ)}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Category Footer */}
                          <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 px-1 text-xs font-mono text-text-3">
                            <span>{t.category} {currentQ.topic}</span>
                            {!showCurrentAnswer && <span className="text-primary font-bold animate-pulse uppercase">{t.selectAnswer}</span>}
                          </div>

                        </div>
                      )
                    })()}
                  </div>
                )}

              </div>
            )}

            {/* --- SUB-TAB: ROAD SIGNBOARDS GRID --- */}
            {rtoSubTab === 'signs' && (
              <div className="w-full flex flex-col gap-6">
                
                {/* Category horizontal filters */}
                <div className="flex gap-2.5 flex-wrap items-center bg-surface border border-border p-3 rounded-2xl justify-center shadow-sm">
                  {[t.all, t.signs, t.parking, t.emergencies, t.laws].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedSignCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        selectedSignCategory === cat
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'bg-void border border-border text-text-2 hover:text-text-1 hover:bg-surface'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of Sign Cards */}
                {filteredSigns.length === 0 ? (
                  <div className="w-full bg-surface border border-border rounded-2xl p-12 text-center text-text-3">
                    {t.noSignboards}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                    {filteredSigns.map((sign: RoadSignItem, idx: number) => (
                      <SignCard
                        key={idx}
                        name={sign.name}
                        category={sign.category}
                        meaning={sign.meaning}
                        rule={sign.rule}
                        imagePath={sign.imagePath}
                        signKey={sign.signKey}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* ----------------------------------------------------
          IMMERSIVE SPLIT-SCREEN SIMULATOR MODAL (Google Level)
          ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedCard && (() => {
          const parsed = parseCardContent(selectedCard)
          const isCompleted = completedIds.includes(selectedCard.id)
          const hasSim = ['parallel-parking', 'reverse-parking', 'vehicle-startup', 'steering-control', 'clutch-control', 'highway-merging'].includes(selectedCard.slug)
          
          return (
            <div className="fixed inset-0 z-[200] flex flex-col">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCard(null)}
                className="absolute inset-0 bg-void/95 backdrop-blur-lg"
              />

              {/* Full-screen modal */}
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                className="relative w-full h-full flex flex-col bg-surface z-10 overflow-hidden sm:max-w-2xl sm:mx-auto sm:my-auto sm:h-[92vh] sm:rounded-[2rem] sm:border sm:border-border shadow-2xl"
              >
                {/* Close button — top right, above everything */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-3 right-3 z-50 p-2.5 bg-void/80 border border-border/60 rounded-full text-text-2 hover:text-white transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* === SIMULATION PANEL === visual (300px min) + 90px control bar = 420px min */}
                {hasSim ? (
                  <div className="w-full bg-void border-b border-border/40 flex items-stretch justify-center relative overflow-hidden shrink-0" style={{ height: 'max(420px, 60vh)' }}>
                    {selectedCard.slug === 'parallel-parking' && <ParallelParkingSimulation onComplete={() => setSimCompleted(true)} />}
                    {selectedCard.slug === 'reverse-parking' && <ReverseBayParkingSimulation onComplete={() => setSimCompleted(true)} />}
                    {selectedCard.slug === 'vehicle-startup' && <VehicleStartupSimulation onComplete={() => setSimCompleted(true)} />}
                    {selectedCard.slug === 'steering-control' && <SteeringControlSimulation onComplete={() => setSimCompleted(true)} />}
                    {selectedCard.slug === 'clutch-control' && <ClutchControlSimulation onComplete={() => setSimCompleted(true)} />}
                    {selectedCard.slug === 'highway-merging' && <HighwayMergingSimulation onComplete={() => setSimCompleted(true)} />}
                  </div>
                ) : (
                  /* Top spacer for non-sim cards */
                  <div className="h-12 shrink-0" />
                )}

                {/* === INSTRUCTIONS PANEL === scrollable middle */}
                <div className="w-full flex-1 min-h-0 overflow-y-auto p-5">

                  {/* Header */}
                  <div className="w-full border-b border-border/40 pb-4 pr-10">
                    <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold uppercase inline-block">
                      {selectedCard.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-text-1 font-display tracking-tight leading-tight mt-2">
                      {selectedCard.title}
                    </h3>
                  </div>

                  {/* Body: Checklist steps OR Quiz Question */}
                  <div className="flex-1 flex flex-col gap-4 py-4 pr-1 scrollbar-none justify-between">
                    
                    <AnimatePresence mode="wait">
                      {showQuiz ? (
                        <motion.div
                          key="quiz-challenge"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-col gap-4 flex-1"
                        >
                          <div>
                            <span className="text-[9px] font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-3">
                              {t.rtoValidation}
                            </span>
                            <h4 className="text-xs font-extrabold text-text-1 leading-relaxed">
                              {selectedCard.quizQuestion || `${t.masterPrefix}${selectedCard.title}${t.masterSuffix}`}
                            </h4>
                          </div>

                          {/* Quiz Options */}
                          <div className="flex flex-col gap-2.5 mt-2">
                            {parsed.quizOptions && parsed.quizOptions.length > 0 ? (
                              parsed.quizOptions.map((option, idx) => {
                                const isSelected = selectedAnswerIndex === idx
                                const isCorrectAnswer = option.toLowerCase() === (selectedCard.quizAnswer || '').toLowerCase()
                                
                                let optClass = 'bg-void/40 border-border text-text-2 hover:bg-white/[0.02] hover:border-text-3'
                                if (isSelected) {
                                  if (quizFeedback === 'correct') {
                                    optClass = 'bg-success/15 border-success text-success font-bold'
                                  } else if (quizFeedback === 'incorrect') {
                                    optClass = 'bg-danger/15 border-danger text-danger font-bold border-2'
                                  } else {
                                    optClass = 'bg-primary/10 border-primary text-primary font-bold'
                                  }
                                } else if (quizFeedback === 'incorrect' && isCorrectAnswer) {
                                  // Highlight the right answer after incorrect attempt
                                  optClass = 'bg-success/10 border-success/30 text-success font-semibold'
                                }

                                return (
                                  <button
                                    key={idx}
                                    disabled={quizFeedback === 'correct'}
                                    onClick={() => {
                                      setSelectedAnswerIndex(idx)
                                      setQuizFeedback('idle')
                                    }}
                                    className={`w-full text-left p-3.5 rounded-xl border text-[11px] transition-all duration-300 flex items-center justify-between gap-2 ${optClass}`}
                                  >
                                    <span>{option}</span>
                                    {isSelected && quizFeedback === 'correct' && (
                                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                    )}
                                    {isSelected && quizFeedback === 'incorrect' && (
                                      <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
                                    )}
                                  </button>
                                )
                              })
                            ) : (
                              // Fallback verification
                              <div className="flex flex-col gap-2">
                                {[t.fullyCompleted, t.needReview].map((option, idx) => {
                                  const isSelected = selectedAnswerIndex === idx
                                  const optClass = isSelected ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-void/40 border-border text-text-2'
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => setSelectedAnswerIndex(idx)}
                                      className={`w-full text-left p-3.5 rounded-xl border text-[11px] transition-all ${optClass}`}
                                    >
                                      {option}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* Quiz feedback text */}
                          {quizFeedback === 'correct' && (
                            <div className="bg-success/15 border border-success/30 px-3 py-2.5 rounded-xl text-[10px] text-success leading-relaxed flex items-center gap-2">
                              <Sparkles className="w-4 h-4 animate-bounce flex-shrink-0" />
                              <span><strong>{t.excellent}</strong> {t.masterySuccess}{selectedCard.xpReward} XP.</span>
                            </div>
                          )}
                          {quizFeedback === 'incorrect' && (
                            <div className="bg-danger/10 border border-danger/25 px-3 py-2.5 rounded-xl text-[10px] text-danger leading-relaxed">
                              <span><strong>{t.incorrect}</strong> {t.checkMirror}</span>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="steps-details"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex flex-col gap-4 flex-1"
                        >
                          <div>
                            <h5 className="text-[10px] font-mono text-text-3 uppercase tracking-wider mb-2.5">
                              {t.stepByStep}
                            </h5>
                            <div className="flex flex-col gap-2">
                              {parsed.steps.map((step, sIdx) => (
                                <div key={sIdx} className="flex gap-2.5 items-start">
                                  <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {sIdx + 1}
                                  </span>
                                  <p className="text-xs text-text-2 leading-relaxed font-body">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mistakes & Warnings Section */}
                          <div className="border-t border-border/40 pt-4 flex flex-col gap-2.5">
                            <div className="flex gap-2 items-start text-[10px] leading-relaxed">
                              <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-bold text-accent font-mono uppercase tracking-wider">{t.mistakeAlert}</span>{' '}
                                <span className="text-text-2">{parsed.commonMistakes}</span>
                              </div>
                            </div>
                            <div className="bg-danger/5 border border-danger/10 px-3 py-2 rounded-xl flex gap-2 items-start text-[10px] leading-relaxed text-text-2">
                              <ShieldAlert className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-bold text-danger font-mono uppercase tracking-wider block mb-0.5">{t.safetyWarning}</span>
                                {parsed.safetyWarning}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  {/* Actions / Mastery Validation Footer */}
                  <div className="border-t border-border/40 pt-4">
                    <AnimatePresence mode="wait">
                      {showQuiz ? (
                        <motion.div 
                          key="quiz-actions" 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="flex gap-3"
                        >
                          <button
                            onClick={() => {
                              setShowQuiz(false)
                              setSelectedAnswerIndex(null)
                              setQuizFeedback('idle')
                            }}
                            className="flex-1 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                          >
                            {t.backToSteps}
                          </button>
                          
                          {quizFeedback === 'incorrect' ? (
                            <button
                              onClick={() => {
                                setSelectedAnswerIndex(null)
                                setQuizFeedback('idle')
                              }}
                              className="flex-1 py-3 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                            >
                              {t.tryAgain}
                            </button>
                          ) : (
                            <button
                              disabled={selectedAnswerIndex === null || quizFeedback === 'correct'}
                              onClick={() => {
                                if (selectedAnswerIndex === null) return
                                const chosenOptionText = parsed.quizOptions[selectedAnswerIndex] || ''
                                const correctAnswerText = selectedCard.quizAnswer || ''
                                
                                if (chosenOptionText.toLowerCase() === correctAnswerText.toLowerCase() || !correctAnswerText) {
                                  setQuizFeedback('correct')
                                  handleMasterSkill(selectedCard)
                                  
                                  // Close modal after 1.5s
                                  setTimeout(() => {
                                    setSelectedCard(null)
                                    setShowQuiz(false)
                                    setSelectedAnswerIndex(null)
                                    setQuizFeedback('idle')
                                  }, 1500)
                                } else {
                                  setQuizFeedback('incorrect')
                                }
                              }}
                              className={`flex-1 py-3 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all ${
                                selectedAnswerIndex === null
                                  ? 'bg-border text-text-3 cursor-not-allowed'
                                  : quizFeedback === 'correct'
                                  ? 'bg-success text-white'
                                  : 'bg-primary hover:bg-primary/95 text-white'
                              }`}
                            >
                              {t.verifyAnswer}
                            </button>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="details-actions" 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="flex gap-3"
                        >
                          <button
                            onClick={() => setSelectedCard(null)}
                            className="flex-1 py-3 bg-void border border-border text-text-2 hover:text-text-1 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                          >
                            {t.closeDetails}
                          </button>
                          
                          {isCompleted ? (
                            <div className="flex-1 py-3 bg-success/15 border border-success/35 text-success font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                              <span>{t.mastered}</span>
                            </div>
                          ) : hasSim && !simCompleted ? (
                            <button
                              disabled
                              title="Please run the HTML simulation step 1 to 4 on the left first!"
                              className="flex-1 py-3 bg-border text-text-3 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75"
                            >
                              <Play className="w-3.5 h-3.5 fill-text-3" />
                              <span>{t.runSimFirst}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleMasterSkill(selectedCard)}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Complete</span>
                              </button>

                              <button
                                onClick={() => setShowQuiz(true)}
                                className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
                              >
                                <span>{t.takeChallenge}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </motion.div>
            </div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
