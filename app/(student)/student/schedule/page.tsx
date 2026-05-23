"use client"

import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    title: '{t.title}',
    desc: '{t.desc}'
  },
  HI: {
    title: 'अनुसूची और बुकिंग',
    desc: 'आपका इंटरेक्टिव पाठ कैलेंडर और बुकिंग प्रबंधन सिस्टम वर्तमान में सेट किया जा रहा है। अपना अगला बिहाइंड-द-व्हील सत्र निर्धारित करने के लिए कृपया जल्द ही वापस देखें।'
  },
  TE: {
    title: 'షెడ్యూల్ మరియు బుకింగ్స్',
    desc: 'మీ ఇంటరాక్టివ్ లెసన్ క్యాలెండర్ మరియు బుకింగ్ మేనేజ్‌మెంట్ సిస్టమ్ ప్రస్తుతం సెటప్ చేయబడుతోంది. దయచేసి మీ తదుపరి బిహైండ్-ది-వీల్ సెషన్‌ను షెడ్యూల్ చేయడానికి త్వరలో తిరిగి తనిఖీ చేయండి.'
  }
}

import React from 'react'
import { Calendar } from 'lucide-react'

export default function SchedulePage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  return (
    <div className="min-h-screen bg-void text-text-1 flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Calendar className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-4xl font-display font-bold mb-4 text-center">{t.title}</h1>
      <p className="text-text-3 max-w-md text-center">
        {t.desc}
      </p>
    </div>
  )
}
