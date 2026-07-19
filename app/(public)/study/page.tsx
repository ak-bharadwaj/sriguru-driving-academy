"use client";

import { motion } from "framer-motion";
import { BookOpen, Download, Globe, Award, Sparkles, Smartphone, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function StudyPortal() {
  return (
    <div className="relative min-h-screen bg-void text-text-1 pt-28 pb-16 px-4 md:px-8 overflow-hidden">
      {/* Background blobs for premium glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-bold uppercase tracking-wider text-primary mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Learning & Prep Center
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold uppercase font-display tracking-tight text-white mb-6"
          >
            Sri Guru <span className="text-primary bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">RTO Study</span> Portal
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-text-2 font-body leading-relaxed"
          >
            Accelerate your learning. Access premium learning cards, practice simulated RTO exams, download our native Android app, and prepare for your driving license offline or online.
          </motion.p>
        </div>

        {/* 2-Option Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1: Web Learning Portal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group bg-surface border border-border/80 hover:border-primary/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(69,121,255,0.15)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform duration-300" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-extrabold uppercase font-display text-white mb-4 tracking-tight">
                Online Web Portal
              </h2>
              
              <p className="text-xs md:text-sm text-text-2 font-body leading-relaxed mb-6">
                Instant access to our fully interactive student dashboard directly from your web browser. Perfect for laptops, tablets, and mobile devices.
              </p>

              {/* Feature Checklist */}
              <ul className="flex flex-col gap-3.5 mb-8">
                {[
                  "18+ Interactive Practical Training Cards",
                  "Real-time RTO Exam Simulator (Official Syllabus)",
                  "Custom Streak Tracking & Experience Badge Rewards",
                  "Automated session bookings and feedback records"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-text-2 font-body">
                    <CheckCircle2 className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/50">
              <a
                href="https://student-app-sigma-five.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg shadow-primary/15"
              >
                Go to Web Portal
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Native Android App */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group bg-surface border border-border/80 hover:border-accent/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform duration-300" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 text-accent flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-extrabold uppercase font-display text-white mb-4 tracking-tight">
                Android APK App
              </h2>
              
              <p className="text-xs md:text-sm text-text-2 font-body leading-relaxed mb-6">
                Install our dedicated Android Application (APK) on your mobile device. Access everything on-the-go with one-tap launch.
              </p>

              {/* Feature Checklist */}
              <ul className="flex flex-col gap-3.5 mb-8">
                {[
                  "Standalone, optimized application bundle",
                  "Directly downloads and installs on any Android phone",
                  "Fast load times and persistent user sessions",
                  "Secure and light-weight Capacitor runtime"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-text-2 font-body">
                    <CheckCircle2 className="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/50">
              <a
                href="/downloads/sriguru-rto-app.apk"
                download="sriguru-rto-app.apk"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-accent hover:bg-accent/90 text-void font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg shadow-accent/15"
              >
                Download Android APK
                <Download className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>

        {/* Security / Help Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-2xl mx-auto bg-void/50 border border-border/60 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
        >
          <ShieldCheck className="w-6 h-6 text-success shrink-0 mt-0.5" />
          <div className="text-xs text-text-2 leading-relaxed">
            <strong className="text-white uppercase font-mono block mb-1">Installation instructions</strong>
            To install the Android app, simply click the download button above from your Android device. Once downloaded, tap the file to open and click Install. You may need to grant permission to install apps from your browser or file manager if prompted.
          </div>
        </motion.div>

      </div>
    </div>
  );
}
