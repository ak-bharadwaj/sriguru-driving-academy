"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

// Import icons
import * as RoadSigns from '@/lib/icons/road-signs'
import { ROAD_SIGNS_DATA } from '@/lib/data/rto-data'

import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    card: 'Card',
    clickFlip: 'Click to Flip',
    concept: 'Concept Meaning',
    safety: 'Safety Guidelines',
    rule: 'RULE',
    info: 'INFO',
    title: 'All Flashcards Verification',
    desc: (count: number) => \Displaying all \ interactive 3D Flashcards. Click any card to flip.\
  },
  HI: {
    card: 'कार्ड',
    clickFlip: 'पलटने के लिए क्लिक करें',
    concept: 'अवधारणा अर्थ',
    safety: 'सुरक्षा दिशा निर्देश',
    rule: 'नियम',
    info: 'जानकारी',
    title: 'सभी फ्लैशकार्ड सत्यापन',
    desc: (count: number) => \सभी \ 3D फ्लैशकार्ड दिखा रहा है। पलटने के लिए किसी भी कार्ड पर क्लिक करें।\
  },
  TE: {
    card: 'కార్డు',
    clickFlip: 'తిప్పడానికి క్లిక్ చేయండి',
    concept: 'కాన్సెప్ట్ అర్థం',
    safety: 'భద్రతా మార్గదర్శకాలు',
    rule: 'నియమం',
    info: 'సమాచారం',
    title: 'అన్ని ఫ్లాష్‌కార్డ్‌ల ధృవీకరణ',
    desc: (count: number) => \అన్ని \ 3D ఫ్లాష్‌కార్డ్‌లను ప్రదర్శిస్తోంది. తిప్పడానికి ఏదైనా కార్డ్‌పై క్లిక్ చేయండి.\
  }
}

const translateName = (name: string, lang: string) => {
  const upperLang = lang.toUpperCase();
  if (upperLang === 'EN') return name;
  let translated = name;
  const dict: Record<string, [string, string]> = {
    'Prohibited': ['निषिद्ध', 'నిషేధించబడింది'],
    'No Entry': ['प्रवेश निषेध', 'ప్రవేశం లేదు'],
    'Compulsory': ['अनिवार्य', 'తప్పనిసరి'],
    'Ahead': ['आगे', 'ముందుకు'],
    'Turn Left': ['बाएं मुड़ें', 'ఎడమవైపు మలుపు'],
    'Turn Right': ['दाएं मुड़ें', 'कुడివైపు మలుపు'],
    'Keep Left': ['बाएं रहें', 'ఎడమవైపు ఉండండి'],
    'Keep Right': ['दाएं रहें', 'కుడివైపు ఉండండి'],
    'Speed Limit': ['गति सीमा', 'వేగ పరిమితి'],
    'Parking': ['पार्किंग', 'పార్కింగ్'],
    'Stop': ['रुकिए', 'ఆగు'],
    'Give Way': ['रास्ता दें', 'దారి ఇవ్వండి'],
    'Pedestrians': ['पैदल यात्री', 'పాదచారులు'],
    'Buses': ['बसें', 'బస్సులు'],
    'Cycles': ['साइकिल', 'సైకిళ్ళు'],
    'Trucks': ['ट्रक', 'ట్రక్కులు']
  };
  
  Object.entries(dict).forEach(([eng, [hi, te]]) => {
    const replacement = upperLang === 'HI' ? hi : te;
    translated = translated.replace(new RegExp(eng, 'gi'), replacement);
  });
  
  return translated;
}

