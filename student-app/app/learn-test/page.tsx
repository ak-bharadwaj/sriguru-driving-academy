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
  Sliders,
  User,
  CheckSquare
} from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { useSearchParams } from 'next/navigation'

import {
  VehicleStartupSimulation,
  SteeringControlSimulation,
  ClutchControlSimulation,
  BrakingSimulation,
  MirrorCheckingSimulation,
  ParallelParkingSimulation,
  ReverseBayParkingSimulation,
  HillStartsSimulation,
  LaneChangingSimulation,
  TrafficSignalsSimulation,
  HighwayMergingSimulation,
  OvertakingSimulation,
  EmergencyBrakingSimulation,
  RainDrivingSimulation,
  NightDrivingSimulation,
  RoundaboutSimulation,
  ParkingAlignmentSimulation,
  BlindSpotAwarenessSimulation
} from '@/components/student/NewHTMLSimulations'

const PAGE_DICT = {
  EN: {
    acqHub: "Acquisition Hub",
    academyTitle: "Academy Learning Center (18 Skills Test)",
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
    noSignboards: "आपके चयनित फ़िल्टर से कोई भी साइनबोर्ड मेल नहीं खाता।",
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
    resetProgress: "ప్రగతిని రీసెట్ చేయండి",
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
    noSignboards: "మీరు ఎంచుకున్న ఫిల్టర్లకు ఏ సైన్ బోర్డులు సరిపోలలేదు.",
    all: "అన్నీ",
    signs: "సంకేతాలు",
    parking: "పార్కింగ్",
    emergencies: "అత్యవసరాలు",
    laws: "చట్టాలు",
    rtoValidation: "RTO ధ్రువీకరణ సవాలు",
    masterPrefix: '"',
    masterSuffix: '" లో ప్రావీణ్యం పొందడానికి, మీరు ప్రధాన నియంత్రణ అభ్యాసాన్ని అర్థం చేసుకున్నారని ధృవీకరించండి:',
    fullyCompleted: "నేను ఈ మాడ్యూలును పూర్తిగా పూర్తి చేసాను మరియు అర్థం చేసుకున్నాను.",
    needReview: "నేను సూచనలను మళ్లీ సమీక్షించాల్సిన అవసరం ఉంది.",
    excellent: "అద్భుతమైన!",
    masterySuccess: "మాస్టరీ ధృవీకరణ విజయవంతమైంది. జోడిస్తోంది +",
    incorrect: "తప్పు.",
    checkMirror: "అద్దం సూచనలను తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి.",
    stepByStep: "దశల వారీ సూచనలు",
    mistakeAlert: "పొరపాటు హెచ్చరిక:",
    safetyWarning: "భద్రతా హెచ్చరిక:",
    backToSteps: "దశల వారీకి వెళ్ళండి",
    tryAgain: "మళ్లీ ప్రయత్నించండి",
    verifyAnswer: "సమాధానాన్ని ధృవీకరించు",
    closeDetails: "వివరాలను మూసివేయి",
    runSimFirst: "సిమ్యులేషన్ రన్ చేయండి",
    takeChallenge: "సవాలు తీసుకోండి"
  }
}

interface LearningCard {
  id: string
  slug: string
  title: string
  category: string
  phase: string
  xpReward: number
  steps: string[]
  commonMistakes: string[]
  instructorTips: string[]
  safetyWarnings: string[]
  quizQuestion?: string | null
  quizOptions?: string[]
  quizAnswer?: string | null
  orderIndex: number
}

