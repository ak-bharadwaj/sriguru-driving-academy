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

const PAGE_DICT = {
  EN: {
    title1: 'Interactive Modules Verification',
    desc1: 'Scroll through and test all 10 interactive driving simulations in one place.',
    simCompleted: 'Simulation Completed Successfully!',
    parallelParking: 'Parallel Parking',
    reverseBayParking: 'Reverse Bay Parking',
    vehicleStartup: 'Vehicle Startup Sequence',
    steeringControl: 'Steering Control Mechanics',
    clutchControl: 'Clutch Control (Bite Point)',
    highwayMerging: 'Highway Merging (Speed Matching)',
    advancedLessons: 'Advanced Lessons',
    advancedDesc: '4 new advanced driving skills added below.',
    threePointTurn: 'Three-Point Turn',
    emergencyBraking: 'Emergency Braking (ABS Drill)',
    roundabout: 'Roundabout Navigation',
    nightDriving: 'Night Driving'
  },
  HI: {
    title1: 'इंटरएक्टिव मॉड्यूल सत्यापन',
    desc1: 'एक ही स्थान पर सभी 10 इंटरएक्टिव ड्राइविंग सिमुलेशन स्क्रॉल करें और परीक्षण करें।',
    simCompleted: 'सिमुलेशन सफलतापूर्वक पूरा हुआ!',
    parallelParking: 'समानांतर पार्किंग',
    reverseBayParking: 'रिवर्स बे पार्किंग',
    vehicleStartup: 'वाहन स्टार्टअप अनुक्रम',
    steeringControl: 'स्टीयरिंग नियंत्रण तंत्र',
    clutchControl: 'क्लच नियंत्रण (बाइट पॉइंट)',
    highwayMerging: 'राजमार्ग विलय (गति मिलान)',
    advancedLessons: 'उन्नत पाठ',
    advancedDesc: 'नीचे 4 नए उन्नत ड्राइविंग कौशल जोड़े गए हैं।',
    threePointTurn: 'थ्री-पॉइंट टर्न',
    emergencyBraking: 'आपातकालीन ब्रेकिंग (ABS ड्रिल)',
    roundabout: 'गोलचक्कर नेविगेशन',
    nightDriving: 'रात की ड्राइविंग'
  },
  TE: {
    title1: 'ఇంటరాక్టివ్ మాడ్యూల్స్ ధృవీకరణ',
    desc1: 'అన్ని 10 ఇంటరాక్టివ్ డ్రైవింగ్ సిమ్యులేషన్లను ఒకే చోట స్క్రోల్ చేయండి మరియు పరీక్షించండి.',
    simCompleted: 'సిమ్యులేషన్ విజయవంతంగా పూర్తయింది!',
    parallelParking: 'సమాంతర పార్కింగ్',
    reverseBayParking: 'రివర్స్ బే పార్కింగ్',
    vehicleStartup: 'వాహన ప్రారంభ క్రమం',
    steeringControl: 'స్టీరింగ్ నియంత్రణ మెకానిక్స్',
    clutchControl: 'క్లచ్ నియంత్రణ (బైట్ పాయింట్)',
    highwayMerging: 'హైవే మెర్జింగ్ (స్పీడ్ మ్యాచింగ్)',
    advancedLessons: 'అధునాతన పాఠాలు',
    advancedDesc: 'కింద 4 కొత్త అధునాతన డ్రైవింగ్ నైపుణ్యాలు జోడించబడ్డాయి.',
    threePointTurn: 'త్రీ-పాయింట్ టర్న్',
    emergencyBraking: 'ఎమర్జెన్సీ బ్రేకింగ్ (ABS డ్రిల్)',
    roundabout: 'రౌండ్‌అబౌట్ నావిగేషన్',
    nightDriving: 'నైట్ డ్రైవింగ్'
  }
}

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
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  return (
    <div className="min-h-screen bg-void text-text-1 p-8 overflow-y-auto pb-32">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-display font-bold text-primary">{t.title1}</h1>
          <p className="text-text-3">{t.desc1}</p>
        </div>

        <SimSection num="1" title={t.parallelParking}>
          <ParallelParkingSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="2" title={t.reverseBayParking}>
          <ReverseBayParkingSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="3" title={t.vehicleStartup} height={480}>
          <VehicleStartupSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="4" title={t.steeringControl}>
          <SteeringControlSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="5" title={t.clutchControl}>
          <ClutchControlSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="6" title={t.highwayMerging}>
          <HighwayMergingSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <div className="border-t-2 border-dashed border-border pt-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-2">{t.advancedLessons}</h2>
          <p className="text-text-3 mb-10">{t.advancedDesc}</p>
        </div>

        <SimSection num="7" title={t.threePointTurn}>
          <ThreePointTurnSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="8" title={t.emergencyBraking}>
          <EmergencyBrakingSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="9" title={t.roundabout}>
          <RoundaboutSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

        <SimSection num="10" title={t.nightDriving} height={460}>
          <NightDrivingSimulation onComplete={() => alert(t.simCompleted)} />
        </SimSection>

      </div>
    </div>
  )
}
