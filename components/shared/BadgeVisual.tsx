"use client"

import React, { useRef } from 'react'
import { CheckCircle2, Award } from 'lucide-react'

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
  logoUrl = null,
  academyName = 'Sri Guru Driving Academy',
  studentName = 'Active Cadet',
  unlockedAt,
  size = 'md',
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Normalize rarity case
  const normRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase() as 'Common' | 'Rare' | 'Legendary'

  // Dimensions based on size prop
  const dimensions = {
    sm: { wreath: 'w-24 h-24', shield: 'w-16 h-16', ribbon: 'text-[8px] px-2 py-0.5 -bottom-0.5', icon: 'w-7 h-7' },
    md: { wreath: 'w-36 h-36', shield: 'w-24 h-24', ribbon: 'text-[10px] px-3.5 py-1 -bottom-1', icon: 'w-10 h-10' },
    lg: { wreath: 'w-44 h-44', shield: 'w-30 h-30', ribbon: 'text-[12px] px-5 py-1.5 -bottom-2', icon: 'w-14 h-14' }
  }[size]

  // Rarity Color Tokens (Stitch definitions)
  const themeColors = {
    Common: {
      accent: '#b45309', // Copper
      accentMuted: 'rgba(180, 83, 9, 0.3)',
      bgAccent: 'bg-amber-700/10 border-amber-700/30 text-amber-500',
      glow: 'shadow-[0_0_15px_rgba(180,83,9,0.15)]',
      gradientId: 'bronzeGradient',
      stops: { start: '#b45309', middle: '#78350f', end: '#451a03' }
    },
    Rare: {
      accent: '#2563eb', // Electric Blue / Silver
      accentMuted: 'rgba(37, 99, 235, 0.3)',
      bgAccent: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      glow: 'shadow-[0_0_15px_rgba(37,99,235,0.2)]',
      gradientId: 'silverGradient',
      stops: { start: '#e2e8f0', middle: '#94a3b8', end: '#475569' }
    },
    Legendary: {
      accent: '#f59e0b', // Gold / Amber
      accentMuted: 'rgba(245, 158, 11, 0.3)',
      bgAccent: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      gradientId: 'goldGradient',
      stops: { start: '#FFD700', middle: '#F59E0B', end: '#B45309' }
    }
  }[normRarity] || {
    accent: '#b45309',
    accentMuted: 'rgba(180, 83, 9, 0.3)',
    bgAccent: 'bg-amber-700/10 border-amber-700/30 text-amber-500',
    glow: '',
    gradientId: 'bronzeGradient',
    stops: { start: '#b45309', middle: '#78350f', end: '#451a03' }
  }

  // Generate unique credential code
  const getCredentialId = () => {
    if (!isEarned) return 'SG-LOCKED-XXXX'
    const input = `${type}-${studentName}`
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i)
      hash |= 0 // 32bit int
    }
    const serial = Math.abs(hash).toString(16).toUpperCase().slice(0, 8)
    const prefix = type.split('_').map(w => w[0]).join('')
    return `SG-${prefix}-${serial}`
  }

  const credentialId = getCredentialId()
  const dateStr = unlockedAt ? new Date(unlockedAt).toLocaleDateString() : 'N/A'

  // Predefined Custom High-Fidelity SVGs for each Badge Type
  const renderBadgeIcon = () => {
    const colorClass = 'text-white'

    switch (type) {
      case 'PARKING_EXPERT':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" strokeDasharray="3 2" />
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
            <path d="M12 7v10M7 12h10" strokeWidth="1.5" />
            <path d="M4 17a8 8 0 0 1 1-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 7a8 8 0 0 1 1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )

      case 'SIGNAL_MASTER':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="8" y="3" width="8" height="18" rx="3" strokeWidth="2" />
            <circle cx="12" cy="7" r="2" fill="currentColor" className="animate-pulse" />
            <circle cx="12" cy="12" r="2" fill={isEarned ? 'currentColor' : 'transparent'} opacity={0.6} />
            <circle cx="12" cy="17" r="2" fill={isEarned ? 'currentColor' : 'transparent'} opacity={0.3} />
          </svg>
        )

      case 'ELITE_DRIVER':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" strokeWidth="2" />
            <circle cx="10" cy="12" r="2" fill="currentColor" />
            <path d="M10 6v12M4 12h12M6 8l8 8M6 16l8-8" />
            <path d="M16 8h4c1 0 2 1 2 2v1c0 1-1 2-2 2h-4V8z" fill={isEarned ? 'currentColor' : 'none'} opacity={0.3} />
            <path d="M4 8H0c-1 0-2 1-2 2v1c0 1 1 2 2 2h4V8z" fill={isEarned ? 'currentColor' : 'none'} opacity={0.3} />
            <path d="M10 1l1.5 2.5h2.5l-2 1.5 1 2.5-3-2-3 2 1-2.5-2-1.5h2.5z" fill="currentColor" />
          </svg>
        )

      case 'PERFECT_ATTENDANCE':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
            <path d="M9 15l2 2 4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )

      case 'ROAD_PRO':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="7" r="3" strokeWidth="1" fill={isEarned ? 'currentColor' : 'none'} opacity={0.2} />
            <path d="M5 21l5-12h4l5 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 9v3M12 15v3" strokeDasharray="2 2" strokeWidth="2" />
            <path d="M2 19h20" strokeWidth="1" opacity="0.4" />
          </svg>
        )

      case 'CONSISTENT_LEARNER':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C12 2 7 6.5 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 6.5 12 2 12 2Z" strokeWidth="2" fill={isEarned ? 'currentColor' : 'none'} fillOpacity={0.2} />
            <path d="M12 7C12 7 9.5 9.5 9.5 12.5C9.5 14.2 10.6 15.5 12 15.5C13.4 15.5 14.5 14.2 14.5 12.5C14.5 9.5 12 7 12 7Z" fill={isEarned ? 'currentColor' : 'none'} fillOpacity={0.5} />
          </svg>
        )

      case 'SAFETY_CHAMPION':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" fill={isEarned ? 'currentColor' : 'none'} fillOpacity={0.1} />
            <path d="M9 11l2 2 4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )

      case 'QUIZ_MASTER':
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9.5 13C9.5 11 11 9.5 12 9.5s2.5 1.5 2.5 3.5c0 1.5-1 2-2.5 2.5" strokeWidth="2" />
            <circle cx="9.5" cy="13" r="1.5" fill="currentColor" />
            <circle cx="14.5" cy="13" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
            <path d="M12 5.5a6.5 6.5 0 0 1 6.5 6.5c0 2.5-1.5 4.5-3.5 5.5v1.5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.5c-2-1-3.5-3-3.5-5.5a6.5 6.5 0 0 1 6.5-6.5z" strokeWidth="1.5" />
          </svg>
        )

      case 'COURSE_GRADUATE':
        if (isEarned && logoUrl) {
          return (
            <div className="relative flex items-center justify-center rounded-full overflow-hidden w-12 h-12 md:w-16 md:h-16 bg-white border border-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img src={logoUrl} alt="Academy Logo" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          )
        }

        return (
          <div className="flex flex-col items-center justify-center text-center">
            <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeWidth="2" />
              <path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" />
              <path d="M12 11.5v4" strokeWidth="2" />
              <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
            </svg>
            {isEarned && (
              <span className="text-[6px] md:text-[7px] text-yellow-400 font-extrabold uppercase tracking-tighter mt-1 block max-w-[50px] overflow-hidden truncate">
                {academyName.split(' ')[0]}
              </span>
            )}
          </div>
        )

      default:
        return (
          <svg className={`${dimensions.icon} ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" fill={isEarned ? 'currentColor' : 'none'} fillOpacity={0.2} />
          </svg>
        )
    }
  }

  // Core Shield and Laurel Graphic
  const renderShieldGraphic = () => (
    <div className={`relative flex items-center justify-center select-none ${dimensions.wreath} ${themeColors.glow} ${!isEarned ? 'grayscale opacity-60' : ''}`}>
      
      {/* Dynamic Glow backdrop */}
      {isEarned && (
        <div 
          className="absolute inset-0 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700 opacity-30"
          style={{ backgroundColor: themeColors.accent }}
        />
      )}

      {/* 1. Laurel Wreath of Honor */}
      <svg className={`absolute ${dimensions.wreath} transition-transform duration-500`} viewBox="0 0 100 100" fill="none">
        <path d="M50 160 Q 30 140, 30 100 Q 30 60, 50 40" stroke={`url(#${themeColors.gradientId})`} strokeWidth="2.5" />
        <path d="M150 160 Q 170 140, 170 100 Q 170 60, 150 40" stroke={`url(#${themeColors.gradientId})`} strokeWidth="2.5" />
        <defs>
          <linearGradient id={themeColors.gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: themeColors.stops.start, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: themeColors.stops.middle, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: themeColors.stops.end, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* 2. Outer Shield Geometry */}
      <div 
        className="rotate-45 border-2 rounded-[24px] shadow-xl flex items-center justify-center group-hover:rotate-[50deg] transition-all duration-500 overflow-hidden relative"
        style={{
          width: dimensions.shield.split(' ')[0].replace('w-', '') === '30' ? '7.5rem' : dimensions.shield.split(' ')[0].replace('w-', '') === '24' ? '6rem' : '4rem',
          height: dimensions.shield.split(' ')[0].replace('w-', '') === '30' ? '7.5rem' : dimensions.shield.split(' ')[0].replace('w-', '') === '24' ? '6rem' : '4rem',
          borderColor: isEarned ? themeColors.accent : 'rgba(255, 255, 255, 0.07)',
          background: isEarned 
            ? `linear-gradient(135deg, ${themeColors.stops.start}, ${themeColors.stops.middle}, ${themeColors.stops.end})`
            : 'rgba(13, 17, 23, 0.3)'
        }}
      >
        {/* Shimmer Shine Overlay */}
        {isEarned && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000" />
        )}

        {/* 3. Inner Contrast Core */}
        <div 
          className="w-[84%] h-[84%] rounded-[20px] border flex flex-col items-center justify-center bg-slate-950/95 -rotate-45 transition-colors duration-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
          style={{ borderColor: isEarned ? `${themeColors.accent}33` : 'rgba(255, 255, 255, 0.07)' }}
        >
          {renderBadgeIcon()}
          
          {/* Sonar circle ripple */}
          {isEarned && (
            <div 
              className="absolute -inset-4 border rounded-full animate-ping opacity-10 pointer-events-none"
              style={{ borderColor: themeColors.accent }}
            />
          )}
        </div>
      </div>

      {/* 5. Bottom Ribbon Sash */}
      <div 
        className={`absolute font-display font-extrabold tracking-widest uppercase rounded-md shadow-md border ${dimensions.ribbon} transition-all duration-300 z-10`}
        style={{
          background: isEarned 
            ? `linear-gradient(90deg, ${themeColors.stops.middle}, ${themeColors.stops.start}, ${themeColors.stops.middle})`
            : '#1e293b',
          borderColor: isEarned ? `${themeColors.accent}40` : 'rgba(255, 255, 255, 0.07)',
          color: isEarned ? '#0f172a' : '#64748b'
        }}
      >
        {normRarity}
      </div>

      {/* Locked Lock Icon Overlay */}
      {!isEarned && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-void/10 rounded-full">
          <div className="bg-slate-950/80 p-2 rounded-full border border-white/10 shadow-md transform translate-y-3">
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )

  // Size "sm" renders just the compact badge graphic
  if (size === 'sm') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {renderShieldGraphic()}
      </div>
    )
  }

  // Interactive 3D Perspective Rotation Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 18
    const rotateY = (centerX - x) / 18
    
    card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative border border-white/7 bg-[#07090F]/95 backdrop-blur-xl rounded-2xl flex flex-col items-center select-none overflow-hidden transition-transform duration-500 ease-out shadow-2xl group ${
        size === 'lg' ? 'w-full max-w-[420px] p-8' : 'w-full max-w-[340px] p-6'
      } ${className}`}
    >
      {/* Scanning Effect */}
      <div className="absolute inset-0 scanline-effect pointer-events-none opacity-40 z-0"></div>
      
      {/* Corner Data-Bits */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-white/10 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-white/10 pointer-events-none text-[7px] font-mono text-slate-500/40 flex flex-col items-end p-0.5">
        <span>COORD_{credentialId.slice(-3)}</span>
        <span>SECURE_LINK</span>
      </div>
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-white/10 pointer-events-none text-[7px] font-mono text-slate-500/40 flex flex-col justify-end p-0.5">
        <span>V_09.2</span>
      </div>
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-white/10 pointer-events-none"></div>

      {/* Top light reflections (Legendary/Gold only) */}
      {isEarned && normRarity === 'Legendary' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] pointer-events-none"></div>
      )}

      {/* 1. Header: Issuer Brand Title */}
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-3.5 mb-6 text-left relative z-10">
        <div className="flex items-center gap-1.5">
          {isEarned ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-slate-700" />
          )}
          <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isEarned ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isEarned ? 'VERIFIED BADGE' : 'LOCKED BADGE'}
          </span>
        </div>
        <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest">
          {academyName.split(' ')[0]} ACADEMY
        </span>
      </div>

      {/* 2. Central Metallic Shield Emblem */}
      <div className="my-2 relative z-10">
        {renderShieldGraphic()}
      </div>

      {/* 2.5 Badge Name Title */}
      <div className="text-center mt-5 mb-4 w-full relative z-10">
        <span 
          className="text-[9px] font-mono uppercase tracking-widest font-bold block mb-1"
          style={{ color: isEarned ? themeColors.accent : '#64748b' }}
        >
          {normRarity} CREDENTIAL
        </span>
        <h3 className={`text-xl font-extrabold font-display tracking-tight leading-tight ${isEarned ? 'text-slate-100' : 'text-slate-500'}`}>
          {BADGE_TITLES[type] || type.replace(/_/g, ' ')}
        </h3>
      </div>

      {/* 3. Recipient Verification Block */}
      <div className="w-full border-t border-white/5 pt-5 mt-2 text-left flex flex-col gap-3.5 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">RECIPIENT</span>
            <span className={`text-base font-extrabold font-display tracking-tight leading-tight ${isEarned ? 'text-slate-100' : 'text-slate-500'}`}>
              {isEarned ? studentName : 'LOCKED CADET'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">UNLOCKED</span>
            <span className={`text-sm font-semibold ${isEarned ? 'text-slate-200' : 'text-slate-500'}`}>
              {isEarned ? dateStr : 'PENDING'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 flex flex-col items-start gap-1">
          <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 font-semibold">SERIAL AUTHENTICATION</span>
          <span 
            className="text-xs font-mono font-bold tracking-wide"
            style={{ 
              color: isEarned ? themeColors.accent : '#64748b',
              textShadow: isEarned ? `0 0 10px ${themeColors.accent}33` : 'none'
            }}
          >
            {credentialId}
          </span>
        </div>

        {/* Security / Holo Stamp vector at the bottom right */}
        {isEarned && size === 'lg' && (
          <div className="absolute bottom-2 right-0 opacity-10 pointer-events-none transform translate-y-2">
            <Award className="w-16 h-16 text-yellow-400 stroke-[1]" />
          </div>
        )}
      </div>

      {/* Scanning lines CSS */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline-effect {
          background: linear-gradient(to bottom, transparent, rgba(37, 99, 235, 0.03), transparent);
          animation: scanline 6s linear infinite;
        }
      `}</style>

    </div>
  )
}
