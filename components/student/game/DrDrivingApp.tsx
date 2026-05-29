"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Box, Plane, Environment, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { Trophy, AlertTriangle, ArrowRight, Play, Coins } from 'lucide-react'

// --- CONSTANTS & TYPES ---
type GameState = 'GARAGE' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'
type GameMode = 'SPEED' | 'PARKING' | 'HIGHWAY'
type Gear = 'P' | 'R' | 'N' | 'D'

const VEHICLE_PROFILES = [
  { id: 'sedan', name: 'Sedan', price: 0, color: '#3b82f6', maxSpeed: 0.15, accel: 0.002, brake: 0.005, w: 1.8, h: 0.4, l: 4.2, cabinH: 0.6, cabinL: 2.2, cabinOffset: -0.4 },
  { id: 'suv', name: 'SUV', price: 1000, color: '#f97316', maxSpeed: 0.12, accel: 0.0015, brake: 0.004, w: 2.0, h: 0.6, l: 4.8, cabinH: 0.8, cabinL: 2.8, cabinOffset: -0.2 },
  { id: 'sports', name: 'Sports', price: 5000, color: '#ef4444', maxSpeed: 0.25, accel: 0.004, brake: 0.008, w: 1.9, h: 0.3, l: 4.5, cabinH: 0.5, cabinL: 2.0, cabinOffset: -0.5 },
]

// --- SOUNDS HOOK ---
function useGameSounds() {
  const engineAudioRef = useRef<HTMLAudioElement | null>(null)
  const crashAudioRef = useRef<HTMLAudioElement | null>(null)
  const winAudioRef = useRef<HTMLAudioElement | null>(null)

  const initAudio = useCallback(() => {
    if (!engineAudioRef.current) {
      engineAudioRef.current = new Audio('https://cdn.freesound.org/previews/118/118558_2124559-lq.mp3')
      engineAudioRef.current.loop = true
      engineAudioRef.current.volume = 0.0
      crashAudioRef.current = new Audio('https://cdn.freesound.org/previews/587/587443_5487341-lq.mp3')
      winAudioRef.current = new Audio('https://cdn.freesound.org/previews/842/842513_14031674-lq.mp3')
    }
    if (engineAudioRef.current.paused) {
      engineAudioRef.current.play().catch(() => {})
    }
  }, [])

  const updateEngine = useCallback((speed: number, gas: boolean) => {
    if (!engineAudioRef.current || engineAudioRef.current.paused) return
    const targetPitch = Math.max(0.8, 0.8 + (Math.abs(speed) * 5) + (gas ? 0.3 : 0))
    const targetGain = gas ? 0.8 : (Math.abs(speed) > 0.01 ? 0.5 : 0.3)
    engineAudioRef.current.playbackRate += (targetPitch - engineAudioRef.current.playbackRate) * 0.1
    engineAudioRef.current.volume += (targetGain - engineAudioRef.current.volume) * 0.1
  }, [])

  const playCrash = () => { if (crashAudioRef.current) { crashAudioRef.current.currentTime = 0; crashAudioRef.current.play().catch(()=>{}) }; if (engineAudioRef.current) engineAudioRef.current.volume = 0; }
  const playWin = () => { if (winAudioRef.current) { winAudioRef.current.currentTime = 0; winAudioRef.current.play().catch(()=>{}) }; if (engineAudioRef.current) engineAudioRef.current.volume = 0; }

  useEffect(() => {
    return () => { if (engineAudioRef.current) engineAudioRef.current.pause() }
  }, [])

  return { initAudio, updateEngine, playCrash, playWin }
}

