"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Award, HelpCircle, AlertTriangle, Ban, Info, Phone, Plus, SquareParking as ParkingSquare, 
  ArrowRight, ArrowLeft, ArrowUp, Zap, HelpCircle as Question, TriangleAlert, 
  CircleSlash, Navigation, MapPin, Hand, XCircle, AlertCircle, Check
} from 'lucide-react'

// Import road sign SVGs
import * as RoadSigns from '@/lib/icons/road-signs'
import { useXPStore } from '@/lib/stores/xp-store'

interface SignCardProps {
  signKey?: string
  name: string
  category: string
  meaning: string
  rule?: string
  steps?: string[]
  limit?: number
  lightState?: 'red' | 'amber' | 'green'
  imagePath?: string
  fallbackShape?: 'circle' | 'triangle' | 'octagon' | 'square'
  fallbackColor?: 'red' | 'blue' | 'yellow' | 'green'
  onStartQuiz?: () => void
}

// Fallback component extracted to module scope
const FallbackComponent = () => null

export const SignCard: React.FC<SignCardProps> = ({
  signKey,
  name,
  category,
  meaning,
  rule,
  steps,
  limit = 50,
  lightState = 'red',
  imagePath,
  fallbackShape,
  fallbackColor,
  onStartQuiz
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { addXP, addToast } = useXPStore()

  useEffect(() => {
    if (signKey) {
      const saved = localStorage.getItem('completed_signs')
      let isComp = false
      if (saved) {
        try {
          const completedList = JSON.parse(saved)
          isComp = completedList.includes(signKey)
          setIsCompleted(isComp)
        } catch (e) {}
      } else {
        setIsCompleted(false)
      }

      // Automatically complete the signboard if the modal is opened
      if (isOpen && !isComp) {
        const savedList = localStorage.getItem('completed_signs')
        let completedList: string[] = []
        if (savedList) {
          try {
            completedList = JSON.parse(savedList)
          } catch (e) {}
        }
        if (!completedList.includes(signKey)) {
          completedList.push(signKey)
          localStorage.setItem('completed_signs', JSON.stringify(completedList))
          setIsCompleted(true)
          addXP(5)
          addToast({
            title: `Sign Mastered!`,
            description: `Gained +5 XP for learning this road sign.`,
            type: 'xp'
          })
        }
      }
    }
  }, [signKey, isOpen, addXP, addToast])

  // Retrieve the custom SVG component if it exists
  const SVGIcon = (signKey && RoadSigns[signKey as keyof typeof RoadSigns])
    ? (RoadSigns[signKey as keyof typeof RoadSigns] as React.ComponentType<{ size: number; glow?: boolean; limit?: number; state?: 'red' | 'amber' | 'green' }>) 
    : FallbackComponent

  // Render a CSS fallback shape with a distinct Lucide icon if no image or SVG is present
  const renderShape = (size: number) => {
    if (imagePath) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image 
            src={imagePath} 
            alt={name} 
            fill 
            className="object-contain drop-shadow-md" 
          />
        </div>
      )
    }
    if (signKey) {
      if (signKey === 'SPEED_LIMIT') return <SVGIcon size={size} limit={limit} />
      if (signKey === 'TRAFFIC_LIGHT') return <SVGIcon size={size} state={lightState} />
      return <SVGIcon size={size} />
    }

    // CSS Fallback Shapes
    const colorMap = {
      red: 'bg-[#dc2626] border-[#b91c1c]',
      blue: 'bg-[#2563eb] border-[#1d4ed8]',
      yellow: 'bg-[#fbbf24] border-[#d97706]',
      green: 'bg-[#059669] border-[#047857]'
    }
    const colorClass = colorMap[fallbackColor || 'red']
    const iconSize = size * 0.45
    
    // Determine dynamic icon based on sign name
    let IconToUse = Question;
    const lowerName = name.toLowerCase();
    
    if (fallbackShape === 'octagon' || lowerName.includes('stop')) IconToUse = Hand;
    else if (lowerName.includes('prohibited') || lowerName.includes('no ')) IconToUse = Ban;
    else if (lowerName.includes('hospital') || lowerName.includes('first aid')) IconToUse = Plus;
    else if (lowerName.includes('telephone') || lowerName.includes('sos')) IconToUse = Phone;
    else if (lowerName.includes('park') || lowerName.includes('stand')) IconToUse = ParkingSquare;
    else if (lowerName.includes('curve') || lowerName.includes('bend')) IconToUse = AlertCircle;
    else if (lowerName.includes('left')) IconToUse = ArrowLeft;
    else if (lowerName.includes('right')) IconToUse = ArrowRight;
    else if (lowerName.includes('ahead') || lowerName.includes('straight')) IconToUse = ArrowUp;
    else if (fallbackShape === 'triangle') IconToUse = AlertTriangle;
    else if (fallbackShape === 'square') IconToUse = Info;
    else if (fallbackShape === 'circle') IconToUse = CircleSlash;

    if (fallbackShape === 'octagon') {
      return (
        <div 
          className={`flex items-center justify-center ${colorClass} text-white`}
          style={{
            width: size, height: size,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
          }}
        >
          {lowerName.includes('stop') ? (
            <span className={`font-extrabold font-display uppercase ${size > 80 ? 'text-4xl' : 'text-xl'}`}>STOP</span>
          ) : (
            <IconToUse size={iconSize} strokeWidth={2.5} />
          )}
        </div>
      )
    }

    if (fallbackShape === 'triangle') {
      return (
        <div 
          className={`flex flex-col justify-end pb-[15%] items-center`}
          style={{
            width: size, height: size,
            background: fallbackColor === 'red' ? '#ef4444' : '#3b82f6',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        >
          <div className="w-[85%] h-[85%] bg-white flex items-end justify-center pb-[10%] text-black" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
             <IconToUse size={iconSize} strokeWidth={3} className="mb-2" />
          </div>
        </div>
      )
    }

    if (fallbackShape === 'square') {
      return (
        <div 
          className={`flex flex-col items-center justify-center ${colorClass} text-white rounded-lg relative overflow-hidden`}
          style={{ width: size, height: size, border: '4px solid white', outline: `4px solid ${fallbackColor === 'red' ? '#dc2626' : '#2563eb'}` }}
        >
           {lowerName.includes('park') || lowerName.includes('stand') ? (
              <span className={`font-extrabold font-display uppercase ${size > 80 ? 'text-6xl' : 'text-3xl'}`}>P</span>
           ) : (
              <IconToUse size={iconSize} strokeWidth={2.5} />
           )}
        </div>
      )
    }

    // Default to circle (Mandatory signs)
    return (
      <div 
        className={`flex items-center justify-center bg-white text-black rounded-full border-[6px]`}
        style={{ width: size, height: size, borderColor: fallbackColor === 'blue' ? '#2563eb' : '#dc2626' }}
      >
        {lowerName.includes('limit') ? (
          <span className={`font-extrabold font-display ${size > 80 ? 'text-5xl' : 'text-2xl'}`}>{limit}</span>
        ) : (
          <IconToUse size={iconSize} strokeWidth={2.5} className={fallbackColor === 'blue' ? 'text-blue-600' : 'text-red-600'} />
        )}
      </div>
    )
  }

  return (
    <>
      {/* 160x160px Fixed Sign Card */}
      <motion.div
        whileHover={{ 
          scale: 1.03,
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 20px rgba(37,99,235,0.15)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="w-[160px] h-[160px] bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-between relative cursor-pointer select-none group transition-colors duration-300"
      >
        {/* Top-Right XP Reward Badge */}
        {isCompleted ? (
          <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500/35 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 pointer-events-none text-emerald-400">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
            <span className="text-[9px] font-bold font-mono uppercase tracking-wider">Done</span>
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-accent/20 border border-accent/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 pointer-events-none">
            <Award className="w-2.5 h-2.5 text-accent fill-accent" />
            <span className="text-[9px] font-bold text-accent font-mono">+5 XP</span>
          </div>
        )}

        {/* Dynamic Image/Shape */}
        <div className="w-[72px] h-[72px] flex items-center justify-center mt-3 relative">
          {renderShape(72)}
        </div>

        {/* Sign Name */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-2 group-hover:text-text-1 text-center w-full truncate transition-colors duration-200 mt-2">
          {name}
        </span>
      </motion.div>

      {/* Expanded Explanation Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-void/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 md:p-8 overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Decorative accent glow */}
              <div className="absolute -right-24 -top-24 w-60 h-60 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-void/50 hover:bg-white/[0.04] border border-border rounded-full text-text-3 hover:text-text-1 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal content */}
              <div className="flex flex-col items-center text-center gap-6 mt-4">
                {/* SVG Icon centered large */}
                <div className="w-[120px] h-[120px] flex items-center justify-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] relative">
                  {renderShape(120)}
                </div>

                <div className="w-full">
                  <span className="text-xs font-mono uppercase tracking-widest text-primary">{category} Signboard</span>
                  <h3 className="text-2xl font-extrabold text-text-1 font-display tracking-tight mt-1">
                    {name}
                  </h3>
                </div>

                {/* Explanation text */}
                <div className="w-full flex flex-col gap-4 text-left border-t border-border pt-6">
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-text-3">Official Meaning</h5>
                    <p className="text-sm text-text-2 mt-1 font-body leading-relaxed">{meaning}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-text-3">RTO Safety Steps</h5>
                    <div className="mt-2 flex flex-col gap-2">
                      {steps && steps.length > 0 ? (
                        steps.map((step, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start bg-accent/5 py-2 px-3 rounded-lg border-l-2 border-l-accent">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold mt-0.5">{idx + 1}</span>
                            <span className="text-sm text-text-2 font-body leading-tight">{step}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-text-2 font-body leading-relaxed border-l-2 border-l-accent pl-3 italic bg-accent/5 py-2 rounded-r-lg">
                          {rule}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex gap-4 w-full mt-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 bg-void/60 hover:bg-white/[0.03] border border-border text-text-2 hover:text-text-1 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    Got It, Student
                  </button>
                  <div className="flex-1 py-3 bg-emerald-600/10 border border-emerald-600/30 text-emerald-400 font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-sm pointer-events-none">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

