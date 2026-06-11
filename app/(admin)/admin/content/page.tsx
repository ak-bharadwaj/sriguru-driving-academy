"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Tag, Book, Activity, AlertCircle, Save, Image as ImageIcon, Upload, Loader2 } from 'lucide-react'
import { Course, Offer } from '@/lib/data/academyStore'
import { useLanguageStore } from '@/store/languageStore'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from 'react-hot-toast'

const PAGE_DICT = {
  EN: {
    dashboard: 'Content Dashboard',
    title: 'Academy Offerings',
    desc: 'Manage the live curriculum courses and promotional voucher codes.',
    tabCourses: 'Curriculum Courses',
    tabOffers: 'Promotional Offers',
    tabGallery: 'Gallery Manager',
    syncing: 'Syncing Dashboard...',
    coursesAlert: 'Live curriculum synced across student and public portals.',
    addCourse: 'Add Course',
    active: 'Active',
    draft: 'Draft',
    offersAlert: 'Promotional vouchers active on public booking channels.',
    createOffer: 'Create Offer',
    promoCode: 'PROMO CODE',
    expired: 'Expired',
    off: 'OFF',
    galleryAlert: 'Manage images for the public gallery page.',
    addImage: 'Add Image',
    noCaption: 'No caption',
    addGalleryImage: 'Add Gallery Image',
    imageUrlKey: 'Image URL / Key',
    imageUrlPlaceholder: 'e.g. https://...',
    captionLabel: 'Caption (optional)',
    captionPlaceholder: 'E.g. Student passing the test',
    adding: 'Adding...',
    confirmDeleteImage: 'Are you sure you want to delete this image?'
  },
  HI: {
    dashboard: 'कंटेंट डैशबोर्ड',
    title: 'अकादमी की पेशकश',
    desc: 'लाइव पाठ्यक्रम और प्रचार वाउचर कोड प्रबंधित करें।',
    tabCourses: 'पाठ्यक्रम',
    tabOffers: 'प्रचार प्रस्ताव',
    tabGallery: 'गैलरी प्रबंधक',
    syncing: 'डैशबोर्ड सिंक हो रहा है...',
    coursesAlert: 'लाइव पाठ्यक्रम छात्र और सार्वजनिक पोर्टल पर सिंक किया गया।',
    addCourse: 'कोर्स जोड़ें',
    active: 'सक्रिय',
    draft: 'ड्राफ्ट',
    offersAlert: 'सार्वजनिक बुकिंग चैनलों पर सक्रिय प्रचार वाउचर।',
    createOffer: 'ऑफर बनाएं',
    promoCode: 'प्रोमो कोड',
    expired: 'समाप्त',
    off: 'छूट',
    galleryAlert: 'सार्वजनिक गैलरी पृष्ठ के लिए छवियां प्रबंधित करें।',
    addImage: 'छवि जोड़ें',
    noCaption: 'कोई कैप्शन नहीं',
    addGalleryImage: 'गैलरी छवि जोड़ें',
    imageUrlKey: 'छवि यूआरएल (URL) / कुंजी (Key)',
    imageUrlPlaceholder: 'जैसे https://...',
    captionLabel: 'कैप्शन (वैकल्पिक)',
    captionPlaceholder: 'जैसे छात्र टेस्ट पास कर रहा है',
    adding: 'जोड़ा जा रहा है...',
    confirmDeleteImage: 'क्या आप वाकई इस छवि को हटाना चाहते हैं?'
  },
  TE: {
    dashboard: 'కంటెంట్ డాష్‌బోర్డ్',
    title: 'అకాడమీ ఆఫరింగ్స్',
    desc: 'లైవ్ కరికులం కోర్సులు మరియు ప్రమోషనల్ వోచర్ కోడ్‌లను నిర్వహించండి.',
    tabCourses: 'కరికులం కోర్సులు',
    tabOffers: 'ప్రమోషనల్ ఆఫర్‌లు',
    tabGallery: 'గ్యాలరీ మేనేజర్',
    syncing: 'డాష్‌బోర్డ్ సింక్ అవుతోంది...',
    coursesAlert: 'విద్యార్థి మరియు పబ్లిక్ పోర్టల్‌లలో లైవ్ కరికులం సింక్ చేయబడింది.',
    addCourse: 'కోర్సును జోడించండి',
    active: 'యాక్టివ్',
    draft: 'డ్రాఫ్ట్',
    offersAlert: 'పబ్లిక్ బుకింగ్ ఛానెల్‌లలో ప్రమోషనల్ వోచర్‌లు యాక్టివ్‌గా ఉన్నాయి.',
    createOffer: 'ఆఫర్‌ను సృష్టించండి',
    promoCode: 'ప్రోమో కోడ్',
    expired: 'గడువు ముగిసింది',
    off: 'తగ్గింపు',
    galleryAlert: 'పబ్లిక్ గ్యాలరీ పేజీ కోసం చిత్రాలను నిర్వహించండి.',
    addImage: 'చిత్రాన్ని జోడించండి',
    noCaption: 'క్యాప్షన్ లేదు',
    addGalleryImage: 'గ్యాలరీ చిత్రాన్ని జోడించండి',
    imageUrlKey: 'చిత్రం URL / కీ',
    imageUrlPlaceholder: 'ఉదా. https://...',
    captionLabel: 'క్యాప్షన్ (ఐచ్ఛికం)',
    captionPlaceholder: 'ఉదా. విద్యార్థి పరీక్షలో ఉత్తీర్ణత సాధించడం',
    adding: 'జోడిస్తోంది...',
    confirmDeleteImage: 'మీరు ఖచ్చితంగా ఈ చిత్రాన్ని తొలగించాలనుకుంటున్నారా?'
  }
}

