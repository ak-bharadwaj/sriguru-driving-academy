"use client"

import React from 'react'
import { ParallelParkingSimulation } from '@/components/student/ParallelParkingSimulation'
import { ReverseBayParkingSimulation } from '@/components/student/ReverseBayParkingSimulation'
import { 
  VehicleStartupSimulation, 
  SteeringControlSimulation, 
  ClutchControlSimulation, 
  HighwayMergingSimulation 
} from '@/components/student/DynamicHTMLSimulations'
import {
  ThreePointTurnSimulation,
  EmergencyBrakingSimulation,
  RoundaboutSimulation,
  NightDrivingSimulation
} from '@/components/student/AdvancedDrivingSimulations'

import { useLanguageStore } from '@/store/languageStore'

const SimSection = ({ num, title, height = 700, children }: { num: string, title: string, height?: number, children: React.ReactNode }) => (
  <section className="bg-surface border border-border p-8 rounded-3xl shadow-xl">
    <h2 className="text-2xl font-bold mb-6 text-accent">{num}. {title}</h2>
    <div className="relative rounded-2xl overflow-x-auto overflow-y-hidden border border-border bg-void custom-scrollbar" style={{ height }}>
      <div className="min-w-[800px] h-full w-full">
        {children}
      </div>
    </div>
  </section>
)

export default function VerifyAllPage() {
  const { language } = useLanguageStore()

  return (
    <div className="min-h-screen bg-void text-text-1 p-8 overflow-y-auto pb-32">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-display font-bold text-primary">{language === 'EN' ? 'Interactive Modules Verification' : language === 'HI' ? 'इंटरएक्टिव मॉड्यूल सत्यापन' : 'ఇంటరాక్టివ్ మాడ్యూల్స్ ధృవీకరణ'}</h1>
          <p className="text-text-3">{language === 'EN' ? 'Scroll through and test all 10 interactive driving simulations in one place.' : language === 'HI' ? 'एक ही स्थान पर सभी 10 इंटरएक्टिव ड्राइविंग सिमुलेशन स्क्रॉल करें और परीक्षण करें।' : 'అన్ని 10 ఇంటరాక్టివ్ డ్రైవింగ్ సిమ్యులేషన్లను ఒకే చోట స్క్రోల్ చేయండి మరియు పరీక్షించండి.'}</p>
        </div>

        <SimSection num="1" title="Parallel Parking">
          <ParallelParkingSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="2" title="Reverse Bay Parking">
          <ReverseBayParkingSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="3" title="Vehicle Startup Sequence" height={480}>
          <VehicleStartupSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="4" title="Steering Control Mechanics">
          <SteeringControlSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="5" title="Clutch Control (Bite Point)">
          <ClutchControlSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="6" title="Highway Merging (Speed Matching)">
          <HighwayMergingSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <div className="border-t-2 border-dashed border-border pt-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-2">Advanced Lessons</h2>
          <p className="text-text-3 mb-10">4 new advanced driving skills added below.</p>
        </div>

        <SimSection num="7" title="Three-Point Turn">
          <ThreePointTurnSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="8" title="Emergency Braking (ABS Drill)">
          <EmergencyBrakingSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="9" title="Roundabout Navigation">
          <RoundaboutSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

        <SimSection num="10" title="Night Driving" height={460}>
          <NightDrivingSimulation onComplete={() => alert('Simulation Completed Successfully!')} />
        </SimSection>

      </div>
    </div>
  )
}
