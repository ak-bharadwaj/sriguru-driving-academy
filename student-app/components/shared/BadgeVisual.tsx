"use client"

import React, { useRef, useState, useId } from 'react'
import { CheckCircle2, Download, Share2, Copy, Check, ExternalLink, X } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { toast } from 'react-hot-toast'

const BADGE_TITLES: Record<string, string> = {
  PARKING_EXPERT: 'Parking Expert',
  SIGNAL_MASTER: 'Signal Master',
  ELITE_DRIVER: 'Elite Driver',
  PERFECT_ATTENDANCE: 'Perfect Attendance',
  ROAD_PRO: 'Road Pro',
  CONSISTENT_LEARNER: 'Consistent Learner',
  SAFETY_CHAMPION: 'Safety Champion',
  QUIZ_MASTER: 'Quiz Master',
  COURSE_GRADUATE: 'Course Graduate'
}

interface BadgeVisualProps {
  type: string
  rarity: 'Common' | 'Rare' | 'Legendary' | string
  isEarned: boolean
  logoUrl?: string | null
  academyName?: string
  studentName?: string
  unlockedAt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const BadgeVisual: React.FC<BadgeVisualProps> = ({
  type,
  rarity = 'Common',
  isEarned,
  academyName = 'Sri Guru Driving School',
  studentName = 'Alex Johnson',
  unlockedAt,
  size = 'md',
  className
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const { instagramUrl, facebookUrl, twitterUrl } = useSettingsStore()
  const uniqueId = useId()
  
  const normRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase() as 'Common' | 'Rare' | 'Legendary'

  const dimensions = {
    sm: { wreath: 'w-24 h-24' },
    md: { wreath: 'w-48 h-48' },
    lg: { wreath: 'w-64 h-64' }
  }[size] || { wreath: 'w-48 h-48' }

  // Generate unique credential code
  const getCredentialId = () => {
    if (!isEarned) return 'SG-LOCKED-XXXX'
    const input = `${type}-${studentName}`
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i)
      hash |= 0
    }
    const serial = Math.abs(hash).toString(16).toUpperCase().slice(0, 4)
    const prefix = type.split('_').map(w => w[0]).join('')
    return `${prefix}-${normRarity.substring(0, 2).toUpperCase()}-${serial}`
  }

