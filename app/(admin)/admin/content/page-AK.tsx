"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Tag, Book, Activity, AlertCircle, Save, Image as ImageIcon } from 'lucide-react'
import { Course, Offer } from '@/lib/data/academyStore'

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'OFFERS' | 'GALLERY' | 'BRANDING'>('COURSES')
  const [courses, setCourses] = useState<Course[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [branding, setBranding] = useState({ logoUrl: '' })
  const [isLoading, setIsLoading] = useState(true)
  
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [newImage, setNewImage] = useState({ imageKey: '', caption: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [courseRes, offerRes, galleryRes, brandingRes] = await Promise.all([
        fetch('/api/admin/courses'),
        fetch('/api/admin/offers'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/branding')
      ])
      
      if (courseRes.ok) {
        const cData = await courseRes.json()
        setCourses(cData)
      }
      
      if (offerRes.ok) {
        const oData = await offerRes.json()
        setOffers(oData)
      }

      if (galleryRes.ok) {
        const gData = await galleryRes.json()
        setGallery(gData)
      }

      if (brandingRes.ok) {
        const bData = await brandingRes.json()
        setBranding(bData)
      }
    } catch (err) {
      console.error('Failed to fetch content data', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage)
      })
      if (res.ok) {
        await fetchData()
        setShowGalleryModal(false)
        setNewImage({ imageKey: '', caption: '' })
      }
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding)
      })
      if (res.ok) {
        alert('Branding updated successfully!')
      }
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body min-h-screen">
      
      {/* Header section */}
      <header className="mb-10">
        <span className="text-xs font-mono tracking-widest text-primary uppercase">Content Dashboard</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 tracking-tight font-display mt-1">
          Academy Offerings
        </h1>
        <p className="text-sm text-text-2 mt-2">Manage the live curriculum courses and promotional voucher codes.</p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border mb-8 pb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('COURSES')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'COURSES' 
              ? 'bg-primary text-void shadow-lg shadow-primary/20' 
              : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <Book className="w-4 h-4" /> Curriculum Courses
        </button>
        <button
          onClick={() => setActiveTab('OFFERS')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'OFFERS' 
              ? 'bg-accent text-void shadow-lg shadow-accent/20' 
              : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <Tag className="w-4 h-4" /> Promotional Offers
        </button>
        <button
          onClick={() => setActiveTab('GALLERY')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'GALLERY' 
              ? 'bg-success text-void shadow-lg shadow-success/20' 
              : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Gallery Manager
        </button>
        <button
          onClick={() => setActiveTab('BRANDING')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'BRANDING' 
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
              : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <Tag className="w-4 h-4" /> Academy Branding
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-3">
          <Activity className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p className="font-mono text-xs uppercase tracking-widest">Syncing Dashboard...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'COURSES' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center bg-void/50 border border-border p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-text-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-mono tracking-wide">Live curriculum synced across student and public portals.</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary/20 border border-border hover:border-primary/40 rounded-xl text-xs font-bold text-text-1 transition-all">
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-surface border border-border p-6 rounded-3xl flex flex-col relative group transition-all hover:border-primary/50">
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-void/80 hover:bg-white/10 rounded-lg text-text-2 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 bg-void/80 hover:bg-danger/20 hover:text-danger rounded-lg text-text-2 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">{course.category}</span>
                    <h3 className="text-xl font-display font-bold text-text-1 leading-tight">{course.title.EN}</h3>
                    <p className="text-sm text-text-2 mt-3 mb-6 line-clamp-3">{course.desc.EN}</p>
                    
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-lg font-bold text-text-1 font-mono">₹{course.price.toLocaleString('en-IN')}</span>
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${course.active ? 'bg-success/20 text-success' : 'bg-void text-text-3 border border-border'}`}>
                        {course.active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'OFFERS' && (
            <motion.div
              key="offers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center bg-void/50 border border-border p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-text-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm font-mono tracking-wide">Promotional vouchers active on public booking channels.</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-accent/20 border border-border hover:border-accent/40 rounded-xl text-xs font-bold text-text-1 transition-all">
                  <Plus className="w-4 h-4" /> Create Offer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-surface border border-border p-6 rounded-3xl flex flex-col relative group transition-all hover:border-accent/50">
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-void/80 hover:bg-white/10 rounded-lg text-text-2 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 bg-void/80 hover:bg-danger/20 hover:text-danger rounded-lg text-text-2 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex gap-3 items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-3">PROMO CODE</span>
                        <h4 className="text-lg font-mono font-bold text-text-1 tracking-widest">{offer.promoCode}</h4>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-bold text-text-1 mb-2">{offer.title.EN}</h3>
                    <p className="text-sm text-text-2 mb-6 line-clamp-2">{offer.desc.EN}</p>
                    
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-2xl font-bold text-accent font-display">{offer.discountPercent}% OFF</span>
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${offer.active ? 'bg-success/20 text-success' : 'bg-void text-text-3 border border-border'}`}>
                        {offer.active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'GALLERY' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center bg-void/50 border border-border p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-text-2">
                  <ImageIcon className="w-5 h-5 text-success" />
                  <span className="text-sm font-mono tracking-wide">Manage images for the public gallery page.</span>
                </div>
                <button 
                  onClick={() => setShowGalleryModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-success/20 border border-border hover:border-success/40 rounded-xl text-xs font-bold text-text-1 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.map((img) => (
                  <div key={img.id} className="bg-surface border border-border p-4 rounded-3xl flex flex-col relative group transition-all hover:border-success/50">
                    <div className="aspect-square bg-void border border-border rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <ImageIcon className="w-12 h-12 text-text-3 opacity-30" />
                      {/* You can render an actual img tag if imageKey is a valid URL */}
                    </div>
                    
                    <h3 className="text-sm font-display font-bold text-text-1 mb-2 line-clamp-2 min-h-[40px]">{img.caption || 'No caption'}</h3>
                    <p className="text-xs text-text-3 font-mono truncate">{img.imageKey}</p>
                    
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-xs text-text-3">{new Date(img.uploadedAt).toLocaleDateString()}</span>
                      <button onClick={() => handleDeleteImage(img.id)} className="p-1.5 bg-void hover:bg-danger/20 hover:text-danger rounded-lg text-text-3 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'BRANDING' && (
            <motion.div
              key="branding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center bg-void/50 border border-border p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-text-2">
                  <AlertCircle className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-mono tracking-wide">Update school logo for certificates and badges.</span>
                </div>
              </div>

              <div className="bg-surface border border-border p-6 rounded-3xl flex flex-col max-w-2xl">
                <form onSubmit={handleSaveBranding} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Driving School Logo URL</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl bg-void border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {branding.logoUrl ? (
                          <img src={branding.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-text-3 opacity-50" />
                        )}
                      </div>
                      <input 
                        type="text" 
                        className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none text-white w-full" 
                        value={branding.logoUrl} 
                        onChange={e => setBranding({...branding, logoUrl: e.target.value})} 
                        placeholder="https://example.com/logo.png" 
                      />
                    </div>
                    <p className="text-xs text-text-3 mt-1">This logo will be featured on the Course Graduate badge.</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50">
                      <Save className="w-4 h-4" /> {submitting ? 'Saving...' : 'Save Branding'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGalleryModal(false)}>
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center bg-void/50">
              <h3 className="font-bold text-lg text-white">Add Gallery Image</h3>
            </div>
            <form onSubmit={handleUploadGallery} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Image URL / Key</label>
                <input required type="text" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-success outline-none text-white w-full" value={newImage.imageKey} onChange={e => setNewImage({...newImage, imageKey: e.target.value})} placeholder="e.g. https://..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Caption (optional)</label>
                <input type="text" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-success outline-none text-white w-full" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} placeholder="E.g. Student passing the test" />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={submitting} className="w-full py-3 bg-success text-void font-bold rounded-xl hover:bg-success/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

