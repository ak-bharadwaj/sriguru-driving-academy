import fs from 'fs'
import path from 'path'

export interface LocalizedString {
  EN: string
  HI: string
  TE: string
}

export interface Course {
  id: string
  title: LocalizedString
  tag: LocalizedString
  desc: LocalizedString
  price: number
  category: 'BEGINNER' | 'ADVANCED' | 'RTO_FAST_TRACK'
  active: boolean
}

export interface Offer {
  id: string
  title: LocalizedString
  desc: LocalizedString
  discountPercent: number
  promoCode: string
  active: boolean
  badge: LocalizedString
}

export interface SkillNode {
  id: string
  title: string
  desc: string
  category: 'PARKING' | 'STEERING' | 'HIGHWAY' | 'EMERGENCY'
  status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED'
  xpReward: number
}

export interface Badge {
  id: string
  title: string
  desc: string
  icon: string
  unlockedAt?: string
}

export interface StudentState {
  id: string
  name: string
  xp: number
  level: number
  streakDays: number
  confidenceScore: number
  skillNodes: SkillNode[]
  badges: Badge[]
}

export interface BrandingState {
  logoUrl: string
  contactPhone: string
  contactUrl: string
}

const DATA_DIR = path.join(process.cwd(), 'lib', 'data')
const DATA_FILE = path.join(DATA_DIR, 'academy_data.json')

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-beginner',
    title: {
      EN: 'The Foundation',
      HI: 'बुनियाद',
      TE: 'పునాది'
    },
    tag: {
      EN: '21 Days',
      HI: '21 दिन',
      TE: '21 రోజులు'
    },
    desc: {
      EN: 'The definitive beginner experience. Master manual transmissions, perfect your parallel parking, and glide through examinations with our guided instruction.',
      HI: 'निश्चित शुरुआती अनुभव। मैनुअल ट्रांसमिशन में महारत हासिल करें, अपनी समानांतर पार्किंग को सही करें, और परीक्षा में आसानी से सफल हों।',
      TE: 'ఖచ్చితమైన బిగినర్స్ అనుభవం. మాన్యువల్ ట్రాన్స్మిషన్లను నేర్చుకోండి, మీ సమాంతర పార్కింగ్ను పరిపూర్ణం చేసుకోండి మరియు పరీక్షల ద్వారా సులभంగా ఉత్తీర్ణత సాధించండి.'
    },
    price: 4999,
    category: 'BEGINNER',
    active: true
  },
  {
    id: 'course-advanced',
    title: {
      EN: 'Advanced Defensive',
      HI: 'उन्नत रक्षात्मक',
      TE: 'అధునాతన డిఫెన్సివ్'
    },
    tag: {
      EN: '14 Days',
      HI: '14 दिन',
      TE: '14 రోజులు'
    },
    desc: {
      EN: 'Elevate your existing skills. High-speed freeway maneuvering, extreme weather protocols, and advanced hazard perception for licensed drivers.',
      HI: 'अपने मौजूदा कौशल को बढ़ाएं। उच्च गति वाली फ्रीवे पैंतरेबाज़ी, चरम मौसम प्रोटोकॉल, और लाइसेंस प्राप्त ड्राइवरों के लिए उन्नत जोखिम धारणा।',
      TE: 'మీ నైపుణ్యాలను పెంచుకోండి. హై-స్పీడ్ ఫ్రీవే డ్రైవింగ్, విపరీత వాతావరణ ప్రోటోకాల్స్ మరియు లైసెన్స్ పొందిన డ్రైవర్లకు ప్రమాద హెచ్చరిక.'
    },
    price: 6999,
    category: 'ADVANCED',
    active: true
  },
  {
    id: 'course-rto',
    title: {
      EN: 'RTO Fast-Track',
      HI: 'RTO फास्ट-ट्रैक',
      TE: 'RTO ఫాస్ట్-ట్రాక్'
    },
    tag: {
      EN: '7 Days',
      HI: '7 दिन',
      TE: '7 రోజులు'
    },
    desc: {
      EN: 'Rapid clearance preparation. Intensive mock testing and precise alignment coaching to ensure flawless execution on your license exam day.',
      HI: 'तेजी से क्लीयरेंस की तैयारी। आपके लाइसेंस परीक्षा के दिन दोषरहित निष्पादन सुनिश्चित करने के लिए गहन मॉक टेस्टिंग।',
      TE: 'వేగవంతమైన క్లియరెన్స్ తయారీ. మీ లైసెన్స్ పరీక్ష రోజున దోషరహిత ప్రదర్శనను నిర్ధారించడానికి ఇంటెన్సివ్ మాక్ టెస్టింగ్ మరియు కోచింగ్.'
    },
    price: 2999,
    category: 'RTO_FAST_TRACK',
    active: true
  }
]

