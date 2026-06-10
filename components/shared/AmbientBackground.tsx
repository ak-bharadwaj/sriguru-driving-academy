"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function AmbientBackground() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hasPointer, setHasPointer] = useState(false)

  useEffect(() => {
    setMounted(true)
    const root = document.documentElement
    setIsDark(root.classList.contains('dark'))
    
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'))
    })
    
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class']
    })

    const handlePointerMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setHasPointer(true)
    }
    
    window.addEventListener('pointermove', handlePointerMove)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-[#f6f8fd] dark:bg-[#06080c] transition-colors duration-1000" />
  }

  // Ultra-premium, dynamic, shifting color stops for Light and Dark modes
  // Colors transition smoothly through high-fidelity, vibrant gradients in real-time
  const grad1Colors = isDark 
    ? ["#6366f1", "#a855f7", "#ec4899", "#3b82f6", "#6366f1"] // Indigo -> Purple -> Pink -> Blue -> Indigo
    : ["#a5b4fc", "#d8b4fe", "#fbcfe8", "#93c5fd", "#a5b4fc"] // Soft Elegant Pastels

  const grad2Colors = isDark
    ? ["#d946ef", "#f43f5e", "#f59e0b", "#10b981", "#d946ef"] // Fuchsia -> Rose -> Amber -> Emerald -> Fuchsia
    : ["#f5d0fe", "#fecdd3", "#fef3c7", "#a7f3d0", "#f5d0fe"]

  const grad3Colors = isDark
    ? ["#06b6d4", "#14b8a6", "#3b82f6", "#6366f1", "#06b6d4"] // Cyan -> Teal -> Blue -> Indigo -> Cyan
    : ["#9fe5f1", "#99f6e4", "#bfdbfe", "#c7d2fe", "#9fe5f1"]

  const grad4Colors = isDark
    ? ["#a855f7", "#6366f1", "#06b6d4", "#10b981", "#a855f7"] // Purple -> Indigo -> Cyan -> Emerald -> Purple
    : ["#e9d5ff", "#c7d2fe", "#bfe5f1", "#bbf7d0", "#e9d5ff"]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000">
      {/* 1. Dynamic Space Base canvas background */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, #060913 0%, #020305 100%)'
            : 'radial-gradient(circle at 50% 50%, #fcfdfe 0%, #edf1f8 100%)'
        }}
      />

      {/* Mobile-only static, high-performance background gradient to replace heavy animated orbs */}
      <div 
        className="absolute inset-0 md:hidden pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `
              radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 90% 90%, rgba(217, 70, 239, 0.12) 0%, transparent 60%)
            `
            : `
              radial-gradient(circle at 10% 10%, rgba(165, 180, 252, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 90% 90%, rgba(245, 208, 254, 0.18) 0%, transparent 60%)
            `
        }}
      />

      {/* 2. Interactive Fluid Mesh Gradient Fields (Pure HTML/CSS - NO SVGs for high performance) */}
      <div className="absolute inset-0 overflow-hidden z-0 hidden md:block">
        
        {/* Orb 1: Top Left */}
        <motion.div
          className="absolute rounded-full filter blur-[100px] md:blur-[120px] mix-blend-normal opacity-[0.5] dark:opacity-[0.35]"
          style={{
            width: '45vw',
            height: '45vw',
            minWidth: '280px',
            minHeight: '280px',
            top: '-5%',
            left: '-5%',
          }}
          animate={{
            x: [0, 80, -50, 0],
            y: [0, -60, 70, 0],
            scale: [1, 1.25, 0.8, 1],
            backgroundColor: grad1Colors,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 2: Top Right */}
        <motion.div
          className="absolute rounded-full filter blur-[100px] md:blur-[120px] mix-blend-normal opacity-[0.4] dark:opacity-[0.3]"
          style={{
            width: '40vw',
            height: '40vw',
            minWidth: '260px',
            minHeight: '260px',
            top: '5%',
            right: '-5%',
          }}
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 80, -40, 0],
            scale: [1, 1.2, 0.85, 1],
            backgroundColor: grad2Colors,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 3: Bottom Left */}
        <motion.div
          className="absolute rounded-full filter blur-[100px] md:blur-[120px] mix-blend-normal opacity-[0.45] dark:opacity-[0.32]"
          style={{
            width: '50vw',
            height: '50vw',
            minWidth: '300px',
            minHeight: '300px',
            bottom: '-10%',
            left: '-10%',
          }}
          animate={{
            x: [0, 70, -40, 0],
            y: [0, -70, 50, 0],
            scale: [1, 1.3, 0.85, 1],
            backgroundColor: grad3Colors,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 4: Bottom Right */}
        <motion.div
          className="absolute rounded-full filter blur-[100px] md:blur-[120px] mix-blend-normal opacity-[0.4] dark:opacity-[0.3]"
          style={{
            width: '42vw',
            height: '42vw',
            minWidth: '280px',
            minHeight: '280px',
            bottom: '-5%',
            right: '-5%',
          }}
          animate={{
            x: [0, -60, 70, 0],
            y: [0, -50, 80, 0],
            scale: [1, 1.25, 0.9, 1],
            backgroundColor: grad4Colors,
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Dynamic Pointer-tracking Interactive Glow Orb (Desktop and high-perf only) */}
        {hasPointer && (
          <motion.div
            className="absolute rounded-full filter blur-[80px] mix-blend-normal opacity-[0.6] dark:opacity-[0.5] pointer-events-none hidden md:block"
            style={{
              width: '400px',
              height: '400px',
              background: isDark 
                ? 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0) 70%)' 
                : 'radial-gradient(circle, rgba(165, 180, 252, 0.9) 0%, rgba(165, 180, 252, 0) 70%)',
            }}
            animate={{
              x: mousePos.x - 200,
              y: mousePos.y - 200,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 150,
              mass: 0.5
            }}
          />
        )}

      </div>

      {/* 3. Subtle volumetric light sweeps to add premium depth */}
      <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.35] hidden md:block">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-[55vw] bg-gradient-to-r from-transparent via-white/[0.04] dark:via-indigo-500/[0.03] to-transparent skew-x-12"
        />
      </div>

      {/* 4. Fine Tactile Frosted Noise layer */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}
