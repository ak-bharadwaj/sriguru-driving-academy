"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Plus, X, Trash2, Power } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Promotions Manager',
    pageDesc: 'Create and manage special offers and promotional banners.',
    newPromo: 'New Promotion',
    noActive: 'No Promotions Active',
    createOne: 'Create a new promotion to boost your sales.',
    promoCode: 'Promo Code',
    disable: 'Disable',
    enable: 'Enable',
    deleteConfirm: 'Delete this promotion?',
    modalTitle: 'New Promotion',
    title: 'Title',
    desc: 'Description',
    discount: 'Discount %',
    badge: 'Badge Label',
    creating: 'Creating...',
    createBtn: 'Create Promotion',
    phTitle: 'e.g. Summer Special Offer',
    phDesc: 'Offer details...',
    phBadge: 'e.g. Limited Time'
  },
  HI: {
    pageTitle: 'प्रचार प्रबंधक',
    pageDesc: 'विशेष ऑफ़र और प्रचारात्मक बैनर बनाएं और प्रबंधित करें।',
    newPromo: 'नया प्रचार',
    noActive: 'कोई प्रचार सक्रिय नहीं है',
    createOne: 'अपनी बिक्री बढ़ाने के लिए एक नया प्रचार बनाएं।',
    promoCode: 'प्रोमो कोड',
    disable: 'अक्षम करें',
    enable: 'सक्षम करें',
    deleteConfirm: 'क्या आप यह प्रचार हटाना चाहते हैं?',
    modalTitle: 'नया प्रचार',
    title: 'शीर्षक',
    desc: 'विवरण',
    discount: 'छूट %',
    badge: 'बैज लेबल',
    creating: 'बनाया जा रहा है...',
    createBtn: 'प्रचार बनाएं',
    phTitle: 'उदा. ग्रीष्मकालीन विशेष ऑफ़र',
    phDesc: 'ऑफ़र विवरण...',
    phBadge: 'उदा. सीमित समय'
  },
  TE: {
    pageTitle: 'ప్రమోషన్స్ మేనేజర్',
    pageDesc: 'ప్రత్యేక ఆఫర్‌లు మరియు ప్రచార బ్యానర్‌లను సృష్టించండి మరియు నిర్వహించండి.',
    newPromo: 'కొత్త ప్రమోషన్',
    noActive: 'ఎలాంటి ప్రమోషన్‌లు యాక్టివ్‌గా లేవు',
    createOne: 'మీ అమ్మకాలను పెంచడానికి కొత్త ప్రమోషన్‌ను సృష్టించండి.',
    promoCode: 'ప్రోమో కోడ్',
    disable: 'నిలిపివేయి',
    enable: 'ప్రారంభించు',
    deleteConfirm: 'ఈ ప్రమోషన్‌ను తొలగించాలా?',
    modalTitle: 'కొత్త ప్రమోషన్',
    title: 'శీర్షిక',
    desc: 'వివరణ',
    discount: 'డిస్కౌంట్ %',
    badge: 'బ్యాడ్జ్ లేబుల్',
    creating: 'సృష్టిస్తోంది...',
    createBtn: 'ప్రమోషన్‌ను సృష్టించండి',
    phTitle: 'ఉదా. వేసవి ప్రత్యేక ఆఫర్',
    phDesc: 'ఆఫర్ వివరాలు...',
    phBadge: 'ఉదా. పరిమిత సమయం'
  }
}


interface Promotion {
  id: string
  title: string
  desc: string
  active: boolean
  expiresAt?: string
  discountPercent: number
  promoCode: string
  badge: string
}

export default function PromotionsPage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [form, setForm] = useState({ title: '', desc: '', discountPercent: '', promoCode: '', badge: '', active: true })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/admin/offers')
      if (res.ok) {
        const data = await res.json()
        setPromotions(data || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        await fetchOffers()
        setIsModalOpen(false)
        setForm({ title: '', desc: '', discountPercent: '', promoCode: '', badge: '', active: true })
      }
    } catch (e) {
      console.error(e)
    }
    setSubmitting(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/offers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !current })
      })
      if (res.ok) {
        setPromotions(promotions.map(p => p.id === id ? { ...p, active: !current } : p))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deletePromo = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPromotions(promotions.filter(p => p.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[rgb(var(--color-text-1))]">{t.pageTitle}</h1>
            <p className="text-[rgb(var(--color-text-3))] text-sm mt-1">{t.pageDesc}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors"
          >
            <Plus className="w-5 h-5" /> {t.newPromo}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-blue-600">
            <Tag className="w-8 h-8 animate-bounce" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t.noActive}</h3>
            <p className="text-[rgb(var(--color-text-3))] text-sm">{t.createOne}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo, idx) => (
              <motion.div 
                key={promo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative bg-[rgb(var(--color-surface))] border rounded-2xl p-6 shadow-sm flex flex-col transition-all ${promo.active ? 'border-blue-200 dark:border-blue-800' : 'border-[rgb(var(--color-border))] opacity-75 grayscale-[0.5]'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg">{(promo.badge as any)?.[activeLang] || (promo.badge as any)?.EN || promo.badge}</span>
                  <div className={`w-3 h-3 rounded-full ${promo.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{(promo.title as any)?.[activeLang] || (promo.title as any)?.EN || promo.title}</h3>
                <p className="text-sm text-[rgb(var(--color-text-3))] mb-6 flex-1 line-clamp-3">{(promo.desc as any)?.[activeLang] || (promo.desc as any)?.EN || promo.desc}</p>
                
                <div className="flex items-center gap-3 mb-6 bg-[rgb(var(--color-void))] p-3 rounded-xl">
                  <div className="text-2xl font-black text-[rgb(var(--color-text-1))]">{promo.discountPercent}%</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[rgb(var(--color-text-3))] tracking-wider">{t.promoCode}</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{promo.promoCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto border-t border-[rgb(var(--color-border))] pt-4">
                  {deletingId === promo.id ? (
                    <>
                      <button 
                        onClick={async () => {
                          await deletePromo(promo.id)
                          setDeletingId(null)
                        }} 
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Confirm Delete
                      </button>
                      <button 
                        onClick={() => setDeletingId(null)} 
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] rounded-xl text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => toggleActive(promo.id, promo.active)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-colors ${promo.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                        <Power className="w-4 h-4" /> {promo.active ? t.disable : t.enable}
                      </button>
                      <button onClick={() => setDeletingId(promo.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 flex justify-between items-center border-b border-[rgb(var(--color-border))]">
                <h2 className="text-xl font-bold">{t.modalTitle}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[rgb(var(--color-border))] rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">{t.title}</label>
                  <input required type="text" className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder={t.phTitle} />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">{t.desc}</label>
                  <textarea required rows={3} className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder={t.phDesc} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">{t.discount}</label>
                    <input required type="number" min="0" max="100" className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" value={form.discountPercent} onChange={e => setForm({...form, discountPercent: e.target.value})} placeholder="e.g. 20" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">{t.promoCode}</label>
                    <input required type="text" className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm uppercase font-mono focus:border-blue-500 outline-none" value={form.promoCode} onChange={e => setForm({...form, promoCode: e.target.value})} placeholder="SUMMER20" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-2">
                  <label className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">{t.badge}</label>
                  <input required type="text" className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} placeholder={t.phBadge} />
                </div>

                <button type="submit" disabled={submitting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-2 shadow-lg shadow-blue-500/20 disabled:opacity-50">
                  {submitting ? t.creating : t.createBtn}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