function StagingLearnTestContent() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const searchParams = useSearchParams()
  const targetCardSlug = searchParams.get('card')

  const [activeTab, setActiveTab] = useState<'practical' | 'rto'>('practical')
  const [cards, setCards] = useState<LearningCard[]>([])
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [dbStalled, setDbStalled] = useState(false)

  // Simulation overlays
  const [selectedCard, setSelectedCard] = useState<LearningCard | null>(null)
  const [simCompleted, setSimCompleted] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const fetchCards = async () => {
    try {
      setLoading(true)
      setDbStalled(false)
      const res = await fetch('/api/student/learning-cards')
      if (res.ok) {
        const data = await res.json()
        setCards(data)
        
        // Auto-open target card from query param if provided
        if (targetCardSlug) {
          const matched = data.find((c: LearningCard) => c.slug === targetCardSlug)
          if (matched) setSelectedCard(matched)
        }
      } else {
        setDbStalled(true)
      }
    } catch (e) {
      setDbStalled(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [targetCardSlug])

  const parseCardContent = (card: LearningCard) => {
    return {
      steps: card.steps || [],
      commonMistakes: card.commonMistakes && card.commonMistakes.length > 0 ? card.commonMistakes.join(', ') : 'None listed',
      safetyWarning: card.safetyWarnings && card.safetyWarnings.length > 0 ? card.safetyWarnings.join('. ') : 'Standard road precautions apply.',
      quizOptions: card.quizOptions || []
    }
  }

  const handleMasterSkill = (card: LearningCard) => {
    if (!completedIds.includes(card.id)) {
      setCompletedIds([...completedIds, card.id])
    }
    setSimCompleted(true)
  }

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-24 overflow-x-hidden font-body">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 text-white">{t.academyTitle}</h1>
        <p className="text-sm text-text-3 mb-6">{t.academyDesc}</p>

        {loading ? (
          <p className="text-text-2">{t.seekingDb}</p>
        ) : dbStalled ? (
          <div className="p-6 bg-danger/10 border border-danger/30 rounded-2xl">
            <p className="text-danger mb-4">{t.dbStalled}</p>
            <button onClick={fetchCards} className="px-4 py-2 bg-primary text-white rounded-xl">{t.retryConnection}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => {
              const isCompleted = completedIds.includes(card.id)
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card)
                    setSimCompleted(false)
                    setShowQuiz(false)
                    setSelectedAnswerIndex(null)
                    setQuizFeedback('idle')
                  }}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    isCompleted 
                      ? 'bg-success/5 border-success/30 hover:border-success/50' 
                      : 'bg-surface border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">{card.phase}</span>
                  <h3 className="text-base font-bold mt-1 text-white">{card.title}</h3>
                  <p className="text-xs text-text-3 mt-1 uppercase tracking-wider">{card.category}</p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Interactive Overlay Modal */}
      <AnimatePresence>
        {selectedCard && (() => {
          const parsed = parseCardContent(selectedCard)
          const isCompleted = completedIds.includes(selectedCard.id)
          const slug = selectedCard.slug

          return (
            <div className="fixed inset-0 z-[500] flex flex-col">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCard(null)}
                className="absolute inset-0 bg-void/95 backdrop-blur-lg"
              />

              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                className="relative w-full h-full flex flex-col bg-surface z-10 overflow-hidden sm:max-w-2xl sm:mx-auto sm:my-auto sm:h-[92vh] sm:rounded-[2rem] shadow-2xl"
              >
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-3 right-3 z-50 p-2 bg-void/80 border border-border/60 rounded-full text-text-2 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Simulation Canvas */}
                <div className="w-full bg-void border-b border-border/40 flex items-stretch justify-center relative overflow-hidden shrink-0" style={{ height: '360px' }}>
                  {slug === 'vehicle-startup' && <VehicleStartupSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'steering-control' && <SteeringControlSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'clutch-control' && <ClutchControlSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'braking' && <BrakingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'mirror-checking' && <MirrorCheckingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'parallel-parking' && <ParallelParkingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'reverse-parking' && <ReverseBayParkingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'hill-starts' && <HillStartsSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'lane-changing' && <LaneChangingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'traffic-signals' && <TrafficSignalsSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'highway-merging' && <HighwayMergingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'overtaking' && <OvertakingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'emergency-braking' && <EmergencyBrakingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'rain-driving' && <RainDrivingSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'night-driving' && <NightDrivingSimulation onComplete={() => setSimCompleted(true)} />}
                  {(slug === 'roundabouts' || slug === 'roundabout') && <RoundaboutSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'parking-alignment' && <ParkingAlignmentSimulation onComplete={() => setSimCompleted(true)} />}
                  {slug === 'blind-spots' && <BlindSpotAwarenessSimulation onComplete={() => setSimCompleted(true)} />}
                </div>

                {/* Instructions scroll view */}
                <div className="w-full flex-1 overflow-y-auto p-6">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase">{selectedCard.phase}</span>
                  <h2 className="text-xl font-bold mt-1 text-white">{selectedCard.title}</h2>
                  
                  <div className="mt-4 flex flex-col gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-text-3 uppercase tracking-wider mb-2">{t.stepByStep}</h4>
                      {parsed.steps.map((step, idx) => (
                        <p key={idx} className="text-xs text-text-2 leading-relaxed mb-1">{idx+1}. {step}</p>
                      ))}
                    </div>

                    <div className="border-t border-border/40 pt-4">
                      <p className="text-xs text-text-2"><strong className="text-accent">{t.mistakeAlert}</strong> {parsed.commonMistakes}</p>
                      <p className="text-xs text-text-2 mt-2"><strong className="text-danger">{t.safetyWarning}</strong> {parsed.safetyWarning}</p>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => handleMasterSkill(selectedCard)}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase"
                      >
                        Mark Complete
                      </button>
                    </div>
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

export default function StagingLearnTestPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-void text-text-3 flex items-center justify-center font-mono">Loading simulations staging environment...</div>}>
      <StagingLearnTestContent />
    </React.Suspense>
  )
}
