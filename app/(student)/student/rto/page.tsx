"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X as XIcon, 
  Clock, 
  BookOpen, 
  RotateCcw,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

// Import icons
import * as RoadSigns from '@/lib/icons/road-signs'

// Import SignCard component
import { SignCard } from '@/components/student/SignCard'

// Import Zustand stores
import { useXPStore } from '@/lib/stores/xp-store'
import { useRTOStore } from '@/lib/stores/rto-store'

import { RoadSignItem, QuizQuestionItem, ROAD_SIGNS_DATA, QUIZ_QUESTIONS } from '@/lib/data/rto-data'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    dashboardTitle: 'RTO Theoretical Dashboard',
    learningCenter: 'RTO Learning Center',
    learningDesc: 'Master mandatory signs, signal states and regional laws to unlock full safety checkpoints.',
    signboardsGrid: 'Signboards Grid',
    flashcards: '3D Flashcards',
    mockExam: 'RTO Mock Exam',
    noSigns: 'No signs found',
    noSignsDesc: 'No signs are available for this category yet.',
    conceptFlashcards: 'Concept Flashcards',
    reviewRules: 'Review Active Road Rules',
    flashcardHint: 'Tap to flip, swipe left (forgot) or right (mastered).',
    forget: 'FORGET',
    mastered: 'MASTERED',
    conceptCard: 'Concept Card',
    zebraLoop: 'Zebra Loop',
    clickToFlip: 'Click to Flip',
    rtoRules: 'RTO Driving Rules',
    xpLog: '+5 XP Log',
    conceptMeaning: 'Concept Meaning',
    safetySteps: 'Student Safety Steps',
    swipeHint: 'Swipe Left (Forgot) | Swipe Right (Mastered)',
    flip: 'Flip',
    question: 'Question',
    of: 'of',
    remaining: 's remaining',
    concept: 'Concept',
    regulationCode: 'Traffic Regulation Code',
    spiderDashboard: 'Spider Accuracy Dashboard',
    assessmentLog: 'Mock RTO Assessment Log',
    totalAccuracy: 'Total Accuracy',
    correctSigns: 'Correct Signs',
    dashboardInsight: 'RTO Dashboard Insight',
    insightDesc: 'Your response matrices suggest high mastery on standard Signs and Rules, with minor road sign gaps flagged under "Laws" topics. Reviewing concept flashcards is suggested.',
    retakeExam: 'Retake Exam',
    studyMaterials: 'Study Materials',
    categories: {
      'Signs': 'Signs',
      'Signals': 'Signals',
      'Rules': 'Rules',
      'Parking': 'Parking',
      'Emergencies': 'Emergencies',
      'Laws': 'Laws'
    }
  },
  HI: {
    dashboardTitle: 'आरटीओ सैद्धांतिक डैशबोर्ड',
    learningCenter: 'आरटीओ लर्निंग सेंटर',
    learningDesc: 'पूर्ण सुरक्षा चौकियों को अनलॉक करने के लिए अनिवार्य संकेत, सिग्नल स्थिति और क्षेत्रीय कानूनों में महारत हासिल करें।',
    signboardsGrid: 'साइनबोर्ड ग्रिड',
    flashcards: '3D फ्लैशकार्ड',
    mockExam: 'आरटीओ मॉक परीक्षा',
    noSigns: 'कोई संकेत नहीं मिला',
    noSignsDesc: 'इस श्रेणी के लिए अभी तक कोई संकेत उपलब्ध नहीं हैं।',
    conceptFlashcards: 'अवधारणा फ्लैशकार्ड',
    reviewRules: 'सक्रिय सड़क नियमों की समीक्षा करें',
    flashcardHint: 'पलटने के लिए टैप करें, पॉइंटर वेलोसिटी के साथ लेफ्ट (भूल गए) या राइट (महारत हासिल) स्वाइप करें।',
    forget: 'भूल गए',
    mastered: 'महारत हासिल',
    conceptCard: 'अवधारणा कार्ड',
    zebraLoop: 'ज़ेबरा लूप',
    clickToFlip: 'पलटने के लिए क्लिक करें',
    rtoRules: 'आरटीओ ड्राइविंग नियम',
    xpLog: '+5 XP लॉग',
    conceptMeaning: 'अवधारणा का अर्थ',
    safetySteps: 'छात्र सुरक्षा कदम',
    swipeHint: 'बाएं स्वाइप करें (भूल गए) | दाएं स्वाइप करें (महारत हासिल)',
    flip: 'पलटें',
    question: 'प्रश्न',
    of: 'का',
    remaining: 'सेकंड शेष',
    concept: 'अवधारणा',
    regulationCode: 'यातायात विनियमन कोड',
    spiderDashboard: 'स्पाइडर सटीकता डैशबोर्ड',
    assessmentLog: 'मॉक आरटीओ मूल्यांकन लॉग',
    totalAccuracy: 'कुल सटीकता',
    correctSigns: 'सही संकेत',
    dashboardInsight: 'आरटीओ डैशबोर्ड इनसाइट',
    insightDesc: 'आपकी प्रतिक्रिया मैट्रिक मानक संकेतों और नियमों पर उच्च महारत का सुझाव देती है, जिसमें "कानून" विषयों के तहत मामूली सड़क संकेत अंतराल चिह्नित हैं। अवधारणा फ्लैशकार्ड की समीक्षा करने का सुझाव दिया गया है।',
    retakeExam: 'फिर से परीक्षा दें',
    studyMaterials: 'अध्ययन सामग्री',
    categories: {
      'Signs': 'संकेत',
      'Signals': 'सिग्नल',
      'Rules': 'नियम',
      'Parking': 'पार्किंग',
      'Emergencies': 'आपात स्थिति',
      'Laws': 'कानून'
    }
  },
  TE: {
    dashboardTitle: 'RTO సైద్ధాంతిక డాష్‌బోర్డ్',
    learningCenter: 'RTO లెర్నింగ్ సెంటర్',
    learningDesc: 'పూర్తి భద్రతా తనిఖీ కేంద్రాలను అన్‌లాక్ చేయడానికి తప్పనిసరి సంకేతాలు, సిగ్నల్ స్థితులు మరియు ప్రాంతీయ చట్టాలపై పట్టు సాధించండి.',
    signboardsGrid: 'సైన్‌బోర్డ్స్ గ్రిడ్',
    flashcards: '3D ఫ్లాష్‌కార్డ్‌లు',
    mockExam: 'RTO మాక్ పరీక్ష',
    noSigns: 'ఎలాంటి సంకేతాలు కనుగొనబడలేదు',
    noSignsDesc: 'ఈ వర్గానికి ఇంకా ఎలాంటి సంకేతాలు అందుబాటులో లేవు.',
    conceptFlashcards: 'కాన్సెప్ట్ ఫ్లాష్‌కార్డ్‌లు',
    reviewRules: 'యాక్టివ్ రోడ్ రూల్స్‌ను సమీక్షించండి',
    flashcardHint: 'ఫ్లిప్ చేయడానికి నొక్కండి, పాయింటర్ వేగంతో ఎడమ (మర్చిపో) లేదా కుడి (మాస్టర్) స్వైప్ చేయండి.',
    forget: 'మర్చిపో',
    mastered: 'మాస్టర్డ్',
    conceptCard: 'కాన్సెప్ట్ కార్డ్',
    zebraLoop: 'జీబ్రా లూప్',
    clickToFlip: 'ఫ్లిప్ చేయడానికి క్లిక్ చేయండి',
    rtoRules: 'RTO డ్రైవింగ్ రూల్స్',
    xpLog: '+5 XP లాగ్',
    conceptMeaning: 'కాన్సెప్ట్ అర్థం',
    safetySteps: 'విద్యార్థి భద్రతా దశలు',
    swipeHint: 'ఎడమకు స్వైప్ చేయండి (మర్చిపోయాను) | కుడికి స్వైప్ చేయండి (మాస్టర్డ్)',
    flip: 'ఫ్లిప్',
    question: 'ప్రశ్న',
    of: '/',
    remaining: 'సెకన్లు మిగిలి ఉన్నాయి',
    concept: 'కాన్సెప్ట్',
    regulationCode: 'ట్రాఫిక్ రెగ్యులేషన్ కోడ్',
    spiderDashboard: 'స్పైడర్ అక్యూరసీ డాష్‌బోర్డ్',
    assessmentLog: 'మాక్ RTO అసెస్‌మెంట్ లాగ్',
    totalAccuracy: 'మొత్తం ఖచ్చితత్వం',
    correctSigns: 'సరైన సంకేతాలు',
    dashboardInsight: 'RTO డాష్‌బోర్డ్ ఇన్‌సైట్',
    insightDesc: 'మీ ప్రతిస్పందన మ్యాట్రిక్‌లు ప్రామాణిక సంకేతాలు మరియు నిబంధనలపై అధిక పట్టును సూచిస్తున్నాయి, "చట్టాలు" అంశాల క్రింద చిన్న రోడ్ సైన్ అంతరాలు గుర్తించబడ్డాయి. కాన్సెప్ట్ ఫ్లాష్‌కార్డ్‌లను సమీక్షించడం సూచించబడింది.',
    retakeExam: 'మళ్లీ పరీక్ష రాయండి',
    studyMaterials: 'స్టడీ మెటీరియల్స్',
    categories: {
      'Signs': 'సంకేతాలు',
      'Signals': 'సిగ్నల్స్',
      'Rules': 'నిబంధనలు',
      'Parking': 'పార్కింగ్',
      'Emergencies': 'అత్యవసరాలు',
      'Laws': 'చట్టాలు'
    }
  }
}


