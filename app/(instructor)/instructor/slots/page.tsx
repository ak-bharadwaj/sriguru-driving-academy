import React from 'react'
import SlotManagerClient from '@/app/(admin)/admin/slots/SlotManagerClient'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Batch & Capacity Override',
    pageDesc: 'Control the availability of your batches and block capacity for legacy offline students.',
  },
  HI: {
    pageTitle: 'बैच और क्षमता ओवरराइड',
    pageDesc: 'अपने बैचों की उपलब्धता को नियंत्रित करें और पुराने ऑफ़लाइन छात्रों के लिए क्षमता ब्लॉक करें।',
  },
  TE: {
    pageTitle: 'బ్యాచ్ & కెపాసిటీ ఓవర్‌రైడ్',
    pageDesc: 'మీ బ్యాచ్‌ల లభ్యతను నియంత్రించండి మరియు పాత ఆఫ్‌లైన్ విద్యార్థుల కోసం సామర్థ్యాన్ని బ్లాక్ చేయండి.',
  }
}

export const metadata = {
  title: 'Batch Management | Instructor Dashboard',
}

export default function InstructorSlotsPage() {
  const { language } = useLanguageStore()
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.pageTitle}</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          {t.pageDesc}
        </p>
      </div>

      <SlotManagerClient />
    </div>
  )
}
