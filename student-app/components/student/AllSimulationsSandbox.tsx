"use client"

import React, { useState, useEffect } from 'react'
import { 
  Play, RotateCcw, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, 
  HelpCircle, Eye, Car, Sliders, ArrowRight, Compass, Moon, Sun, 
  CloudRain, Shield, AlertOctagon, RefreshCw, Milestone, Layers
} from 'lucide-react'

// --- SIMULATION TYPES ---
type SimulationId = 
  | 'vehicle-startup' | 'steering-control' | 'clutch-control' | 'braking' | 'mirror-checking'
  | 'parallel-parking' | 'reverse-parking' | 'hill-starts' | 'lane-changing' | 'traffic-signals'
  | 'highway-merging' | 'overtaking' | 'emergency-braking' | 'rain-driving' | 'night-driving'
  | 'roundabouts' | 'parking-alignment' | 'blind-spots'

interface SimulationMetaData {
  id: SimulationId
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
}

const ALL_SIMS: SimulationMetaData[] = [
  { id: 'vehicle-startup', title: '1. Vehicle Startup Process', category: 'Basics', difficulty: 'Beginner', description: 'Complete the startup check sequence in order.' },
  { id: 'steering-control', title: '2. Steering Control Mastery', category: 'Control', difficulty: 'Beginner', description: 'Steer the wheel to stay within the lanes.' },
  { id: 'clutch-control', title: '3. Clutch Friction Point', category: 'Control', difficulty: 'Beginner', description: 'Find and hold the engine biting point.' },
  { id: 'braking', title: '4. Braking Techniques', category: 'Control', difficulty: 'Beginner', description: 'Gradually brake to stop smoothly before the line.' },
  { id: 'mirror-checking', title: '5. Mirror Checking (MSM)', category: 'Safety', difficulty: 'Beginner', description: 'Scan all mirrors to notice surrounding hazards.' },
  { id: 'parallel-parking', title: '6. Parallel Parking', category: 'Parking', difficulty: 'Intermediate', description: 'Align and reverse park behind the lead vehicle.' },
  { id: 'reverse-parking', title: '7. Reverse Bay Parking', category: 'Parking', difficulty: 'Intermediate', description: 'Reverse lock into the marked parking bay.' },
  { id: 'hill-starts', title: '8. Hill Starts', category: 'Control', difficulty: 'Intermediate', description: 'Balance clutch and gas to pull up a hill.' },
  { id: 'lane-changing', title: '9. Lane Changing', category: 'Road', difficulty: 'Intermediate', description: 'Signal, check blind spots, and change lanes.' },
  { id: 'traffic-signals', title: '10. Traffic Signals', category: 'Road Rules', difficulty: 'Beginner', description: 'React and stop according to the lights.' },
  { id: 'highway-merging', title: '11. Highway Merging', category: 'Advanced', difficulty: 'Advanced', description: 'Accelerate on the ramp and merge into highway traffic.' },
  { id: 'overtaking', title: '12. Overtaking', category: 'Advanced', difficulty: 'Advanced', description: 'Safely accelerate past a slow lead vehicle.' },
  { id: 'emergency-braking', title: '13. Emergency Braking', category: 'Safety', difficulty: 'Advanced', description: 'Quickly slam the brakes when the hazard appears.' },
  { id: 'rain-driving', title: '14. Driving in Rain', category: 'Advanced', difficulty: 'Advanced', description: 'Toggle wipers and maintain a safe wet gap.' },
  { id: 'night-driving', title: '15. Night Driving', category: 'Advanced', difficulty: 'Advanced', description: 'Toggle high/low beams when oncoming cars approach.' },
  { id: 'roundabouts', title: '16. Roundabout Navigation', category: 'Road', difficulty: 'Intermediate', description: 'Yield, signal, and negotiate roundabout exits.' },
  { id: 'parking-alignment', title: '17. Parking Alignment', category: 'Parking', difficulty: 'Intermediate', description: 'Position the car parallel within 15-30cm of the curb.' },
  { id: 'blind-spots', title: '18. Blind Spot Awareness', category: 'Safety', difficulty: 'Beginner', description: 'Perform shoulder checks to detect hidden vehicles.' }
]