const CATEGORIES = ['Signs', 'Signals', 'Rules', 'Parking', 'Emergencies', 'Laws']

export default function RTOLearningCenter() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN
  const [activeCategory, setActiveCategory] = useState('Signs')
  const [activeMode, setActiveMode] = useState<'learn' | 'quiz' | 'flashcard'>('learn')

  const { addToast, addXP } = useXPStore()
  const { recordWeakTopic } = useRTOStore()

  // Track if user has paid course
  const [hasPaidCourse, setHasPaidCourse] = useState(true)
  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.courseFee || data.feeStatus === 'PENDING') {
          setHasPaidCourse(false)
        }
      })
      .catch(() => {}) // Ignore errors gracefully
  }, [])

  // ----------------------------------------------------
  // FLASHCARD MODE STATES & GESTURES
  // ----------------------------------------------------
  const [currentFlashIdx, setCurrentFlashIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const handleFlashcardSwipe = (direction: 'left' | 'right') => {
    setIsFlipped(false)
    // Slide out animation
    setSwipeOffset(direction === 'left' ? -400 : 400)
    
    // Award minor XP for reviewing right (know)
    if (direction === 'right') {
      addXP(5)
      addToast({
        title: 'Concept Reviewed!',
        description: 'Awarded +5 XP for learning mastery.',
        type: 'xp'
      })
    }

    setTimeout(() => {
      // Go to next card
      setCurrentFlashIdx((prev) => (prev + 1) % ROAD_SIGNS_DATA.length)
      setSwipeOffset(0)
    }, 300)
  }

  // ----------------------------------------------------
  // QUIZ MODE STATE & timerRef (requestAnimationFrame)
  // ----------------------------------------------------
  const [quizIdx, setQuizIdx] = useState(0)
  const [activeQuestions, setActiveQuestions] = useState<(QuizQuestionItem & { signImage?: string; signName?: string })[]>([])
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  
  // Topic accuracy tracker for raw SVG radar chart
  const [topicScores, setTopicScores] = useState<Record<string, { correct: number; total: number }>>({
    'Signs': { correct: 0, total: 0 },
    'Signals': { correct: 0, total: 0 },
    'Rules': { correct: 0, total: 0 },
    'Parking': { correct: 0, total: 0 },
    'Laws': { correct: 0, total: 0 }
  })

  // requestAnimationFrame Timer Hook
  const [timeLeft, setTimeLeft] = useState(15) // 15 seconds per question
  const timerRafRef = useRef<number | null>(null)
  const timerStartRef = useRef<number>(0)

  const stopQuestionTimer = useCallback(() => {
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current)
      timerRafRef.current = null
    }
  }, [])

  const handleNextQuestionRef = useRef<() => void>(() => {})

  const handleQuizAnswer = useCallback((optionIdx: number) => {
    stopQuestionTimer()
    if (isAnswered) return

    setSelectedOpt(optionIdx)
    setIsAnswered(true)

    setUserAnswers(prev => ({ ...prev, [quizIdx]: optionIdx }))
    
    // Auto-advance after 500ms since we don't show answers immediately
    setTimeout(() => {
      handleNextQuestionRef.current()
    }, 500)
  }, [isAnswered, quizIdx, stopQuestionTimer])

  const startQuestionTimer = useCallback(() => {
    // Clear any active raf timer
    if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current)
    
    timerStartRef.current = performance.now()
    const update = (now: number) => {
      const elapsed = (now - timerStartRef.current) / 1000
      const remaining = Math.max(15 - Math.floor(elapsed), 0)
      setTimeLeft(remaining)
      
      if (remaining > 0) {
        timerRafRef.current = requestAnimationFrame(update)
      } else {
        // Timeout -> wrong answer
        handleQuizAnswer(-1)
      }
    }
    timerRafRef.current = requestAnimationFrame(update)
  }, [handleQuizAnswer])

  useEffect(() => {
    if (activeMode === 'quiz' && !quizFinished && !isAnswered && activeQuestions.length > 0) {
      setTimeLeft(15)
      startQuestionTimer()
    }
    return () => stopQuestionTimer()
  }, [activeMode, quizIdx, isAnswered, quizFinished, startQuestionTimer, stopQuestionTimer, activeQuestions.length])

  const handleNextQuestion = useCallback(() => {
    setIsAnswered(false)
    setSelectedOpt(null)
    if (quizIdx < activeQuestions.length - 1) {
      setQuizIdx((prev) => prev + 1)
    } else {
      // Calculate final score
      let score = 0;
      const newTopicScores = {
        'Signs': { correct: 0, total: 0 },
        'Signals': { correct: 0, total: 0 },
        'Rules': { correct: 0, total: 0 },
        'Parking': { correct: 0, total: 0 },
        'Laws': { correct: 0, total: 0 }
      }
      
      activeQuestions.forEach((q, idx) => {
        const uAns = userAnswers[idx];
        const isCorrect = uAns === q.correctIndex;
        if (isCorrect) score++;
        
        const topicKey = q.topic as keyof typeof newTopicScores;
        const curr = newTopicScores[topicKey] || { correct: 0, total: 0 };
        newTopicScores[topicKey] = {
          correct: curr.correct + (isCorrect ? 1 : 0),
          total: curr.total + 1
        };
      });
      
      setQuizScore(score);
      setTopicScores(newTopicScores);
      setQuizFinished(true);
      
      // Award XP at the end
      if (score > 0) {
        addXP(score * 10)
        addToast({
          title: 'Exam Completed',
          description: `You scored ${score}/${activeQuestions.length}. Earned +${score * 10} XP!`,
          type: 'xp'
        })
      }
    }
  }, [quizIdx, activeQuestions, userAnswers, addXP, addToast])

  useEffect(() => {
    handleNextQuestionRef.current = handleNextQuestion
  }, [handleNextQuestion])

  const resetQuizSession = () => {
    // Build mixed exam: 10 theory questions + 10 sign-identify questions
    const shuffledTheory = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10)
    
    // Generate sign-identify questions from ROAD_SIGNS_DATA
    const signsWithImages = ROAD_SIGNS_DATA.filter(s => s.imagePath || s.signKey)
    const shuffledSigns = [...signsWithImages].sort(() => 0.5 - Math.random()).slice(0, 10)
    
    const signQuestions: (QuizQuestionItem & { signImage?: string; signName?: string })[] = shuffledSigns.map((sign, i) => {
      // Pick 3 wrong answers from other signs
      const others = signsWithImages.filter(s => s.name !== sign.name)
        .sort(() => 0.5 - Math.random()).slice(0, 3).map(s => s.name)
      const options = [...others, sign.name].sort(() => 0.5 - Math.random())
      const correctIndex = options.indexOf(sign.name)
      return {
        id: `sign-q-${i}`,
        question: 'What does this road sign mean?',
        options,
        correctIndex,
        explanation: sign.meaning,
        topic: sign.category || 'Signs',
        signImage: sign.imagePath,
        signName: sign.name,
        signKey: sign.signKey
      } as QuizQuestionItem & { signImage?: string; signName?: string }
    })
    
    // Interleave theory and sign questions perfectly 1 to 1
    const mixed: any[] = []
    for(let i = 0; i < 10; i++) {
      if (shuffledTheory[i]) mixed.push({ ...shuffledTheory[i], signImage: undefined, signName: undefined })
      if (signQuestions[i]) mixed.push(signQuestions[i])
    }

    
    setActiveQuestions(mixed)
    setQuizIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setQuizFinished(false)
    setQuizScore(0)
    setUserAnswers({})
    setTopicScores({
      'Signs': { correct: 0, total: 0 },
      'Signals': { correct: 0, total: 0 },
      'Rules': { correct: 0, total: 0 },
      'Parking': { correct: 0, total: 0 },
      'Laws': { correct: 0, total: 0 }
    })
  }

  const renderTopicProgressbars = () => {
    const keys = Object.keys(topicScores)

    return (
      <div className="flex flex-col gap-4 w-full px-2 py-4">
        {keys.map((key) => {
          const stats = topicScores[key]
          const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
          
          let colorClass = "bg-primary"
          if (accuracy < 50 && stats.total > 0) colorClass = "bg-rose-500"
          else if (accuracy < 80 && stats.total > 0) colorClass = "bg-amber-500"
          else if (stats.total > 0) colorClass = "bg-emerald-500"
          else colorClass = "bg-text-3 opacity-30"

          return (
            <div key={key} className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center text-sm font-bold font-mono uppercase tracking-wider">
                <span className="text-text-2">{key}</span>
                <span className={stats.total > 0 ? "text-text-1" : "text-text-3"}>
                  {stats.total > 0 ? `${accuracy}%` : 'Not Tested'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-void/50 border border-border/50 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${colorClass} transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                  style={{ width: `${stats.total > 0 ? accuracy : 0}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Filter signs for categories
  const filteredSigns = ROAD_SIGNS_DATA.filter((s) => s.category === activeCategory)

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-20 overflow-x-hidden font-body">
      
      {/* Background ambient branding glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32">
        
        {/* Header Title Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent">{t.dashboardTitle}</span>
            <h1 className="text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1">
              RTO Learning Center
            </h1>
            <p className="text-sm text-text-2 mt-2 max-w-xl font-body">
              {t.learningDesc}
            </p>
          </div>

          {/* Interactive Portal Switcher */}
          <div className="bg-surface border border-border p-1 rounded-2xl flex gap-1 self-start">
            <button
              onClick={() => setActiveMode('learn')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeMode === 'learn' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-text-3 hover:text-text-2'
              }`}
            >
              Signboards Grid
            </button>
            <button
              onClick={() => setActiveMode('flashcard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeMode === 'flashcard' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-text-3 hover:text-text-2'
              }`}
            >
              3D Flashcards
            </button>
            <button
              onClick={() => {
                resetQuizSession()
                setActiveMode('quiz')
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeMode === 'quiz' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-text-3 hover:text-text-2'
              }`}
            >
              RTO Mock Exam
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------
            MODE 1: SIGNBOARDS GRID MODE (LEARN)
            ---------------------------------------------------- */}
        {activeMode === 'learn' && (
          <div className="mt-8 flex flex-col gap-8">
            
            {/* Snap scroll category bar */}
            <div className="w-full relative">
              <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-2">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`snap-start flex-shrink-0 px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-300 select-none ${
                        isActive 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_12px_rgba(37,99,235,0.1)]' 
                          : 'bg-surface border-border text-text-3 hover:text-text-2 hover:border-text-3'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Grid display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center"
              >
                {filteredSigns.length > 0 ? (
                  filteredSigns.map((sign, idx) => (
                    <SignCard
                      key={idx}
                      signKey={sign.signKey}
                      name={sign.name}
                      category={sign.category}
                      meaning={sign.meaning}
                      rule={sign.rule}
                      steps={sign.steps}
                      imagePath={sign.imagePath}
                      onStartQuiz={() => {
                        resetQuizSession()
                        setActiveMode('quiz')
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-12 h-12 text-text-3 opacity-30 animate-pulse" />
                    <h4 className="text-lg font-bold mt-4 text-text-2">{t.noSigns}</h4>
                    <p className="text-xs text-text-3 max-w-xs mt-1">{t.noSignsDesc}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ----------------------------------------------------
            MODE 2: 3D PERSPECTIVE FLASHCARDS
            ---------------------------------------------------- */}
        {activeMode === 'flashcard' && (
          <div className="mt-12 flex flex-col items-center gap-8">
            <div className="text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-text-3">{t.conceptFlashcards}</span>
              <h3 className="text-xl font-extrabold text-text-1 font-display mt-1">{t.reviewRules}</h3>
              <p className="text-xs text-text-2 mt-1">{t.flashcardHint}</p>
            </div>

            {/* 3D perspective flip container */}
            <div className="relative w-[340px] h-[400px] flex items-center justify-center select-none touch-none">
              
              {/* Swipe Left (No) Indicator overlay */}
              {swipeOffset < -40 && (
                <div className="absolute left-6 top-6 z-20 bg-danger/90 border border-danger text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono rotate-[-12deg] tracking-widest uppercase pointer-events-none">
                  FORGET
                </div>
              )}
              {/* Swipe Right (Yes) Indicator overlay */}
              {swipeOffset > 40 && (
                <div className="absolute right-6 top-6 z-20 bg-success/90 border border-success text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono rotate-[12deg] tracking-widest uppercase pointer-events-none">
                  MASTERED
                </div>
              )}

              {/* Inertia swipe card panel */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ 
                  x: swipeOffset || 0,
                  rotate: swipeOffset ? swipeOffset / 10 : 0,
                  perspective: 1000
                }}
                onDrag={(e, info) => setSwipeOffset(info.offset.x)}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) {
                    handleFlashcardSwipe('left')
                  } else if (info.offset.x > 100) {
                    handleFlashcardSwipe('right')
                  } else {
                    setSwipeOffset(0)
                  }
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-full cursor-pointer relative"
              >
                <motion.div
                  className="w-full h-full relative duration-700"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* CARD FRONT CONTAINER */}
                  <div 
                    className="absolute inset-0 bg-surface border border-border rounded-3xl p-8 flex flex-col items-center justify-between shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex justify-between w-full text-xs font-mono text-text-3">
                      <span>{t.conceptCard} {currentFlashIdx + 1}/{ROAD_SIGNS_DATA.length}</span>
                      <span className="uppercase text-primary font-bold">{t.zebraLoop}</span>
                    </div>

                    <div className="w-[140px] h-[140px] flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative">
                      {(() => {
                        const activeSign = ROAD_SIGNS_DATA[currentFlashIdx]
                        const SVGComponent = activeSign.signKey ? RoadSigns[activeSign.signKey as keyof typeof RoadSigns] : null
                        if (activeSign.imagePath) {
                          return <Image src={activeSign.imagePath} alt="Sign" width={140} height={140} className="object-contain" />
                        } else if (SVGComponent) {
                          return React.createElement(SVGComponent as React.ComponentType<{ size: number; glow?: boolean }>, { size: 140, glow: true })
                        }
                        
                        // Fallback shape
                        const shapeClass = activeSign.fallbackShape === 'circle' ? 'rounded-full' 
                                         : activeSign.fallbackShape === 'octagon' ? 'clip-octagon'
                                         : activeSign.fallbackShape === 'triangle' ? 'clip-triangle'
                                         : 'rounded-xl'
                        const colorClass = activeSign.fallbackColor === 'red' ? 'bg-[#ff3b30]'
                                         : activeSign.fallbackColor === 'blue' ? 'bg-[#007aff]'
                                         : activeSign.fallbackColor === 'yellow' ? 'bg-[#ffcc00]'
                                         : 'bg-[#34c759]'
                                         
                        return (
                          <div className={`w-32 h-32 ${shapeClass} ${colorClass} flex items-center justify-center border-4 border-white shadow-lg`}>
                            <span className="text-white font-bold text-xs uppercase text-center px-2">{activeSign.name}</span>
                          </div>
                        )
                      })()}
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-text-3 font-mono uppercase tracking-widest">{t.clickToFlip}</span>
                      <h4 className="text-lg font-bold text-text-1 font-display tracking-tight mt-1">
                        {ROAD_SIGNS_DATA[currentFlashIdx].name}
                      </h4>
                    </div>
                  </div>

                  {/* CARD BACK CONTAINER */}
                  <div 
                    className="absolute inset-0 bg-surface border border-border rounded-3xl p-8 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="flex justify-between w-full text-xs font-mono text-text-3 border-b border-border pb-3">
                      <span>{t.rtoRules}</span>
                      <span className="text-accent font-bold">{t.xpLog}</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 justify-center mt-2">
                      <div>
                        <h6 className="text-[10px] font-mono text-text-3 uppercase tracking-wider">{t.conceptMeaning}</h6>
                        <p className="text-sm text-text-1 font-body mt-1 leading-relaxed">{ROAD_SIGNS_DATA[currentFlashIdx].meaning}</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <h6 className="text-[10px] font-mono text-accent uppercase tracking-wider">{t.safetySteps}</h6>
                        <div className="mt-2 flex flex-col gap-2">
                          {ROAD_SIGNS_DATA[currentFlashIdx].steps && ROAD_SIGNS_DATA[currentFlashIdx].steps.length > 0 ? (
                            ROAD_SIGNS_DATA[currentFlashIdx].steps.map((step: string, sIdx: number) => (
                              <div key={sIdx} className="flex gap-2 items-start text-xs text-text-2 font-body italic border-l border-l-accent pl-2.5 leading-relaxed">
                                <span className="flex-shrink-0 text-accent font-bold">{sIdx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-text-2 font-body italic border-l border-l-accent pl-2.5 leading-relaxed">
                              {ROAD_SIGNS_DATA[currentFlashIdx].rule}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-[10px] text-text-3 font-mono border-t border-border pt-4">
                      {t.swipeHint}
                    </div>
                  </div>

                </motion.div>
              </motion.div>

            </div>

            {/* Gesture Helper Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => handleFlashcardSwipe('left')}
                className="p-4 bg-surface border border-border hover:border-danger/30 text-text-3 hover:text-danger rounded-full transition-all duration-300"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-6 bg-surface border border-border text-text-2 hover:text-text-1 text-sm font-semibold rounded-full flex items-center gap-2 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                Flip
              </button>
              <button 
                onClick={() => handleFlashcardSwipe('right')}
                className="p-4 bg-surface border border-border hover:border-success/30 text-text-3 hover:text-success rounded-full transition-all duration-300"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            MODE 3: MOCK TEST SIMULATION MODE
            ---------------------------------------------------- */}
        {activeMode === 'quiz' && (
          <div className="mt-8 flex flex-col items-center pb-12">
            
            {!quizFinished && activeQuestions.length > 0 ? (
              <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                
                {/* Selection frame */}
                {isAnswered && (
                  <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 border-2 border-primary bg-primary/5 rounded-3xl" />
                )}

                {/* Header question and clock */}
                <div className="relative z-10 flex justify-between items-center text-xs font-mono text-text-3 border-b border-border pb-4">
                  <span>{t.question} {quizIdx + 1} {t.of} {activeQuestions.length}</span>
                  
                  {/* requestAnimationFrame Clock HUD */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                    timeLeft < 5 ? 'border-danger/30 text-danger bg-danger/5 animate-pulse' : 'border-border text-text-2'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-bold">{timeLeft} {t.remaining}</span>
                  </div>
                </div>

                {/* Question Details */}
                <div className="relative z-10 flex flex-col items-center gap-5 mt-2">
                  
                  {/* Sign image — shown only for sign-identify questions */}
                  {(activeQuestions[quizIdx] as any).signImage && (
                    <div className="w-[120px] h-[120px] flex items-center justify-center bg-void/50 border border-border/60 rounded-2xl p-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative">
                      <Image
                        src={(activeQuestions[quizIdx] as any).signImage}
                        alt="Road sign"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}

                  {/* Question wording */}
                  <div className="w-full text-center md:text-left">
                    <span className="text-xs font-mono uppercase tracking-widest text-primary">
                      {(activeQuestions[quizIdx] as any).signImage ? 'Road Sign Identification' : t.regulationCode}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-text-1 font-display mt-1 leading-snug">
                      {activeQuestions[quizIdx].question}
                    </h3>
                  </div>
                </div>

                {/* Interactive Question options */}
                <div className="relative z-10 flex flex-col gap-3 mt-2">
                  {activeQuestions[quizIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx
                    
                    let cardStyle = 'bg-void/50 border-border hover:border-text-3 text-text-2'
                    
                    if (isAnswered) {
                      if (isSelected) {
                        cardStyle = 'bg-primary/15 border-primary text-primary font-semibold shadow-[0_0_12px_rgba(37,99,235,0.1)]'
                      } else {
                        cardStyle = 'bg-void/20 border-border/40 text-text-3 opacity-40'
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(oIdx)}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-300 flex items-center justify-between group ${cardStyle}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                            isAnswered && isSelected ? 'border-primary text-primary bg-primary/20' : 'border-border/80 text-text-3 bg-surface group-hover:border-text-3'
                          }`}>
                            {oIdx + 1}
                          </span>
                          <span className="font-medium">{opt}</span>
                        </div>
                        {isAnswered && isSelected && <Check className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : quizFinished ? (
              // Quiz Finished End Screen with RAW SVG Radar spider chart
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-surface border border-border rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Left Area: Score log metrics (Moved to top on mobile) */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-primary">Simulation Completed</span>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1 leading-snug">
                      Mock RTO Assessment
                    </h3>
                  </div>

                  {/* PASS / FAIL BANNER */}
                  <div className={`w-full p-4 rounded-2xl flex items-center gap-4 ${quizScore >= 12 ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'}`}>
                    <div className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center ${quizScore >= 12 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                      {quizScore >= 12 ? <Check className="w-6 h-6" /> : <XIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold font-display uppercase tracking-widest ${quizScore >= 12 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {quizScore >= 12 ? 'EXAM PASSED' : 'EXAM FAILED'}
                      </h4>
                      <p className="text-sm font-medium text-text-2">
                        {quizScore >= 12 ? 'Congratulations! You meet the RTO standard.' : 'You need at least 12 correct to pass.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-text-3 uppercase">{t.totalAccuracy}</span>
                      <span className="text-3xl font-extrabold text-success mt-2">
                        {Math.round((quizScore / activeQuestions.length) * 100)}%
                      </span>
                    </div>
                    <div className="bg-void/50 border border-border p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-text-3 uppercase">{t.correctSigns}</span>
                      <span className="text-3xl font-extrabold text-primary mt-2">
                        {quizScore} <span className="text-xs text-text-3">/ {activeQuestions.length}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-void/30 border border-border p-5 rounded-2xl flex flex-col gap-1.5">
                    <h5 className="text-sm font-bold text-text-2 uppercase font-display tracking-tight">{t.dashboardInsight}</h5>
                    <p className="text-sm text-text-3 leading-relaxed font-body">
                      Your response matrices suggest high mastery on standard Signs and Rules, with minor road sign gaps flagged under &quot;Laws&quot; topics. Reviewing concept flashcards is suggested.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={resetQuizSession}
                      className="flex-1 py-3 bg-void/80 hover:bg-white/[0.03] border border-border text-text-2 hover:text-text-1 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake Exam
                    </button>
                    <button
                      onClick={() => setActiveMode('learn')}
                      className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <span>{t.studyMaterials}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Area: Score log metrics (Moved to bottom on mobile) */}
                <div className="w-full md:w-1/2 flex flex-col w-full">
                  <span className="text-xs font-bold font-mono text-accent uppercase tracking-widest mb-3 text-center">Topic Progress Bars</span>
                  <div className="bg-surface border border-border/80 p-6 rounded-3xl w-full shadow-inner flex flex-col justify-center">
                    {renderTopicProgressbars()}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