const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'offer-monsoon',
    title: {
      EN: 'Monsoon Driving Shield',
      HI: 'मानसून ड्राइविंग शील्ड',
      TE: 'మాన్సూన్ డ్రైవింగ్ షీల్డ్'
    },
    desc: {
      EN: 'Master wet road handling, prevent aquaplaning, and claim a 20% elite safety clearance discount.',
      HI: 'गीली सड़कों पर ड्राइविंग सीखें, एक्वाप्लानिंग से बचें, और 20% विशिष्ट सुरक्षा छूट प्राप्त करें।',
      TE: 'తడి రోడ్డులపై డ్రైవింగ్ నేర్చుకోండి, అక్వాప్లానింగ్‌ను నివారించండి మరియు 20% ఎలైట్ సేఫ్టీ డిస్కౌంట్ పొందండి.'
    },
    discountPercent: 20,
    promoCode: 'MONSOON20',
    active: true,
    badge: {
      EN: 'HOT OFFER',
      HI: 'गर्म प्रस्ताव',
      TE: 'హాట్ ఆఫర్'
    }
  },
  {
    id: 'offer-rto-special',
    title: {
      EN: 'RTO Preparation Combo',
      HI: 'RTO तैयारी विशेष',
      TE: 'RTO ప్రిపరేషన్ స్పెషల్'
    },
    desc: {
      EN: 'Get 15% off RTO mock test series and track coaching package today.',
      HI: 'आज ही RTO मॉक टेस्ट सीरीज़ और ट्रैक कोचिंग पैकेज पर 15% की छूट पाएं।',
      TE: 'ఈ రోజు RTO మాక్ టెస్ట్ సిరీస్ మరియు కోచింగ్ ప్యాకేజీపై 15% తగ్గింపు పొందండి.'
    },
    discountPercent: 15,
    promoCode: 'RTOSPECIAL',
    active: true,
    badge: {
      EN: 'SPECIAL PROMO',
      HI: 'विशेष प्रोमो',
      TE: 'ప్రత్యేక ప్రమోషన్'
    }
  }
]

const DEFAULT_STUDENT_STATE: StudentState = {
  id: 'student-001',
  name: 'Alex Cadet',
  xp: 1250,
  level: 4,
  streakDays: 12,
  confidenceScore: 85,
  skillNodes: [
    { id: 'node-1', title: 'Ignition & Gears', desc: 'Mastering manual shifting', category: 'STEERING', status: 'COMPLETED', xpReward: 100 },
    { id: 'node-2', title: 'Parallel Parking', desc: 'Precision reverse parking in tight spots', category: 'PARKING', status: 'IN_PROGRESS', xpReward: 250 },
    { id: 'node-3', title: 'Highway Merging', desc: 'High-speed lane entries', category: 'HIGHWAY', status: 'LOCKED', xpReward: 300 }
  ],
  badges: [
    { id: 'badge-1', title: 'First Gear', desc: 'Completed the first lesson', icon: 'zap', unlockedAt: new Date().toISOString() },
    { id: 'badge-2', title: 'Parking Expert', desc: 'Perfectly aligned 10 parallel parks', icon: 'shield' }
  ]
}

const DEFAULT_BRANDING: BrandingState = {
  logoUrl: '',
  contactPhone: '+919876543210',
  contactUrl: 'https://wa.me/919876543210'
}

interface AcademyData {
  courses: Course[]
  offers: Offer[]
  studentState?: StudentState
  branding?: BrandingState
}

function ensureDataExists(): AcademyData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    if (!fs.existsSync(DATA_FILE)) {
      const initialData: AcademyData = {
        courses: DEFAULT_COURSES,
        offers: DEFAULT_OFFERS,
        studentState: DEFAULT_STUDENT_STATE,
        branding: DEFAULT_BRANDING
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
      return initialData
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(fileContent) as AcademyData
  } catch (error) {
    console.error('Failed to initialize or read academy JSON store:', error)
    return {
      courses: DEFAULT_COURSES,
      offers: DEFAULT_OFFERS,
      studentState: DEFAULT_STUDENT_STATE,
      branding: DEFAULT_BRANDING
    }
  }
}

export function getCourses(): Course[] {
  const data = ensureDataExists()
  return data.courses
}

export function saveCourses(courses: Course[]): void {
  const data = ensureDataExists()
  data.courses = courses
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save courses to academy JSON store:', error)
  }
}

export function getOffers(): Offer[] {
  const data = ensureDataExists()
  return data.offers
}

export function saveOffers(offers: Offer[]): void {
  const data = ensureDataExists()
  data.offers = offers
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save offers to academy JSON store:', error)
  }
}

export function getStudentState(): StudentState {
  const data = ensureDataExists()
  return data.studentState || DEFAULT_STUDENT_STATE
}

export function saveStudentState(state: StudentState): void {
  const data = ensureDataExists()
  data.studentState = state
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save student state to academy JSON store:', error)
  }
}

export function getBranding(): BrandingState {
  const data = ensureDataExists()
  return data.branding || DEFAULT_BRANDING
}

export function saveBranding(branding: BrandingState): void {
  const data = ensureDataExists()
  data.branding = branding
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save branding to academy JSON store:', error)
  }
}