export function AllSimulationsSandbox() {
  const [selectedSim, setSelectedSim] = useState<SimulationId>('vehicle-startup')
  const [completedList, setCompletedList] = useState<SimulationId[]>([])
  
  const markComplete = (id: SimulationId) => {
    if (!completedList.includes(id)) {
      setCompletedList(prev => [...prev, id])
    }
  }

  return (
    <div className="w-full min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] flex flex-col md:flex-row">
      
      {/* LEFT NAVIGATION COLUMN */}
      <div className="w-full md:w-80 bg-[rgb(var(--color-surface))] border-r border-[rgb(var(--color-border))] flex flex-col h-full md:h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-xl font-extrabold font-display tracking-tight text-[rgb(var(--color-primary))]">Sri Guru Academy</h2>
          <p className="text-[11px] text-[rgb(var(--color-text-3))] uppercase tracking-wider font-mono mt-1">18 Simulations Sandbox</p>
          
          <div className="mt-4 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl p-3 flex justify-between items-center text-xs font-mono">
            <span>Completed:</span>
            <span className="font-bold text-[rgb(var(--color-success))]">{completedList.length} / 18</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {ALL_SIMS.map((sim) => {
            const isActive = selectedSim === sim.id
            const isDone = completedList.includes(sim.id)
            return (
              <button
                key={sim.id}
                onClick={() => setSelectedSim(sim.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between text-xs font-bold border ${
                  isActive
                    ? 'bg-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/20'
                    : 'bg-transparent border-transparent hover:bg-[rgb(var(--color-surface-2))] text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))]'
                }`}
              >
                <div className="flex flex-col">
                  <span>{sim.title}</span>
                  <span className={`text-[9px] mt-0.5 ${isActive ? 'text-white/70' : 'text-[rgb(var(--color-text-3))]'}`}>
                    {sim.category} • {sim.difficulty}
                  </span>
                </div>
                {isDone && (
                  <CheckCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[rgb(var(--color-success))]'}`} />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* RIGHT DISPLAY PANEL */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center min-h-[600px] overflow-y-auto pb-32">
        <div className="w-full max-w-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[32px] overflow-hidden shadow-xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[rgb(var(--color-border))]">
            <span className="text-[10px] font-mono text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 px-2 py-0.5 rounded-full font-bold uppercase">
              {ALL_SIMS.find(s => s.id === selectedSim)?.category}
            </span>
            <h2 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))] mt-2">
              {ALL_SIMS.find(s => s.id === selectedSim)?.title}
            </h2>
            <p className="text-xs text-[rgb(var(--color-text-2))] mt-1">
              {ALL_SIMS.find(s => s.id === selectedSim)?.description}
            </p>
          </div>

          {/* Simulation Display Frame */}
          <div className="p-6 bg-[rgb(var(--color-void))] flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
            {selectedSim === 'vehicle-startup' && <SimVehicleStartup onComplete={() => markComplete('vehicle-startup')} />}
            {selectedSim === 'steering-control' && <SimSteeringControl onComplete={() => markComplete('steering-control')} />}
            {selectedSim === 'clutch-control' && <SimClutchControl onComplete={() => markComplete('clutch-control')} />}
            {selectedSim === 'braking' && <SimBraking onComplete={() => markComplete('braking')} />}
            {selectedSim === 'mirror-checking' && <SimMirrorChecking onComplete={() => markComplete('mirror-checking')} />}
            {selectedSim === 'parallel-parking' && <SimParallelParking onComplete={() => markComplete('parallel-parking')} />}
            {selectedSim === 'reverse-parking' && <SimReverseParking onComplete={() => markComplete('reverse-parking')} />}
            {selectedSim === 'hill-starts' && <SimHillStarts onComplete={() => markComplete('hill-starts')} />}
            {selectedSim === 'lane-changing' && <SimLaneChanging onComplete={() => markComplete('lane-changing')} />}
            {selectedSim === 'traffic-signals' && <SimTrafficSignals onComplete={() => markComplete('traffic-signals')} />}
            {selectedSim === 'highway-merging' && <SimHighwayMerging onComplete={() => markComplete('highway-merging')} />}
            {selectedSim === 'overtaking' && <SimOvertaking onComplete={() => markComplete('overtaking')} />}
            {selectedSim === 'emergency-braking' && <SimEmergencyBraking onComplete={() => markComplete('emergency-braking')} />}
            {selectedSim === 'rain-driving' && <SimRainDriving onComplete={() => markComplete('rain-driving')} />}
            {selectedSim === 'night-driving' && <SimNightDriving onComplete={() => markComplete('night-driving')} />}
            {selectedSim === 'roundabouts' && <SimRoundabouts onComplete={() => markComplete('roundabouts')} />}
            {selectedSim === 'parking-alignment' && <SimParkingAlignment onComplete={() => markComplete('parking-alignment')} />}
            {selectedSim === 'blind-spots' && <SimBlindSpots onComplete={() => markComplete('blind-spots')} />}
          </div>

        </div>
      </main>

    </div>
  )
}

// ==========================================
// 1. VEHICLE STARTUP PROCESS (Basics)
// ==========================================
function SimVehicleStartup({ onComplete }: { onComplete: () => void }) {
  const steps = ['Seat & Mirrors', 'Seatbelt', 'Gear Neutral', 'Press Clutch', 'Turn Ignition', 'Release Handbrake']
  const [currentStep, setCurrentStep] = useState(0)

  const handleStep = (idx: number) => {
    if (idx === currentStep) {
      if (currentStep === steps.length - 1) {
        setCurrentStep(steps.length)
        onComplete()
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-sm">
      <h3 className="text-sm font-mono text-center mb-2">Startup Checklist:</h3>
      <div className="grid grid-cols-2 gap-2 w-full">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => handleStep(idx)}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              idx < currentStep
                ? 'bg-[rgb(var(--color-success))]/15 border-[rgb(var(--color-success))] text-[rgb(var(--color-success))]'
                : idx === currentStep
                ? 'bg-[rgb(var(--color-primary))]/10 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] animate-pulse'
                : 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text-3))]'
            }`}
          >
            {step}
          </button>
        ))}
      </div>
      {currentStep === steps.length && (
        <div className="flex items-center gap-2 text-[rgb(var(--color-success))] text-sm font-bold mt-4 animate-bounce">
          <Sparkles className="w-5 h-5" /> Ready to Drive!
        </div>
      )}
    </div>
  )
}

// ==========================================
// 2. STEERING CONTROL (Control)
// ==========================================
function SimSteeringControl({ onComplete }: { onComplete: () => void }) {
  const [angle, setAngle] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (score >= 100) {
      onComplete()
    }
  }, [score])

  const handleSteer = (dir: 'L' | 'R') => {
    if (score >= 100) return
    const diff = dir === 'L' ? -15 : 15
    setAngle(prev => Math.max(-90, Math.min(90, prev + diff)))
    setScore(prev => Math.min(100, prev + 10))
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      <div className="relative w-40 h-40 border-4 border-[rgb(var(--color-border))] rounded-full flex items-center justify-center transition-transform duration-300" style={{ transform: `rotate(${angle}deg)` }}>
        <div className="w-1.5 h-full bg-[rgb(var(--color-text-3))] absolute" />
        <div className="h-1.5 w-full bg-[rgb(var(--color-text-3))] absolute" />
        <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] relative z-10" />
      </div>

      <div className="flex justify-between w-full gap-4">
        <button onClick={() => handleSteer('L')} className="flex-1 py-3 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold text-xs">Steer Left</button>
        <button onClick={() => handleSteer('R')} className="flex-1 py-3 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold text-xs">Steer Right</button>
      </div>

      <div className="w-full bg-[rgb(var(--color-surface-2))] border border-[rgb(var(--color-border))] h-3 rounded-full overflow-hidden mt-2">
        <div className="bg-[rgb(var(--color-primary))] h-full transition-all" style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-mono">Progress: {score}%</span>
    </div>
  )
}

// ==========================================
// 3. CLUTCH CONTROL (Control)
// ==========================================
function SimClutchControl({ onComplete }: { onComplete: () => void }) {
  const [val, setVal] = useState(0)
  const [duration, setDuration] = useState(0)
  const isBiting = val >= 55 && val <= 65

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isBiting) {
      timer = setInterval(() => {
        setDuration(prev => {
          if (prev >= 3) {
            onComplete()
            return 3
          }
          return prev + 1
        })
      }, 1000)
    } else {
      setDuration(0)
    }
    return () => clearInterval(timer)
  }, [isBiting])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all ${isBiting ? 'border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))]/10 animate-pulse' : 'border-[rgb(var(--color-border))]'}`}>
        <span className="text-2xl font-bold font-mono">{val}%</span>
        <span className="text-[9px] uppercase tracking-wider font-mono mt-1">{isBiting ? 'Friction Zone!' : 'Press Clutch'}</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={(e) => setVal(parseInt(e.target.value))}
        className="w-full accent-[rgb(var(--color-primary))]"
      />

      <span className="text-xs font-mono">Hold Biting Zone (55%-65%): {duration} / 3s</span>
    </div>
  )
}

