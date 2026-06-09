"use client"

import React, { useRef } from 'react'
import { CheckCircle2, Award } from 'lucide-react'
import Image from 'next/image'

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


type ThemeColorConfig = {
  accent: string;
  accentMuted: string;
  bgAccent: string;
  glow: string;
  gradientId: string;
  stops: { start: string; middle: string; end: string };
  fabric: string;
  stitch: string;
  bgFabric: string;
};

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

  // Rarity Color Tokens (Stitch definitions)
const themeColors: Record<string, ThemeColorConfig> = {
    Common: {
      accent: '#f97316', // Bright Orange (Safety)
      accentMuted: 'rgba(249, 115, 22, 0.3)',
      bgAccent: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]',
      gradientId: 'commonGradient',
      stops: { start: '#ea580c', middle: '#9a3412', end: '#431407' },
      fabric: '#1c1917',
      stitch: '#f97316',
      bgFabric: '#292524'
    },
    Rare: {
      accent: '#3b82f6', // Bright Blue
      accentMuted: 'rgba(59, 130, 246, 0.3)',
      bgAccent: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.25)]',
      gradientId: 'rareGradient',
      stops: { start: '#2563eb', middle: '#1e40af', end: '#172554' },
      fabric: '#1e1b4b',
      stitch: '#60a5fa',
      bgFabric: '#0f172a'
    },
    Legendary: {
      accent: '#eab308', // Brilliant Gold
      accentMuted: 'rgba(234, 179, 8, 0.3)',
      bgAccent: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
      gradientId: 'legendaryGradient',
      stops: { start: '#ca8a04', middle: '#eab308', end: '#854d0e' },
      fabric: '#422006',
      stitch: '#eab308',
      bgFabric: '#422006'
    }
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
  className
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

  const currentTheme = themeColors[normRarity] || themeColors['Common'];
  if (!currentTheme) { console.warn('Missing theme for rarity:', normRarity); }

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
    // Shared stitch visual properties
    const stitchStroke = isEarned ? currentTheme.stitch : '#475569';
    const fillFabric = isEarned ? currentTheme.fabric : '#1e293b';
    const bgFabricColor = isEarned ? currentTheme.bgFabric : '#0f172a';
    const strokeProps = {
      stroke: stitchStroke,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    };

    switch (type) {
      case 'PARKING_EXPERT':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} stroke="#000" strokeWidth="1" />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <rect x="12" y="10" width="16" height="20" rx="3" fill={fillFabric} />
            <path d="M16 16h6c2 0 3 1 3 3s-1 3-3 3h-6v-6z" strokeWidth="2" fill="none" {...strokeProps} />
            <path d="M16 26v-4" strokeWidth="2" fill="none" {...strokeProps} />
            {/* Corner stitches */}
            <path d="M13 11h2M25 11h2M13 29h2M25 29h2" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
          </svg>
        )

      case 'SIGNAL_MASTER':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <rect x="14" y="8" width="12" height="24" rx="4" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <circle cx="20" cy="13" r="2.5" fill={isEarned ? '#ef4444' : '#334155'} />
            <circle cx="20" cy="20" r="2.5" fill={isEarned ? '#eab308' : '#334155'} />
            <circle cx="20" cy="27" r="2.5" fill={isEarned ? '#22c55e' : '#334155'} />
            {/* Embroidery threads */}
            <path d="M12 13h2M26 13h2M12 20h2M26 20h2M12 27h2M26 27h2" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
          </svg>
        )

      case 'ELITE_DRIVER':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <circle cx="20" cy="20" r="10" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <path d="M20 10v20M10 20h20" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} opacity={0.5} />
            <circle cx="20" cy="20" r="3" fill={stitchStroke} />
            <path d="M13 20l3-5h8l3 5M15 25l5-3 5 3" strokeWidth="2" fill="none" {...strokeProps} />
          </svg>
        )

      case 'PERFECT_ATTENDANCE':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <rect x="10" y="12" width="20" height="18" rx="2" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <path d="M14 10v4M26 10v4" strokeWidth="2" fill="none" {...strokeProps} />
            <path d="M10 18h20" strokeWidth="2" fill="none" {...strokeProps} />
            <path d="M16 24l3 3 6-6" stroke={isEarned ? '#22c55e' : stitchStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M12 14h2M26 14h2" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
          </svg>
        )

      case 'ROAD_PRO':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <path d="M10 30L16 10h8l6 20" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <path d="M20 14v4M20 22v4" stroke={stitchStroke} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
            <path d="M8 30h24" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
          </svg>
        )

      case 'CONSISTENT_LEARNER':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <path d="M20 10s-6 5-6 10c0 4 3 6 6 6s6-2 6-6c0-5-6-10-6-10z" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <path d="M20 15s-3 3-3 5c0 2 1.5 3 3 3s3-1 3-3c0-2-3-5-3-5z" fill={stitchStroke} opacity={0.6} />
            {/* Sparkles */}
            <path d="M12 10l2 1 1 2 1-2 2-1-2-1-1-2-1 2-2 1z" fill={stitchStroke} />
            <path d="M28 14l1.5 1 .5 1.5.5-1.5 1.5-1-1.5-1-.5-1.5-.5 1.5-1.5 1z" fill={stitchStroke} />
          </svg>
        )

      case 'SAFETY_CHAMPION':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <path d="M20 30s-8-4-8-12V10l8-3 8 3v8c0 8-8 12-8 12z" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <path d="M16 19l3 3 6-6" stroke={isEarned ? '#22c55e' : stitchStroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Cross stitches on shield */}
            <path d="M12 12l2 2M14 12l-2 2M26 12l2 2M28 12l-2 2" stroke={stitchStroke} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )

      case 'QUIZ_MASTER':
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <path d="M20 10a6 6 0 0 0-6 6c0 4 4 6 4 9v2h4v-2c0-3 4-5 4-9a6 6 0 0 0-6-6z" strokeWidth="2" fill={fillFabric} {...strokeProps} />
            <path d="M18 30h4M19 33h2" strokeWidth="2" fill="none" {...strokeProps} />
            <circle cx="20" cy="22" r="1" fill={stitchStroke} />
            <path d="M12 16h3M25 16h3M15 10l2 2M23 10l-2 2" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
          </svg>
        )

      case 'COURSE_GRADUATE':
        if (isEarned && logoUrl) {
          return (
            <div className="relative flex items-center justify-center rounded-full overflow-hidden w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-dashed p-1 shadow-lg group-hover:scale-105 transition-transform duration-300" style={{ borderColor: currentTheme.stitch }}>
              <Image src={logoUrl} alt="Academy Logo" width={64} height={64} className="w-full h-full object-contain rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          )
        }

        return (
          <div className="flex flex-col items-center justify-center text-center">
            <svg className={dimensions.icon} viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
              <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
              <path d="M32 16v8M8 16l12-6 12 6-12 6-12-6z" strokeWidth="2" fill={fillFabric} {...strokeProps} />
              <path d="M12 18v6c0 3 4 5 8 5s8-2 8-5v-6" strokeWidth="2" fill="none" {...strokeProps} />
              <path d="M20 18v6" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
              <circle cx="20" cy="26" r="2" fill={stitchStroke} />
            </svg>
            {isEarned && (
              <span className="text-[6px] md:text-[7px] text-yellow-400 font-extrabold uppercase tracking-tighter mt-1 block max-w-[50px] overflow-hidden truncate">
                {academyName?.split(' ')[0]}
              </span>
            )}
          </div>
        )

      default:
        return (
          <svg className={dimensions.icon} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill={bgFabricColor} />
            <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="3 2" fill="none" {...strokeProps} />
            <polygon points="20 10 24 18 32 19 26 25 28 32 20 28 12 32 14 25 8 19 16 18 20 10" strokeWidth="2" fill={fillFabric} {...strokeProps} />
          </svg>
        )
    }
  }

  // Core Shield and Laurel Graphic
  const renderShieldGraphic = () => (
    <div className={`relative flex items-center justify-center select-none ${dimensions.wreath} ${currentTheme.glow} ${!isEarned ? 'grayscale opacity-60' : ''}`}>
      
      {/* Dynamic Glow backdrop */}
      {isEarned && (
        <div 
          className="absolute inset-0 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700 opacity-30"
          style={{ backgroundColor: currentTheme.accent }}
        />
      )}

      {/* 1. Laurel Wreath of Honor */}
      <svg className={`absolute ${dimensions.wreath} transition-transform duration-500`} viewBox="0 0 200 200" fill="none">
        <path d="M 65 170 Q 15 140, 15 100 Q 15 60, 65 30" stroke={`url(#${currentTheme.gradientId})`} strokeWidth="3.5" strokeDasharray="6 8" strokeLinecap="round" />
        <path d="M 135 170 Q 185 140, 185 100 Q 185 60, 135 30" stroke={`url(#${currentTheme.gradientId})`} strokeWidth="3.5" strokeDasharray="6 8" strokeLinecap="round" />
        <defs>
          <linearGradient id={currentTheme.gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: currentTheme.stops.start, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: currentTheme.stops.middle, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.stops.end, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* 2. Outer Shield Geometry */}
      <div 
        className="rotate-45 border-2 rounded-[24px] shadow-xl flex items-center justify-center group-hover:rotate-[50deg] transition-all duration-500 overflow-hidden relative"
        style={{
          width: dimensions.shield.split(' ')[0].replace('w-', '') === '30' ? '7.5rem' : dimensions.shield.split(' ')[0].replace('w-', '') === '24' ? '6rem' : '4rem',
          height: dimensions.shield.split(' ')[0].replace('w-', '') === '30' ? '7.5rem' : dimensions.shield.split(' ')[0].replace('w-', '') === '24' ? '6rem' : '4rem',
          borderColor: isEarned ? currentTheme.accent : 'rgba(255, 255, 255, 0.07)',
          background: isEarned 
            ? `linear-gradient(135deg, ${currentTheme.stops.start}, ${currentTheme.stops.middle}, ${currentTheme.stops.end})`
            : 'rgba(13, 17, 23, 0.3)'
        }}
      >
        {/* Shimmer Shine Overlay */}
        {isEarned && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000" />
        )}

        {/* 3. Inner Contrast Core */}
        <div 
          className="w-[84%] h-[84%] rounded-[20px] border flex flex-col items-center justify-center bg-slate-950/95 transition-colors duration-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
          style={{ borderColor: isEarned ? `${currentTheme.accent}33` : 'rgba(255, 255, 255, 0.07)' }}
        >
          {/* Un-rotate container for badge icon */}
          <div className="-rotate-45 flex flex-col items-center justify-center">
            {renderBadgeIcon()}
          </div>
          
          {/* Sonar circle ripple */}
          {isEarned && (
            <div 
              className="absolute -inset-4 border rounded-full animate-ping opacity-10 pointer-events-none"
              style={{ borderColor: currentTheme.accent }}
            />
          )}
        </div>
      </div>

      {/* 5. Bottom Ribbon Sash */}
      <div 
        className={`absolute font-display font-extrabold tracking-widest uppercase rounded-md shadow-md border ${dimensions.ribbon} transition-all duration-300 z-10`}
        style={{
          background: isEarned 
            ? `linear-gradient(90deg, ${currentTheme.stops.middle}, ${currentTheme.stops.start}, ${currentTheme.stops.middle})`
            : '#1e293b',
          borderColor: isEarned ? `${currentTheme.accent}40` : 'rgba(255, 255, 255, 0.07)',
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
          style={{ color: isEarned ? currentTheme.accent : '#64748b' }}
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
              color: isEarned ? currentTheme.accent : '#64748b',
              textShadow: isEarned ? `0 0 10px ${currentTheme.accent}33` : 'none'
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
