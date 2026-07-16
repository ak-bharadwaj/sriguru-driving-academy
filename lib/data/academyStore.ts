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
  academyName?: string
}

const DATA_DIR = path.join(process.cwd(), 'lib', 'data')
const DATA_FILE = path.join(DATA_DIR, 'academy_data.json')

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-driving',
    title: {
      EN: 'Just Driving Course',
      HI: 'केवल ड्राइविंग कोर्स',
      TE: 'కేవలం డ్రైవింగ్ కోర్సు'
    },
    tag: {
      EN: '150 Km Practice',
      HI: '150 किमी अभ्यास',
      TE: '150 కిమీ ప్రాక్టీస్'
    },
    desc: {
      EN: 'Dedicated on-road training focusing purely on driving skills, steering control, and road confidence.',
      HI: 'सड़क पर ड्राइविंग कौशल और आत्मविश्वास विकसित करने पर ध्यान केंद्रित करने वाला कोर्स।',
      TE: 'స్టీరింగ్ నియంత్రణ మరియు రోడ్డు విశ్వాసంపై ప్రత్యేకంగా దృష్టి పెట్టే డ్రైవింగ్ శిక్షణ.'
    },
    price: 4999,
    category: 'BEGINNER',
    active: true
  },
  {
    id: 'course-license',
    title: {
      EN: 'Driving Course + License Process',
      HI: 'ड्राइविंग कोर्स + लाइसेंस प्रक्रिया',
      TE: 'డ్రైవింగ్ కోర్సు + లైసెన్స్ ప్రక్రియ'
    },
    tag: {
      EN: 'Complete Package',
      HI: 'पूर्ण पैकेज',
      TE: 'పూర్తి ప్యాకేజీ'
    },
    desc: {
      EN: 'Comprehensive driving training combined with RTO learners & permanent license assistance and documentation.',
      HI: 'लाइसेंस प्रक्रिया, दस्तावेज़ीकरण और परीक्षा सहायता के साथ संपूर्ण ड्राइविंग प्रशिक्षण।',
      TE: 'RTO లెర్నర్స్ & పర్మనెంట్ లైసెన్స్ సహాయం మరియు డాక్యుమెంటేషన్‌తో కూడిన డ్రైవింగ్ శిక్షణ.'
    },
    price: 6999,
    category: 'ADVANCED',
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
      TE: 'RTO प्रिపరేషన్ స్పెషల్'
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
  logoUrl: '/logo.png',
  contactPhone: '+919642589121',
  contactUrl: 'https://wa.me/919642589121',
  academyName: 'Sri Guru Driving School'
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