// ==========================================
// 4. BRAKING TECHNIQUES (Control)
// ==========================================
function SimBraking({ onComplete }: { onComplete: () => void }) {
  const [speed, setSpeed] = useState(60)
  const [stopLine, setStopLine] = useState(150) // distance from stopping point

  const handleBrake = () => {
    if (speed <= 0) return
    const reduction = 15
    const newSpeed = Math.max(0, speed - reduction)
    setSpeed(newSpeed)
    
    // Decrease remaining stopping distance based on deceleration speed
    setStopLine(prev => Math.max(0, prev - (speed * 2)))

    if (newSpeed === 0) {
      if (stopLine >= 5 && stopLine <= 30) {
        onComplete()
      } else {
        // Reset if stopped too early or crashed
        setSpeed(60)
        setStopLine(150)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="flex justify-between w-full font-mono text-xs">
        <span>Speed: {speed} km/h</span>
        <span>Stop Margin: {stopLine}m</span>
      </div>

      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-40 rounded-2xl relative flex items-end justify-center overflow-hidden">
        {/* Stopping line indicator */}
        <div className="absolute w-full h-1 bg-[rgb(var(--color-danger))] bottom-4" />
        <span className="absolute bottom-6 text-[9px] text-[rgb(var(--color-danger))] font-mono font-bold">STOP LINE</span>

        {/* Car indicator */}
        <div className="absolute transition-all duration-300 w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center text-white" style={{ bottom: `${4 + (stopLine * 0.8)}px` }}>
          🚗
        </div>
      </div>

      <button onClick={handleBrake} className="w-full py-4 bg-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg">
        Brake Pedal
      </button>
      <span className="text-[10px] font-mono text-[rgb(var(--color-text-3))]">Aim to stop within 5m to 30m of the line.</span>
    </div>
  )
}

// ==========================================
// 5. MIRROR CHECKING (Safety)
// ==========================================
function SimMirrorChecking({ onComplete }: { onComplete: () => void }) {
  const [scanned, setScanned] = useState<string[]>([])

  const handleScan = (mirror: string) => {
    if (!scanned.includes(mirror)) {
      const next = [...scanned, mirror]
      setScanned(next)
      if (next.length === 3) {
        onComplete()
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <h3 className="text-xs font-mono text-center">Click all mirrors to check surrounding lane conditions:</h3>
      
      <div className="grid grid-cols-3 gap-3 w-full">
        {/* Left Side Mirror */}
        <button
          onClick={() => handleScan('left')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
            scanned.includes('left') ? 'border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))]/10' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
          }`}
        >
          <Eye className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          <span className="text-[10px] font-bold">Left Mirror</span>
          <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))]">{scanned.includes('left') ? 'Clear' : 'Scan'}</span>
        </button>

        {/* Rear View Mirror */}
        <button
          onClick={() => handleScan('rear')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
            scanned.includes('rear') ? 'border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))]/10' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
          }`}
        >
          <Eye className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          <span className="text-[10px] font-bold">Rear View</span>
          <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))]">{scanned.includes('rear') ? 'Hazard Clear' : 'Scan'}</span>
        </button>

        {/* Right Side Mirror */}
        <button
          onClick={() => handleScan('right')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
            scanned.includes('right') ? 'border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))]/10' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
          }`}
        >
          <Eye className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          <span className="text-[10px] font-bold">Right Mirror</span>
          <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))]">{scanned.includes('right') ? 'Car Passing' : 'Scan'}</span>
        </button>
      </div>

      <span className="text-xs font-mono">Mirrors Scanned: {scanned.length} / 3</span>
    </div>
  )
}

// ==========================================
// 6. PARALLEL PARKING (Parking)
// ==========================================
function SimParallelParking({ onComplete }: { onComplete: () => void }) {
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(20)
  const [completed, setCompleted] = useState(false)

  const handleMove = (dir: 'L' | 'R' | 'U' | 'D') => {
    if (completed) return
    if (dir === 'L') setPosX(prev => Math.max(10, prev - 10))
    if (dir === 'R') setPosX(prev => Math.min(90, prev + 10))
    if (dir === 'U') setPosY(prev => Math.max(10, prev - 5))
    if (dir === 'D') setPosY(prev => Math.min(80, prev + 5))
  }

  useEffect(() => {
    // Target spot: posX around 80, posY around 60
    if (posX >= 70 && posX <= 90 && posY >= 55 && posY <= 65) {
      setCompleted(true)
      onComplete()
    }
  }, [posX, posY])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-48 rounded-2xl relative overflow-hidden">
        {/* Obstacle / Lead Vehicle */}
        <div className="absolute w-12 h-16 bg-[rgb(var(--color-text-3))]/20 rounded-md top-4 right-6 flex items-center justify-center text-xs">🚗 Lead</div>
        
        {/* Target spot */}
        <div className="absolute w-14 h-18 border-2 border-dashed border-[rgb(var(--color-success))] rounded-md bottom-6 right-5 flex items-center justify-center text-[9px] text-[rgb(var(--color-success))] font-bold">PARK SPOT</div>

        {/* Moving Car */}
        <div className="absolute transition-all duration-300 w-12 h-16 bg-[rgb(var(--color-primary))] text-white rounded-md flex items-center justify-center text-xs font-bold" style={{ left: `${posX}%`, top: `${posY}%` }}>
          🚙 Me
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[180px]">
        <div />
        <button onClick={() => handleMove('U')} className="py-2.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold">▲</button>
        <div />
        <button onClick={() => handleMove('L')} className="py-2.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold">◀</button>
        <button onClick={() => handleMove('D')} className="py-2.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold">▼</button>
        <button onClick={() => handleMove('R')} className="py-2.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold">▶</button>
      </div>
    </div>
  )
}

// ==========================================
// 7. REVERSE BAY PARKING (Parking)
// ==========================================
function SimReverseBayParking({ onComplete }: { onComplete: () => void }) {
  // Similar model as parallel parking but aiming inside the parking lines
  return <SimParallelParking onComplete={onComplete} />
}
function SimReverseParking({ onComplete }: { onComplete: () => void }) {
  return <SimReverseBayParking onComplete={onComplete} />
}

// ==========================================
// 8. HILL STARTS (Control)
// ==========================================
function SimHillStarts({ onComplete }: { onComplete: () => void }) {
  const [clutch, setClutch] = useState(0)
  const [handbrakeReleased, setHandbrakeReleased] = useState(false)
  const [status, setStatus] = useState<'IDLE' | 'ROLLBACK' | 'SUCCESS'>('IDLE')

  const handleReleaseHandbrake = () => {
    setHandbrakeReleased(true)
    if (clutch >= 55 && clutch <= 65) {
      setStatus('SUCCESS')
      onComplete()
    } else {
      setStatus('ROLLBACK')
      setTimeout(() => {
        setHandbrakeReleased(false)
        setStatus('IDLE')
      }, 1500)
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-4 rounded-xl font-mono text-xs">
        {status === 'SUCCESS' && <span className="text-[rgb(var(--color-success))] font-bold">Hill Start Success!</span>}
        {status === 'ROLLBACK' && <span className="text-[rgb(var(--color-danger))] font-bold">🛑 Rollback Danger! Hold Handbrake.</span>}
        {status === 'IDLE' && <span>Find biting point before releasing handbrake.</span>}
      </div>

      <div className="w-full">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-2 text-left">Clutch Level: {clutch}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={clutch}
          onChange={(e) => setClutch(parseInt(e.target.value))}
          className="w-full accent-[rgb(var(--color-primary))]"
        />
      </div>

      <button
        onClick={handleReleaseHandbrake}
        className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg"
      >
        Release Handbrake
      </button>
    </div>
  )
}

// ==========================================
// 9. LANE CHANGING (Road)
// ==========================================
function SimLaneChanging({ onComplete }: { onComplete: () => void }) {
  const [lane, setLane] = useState<'left' | 'right'>('left')
  const [indicator, setIndicator] = useState<boolean>(false)
  const [done, setDone] = useState(false)

  const handleToggleIndicator = () => {
    setIndicator(!indicator)
  }

  const handleSteerLane = () => {
    if (indicator) {
      setLane('right')
      setDone(true)
      onComplete()
    } else {
      // flash warning
      alert('Always activate your turn indicators before steering into a different lane!')
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-48 rounded-2xl relative overflow-hidden flex justify-around">
        {/* Lane dividers */}
        <div className="absolute left-1/2 w-0.5 h-full bg-dashed bg-white/20 border-l border-dashed border-white/40" />

        <div className="flex flex-col items-center justify-around h-full w-1/2">
          {lane === 'left' && (
            <div className={`w-12 h-16 rounded-md bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold ${indicator ? 'animate-pulse' : ''}`}>
               Me {indicator ? '🗲' : ''}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-around h-full w-1/2">
          {lane === 'right' && (
            <div className="w-12 h-16 rounded-md bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold">
              Me
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button onClick={handleToggleIndicator} className={`flex-1 py-3 border rounded-xl font-bold text-xs ${indicator ? 'bg-[rgb(var(--color-primary))]/20 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]' : 'border-[rgb(var(--color-border))]'}`}>
          Toggle Indicator
        </button>
        <button onClick={handleSteerLane} className="flex-1 py-3 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs">
          Steer Right
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 10. TRAFFIC SIGNALS (Road Rules)
// ==========================================
function SimTrafficSignals({ onComplete }: { onComplete: () => void }) {
  const [light, setLight] = useState<'red' | 'green'>('red')
  const [speed, setSpeed] = useState(40)

  useEffect(() => {
    const interval = setInterval(() => {
      setLight(prev => prev === 'red' ? 'green' : 'red')
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = () => {
    if (light === 'red') {
      setSpeed(0)
      onComplete()
    } else {
      // Speed up
      setSpeed(50)
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-12 bg-zinc-900 p-2.5 rounded-full flex flex-col gap-2.5 items-center">
        <div className={`w-8 h-8 rounded-full ${light === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-red-950'}`} />
        <div className={`w-8 h-8 rounded-full ${light === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-green-950'}`} />
      </div>

      <div className="font-mono text-xs">Speed: {speed} km/h</div>

      <button onClick={handleAction} className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
        {light === 'red' ? 'Brake & Stop' : 'Accelerate'}
      </button>
    </div>
  )
}

// ==========================================
// 11. HIGHWAY MERGING (Advanced)
// ==========================================
function SimHighwayMerging({ onComplete }: { onComplete: () => void }) {
  const [speed, setSpeed] = useState(20)

  const handleGas = () => {
    const next = speed + 20
    setSpeed(next)
    if (next >= 80) {
      onComplete()
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-36 h-36 rounded-full border-4 border-[rgb(var(--color-border))] flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono">{speed}</span>
        <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono uppercase tracking-wider">km/h</span>
      </div>

      <button onClick={handleGas} className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
        Gas pedal
      </button>
      <span className="text-[10px] font-mono">Accelerate to at least 80 km/h to merge with traffic flow.</span>
    </div>
  )
}

// ==========================================
// 12. OVERTAKING (Advanced)
// ==========================================
function SimOvertaking({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0)

  const advanceStage = () => {
    if (stage < 3) {
      setStage(prev => (prev + 1) as any)
    } else {
      onComplete()
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-48 rounded-2xl relative overflow-hidden flex justify-around">
        {/* Lanes */}
        <div className="absolute left-1/2 w-0.5 h-full bg-dashed bg-white/20 border-l border-dashed border-white/40" />

        {/* Slow Car */}
        {stage !== 2 && (
          <div className="absolute w-12 h-16 bg-red-500/20 rounded-md top-12 left-6 flex items-center justify-center text-xs">🚗 Lead</div>
        )}

        {/* My Car Position based on stages */}
        {stage === 0 && <div className="absolute w-12 h-16 bg-[rgb(var(--color-primary))] text-white rounded-md bottom-4 left-6 flex items-center justify-center text-xs">Me</div>}
        {stage === 1 && <div className="absolute w-12 h-16 bg-[rgb(var(--color-primary))] text-white rounded-md bottom-12 right-6 flex items-center justify-center text-xs">Me</div>}
        {stage === 2 && <div className="absolute w-12 h-16 bg-[rgb(var(--color-primary))] text-white rounded-md top-4 right-6 flex items-center justify-center text-xs">Me</div>}
        {stage === 3 && <div className="absolute w-12 h-16 bg-[rgb(var(--color-primary))] text-white rounded-md top-4 left-6 flex items-center justify-center text-xs">Me</div>}
      </div>

      <button onClick={advanceStage} className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
        {stage === 0 && 'Signal Right & Merge Out'}
        {stage === 1 && 'Accelerate Past Slow Car'}
        {stage === 2 && 'Signal Left & Merge In'}
        {stage === 3 && 'Complete Overtake'}
      </button>
    </div>
  )
}

// ==========================================
// 13. EMERGENCY BRAKING (Safety)
// ==========================================
function SimEmergencyBraking({ onComplete }: { onComplete: () => void }) {
  const [running, setRunning] = useState(false)
  const [hazardVisible, setHazardVisible] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleStart = () => {
    setRunning(true)
    setHazardVisible(false)
    setSuccess(false)
    
    // trigger hazard after random delay
    setTimeout(() => {
      setHazardVisible(true)
    }, 1500 + Math.random() * 2000)
  }

  const handleBrake = () => {
    if (hazardVisible && running) {
      setSuccess(true)
      setRunning(false)
      onComplete()
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-48 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
        {hazardVisible && (
          <div className="absolute top-8 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs animate-bounce shadow-lg shadow-red-500/50">
            🛑 HAZARD!
          </div>
        )}
        {!running && !success && <span>Click Start to Accelerate</span>}
        {running && !hazardVisible && <span className="animate-pulse">Driving... Watch screen carefully!</span>}
        {success && <span className="text-[rgb(var(--color-success))] font-bold">Stopped safely! Reacted fast.</span>}
      </div>

      {!running ? (
        <button onClick={handleStart} className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
          Start Driving
        </button>
      ) : (
        <button onClick={handleBrake} className="w-full py-4 bg-[rgb(var(--color-danger))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
          SLAM BRAKES!
        </button>
      )}
    </div>
  )
}

// ==========================================
// 14. DRIVING IN RAIN (Advanced)
// ==========================================
function SimRainDriving({ onComplete }: { onComplete: () => void }) {
  const [wipers, setWipers] = useState(false)
  const [gap, setGap] = useState(2) // in seconds following distance

  const increaseGap = () => {
    setGap(prev => {
      const next = Math.min(5, prev + 1)
      if (next >= 4 && wipers) {
        onComplete()
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-slate-900 border border-[rgb(var(--color-border))] h-40 rounded-2xl relative flex items-center justify-center overflow-hidden">
        {/* Animated rain lines overlay */}
        <div className="absolute inset-0 bg-blue-500/10 opacity-70 animate-pulse pointer-events-none" />
        {wipers && <div className="absolute inset-0 border-l border-white/30 animate-spin pointer-events-none" />}

        <div className="flex flex-col gap-2 font-mono text-xs text-white">
          <span>Following Distance: {gap}s</span>
          <span>Wipers status: {wipers ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button onClick={() => setWipers(!wipers)} className={`flex-1 py-3 border rounded-xl font-bold text-xs ${wipers ? 'bg-[rgb(var(--color-primary))]/20 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]' : 'border-[rgb(var(--color-border))]'}`}>
          Toggle Wipers
        </button>
        <button onClick={increaseGap} className="flex-1 py-3 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs">
          Increase Gap
        </button>
      </div>
      <span className="text-[10px] font-mono">Turn on Wipers & maintain at least 4s following gap.</span>
    </div>
  )
}

// ==========================================
// 15. NIGHT DRIVING (Advanced)
// ==========================================
function SimNightDriving({ onComplete }: { onComplete: () => void }) {
  const [beam, setBeam] = useState<'low' | 'high'>('high')
  const [oncoming, setOncoming] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const trigger = setInterval(() => {
      setOncoming(prev => !prev)
    }, 4000)
    return () => clearInterval(trigger)
  }, [])

  useEffect(() => {
    if (oncoming && beam === 'low') {
      setSuccess(true)
      onComplete()
    }
  }, [oncoming, beam])

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className={`w-full h-40 border rounded-2xl relative flex items-center justify-center transition-colors duration-500 ${beam === 'high' ? 'bg-zinc-800' : 'bg-black'}`}>
        {oncoming && (
          <div className="absolute right-4 w-12 h-12 rounded-full bg-yellow-400 animate-pulse border-2 border-yellow-200 shadow-xl shadow-yellow-200/50 flex items-center justify-center text-[10px] text-zinc-900 font-bold">
            ONCOMING
          </div>
        )}
        <div className="text-white font-mono text-xs">My Beam: {beam.toUpperCase()}</div>
      </div>

      <button onClick={() => setBeam(prev => prev === 'high' ? 'low' : 'high')} className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
        Toggle High/Low Beam
      </button>
      <span className="text-[10px] font-mono">Dip headlights to LOW beam when oncoming car appears!</span>
    </div>
  )
}

// ==========================================
// 16. ROUNDABOUTS (Road)
// ==========================================
function SimRoundabouts({ onComplete }: { onComplete: () => void }) {
  const [yielded, setYielded] = useState(false)
  const [exited, setExited] = useState(false)

  const handleYield = () => {
    setYielded(true)
  }

  const handleExit = () => {
    if (yielded) {
      setExited(true)
      onComplete()
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-44 rounded-2xl relative overflow-hidden flex items-center justify-center">
        {/* Roundabout track */}
        <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center text-xs">
          Center
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button onClick={handleYield} className={`flex-1 py-3 border rounded-xl font-bold text-xs ${yielded ? 'bg-[rgb(var(--color-success))]/20 border-[rgb(var(--color-success))] text-[rgb(var(--color-success))]' : 'border-[rgb(var(--color-border))]'}`}>
          Yield to Traffic
        </button>
        <button onClick={handleExit} className="flex-1 py-3 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs">
          Signal & Exit
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 17. PARKING ALIGNMENT (Parking)
// ==========================================
function SimParkingAlignment({ onComplete }: { onComplete: () => void }) {
  const [dist, setDist] = useState(50) // in cm

  const handleAlign = (dir: 'L' | 'R') => {
    setDist(prev => {
      const next = dir === 'L' ? Math.max(0, prev - 5) : Math.min(100, prev + 5)
      if (next >= 15 && next <= 30) {
        onComplete()
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-40 rounded-2xl relative overflow-hidden flex items-end">
        {/* Curb line */}
        <div className="absolute right-0 w-2 h-full bg-slate-400" />
        <span className="absolute top-2 right-4 text-[8px] font-bold text-slate-400">CURB</span>

        {/* Car body */}
        <div className="absolute w-12 h-20 rounded-md bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-xs font-bold transition-all duration-200" style={{ right: `${dist * 2}px`, bottom: '20px' }}>
          🚙 Me
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button onClick={() => handleAlign('L')} className="flex-1 py-3 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold text-xs">Steer Left</button>
        <button onClick={() => handleAlign('R')} className="flex-1 py-3 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl font-bold text-xs">Steer Right</button>
      </div>

      <span className="text-xs font-mono">Distance to Curb: {dist} cm</span>
      <span className="text-[10px] font-mono text-[rgb(var(--color-text-3))]">Aim for the sweet spot: 15cm to 30cm.</span>
    </div>
  )
}

// ==========================================
// 18. BLIND SPOT AWARENESS (Safety)
// ==========================================
function SimBlindSpots({ onComplete }: { onComplete: () => void }) {
  const [checked, setChecked] = useState(false)

  const handleShoulderCheck = () => {
    setChecked(true)
    onComplete()
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs text-center">
      <div className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] h-44 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
        {/* Blind spot car icon */}
        <div className="absolute top-12 right-2 w-8 h-12 bg-red-500/10 rounded flex items-center justify-center text-xs">🚗</div>
        
        {checked ? (
          <span className="text-[rgb(var(--color-success))] font-bold">Check ok! Noticed hidden car in blind spot.</span>
        ) : (
          <span className="text-xs text-[rgb(var(--color-text-2))] p-4">Car is trailing in your rear right quarter. Always check shoulder!</span>
        )}
      </div>

      <button onClick={handleShoulderCheck} className="w-full py-4 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
        Shoulder Check (Look back)
      </button>
    </div>
  )
}
