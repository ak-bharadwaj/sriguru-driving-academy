"use client"

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Download, Award, ShieldCheck, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useSession } from 'next-auth/react'
import { useSettingsStore } from '@/store/settingsStore'

export default function CertificatePage() {
  const { data: session } = useSession()
  const { academyName, logoUrl } = useSettingsStore()
  const studentName = session?.user?.name || "Jane Doe"
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // 3D Tilt Effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // PDF Generation Function
  const handleDownload = async () => {
    if (!certificateRef.current) return
    setIsDownloading(true)

    try {
      // Create a high-quality canvas from the certificate DOM node
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff' // Ensure background is white for printing
      })

      const imgData = canvas.toDataURL('image/png')
      
      // Landscape A4 PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('Driving_Academy_Certificate.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 lg:p-12 relative flex flex-col items-center justify-center overflow-x-hidden pt-24 pb-32">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header text */}
      <div className="text-center mb-12 relative z-10 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-3 block">Milestone Reached</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-1 font-display tracking-tight uppercase">
          Congratulations!
        </h1>
        <p className="text-text-2 mt-4">
          You have successfully completed the theoretical and practical driving curriculum. Your official Certificate of Completion is ready to be downloaded.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-16 relative z-10">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)]"
        >
          {isDownloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? 'Generating PDF...' : 'Download Certificate'}
        </button>
        
        <button className="flex items-center gap-2 bg-surface border border-border hover:bg-white/5 text-text-1 px-6 py-4 rounded-xl font-bold transition-all">
          <Share2 className="w-5 h-5" />
          Share Achievement
        </button>
      </div>

      {/* 3D Certificate Container */}
      <div className="relative w-full max-w-[1000px] perspective-1000 z-10">
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-crosshair"
        >
          {/* 
            Actual Certificate to be Rendered and Captured 
            This div uses inline styles or light-mode explicit colors 
            to ensure the exported PDF looks exactly like a real paper certificate.
          */}
          <div 
            ref={certificateRef}
            className="w-full aspect-[1.414/1] bg-[#fdfbf7] relative overflow-hidden"
            style={{ padding: '4%' }}
          >
            {/* Inner Ornate Border */}
            <div className="w-full h-full border-[6px] border-[#c0a062] p-2 relative flex flex-col items-center justify-center">
              
              {/* Secondary fine border */}
              <div className="w-full h-full border border-[#c0a062] absolute inset-2" />

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <ShieldCheck className="w-[400px] h-[400px] text-black" />
              </div>

              {/* Certificate Content */}
              <div className="relative z-10 flex flex-col items-center text-center px-12">
                
                {/* Top Badge */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37] to-[#aa8022] rounded-full flex items-center justify-center shadow-lg mb-8 relative border-4 border-[#fdfbf7]">
                  <Award className="w-10 h-10 text-white" />
                  <div className="absolute inset-[-6px] border border-[#d4af37] rounded-full" />
                </div>

                <h3 className="text-[#333333] tracking-[0.2em] font-mono text-sm font-bold uppercase mb-4">
                  {academyName}
                </h3>

                <h1 className="text-5xl md:text-6xl text-[#1a1a1a] mb-6 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificate of Completion
                </h1>

                <p className="text-[#666666] text-lg italic mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  This is to certify that
                </p>

                {/* Student Name */}
                <h2 className="text-4xl text-[#1a1a1a] font-bold border-b-2 border-[#d4af37] pb-2 px-12 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  {studentName}
                </h2>

                <p className="text-[#555555] max-w-2xl leading-relaxed text-sm md:text-base font-medium mx-auto mb-16">
                  Has successfully completed all theoretical modules, RTO mock examinations, and rigorous practical driving assessments with distinction. They are fully prepared and certified for advanced road safety and defensive driving techniques.
                </p>

                {/* Signatures & Dates */}
                <div className="w-full flex justify-between items-end px-12 mt-auto">
                  <div className="flex flex-col items-center">
                    <span className="text-[#1a1a1a] font-bold text-lg mb-2" style={{ fontFamily: 'cursive' }}>
                      May 24, 2026
                    </span>
                    <div className="w-48 border-t border-[#999999] pt-2 text-[#666666] text-xs font-bold uppercase tracking-widest">
                      Date of Issue
                    </div>
                  </div>

                  <div className="w-24 h-24 relative flex items-center justify-center">
                    {/* Official Seal / Stamp */}
                    {logoUrl ? (
                      <img src={logoUrl} alt="Academy Seal" className="w-[90%] h-[90%] object-contain rounded-full shadow-md border-2 border-[#d4af37]" />
                    ) : (
                      <div className="w-full h-full rounded-full border-4 border-dashed border-[#d4af37] flex items-center justify-center animate-spin-slow">
                        <div className="w-[85%] h-[85%] rounded-full border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-[8px] uppercase text-center leading-tight">
                          Official<br/>Certified<br/>Seal
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[#1a1a1a] font-bold text-xl mb-2" style={{ fontFamily: 'cursive' }}>
                      Mr. Rajesh Kumar
                    </span>
                    <div className="w-48 border-t border-[#999999] pt-2 text-[#666666] text-xs font-bold uppercase tracking-widest">
                      Chief Instructor
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