  const badgeTitle = BADGE_TITLES[type] || type.replace(/_/g, ' ')
  const credentialId = getCredentialId()
  const dateStr = unlockedAt ? new Date(unlockedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }) : 'Nov 22, 2023'

  // Hexagonal Credential Badge Graphic (User's AWS-style custom SVG design)
  const renderHexagonBadge = () => {
    const idSuffix = uniqueId.replace(/:/g, '')
    const prefixName = 'SRI GURU'

    // Determine colors and styling depending on rarity
    let gradientStops = null
    let textColor = '#232f3e'
    let subTextColor = '#4a3e00'
    let dividerColor = 'rgba(35,47,62,0.2)'
    let tierText = 'GOLD'
    let strokeColor = '#ffd700'

    if (normRarity === 'Legendary') {
      // Gold theme
      gradientStops = (
        <>
          <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#b8860b', stopOpacity: 1 }} />
        </>
      )
      textColor = '#232f3e'
      subTextColor = '#4a3e00'
      dividerColor = 'rgba(35,47,62,0.2)'
      tierText = 'GOLD'
      strokeColor = '#ffd700'
    } else if (normRarity === 'Rare') {
      // Silver/Blue Steel theme (Bright metallic silver with high contrast dark text)
      gradientStops = (
        <>
          <stop offset="0%" style={{ stopColor: '#f1f5f9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#94a3b8', stopOpacity: 1 }} />
        </>
      )
      textColor = '#232f3e'
      subTextColor = '#334155'
      dividerColor = 'rgba(35,47,62,0.2)'
      tierText = 'SILVER'
      strokeColor = '#cbd5e1'
    } else {
      // Bronze/Common theme (Bright metallic copper with high contrast dark text)
      gradientStops = (
        <>
          <stop offset="0%" style={{ stopColor: '#ffedd5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#b45309', stopOpacity: 1 }} />
        </>
      )
      textColor = '#232f3e'
      subTextColor = '#7c2d12'
      dividerColor = 'rgba(35,47,62,0.2)'
      tierText = 'BRONZE'
      strokeColor = '#d97706'
    }

    return (
      <div className={`relative ${dimensions.wreath} flex items-center justify-center select-none`}>
        <svg 
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]" 
          viewBox="0 0 400 400" 
          width="400" 
          height="400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`badgeGrad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {gradientStops}
            </linearGradient>
          </defs>

          {/* Hexagon Shape with Gold/Silver/Bronze border */}
          <path 
            d="M200 20 L364.5 115 V305 L200 400 L35.5 305 V115 L200 20 Z" 
            fill={`url(#badgeGrad-${idSuffix})`} 
            stroke={strokeColor} 
            strokeWidth="6"
            strokeLinejoin="round"
            opacity={isEarned ? 1 : 0.7}
          />
          
          <g textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif">
            {/* Header caret wings */}
            <g transform="translate(200, 70)">
              <path d="M-25 0 L-15 -10 L0 5 L15 -10 L25 0" fill="none" stroke={textColor} strokeWidth="3" strokeLinecap="round"/>
              <text y="22" fontSize="14" fontWeight="900" fill={textColor} letterSpacing="2">{prefixName}</text>
              <text y="38" fontSize="12" fontWeight="bold" fill={textColor} letterSpacing="1">CERTIFIED</text>
            </g>

            {/* Lock symbol indicator if locked */}
            {!isEarned && (
              <g transform="translate(200, 132) scale(0.95)">
                <path d="M -8 -4 V -12 A 8 8 0 0 1 8 -12 V -4" fill="none" stroke={textColor} strokeWidth="2.8" strokeLinecap="round" />
                <rect x="-13" y="-5" width="26" height="20" rx="3.5" fill={textColor} stroke={textColor} strokeWidth="1" />
                <circle cx="0" cy="3" r="1.5" fill={strokeColor} />
              </g>
            )}

            {/* Main Title */}
            <text x="200" y="165" fontSize="24" fontWeight="900" fill={textColor} letterSpacing="-0.5">
              {badgeTitle}
            </text>
            
            {/* Recipient Name */}
            <text x="200" y="200" fontSize="18" fontWeight="600" fill={textColor}>
              {isEarned ? studentName : 'Locked Cadet'}
            </text>
            
            {/* Academy Name */}
            <text x="200" y="222" fontSize="13" fontWeight="400" fill={subTextColor}>
              {academyName}
            </text>

            {/* Divider */}
            <line x1="130" y1="245" x2="270" y2="245" stroke={dividerColor} strokeWidth="1"/>

            {/* Tier */}
            <text x="200" y="275" fill={textColor} fontSize="11" fontWeight="900" letterSpacing="4">
              {tierText}
            </text>
            
            {/* Metadata (Date & Badge ID) */}
            <g transform="translate(0, 305)">
              <text x="140" y="0" fill={subTextColor} fontSize="9" fontWeight="bold" letterSpacing="0.5">DATE ISSUED</text>
              <text x="140" y="18" fill={textColor} fontSize="12" fontWeight="bold">{isEarned ? dateStr : 'PENDING'}</text>
              
              <text x="260" y="0" fill={subTextColor} fontSize="9" fontWeight="bold" letterSpacing="0.5">BADGE ID</text>
              <text x="260" y="18" fill={textColor} fontSize="12" fontWeight="bold">{credentialId}</text>
            </g>
          </g>
        </svg>
      </div>
    )
  }

  if (size === 'sm') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className || ''}`}>
        {renderHexagonBadge()}
      </div>
    )
  }

  const handleDownload = async () => {
    try {
      const card = cardRef.current
      if (!card) return
      const svgEl = card.querySelector('svg')
      if (!svgEl) return

      const serializer = new XMLSerializer()
      let svgString = serializer.serializeToString(svgEl)
      
      if (!svgString.includes('http://www.w3.org/2000/svg')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const URL = window.URL || window.webkitURL || window
      const blobURL = URL.createObjectURL(svgBlob)

      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const context = canvas.getContext('2d')
        if (context) {
          context.clearRect(0, 0, 512, 512)
          context.drawImage(image, 0, 0, 512, 512)
          
          const pngDataUrl = canvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.href = pngDataUrl
          downloadLink.download = `${type.toLowerCase()}_badge.png`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
          toast.success('Badge emblem downloaded as PNG!')
        }
        URL.revokeObjectURL(blobURL)
      }
      image.src = blobURL
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download badge image')
    }
  }

  const handleShare = async () => {
    const shareTitle = `Sri Guru Driving School - Verified Badge`
    const shareText = `I just earned the ${BADGE_TITLES[type] || type.replace(/_/g, ' ')} digital credential at Sri Guru Driving School! Serial: ${credentialId} #driving #badges #gamified`
    
    if (navigator.share) {
      try {
        const card = cardRef.current
        if (card) {
          const svgEl = card.querySelector('svg')
          if (svgEl) {
            const serializer = new XMLSerializer()
            let svgString = serializer.serializeToString(svgEl)
            if (!svgString.includes('http://www.w3.org/2000/svg')) {
              svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
            }
            
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
            const canvas = document.createElement('canvas')
            canvas.width = 512
            canvas.height = 512
            const ctx = canvas.getContext('2d')
            const image = new Image()
            
            image.onload = async () => {
              if (ctx) {
                ctx.clearRect(0, 0, 512, 512)
                ctx.drawImage(image, 0, 0, 512, 512)
                canvas.toBlob(async (blob) => {
                  if (blob) {
                    const file = new File([blob], 'badge_credential.png', { type: 'image/png' })
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                      await navigator.share({
                        files: [file],
                        title: shareTitle,
                        text: shareText
                      })
                      toast.success('Shared successfully!')
                      return
                    }
                  }
                  setShowShareMenu(true)
                }, 'image/png')
              }
            }
            image.src = window.URL.createObjectURL(svgBlob)
            return
          }
        }
      } catch (err) {
        console.warn('Native share failed, falling back to dialog:', err)
      }
    }
    
    setShowShareMenu(true)
  }

  if (size === 'md') {
    return (
      <div 
        ref={cardRef}
        className={`relative border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] rounded-2xl flex flex-col items-center select-none overflow-hidden transition-all duration-300 p-6 w-full max-w-[320px] shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:scale-[1.02] ${className || ''}`}
      >
        <div className="my-2">
          {renderHexagonBadge()}
        </div>
        
        <div className="text-center mt-3 w-full">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold block mb-1 text-slate-500 dark:text-slate-400">
            {normRarity.toUpperCase()} CREDENTIAL
          </span>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
            {badgeTitle}
          </h3>
          
          <div className="flex items-center justify-center mt-3">
            {isEarned ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
                LOCKED
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={cardRef}
      className={`relative border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] rounded-3xl flex flex-col md:flex-row items-center md:items-start select-none overflow-hidden transition-all duration-300 p-8 w-full max-w-[640px] gap-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${className || ''}`}
    >
      {/* Left Column: Hexagon Badge */}
      <div className="flex flex-col items-center justify-center shrink-0">
        {renderHexagonBadge()}
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold mt-4 px-3.5 py-1 rounded-full border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          {normRarity.toUpperCase()}
        </span>
      </div>

      {/* Right Column: Credential Details */}
      <div className="flex-1 flex flex-col text-center md:text-left w-full h-full justify-between">
        <div>
          {/* Verified Status & Issuer */}
          <div className="flex items-center justify-between w-full border-b border-slate-200/80 dark:border-slate-800/80 pb-3 mb-5">
            <div className="flex items-center gap-1.5">
              {isEarned ? (
                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-extrabold tracking-wider">
                  VERIFIED CREDENTIAL
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-[9px] font-mono text-slate-600 dark:text-slate-400 font-extrabold tracking-wider">
                  LOCKED CREDENTIAL
                </div>
              )}
            </div>
            <span className="hidden md:inline text-[9px] font-mono text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest">
              {academyName.split(' ')[0].toUpperCase()} ACADEMY
            </span>
          </div>

          {/* Badge Title */}
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {badgeTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            This digital credential verifies the student has demonstrated driving skills in the {badgeTitle} curriculum category at {academyName}.
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 pt-5 text-left">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block mb-0.5">RECIPIENT</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isEarned ? studentName : 'LOCKED CADET'}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block mb-0.5">DATE EARNED</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isEarned ? dateStr : 'PENDING'}
              </span>
            </div>
          </div>

          {/* Authentication Code */}
          <div className="mt-5 bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-3.5 flex flex-col gap-1 relative overflow-hidden text-left">
            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">AUTHENTICATION ID</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
              {credentialId}
            </span>
            {isEarned && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded-full text-[8px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest">
                VALID
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {isEarned && (
          <div className="card-action-buttons w-full grid grid-cols-2 gap-3 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 pt-5">
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        )}
      </div>

      {/* Desktop Fallback Share Overlay */}
      {showShareMenu && (
        <div className="share-overlay-panel absolute inset-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md rounded-3xl p-6 z-30 flex flex-col justify-between text-left border border-slate-200 dark:border-slate-800 shadow-xl">
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Share Credential</span>
              <button 
                onClick={() => setShowShareMenu(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Social Share Link</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`I earned the ${badgeTitle} digital badge at Sri Guru Driving School! Serial: ${credentialId}`}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 flex-1 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`I earned the ${badgeTitle} digital badge at Sri Guru Driving School! Serial: ${credentialId}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    toast.success('Text copied to clipboard!');
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-2">Publish To Handles</span>
              <div className="grid grid-cols-3 gap-2">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&quote=${encodeURIComponent(`I earned the ${badgeTitle} digital badge at Sri Guru Driving School! Serial: ${credentialId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all gap-1.5"
                >
                  <Facebook className="w-5 h-5 text-blue-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Post FB</span>
                </a>

                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I earned the ${badgeTitle} digital badge at Sri Guru Driving School! Serial: ${credentialId} #driving #gamification`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all gap-1.5"
                >
                  <Twitter className="w-5 h-5 text-sky-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Tweet</span>
                </a>

                <button 
                  onClick={() => {
                    handleDownload();
                    toast.success('Badge downloaded! You can now upload it directly to Instagram stories or feed.');
                  }}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all gap-1.5"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Insta</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4 flex flex-col gap-2">
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Visit Academy Profiles</span>
            <div className="flex gap-4">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  <Facebook className="w-3.5 h-3.5 text-blue-500" /> Facebook <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  <Twitter className="w-3.5 h-3.5 text-sky-500" /> Twitter <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Instagram: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Facebook: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const Twitter: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
)