export default function VerifyFlashcardsPage() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="min-h-screen bg-void text-text-1 flex flex-col items-center pt-20 pb-32 overflow-x-hidden font-body relative">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-12 relative z-10 px-4">
        <h1 className="text-4xl font-display font-bold text-primary">{t.title}</h1>
        <p className="text-text-3 mt-2">{t.desc(ROAD_SIGNS_DATA.length)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 max-w-[1600px] mx-auto z-10">
        {ROAD_SIGNS_DATA.map((activeSign, index) => {
          const isFlipped = !!flippedCards[index]
          
          return (
            <div key={index} className="relative w-[320px] h-[380px] flex items-center justify-center select-none perspective-1000">
              
              <motion.div
                onClick={() => toggleFlip(index)}
                className="w-full h-full cursor-pointer relative duration-700 transition-transform"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* CARD FRONT CONTAINER */}
                <div 
                  className="absolute inset-0 bg-surface border border-border rounded-3xl p-6 flex flex-col items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-primary/50 transition-colors"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex justify-between w-full text-[10px] font-mono text-text-3">
                    <span>{t.card} {index + 1}/{ROAD_SIGNS_DATA.length}</span>
                    <span className="uppercase text-primary font-bold">{translateName(activeSign.category, language)}</span>
                  </div>

                  <div className="w-[120px] h-[120px] flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative">
                    {(() => {
                      const SVGComponent = activeSign.signKey ? RoadSigns[activeSign.signKey as keyof typeof RoadSigns] : null
                      if (activeSign.imagePath) {
                        return <Image src={activeSign.imagePath} alt="Sign" width={120} height={120} className="object-contain" />
                      } else if (SVGComponent) {
                        return React.createElement(SVGComponent as React.ComponentType<{ size: number; glow?: boolean }>, { size: 120, glow: true })
                      }
                      
                      const shapeClass = activeSign.fallbackShape === 'circle' ? 'rounded-full' 
                                       : activeSign.fallbackShape === 'octagon' ? 'clip-octagon'
                                       : activeSign.fallbackShape === 'triangle' ? 'clip-triangle'
                                       : 'rounded-xl'
                      const colorClass = activeSign.fallbackColor === 'red' ? 'bg-[#ff3b30]'
                                       : activeSign.fallbackColor === 'blue' ? 'bg-[#007aff]'
                                       : activeSign.fallbackColor === 'yellow' ? 'bg-[#ffcc00]'
                                       : 'bg-[#34c759]'
                                       
                      return (
                        <div className={\w-28 h-28 \ \ flex items-center justify-center border-4 border-white shadow-lg\}>
                          <span className="text-white font-bold text-[10px] uppercase text-center px-1">{activeSign.name}</span>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] text-text-3 font-mono uppercase tracking-widest flex items-center justify-center gap-1"><RotateCcw className="w-3 h-3"/> {t.clickFlip}</span>
                    <h4 className="text-base font-bold text-text-1 font-display tracking-tight mt-1 line-clamp-2">
                      {translateName(activeSign.name, language)}
                    </h4>
                  </div>
                </div>

                {/* CARD BACK CONTAINER */}
                <div 
                  className="absolute inset-0 bg-surface border border-primary/30 rounded-3xl p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(56,189,248,0.15)]"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex justify-between w-full text-[10px] font-mono text-text-3 border-b border-border pb-2">
                    <span>{translateName(activeSign.category, language)} {t.rule}</span>
                    <span className="text-accent font-bold">{t.info}</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-3 justify-center mt-2 overflow-y-auto scrollbar-none pr-1">
                    <div>
                      <h6 className="text-[9px] font-mono text-text-3 uppercase tracking-wider">{t.concept}</h6>
                      <p className="text-xs text-text-1 font-body mt-1 leading-relaxed">{translateName(activeSign.meaning, language)}</p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <h6 className="text-[9px] font-mono text-accent uppercase tracking-wider">{t.safety}</h6>
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        {activeSign.steps && activeSign.steps.length > 0 ? (
                          activeSign.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-2 items-start text-[11px] text-text-2 font-body italic border-l border-l-accent pl-2 leading-snug">
                              <span className="flex-shrink-0 text-accent font-bold">{sIdx + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-text-2 font-body italic border-l border-l-accent pl-2 leading-snug">
                            {activeSign.rule}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