export default function ContentManagementPage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [activeTab, setActiveTab] = useState<'COURSES' | 'OFFERS' | 'GALLERY'>('COURSES')
  const [courses, setCourses] = useState<Course[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [newImage, setNewImage] = useState({ imageKey: '', caption: '' })
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const { startUpload } = useUploadThing('galleryImage', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url
      if (url) {
        setUploadedImageUrl(url)
        setNewImage(prev => ({ ...prev, imageKey: url }))
      }
      setIsUploadingImage(false)
    },
    onUploadError: (err) => {
      console.error('Upload error:', err)
      setIsUploadingImage(false)
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [courseRes, offerRes, galleryRes] = await Promise.all([
        fetch('/api/admin/courses'),
        fetch('/api/admin/offers'),
        fetch('/api/admin/gallery')
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
    } catch (err) {
      console.error('Failed to fetch content data', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse)
      })
      if (res.ok) {
        await fetchData()
        setEditingCourse(null)
        toast.success('Course updated successfully!')
      } else {
        toast.error('Failed to update course. Ensure the API supports PUT requests.')
      }
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage.imageKey) return
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
        setUploadedImageUrl(null)
      }
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    setUploadedImageUrl(null)
    await startUpload([file])
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm(t.confirmDeleteImage)) return
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
        <span className="text-xs font-mono tracking-widest text-primary uppercase">{t.dashboard}</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 tracking-tight font-display mt-1">
          {t.title}
        </h1>
        <p className="text-sm text-text-2 mt-2">{t.desc}</p>
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
          <Book className="w-4 h-4" /> {t.tabCourses}
        </button>
        <button
          onClick={() => setActiveTab('OFFERS')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'OFFERS' 
              ? 'bg-accent text-void shadow-lg shadow-accent/20' 
              : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <Tag className="w-4 h-4" /> {t.tabOffers}
        </button>
        <button
          onClick={() => setActiveTab('GALLERY')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
            activeTab === 'GALLERY' 
              ? 'bg-success text-void shadow-lg shadow-success/20' 
              : 'bg-surface border border-border text-text-3 hover:text-text-1'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> {t.tabGallery}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-3">
          <Activity className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p className="font-mono text-xs uppercase tracking-widest">{t.syncing}</p>
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
                  <span className="text-sm font-mono tracking-wide">{t.coursesAlert}</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary/20 border border-border hover:border-primary/40 rounded-xl text-xs font-bold text-text-1 transition-all">
                  <Plus className="w-4 h-4" /> {t.addCourse}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                  <div key={course.id} className="bg-surface border border-border p-6 rounded-3xl flex flex-col relative group transition-all hover:border-primary/50">
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingCourse({...course})} className="p-1.5 bg-void/80 hover:bg-white/10 rounded-lg text-text-2 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 bg-void/80 hover:bg-danger/20 hover:text-danger rounded-lg text-text-2 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary">{course.category}</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-extrabold uppercase tracking-wider">
                        {course.tag?.[activeLang] || course.tag?.EN || (typeof course.tag === 'string' ? course.tag : '')}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-1 leading-tight">{course.title?.[activeLang] || course.title?.EN || course.title}</h3>
                    <p className="text-sm text-text-2 mt-3 mb-6 line-clamp-3">{course.desc?.[activeLang] || course.desc?.EN || course.desc}</p>
                    
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-lg font-bold text-text-1 font-mono">₹{course.price.toLocaleString('en-IN')}</span>
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${course.active ? 'bg-success/20 text-success' : 'bg-void text-text-3 border border-border'}`}>
                        {course.active ? t.active : t.draft}
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
                  <span className="text-sm font-mono tracking-wide">{t.offersAlert}</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-accent/20 border border-border hover:border-accent/40 rounded-xl text-xs font-bold text-text-1 transition-all">
                  <Plus className="w-4 h-4" /> {t.createOffer}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer: any) => (
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
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-3">{t.promoCode}</span>
                        <h4 className="text-lg font-mono font-bold text-text-1 tracking-widest">{offer.promoCode}</h4>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-bold text-text-1 mb-2">{offer.title?.[activeLang] || offer.title?.EN || offer.title}</h3>
                    <p className="text-sm text-text-2 mb-6 line-clamp-2">{offer.desc?.[activeLang] || offer.desc?.EN || offer.desc}</p>
                    
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-2xl font-bold text-accent font-display">{offer.discountPercent}% {t.off}</span>
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${offer.active ? 'bg-success/20 text-success' : 'bg-void text-text-3 border border-border'}`}>
                        {offer.active ? t.active : t.expired}
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
                  <span className="text-sm font-mono tracking-wide">{t.galleryAlert}</span>
                </div>
                <button 
                  onClick={() => setShowGalleryModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-success/20 border border-border hover:border-success/40 rounded-xl text-xs font-bold text-text-1 transition-all"
                >
                  <Plus className="w-4 h-4" /> {t.addImage}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.map((img) => (
                  <div key={img.id} className="bg-surface border border-border p-4 rounded-3xl flex flex-col relative group transition-all hover:border-success/50">
                    <div className="aspect-square bg-void border border-border rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                      {img.imageKey.startsWith('data:image') || img.imageKey.startsWith('http') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.imageKey} alt={img.caption} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-text-3 opacity-30" />
                      )}
                    </div>
                    
                    <h3 className="text-sm font-display font-bold text-text-1 mb-2 line-clamp-2 min-h-[40px]">{img.caption || t.noCaption}</h3>
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
        </AnimatePresence>
      )}

      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowGalleryModal(false); setUploadedImageUrl(null); setNewImage({ imageKey: '', caption: '' }) }}>
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center bg-void/50">
              <h3 className="font-bold text-lg text-white">{t.addGalleryImage}</h3>
            </div>
            <form onSubmit={handleUploadGallery} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">{t.imageUrlKey}</label>
                <label className={`flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl cursor-pointer border-2 border-dashed transition-all ${
                  isUploadingImage
                    ? 'border-success bg-success/10 cursor-wait'
                    : uploadedImageUrl
                    ? 'border-success bg-success/5'
                    : 'border-border bg-void hover:border-success/50'
                }`}>
                  {isUploadingImage ? (
                    <><Loader2 className="w-5 h-5 animate-spin text-success" /><span className="text-sm text-success font-semibold">Uploading...</span></>
                  ) : uploadedImageUrl ? (
                    <><ImageIcon className="w-5 h-5 text-success" /><span className="text-sm text-success font-semibold">Image uploaded! ✓</span></>
                  ) : (
                    <><Upload className="w-5 h-5 text-text-3" /><span className="text-sm text-text-2">Click to upload image</span></>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploadingImage} />
                </label>
                {uploadedImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uploadedImageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl mt-1" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">{t.captionLabel}</label>
                <input type="text" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-success outline-none text-white w-full" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} placeholder={t.captionPlaceholder} />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={submitting || isUploadingImage || !uploadedImageUrl} className="w-full py-3 bg-success text-void font-bold rounded-xl hover:bg-success/90 transition-colors disabled:opacity-50">
                  {submitting ? t.adding : isUploadingImage ? 'Uploading...' : !uploadedImageUrl ? 'Upload an image first' : t.addImage}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingCourse(null)}>
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center bg-void/50">
              <h3 className="font-bold text-lg text-white">✏️ Edit Course</h3>
              <button type="button" onClick={() => setEditingCourse(null)} className="text-text-3 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdateCourse} className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <p className="text-xs text-text-3 font-mono">Fields marked * are shown on the website</p>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Title (English) *</label>
                <input required type="text" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full"
                  value={editingCourse.title?.EN || ''}
                  onChange={e => setEditingCourse({...editingCourse, title: {...editingCourse.title, EN: e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Title (Hindi)</label>
                <input type="text" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full"
                  value={editingCourse.title?.HI || ''}
                  onChange={e => setEditingCourse({...editingCourse, title: {...editingCourse.title, HI: e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Title (Telugu)</label>
                <input type="text" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full"
                  value={editingCourse.title?.TE || ''}
                  onChange={e => setEditingCourse({...editingCourse, title: {...editingCourse.title, TE: e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Description (English) *</label>
                <textarea rows={3} className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full resize-none"
                  value={editingCourse.desc?.EN || ''}
                  onChange={e => setEditingCourse({...editingCourse, desc: {...editingCourse.desc, EN: e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Description (Hindi)</label>
                <textarea rows={2} className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full resize-none"
                  value={editingCourse.desc?.HI || ''}
                  onChange={e => setEditingCourse({...editingCourse, desc: {...editingCourse.desc, HI: e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Description (Telugu)</label>
                <textarea rows={2} className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full resize-none"
                  value={editingCourse.desc?.TE || ''}
                  onChange={e => setEditingCourse({...editingCourse, desc: {...editingCourse.desc, TE: e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Duration Tag * — e.g. "21 Days"</label>
                <input type="text" placeholder="e.g. 21 Days" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full"
                  value={editingCourse.tag?.EN || ''}
                  onChange={e => setEditingCourse({...editingCourse, tag: {...editingCourse.tag, EN: e.target.value, HI: editingCourse.tag?.HI || e.target.value, TE: editingCourse.tag?.TE || e.target.value}})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Category *</label>
                <select className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full"
                  value={editingCourse.category}
                  onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}>
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="RTO_FAST_TRACK">RTO FAST TRACK</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-3 uppercase tracking-wider">Price (₹) *</label>
                <input required type="number" className="bg-void border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white w-full"
                  value={editingCourse.price}
                  onChange={e => setEditingCourse({...editingCourse, price: parseInt(e.target.value) || 0})} />
              </div>
              <div className="flex items-center gap-3 bg-void/50 border border-border rounded-xl p-3">
                <input type="checkbox" id="activeCourse" checked={editingCourse.active} onChange={e => setEditingCourse({...editingCourse, active: e.target.checked})} className="w-4 h-4 rounded border-border accent-primary" />
                <label htmlFor="activeCourse" className="text-sm text-white font-medium">Course is Active &amp; Visible on website</label>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-void font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

