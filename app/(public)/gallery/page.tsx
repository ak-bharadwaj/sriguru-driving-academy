"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Camera, ArrowRight, Car } from 'lucide-react'
import Link from 'next/link'

interface GalleryImage {
  id: string
  imageKey: string
  caption: string | null
  uploadedAt: string
}

interface Vehicle {
  id: string
  name: string
  type: string
  features: string[] | null
}

const DEMO_IMAGES = [
  { id: '1', caption: 'Student mastering parallel parking', gradient: 'from-blue-500 to-cyan-400' },
  { id: '2', caption: 'Our fleet of dual-control vehicles', gradient: 'from-purple-500 to-indigo-500' },
  { id: '3', caption: 'RTO Exam preparation session', gradient: 'from-emerald-400 to-teal-500' },
  { id: '4', caption: 'Night driving safety course', gradient: 'from-slate-800 to-slate-900' },
  { id: '5', caption: 'Highway navigation training', gradient: 'from-amber-400 to-orange-500' },
  { id: '6', caption: 'Celebrating successful license test', gradient: 'from-pink-500 to-rose-500' },
]

export default function PublicGalleryPage() {
  const [tab, setTab] = useState<'gallery' | 'fleet'>('gallery')
  const [images, setImages] = useState<GalleryImage[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data.images || [])
        setVehicles(data.vehicles || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayImages = images.length > 0 ? images : DEMO_IMAGES

  return (
    <div className="min-h-screen bg-transparent text-text-1 font-body selection:bg-primary/30">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,1),rgba(0,0,0,0.4))] pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 border border-blue-200/50 dark:border-blue-800/50">
            <Camera className="w-4 h-4" /> Explore our academy
          </motion.div>
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="text-4xl md:text-6xl font-black text-[rgb(var(--color-text-1))] tracking-tight mb-6">
            Inside <span className="text-[rgb(var(--color-primary))]">Sri Guru</span>
          </motion.h1>
          <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="text-lg text-[rgb(var(--color-text-2))] max-w-2xl mb-12">
            Get a glimpse of our training sessions, modern dual-control vehicles, and successful students passing their driving tests.
          </motion.p>

          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="flex p-1.5 bg-[rgb(var(--color-surface))]/50 backdrop-blur-md rounded-2xl border border-[rgb(var(--color-border))]">
            <button onClick={() => setTab('gallery')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'gallery' ? 'bg-[rgb(var(--color-surface))] text-blue-600 shadow-sm' : 'text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] dark:hover:text-white'}`}>
              Gallery
            </button>
            <button onClick={() => setTab('fleet')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'fleet' ? 'bg-[rgb(var(--color-surface))] text-blue-600 shadow-sm' : 'text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] dark:hover:text-white'}`}>
              Our Fleet
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-32 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : tab === 'gallery' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {displayImages.map((img: any, idx) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 3) * 0.1 }}
                  className="break-inside-avoid relative group rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[3/4] shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.gradient || 'from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900'} group-hover:scale-105 transition-transform duration-700`} />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <ImageIcon className="w-20 h-20 text-white" />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg sm:text-xl leading-snug">{img.caption}</p>
                    {img.uploadedAt && <p className="text-white/60 text-xs mt-2">{new Date(img.uploadedAt).toLocaleDateString()}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.length > 0 ? vehicles.map((v, idx) => (
                <motion.div key={v.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:idx*0.1}} className="bg-[rgb(var(--color-surface))] rounded-3xl border border-[rgb(var(--color-border))] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-slate-900 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_100%)]" />
                    <Car className="w-24 h-24 text-blue-600/20 dark:text-blue-400/20 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">{v.type}</div>
                    <h3 className="text-2xl font-bold mb-4">{v.name}</h3>
                    {v.features && (
                      <ul className="space-y-2">
                        {v.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[rgb(var(--color-text-2))]">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center text-[rgb(var(--color-text-3))]">Fleet details coming soon!</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-blue-600 dark:bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to hit the road?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">Join thousands of confident drivers who started their journey with Sri Guru Driving Academy.</p>
          <Link href="/book" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl">
            Book Your Demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