// --- VEHICLE MESH ---
function VehicleMesh({ profile }: { profile: any }) {
  const glassMaterial = new THREE.MeshPhysicalMaterial({ color: '#000000', metalness: 0.9, roughness: 0.1, clearcoat: 1.0 })
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: profile.color, metalness: 0.6, roughness: 0.4, clearcoat: 0.8 })
  const plasticMaterial = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9 })

  return (
    <group position={[0, -0.4, 0]}>
      <RoundedBox args={[profile.w, profile.h, profile.l]} radius={0.1} smoothness={4} position={[0, 0.4 + profile.h/2, 0]} castShadow receiveShadow>
        <primitive object={bodyMaterial} attach="material" />
      </RoundedBox>
      <RoundedBox args={[profile.w * 0.85, profile.cabinH, profile.cabinL]} radius={0.08} smoothness={4} position={[0, 0.4 + profile.h + profile.cabinH/2 - 0.05, profile.cabinOffset]} castShadow>
        <primitive object={glassMaterial} attach="material" />
      </RoundedBox>
      <mesh position={[0, 0.4 + profile.h/2 - 0.05, -profile.l/2 - 0.01]} castShadow>
        <boxGeometry args={[profile.w * 0.6, profile.h * 0.5, 0.05]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      {[-1, 1].map((x) => 
        [-1, 1].map((z) => (
          <group key={`${x}-${z}`} position={[x * (profile.w/2), 0.4, z * (profile.l/2 - 0.6)]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
            <mesh position={[0, x * 0.13, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
              <meshStandardMaterial color="#cccccc" metalness={0.8} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

// --- CITY ENVIRONMENT ---
function CityEnvironment() {
  return (
    <group>
      {/* Main Road Segment */}
      <Plane args={[20, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]} receiveShadow>
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </Plane>
      {/* Road Lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Plane key={i} args={[0.2, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -i * 8]} receiveShadow>
          <meshBasicMaterial color="#ffffff" />
        </Plane>
      ))}
      {/* Buildings (Simple Blocks) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <React.Fragment key={i}>
          <Box args={[10, Math.random() * 20 + 10, 10]} position={[-16, 0, -i * 20]} castShadow receiveShadow>
            <meshStandardMaterial color={['#e2e8f0', '#cbd5e1', '#94a3b8'][Math.floor(Math.random() * 3)]} />
          </Box>
          <Box args={[10, Math.random() * 20 + 10, 10]} position={[16, 0, -i * 20]} castShadow receiveShadow>
            <meshStandardMaterial color={['#e2e8f0', '#cbd5e1', '#94a3b8'][Math.floor(Math.random() * 3)]} />
          </Box>
        </React.Fragment>
      ))}
    </group>
  )
}

// --- PHYSICS CONTROLLER ---
function VehicleController({ profile, mode, inputRef, onSpeedChange, onCrash, onWin, updateEngine }: any) {
  const groupRef = useRef<THREE.Group>(null)
  const speedRef = useRef(0)
  const angleRef = useRef(0)
  const posRef = useRef({ x: 0, z: 0 })
  const steerRef = useRef(0)

  useFrame((state) => {
    if (!groupRef.current) return
    const input = inputRef.current
    let speed = speedRef.current
    const FRICTION = 0.98

    // Steering Physics
    let targetSteer = 0
    if (input.isDraggingSteering) {
      targetSteer = input.steeringAngle / 180 * Math.PI
    }
    steerRef.current += (targetSteer - steerRef.current) * 0.1

    // Dr. Driving rapid steering response
    if (Math.abs(speed) > 0.01) {
      angleRef.current -= steerRef.current * (speed > 0 ? 0.05 : -0.05)
    }

    // Acceleration/Braking
    if (input.gas) {
      if (input.gear === 'D') speed = Math.min(speed + profile.accel, profile.maxSpeed)
      if (input.gear === 'R') speed = Math.max(speed - profile.accel, -profile.maxSpeed)
    }
    if (input.brake) speed = Math.sign(speed) * Math.max(Math.abs(speed) - profile.brake, 0)

    updateEngine(speed, input.gas)

    if (!input.gas && !input.brake) speed *= FRICTION
    if (Math.abs(speed) < 0.001) speed = 0

    speedRef.current = speed
    posRef.current.x += Math.sin(angleRef.current) * speed
    posRef.current.z += Math.cos(angleRef.current) * speed

    groupRef.current.position.set(posRef.current.x, 0, posRef.current.z)
    groupRef.current.rotation.y = angleRef.current

    // Camera follow (arcade style, locked behind car)
    const camOffsetZ = Math.cos(angleRef.current) * 6
    const camOffsetX = Math.sin(angleRef.current) * 6
    state.camera.position.set(posRef.current.x + camOffsetX, 3, posRef.current.z + camOffsetZ)
    state.camera.lookAt(posRef.current.x, 1, posRef.current.z)

    onSpeedChange(Math.abs(Math.round(speed * 200)))

    // Crash detection (sidewalks)
    if (posRef.current.x < -10 || posRef.current.x > 10) {
      onCrash()
    }
  })

  return (
    <group ref={groupRef}>
      <VehicleMesh profile={profile} />
    </group>
  )
}

// --- MAIN APP ---
export function DrDrivingApp() {
  const [gameState, setGameState] = useState<GameState>('GARAGE')
  const [mode, setMode] = useState<GameMode>('SPEED')
  const [coins, setCoins] = useState(1500)
  const [unlockedCars, setUnlockedCars] = useState(['sedan'])
  const [selectedCarIndex, setSelectedCarIndex] = useState(0)

  const [speedUI, setSpeedUI] = useState(0)
  const [gearUI, setGearUI] = useState<Gear>('P')
  const [steerAngleUI, setSteerAngleUI] = useState(0)
  
  const inputRef = useRef({ gas: false, brake: false, gear: 'P', steeringAngle: 0, isDraggingSteering: false })
  const steeringWheelRef = useRef<HTMLDivElement>(null)
  
  const { initAudio, updateEngine, playCrash, playWin } = useGameSounds()

  const selectedProfile = VEHICLE_PROFILES[selectedCarIndex]

  // HUD Controllers
  const handlePointerDown = (e: any) => { inputRef.current.isDraggingSteering = true; updateSteering(e); initAudio(); }
  const handlePointerUp = () => { inputRef.current.isDraggingSteering = false; inputRef.current.steeringAngle = 0; setSteerAngleUI(0); }
  const handlePointerMove = (e: any) => { if (inputRef.current.isDraggingSteering) updateSteering(e) }
  
  const updateSteering = (e: any) => {
    if (!steeringWheelRef.current) return
    const rect = steeringWheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
    angle = angle + 90
    if (angle > 180) angle -= 360
    angle = Math.max(-120, Math.min(120, angle))
    inputRef.current.steeringAngle = angle
    setSteerAngleUI(angle)
  }

  const changeGear = (g: Gear) => {
    setGearUI(g)
    inputRef.current.gear = g
  }

  const handleCrash = () => {
    setGameState('GAME_OVER')
    playCrash()
  }

  const buyCar = () => {
    if (coins >= selectedProfile.price && !unlockedCars.includes(selectedProfile.id)) {
      setCoins(c => c - selectedProfile.price)
      setUnlockedCars([...unlockedCars, selectedProfile.id])
    }
  }

  return (
    <div className="fixed inset-0 bg-sky-300 font-sans select-none overflow-hidden touch-none" onPointerDown={initAudio} onTouchStart={initAudio}>
      
      {/* 3D RENDERER */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 3, 6], fov: 60 }}>
          <Environment preset="city" />
          <Sky distance={450000} sunPosition={[0, 1, 0]} />
          <ambientLight intensity={0.6} />
          <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
          
          {gameState === 'GARAGE' ? (
             <group>
               <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                 <meshStandardMaterial color="#222" roughness={0.1} metalness={0.5} />
               </Plane>
               {/* Turntable */}
               <group rotation={[0, Date.now() * 0.0005, 0]}>
                 <VehicleMesh profile={selectedProfile} />
               </group>
               <ContactShadows position={[0, 0.01, 0]} opacity={0.8} scale={10} blur={2} far={4} />
             </group>
          ) : (
             <>
               <CityEnvironment />
               <VehicleController 
                 profile={selectedProfile} 
                 mode={mode} 
                 inputRef={inputRef}
                 onSpeedChange={setSpeedUI}
                 onCrash={handleCrash}
                 onWin={() => { setGameState('VICTORY'); playWin(); }}
                 updateEngine={updateEngine}
               />
               <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={15} blur={2} far={4} />
             </>
          )}
        </Canvas>
      </div>

      {/* GARAGE UI */}
      {gameState === 'GARAGE' && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none">
          <div className="flex justify-between items-start w-full">
            <h1 className="text-4xl font-black italic text-white drop-shadow-lg tracking-tighter">DR. ACADEMY</h1>
            <div className="bg-black/60 backdrop-blur-md border-2 border-yellow-400 px-4 py-2 rounded-full flex items-center gap-2">
              <Coins className="text-yellow-400 w-6 h-6" />
              <span className="text-yellow-400 font-bold text-xl">{coins}</span>
            </div>
          </div>

          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button onClick={() => setSelectedCarIndex((i) => Math.max(0, i - 1))} className="bg-white/20 p-4 rounded-full backdrop-blur-md hover:bg-white/40">{'<'}</button>
            
            <div className="flex flex-col items-center bg-black/60 p-6 rounded-2xl backdrop-blur-md border-2 border-white/10 w-80">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedProfile.name}</h2>
              <div className="flex flex-col gap-2 w-full text-white/80 text-sm mb-4">
                <div className="flex justify-between"><span>Speed</span><div className="w-32 bg-white/20 h-4 rounded"><div className="bg-sky-400 h-full rounded" style={{width: `${selectedProfile.maxSpeed*400}%`}}/></div></div>
                <div className="flex justify-between"><span>Accel</span><div className="w-32 bg-white/20 h-4 rounded"><div className="bg-orange-400 h-full rounded" style={{width: `${selectedProfile.accel*10000}%`}}/></div></div>
              </div>

              {unlockedCars.includes(selectedProfile.id) ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between gap-2">
                    <button onClick={() => { setMode('SPEED'); setGameState('PLAYING'); }} className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg">Speed</button>
                    <button onClick={() => { setMode('HIGHWAY'); setGameState('PLAYING'); }} className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg">Highway</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={buyCar}
                  disabled={coins < selectedProfile.price}
                  className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg ${coins >= selectedProfile.price ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-500 text-gray-300'}`}
                >
                  Buy for {selectedProfile.price} <Coins className="w-5 h-5"/>
                </button>
              )}
            </div>

            <button onClick={() => setSelectedCarIndex((i) => Math.min(VEHICLE_PROFILES.length - 1, i + 1))} className="bg-white/20 p-4 rounded-full backdrop-blur-md hover:bg-white/40">{'>'}</button>
          </div>
        </div>
      )}

      {/* IN-GAME HUD */}
      {gameState === 'PLAYING' && (
        <>
          <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-20">
            <div className="bg-black/80 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-mono text-emerald-400 font-bold text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-md">
              <span className="tabular-nums tracking-tighter w-10 sm:w-12 text-right">{speedUI}</span> 
              <span className="text-[10px] sm:text-[12px] text-emerald-600 tracking-widest mt-1">KM/H</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex flex-col gap-2 sm:gap-4 items-center sm:items-start z-20 pointer-events-auto">
            <div className="bg-black/90 border-2 border-white/10 rounded-full p-1 flex flex-row items-center shadow-xl backdrop-blur-md scale-90 sm:scale-100 origin-bottom-left">
              {(['P', 'R', 'N', 'D'] as Gear[]).map(g => (
                <button
                  key={g} onClick={() => changeGear(g)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-black text-lg sm:text-xl flex items-center justify-center transition-all mx-1 ${
                    gearUI === g ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.8)] scale-110' : 'text-white/40 hover:bg-white/10'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div 
              ref={steeringWheelRef}
              onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
              className="w-32 h-32 sm:w-48 sm:h-48 relative flex items-center justify-center touch-none cursor-grab active:cursor-grabbing will-change-transform"
              style={{ transform: `rotate(${steerAngleUI}deg)` }}
            >
              <svg width="100%" height="100%" viewBox="0 0 160 160" fill="none" className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
                <circle cx="80" cy="80" r="70" stroke="#111" strokeWidth="20" />
                <circle cx="80" cy="80" r="68" stroke="#222" strokeWidth="16" />
                <path d="M20 80 L60 80" stroke="#333" strokeWidth="16" />
                <path d="M140 80 L100 80" stroke="#333" strokeWidth="16" />
                <path d="M80 140 L80 100" stroke="#333" strokeWidth="16" />
                <circle cx="80" cy="80" r="26" fill="#111" stroke="#333" strokeWidth="4"/>
              </svg>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2 sm:gap-4 items-end z-20 pointer-events-auto">
             <button
              onPointerDown={() => { inputRef.current.brake = true; initAudio(); }} onPointerUp={() => { inputRef.current.brake = false }} onPointerLeave={() => { inputRef.current.brake = false }}
              className="w-14 h-20 sm:w-20 sm:h-24 relative active:scale-95 transition-transform touch-none"
            >
              <svg width="100%" height="100%" viewBox="0 0 80 96" fill="none" className="drop-shadow-[0_15px_20px_rgba(220,38,38,0.4)]">
                <rect x="4" y="4" width="72" height="88" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="3"/>
                <rect x="8" y="8" width="64" height="80" rx="4" fill="#171717"/>
              </svg>
            </button>
            <button
              onPointerDown={() => { inputRef.current.gas = true; initAudio(); }} onPointerUp={() => { inputRef.current.gas = false }} onPointerLeave={() => { inputRef.current.gas = false }}
              className="w-14 h-28 sm:w-16 sm:h-36 relative active:scale-95 transition-transform touch-none"
            >
              <svg width="100%" height="100%" viewBox="0 0 64 128" fill="none" className="drop-shadow-[0_15px_20px_rgba(16,185,129,0.3)]">
                <rect x="4" y="4" width="56" height="120" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="3"/>
                <rect x="8" y="8" width="48" height="112" rx="4" fill="#171717"/>
              </svg>
            </button>
          </div>
        </>
      )}

      {/* GAME OVER UI */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-red-900/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-black/80 border-4 border-red-500 p-8 rounded-2xl flex flex-col items-center gap-6 shadow-2xl">
            <AlertTriangle className="w-24 h-24 text-red-500 animate-pulse" />
            <h2 className="text-4xl font-black text-white uppercase tracking-wider">Accident!</h2>
            <button onClick={() => setGameState('GARAGE')} className="bg-white text-black px-8 py-3 rounded-full font-bold text-xl hover:bg-gray-200">Return to Garage</button>
          </div>
        </div>
      )}
    </div>
  )
}
