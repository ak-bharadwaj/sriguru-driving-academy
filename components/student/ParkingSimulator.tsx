"use client"

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Trophy, AlertTriangle, Route, X, Car as CarIcon, Truck, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Box, Plane, Environment, ContactShadows, RoundedBox } from '@react-three/drei'
import { CityIntersectionEnvironment } from './CityIntersectionEnvironment'
import { NarrowRoadEnvironment } from './NarrowRoadEnvironment'

// Custom hook to synthesize high-quality ARCADE vehicle sounds
function useVehicleSounds() {
  const ctxRef = useRef<AudioContext | null>(null)
  const engineOscRef = useRef<OscillatorNode | null>(null)
  const engineGainRef = useRef<GainNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)

  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
      if (!Ctx) return
      ctxRef.current = new Ctx()

      // Arcade Engine Core (Sawtooth for a slightly buzzy, rich tone)
      engineOscRef.current = ctxRef.current.createOscillator()
      engineOscRef.current.type = 'sawtooth'
      engineOscRef.current.frequency.value = 50 // Idle pitch

      // LFO for the engine "purr/rumble"
      lfoRef.current = ctxRef.current.createOscillator()
      lfoRef.current.type = 'sine'
      lfoRef.current.frequency.value = 15 // Rumble speed
      
      const lfoGain = ctxRef.current.createGain()
      lfoGain.gain.value = 5 // Vibrato depth (pitch modulation)
      lfoRef.current.connect(lfoGain)
      lfoGain.connect(engineOscRef.current.frequency) // Modulate engine pitch

      // Master Gain for Engine
      engineGainRef.current = ctxRef.current.createGain()
      engineGainRef.current.gain.value = 0.0 

      // Lowpass filter to muffle the harsh sawtooth into a nice arcade hum
      const filter = ctxRef.current.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 300 // Muffled idle

      engineOscRef.current.connect(filter)
      filter.connect(engineGainRef.current)
      engineGainRef.current.connect(ctxRef.current.destination)
      
      engineOscRef.current.start()
      lfoRef.current.start()
    }
    
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
  }, [])

  const updateEngine = useCallback((speed: number, gas: boolean) => {
    if (!ctxRef.current || !engineOscRef.current || !engineGainRef.current || !lfoRef.current) return
    
    // Pitch goes up with speed. Gas adds an immediate pitch jump.
    const targetPitch = 50 + (Math.abs(speed) * 1200) + (gas ? 30 : 0)
    engineOscRef.current.frequency.setTargetAtTime(targetPitch, ctxRef.current.currentTime, 0.1)

    // LFO (rumble) speed increases with engine pitch
    const rumbleSpeed = 15 + (Math.abs(speed) * 50)
    lfoRef.current.frequency.setTargetAtTime(rumbleSpeed, ctxRef.current.currentTime, 0.1)

    // Volume logic
    const targetGain = gas ? 0.25 : (Math.abs(speed) > 0.01 ? 0.15 : 0.05)
    engineGainRef.current.gain.setTargetAtTime(targetGain, ctxRef.current.currentTime, 0.2)
  }, [])

  const playCrash = useCallback(() => {
    if (!ctxRef.current) return
    // Arcade Crash: A rapid frequency sweep down on a complex waveform
    const osc = ctxRef.current.createOscillator()
    const gain = ctxRef.current.createGain()
    osc.type = 'sawtooth' // Harsh waveform for impact
    
    // Pitch drops drastically from 200Hz down to 20Hz
    osc.frequency.setValueAtTime(200, ctxRef.current.currentTime)
    osc.frequency.exponentialRampToValueAtTime(10, ctxRef.current.currentTime + 0.4)
    
    gain.gain.setValueAtTime(0.6, ctxRef.current.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctxRef.current.currentTime + 0.4)

    osc.connect(gain)
    gain.connect(ctxRef.current.destination)
    osc.start()
    osc.stop(ctxRef.current.currentTime + 0.4)

    // Mute engine briefly during crash
    if (engineGainRef.current) {
      engineGainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime)
    }
  }, [])

  const playWin = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    // Arcade Win: Happy major arpeggio
    const frequencies = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle' // Sweet, rounded retro tone
      osc.frequency.value = freq
      
      const startTime = ctx.currentTime + (i * 0.12)
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.4)
    })
    
    // Mute engine briefly during win jingle
    if (engineGainRef.current) {
      engineGainRef.current.gain.setValueAtTime(0, ctx.currentTime)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (engineOscRef.current) { try { engineOscRef.current.stop() } catch (e) {} }
      if (lfoRef.current) { try { lfoRef.current.stop() } catch (e) {} }
      if (ctxRef.current) { ctxRef.current.close() }
    }
  }, [])

  return { initAudio, updateEngine, playCrash, playWin }
}

// Realistic Vehicle Physics Profiles (no React components - avoids SSR hydration errors)
const VEHICLE_PROFILES = {
  sedan: {
    id: 'sedan',
    name: 'Standard Car',
    maxSpeed: 0.08,
    acceleration: 0.0008,
    brakingPower: 0.003,
    color: '#3b82f6',
    w: 1.8, h: 0.4, l: 4.2,
    cabinOffset: 0, cabinL: 2.0, cabinH: 0.4, // Centered cabin
  },
  suv: {
    id: 'suv',
    name: 'Family SUV',
    maxSpeed: 0.06,
    acceleration: 0.0006,
    brakingPower: 0.004,
    color: '#64748b',
    w: 2.0, h: 0.6, l: 4.8,
    cabinOffset: 0.5, cabinL: 3.4, cabinH: 0.5, // Cabin extends to the rear (+Z)
  },
  truck: {
    id: 'truck',
    name: 'Pickup Truck',
    maxSpeed: 0.05,
    acceleration: 0.0005,
    brakingPower: 0.002,
    color: '#ef4444',
    w: 2.1, h: 0.6, l: 5.5,
    cabinOffset: -0.8, cabinL: 1.5, cabinH: 0.5, // Cabin is near the front (-Z), leaving long bed in rear (+Z)
  }
}

// Separate icon map - keeps React components out of serializable data
const VEHICLE_ICONS = {
  sedan: CarIcon,
  suv: CarIcon,
  truck: Truck,
}

const FRICTION = 0.98
type Gear = 'P' | 'R' | 'N' | 'D'
const START_POS = { x: 0, z: 25, angle: 0 }

const PERP_X = -12;
const PARA_X = 12;

const PARKING_BAYS = [
  // Scenario A: The Busy Row (Perpendicular)
  { x: PERP_X, z: -4, angle: Math.PI / 2, width: 3.5, length: 6, type: 'bay' },
  { x: PERP_X, z: -16, angle: Math.PI / 2, width: 3.5, length: 6, type: 'bay' }, // Tight gap
  // Scenario B: Parallel Parking Challenge
  { x: PARA_X, z: -15, angle: 0, width: 3, length: 7, type: 'parallel' },
]

const NPC_CARS = [
  // Row of perpendicular bays (-X side)
  { x: PERP_X, z: 0, angle: Math.PI / 2, profile: VEHICLE_PROFILES.sedan, color: '#eab308' },
  { x: PERP_X, z: -8, angle: Math.PI / 2, profile: VEHICLE_PROFILES.suv, color: '#f97316' },
  { x: PERP_X, z: -12, angle: Math.PI / 2, profile: VEHICLE_PROFILES.sedan, color: '#14b8a6' },
  { x: PERP_X, z: -20, angle: Math.PI / 2, profile: VEHICLE_PROFILES.truck, color: '#6366f1' },
  { x: PERP_X, z: -24, angle: Math.PI / 2, profile: VEHICLE_PROFILES.sedan, color: '#d946ef' },

  // Parallel parking cars (+X side)
  { x: PARA_X, z: -8, angle: 0, profile: VEHICLE_PROFILES.sedan, color: '#0ea5e9' },
  { x: PARA_X, z: -22, angle: 0, profile: VEHICLE_PROFILES.suv, color: '#8b5cf6' },
]

const CONES = [
  // Start gate
  { x: -4, z: 22 }, { x: -4, z: 24 }, { x: 4, z: 22 }, { x: 4, z: 24 },
  // Slalom Course
  { x: -2, z: 15 }, { x: 2, z: 8 }, { x: -2, z: 1 },
  // Center dividing line to prevent cutting across parking lot
  { x: 0, z: -2 }, { x: 0, z: -5 }, { x: 0, z: -10 }, { x: 0, z: -15 }, { x: 0, z: -20 }, { x: 0, z: -25 }
]

const MISSIONS = [
  { title: 'Mission 1: Follow the Path' },
  { title: 'Mission 2: Stop at the Intersection' },
  { title: 'Mission 3: Park the Car' },
]

function VehicleMesh({ profile }: any) {
  // Use a glass material for the cabin
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#000000', metalness: 0.9, roughness: 0.1, envMapIntensity: 1.0, clearcoat: 1.0, clearcoatRoughness: 0.1
  })
  
  // Metallic car paint
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: profile.color, metalness: 0.6, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.2
  })

  // Matte plastic for bumpers/grill
  const plasticMaterial = new THREE.MeshStandardMaterial({
    color: '#1a1a1a', roughness: 0.9, metalness: 0.1
  })

  return (
    <group position={[0, -0.4, 0]}>
      {/* Main Body (Smooth) */}
      <RoundedBox args={[profile.w, profile.h, profile.l]} radius={0.1} smoothness={4} position={[0, 0.4 + profile.h/2, 0]} castShadow receiveShadow>
        <primitive object={bodyMaterial} attach="material" />
      </RoundedBox>

      {/* Cabin/Glass (Smooth) */}
      <RoundedBox args={[profile.w * 0.85, profile.cabinH, profile.cabinL]} radius={0.08} smoothness={4} position={[0, 0.4 + profile.h + profile.cabinH/2 - 0.05, profile.cabinOffset]} castShadow>
        <primitive object={glassMaterial} attach="material" />
      </RoundedBox>

      {/* Front Grill */}
      <mesh position={[0, 0.4 + profile.h/2 - 0.05, -profile.l/2 - 0.01]} castShadow>
        <boxGeometry args={[profile.w * 0.6, profile.h * 0.5, 0.05]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>

      {/* Front Bumper */}
      <mesh position={[0, 0.4 + 0.05, -profile.l/2 - 0.02]} castShadow>
        <boxGeometry args={[profile.w * 0.95, 0.1, 0.1]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      
      {/* Rear Bumper */}
      <mesh position={[0, 0.4 + 0.05, profile.l/2 + 0.02]} castShadow>
        <boxGeometry args={[profile.w * 0.95, 0.1, 0.1]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      
      {/* Side Mirrors */}
      <mesh position={[profile.w/2 + 0.05, 0.4 + profile.h + 0.05, profile.cabinOffset - profile.cabinL/3]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      <mesh position={[-profile.w/2 - 0.05, 0.4 + profile.h + 0.05, profile.cabinOffset - profile.cabinL/3]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      
      {/* Headlights (Front is -Z) */}
      <mesh position={[profile.w/2 - 0.35, 0.4 + profile.h/2 + 0.05, -profile.l/2 - 0.02]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-profile.w/2 + 0.35, 0.4 + profile.h/2 + 0.05, -profile.l/2 - 0.02]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Tail lights (Back is +Z) */}
      <mesh position={[profile.w/2 - 0.35, 0.4 + profile.h/2, profile.l/2 + 0.02]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-profile.w/2 + 0.35, 0.4 + profile.h/2, profile.l/2 + 0.02]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Wheels */}
      {[-1, 1].map((x) => 
        [-1, 1].map((z) => (
          <group key={`${x}-${z}`} position={[x * (profile.w/2), 0.4, z * (profile.l/2 - 0.6)]} rotation={[0, 0, Math.PI / 2]}>
            {/* Tire */}
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
            {/* Hubcap */}
            <mesh position={[0, x * 0.13, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
              <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

function Car({ inputRef, speedRef, carPosRef, carAngleRef, hasCrashedRef, hasWonRef, onSpeedChange, onCrash, onWin, setSteerAngleUI, profile, targetZone = PARKING_BAYS[0], missionStepRef, advanceMission, updateEngine, scenario, coachTextRef }: any) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (hasCrashedRef.current || hasWonRef.current) return

    const input = inputRef.current
    
    // Steering - Increased responsiveness for zero delay feel
    if (input.a || input.ArrowLeft) {
      input.steerAngle = Math.max(input.steerAngle - 0.15, -1)
      input.isDraggingSteering = false
    } else if (input.d || input.ArrowRight) {
      input.steerAngle = Math.min(input.steerAngle + 0.15, 1)
      input.isDraggingSteering = false
    } 
    if (!input.isDraggingSteering && !(input.a || input.ArrowLeft || input.d || input.ArrowRight)) {
      // Faster auto-center
      input.steerAngle += (0 - input.steerAngle) * 0.2
      if (Math.abs(input.steerAngle) < 0.01) input.steerAngle = 0
    }

    setSteerAngleUI(input.steerAngle * 120)

    // Gas & Brake
    const isGas = input.gas || input.w || input.ArrowUp
    const isBrake = input.brake || input.s || input.ArrowDown
    const currentGear = input.gear

    let speed = speedRef.current

    if (currentGear === 'D') {
      if (isGas) speed = Math.min(speed + profile.acceleration, profile.maxSpeed)
      if (isBrake) speed = Math.max(speed - profile.brakingPower, 0)
    } else if (currentGear === 'R') {
      if (isGas) speed = Math.max(speed - profile.acceleration, -profile.maxSpeed / 1.5)
      if (isBrake) speed = Math.min(speed + profile.brakingPower, 0)
    }

    updateEngine(speed, isGas)

    if (!isGas && !isBrake) {
      speed *= FRICTION
      if (Math.abs(speed) < 0.0001) speed = 0
    }

    let angle = carAngleRef.current
    
    // REALISTIC KINEMATIC BICYCLE MODEL
    const wheelbase = profile.l * 0.75 // Distance between front and rear axles
    const maxSteerAngle = 0.6 // ~35 degrees max steering angle
    const steer = input.steerAngle * maxSteerAngle
    
    // Angular velocity: omega = -(v / L) * tan(delta)
    // Note: Negative sign because in Three.js, positive Y rotation is Counter-Clockwise (Left).
    // So to steer Right (positive steer), we need negative angular velocity.
    const omega = -(speed / wheelbase) * Math.tan(steer)
    angle += omega

    carAngleRef.current = angle
    speedRef.current = speed

    const dx = -Math.sin(angle) * speed
    const dz = -Math.cos(angle) * speed

    const pos = carPosRef.current
    pos.x += dx
    pos.z += dz

    if (groupRef.current) {
      groupRef.current.position.set(pos.x, 0.5, pos.z)
      groupRef.current.rotation.y = angle
    }

    // Dynamic Chase Camera
    const cameraDistance = 10
    const cameraHeight = 5
    // Camera is positioned BEHIND the car (+Z direction when angle is 0)
    const camX = pos.x + Math.sin(angle) * cameraDistance
    const camZ = pos.z + Math.cos(angle) * cameraDistance
    
    state.camera.position.lerp(new THREE.Vector3(camX, cameraHeight, camZ), 0.1)
    // Look slightly AHEAD of the car's current position (-Z direction when angle is 0)
    const lookX = pos.x - Math.sin(angle) * 5
    const lookZ = pos.z - Math.cos(angle) * 5
    state.camera.lookAt(lookX, 0, lookZ)

    onSpeedChange(Math.abs(Math.round(speed * 200))) // Scale to realistic KM/H display

    // Boundary Crash (Lot is 200x300 now)
    if (pos.x < -100 || pos.x > 100 || pos.z < -150 || pos.z > 150) {
       onCrash()
       return
    }

    // 2-Circle Capsule Approximation for Player Car (Front and Rear bumper areas)
    const pL = profile.l
    const pW = profile.w
    const pR = pW / 2
    // Place circles at 30% from center towards front and back
    const pFrontX = pos.x - Math.sin(angle) * (pL * 0.3)
    const pFrontZ = pos.z - Math.cos(angle) * (pL * 0.3)
    const pBackX = pos.x + Math.sin(angle) * (pL * 0.3)
    const pBackZ = pos.z + Math.cos(angle) * (pL * 0.3)
    const playerPoints = [ {x: pFrontX, z: pFrontZ}, {x: pBackX, z: pBackZ} ]

    // NPC Collision (Capsule-to-Capsule approximation)
    if (scenario === 'parking') {
      for (const npc of NPC_CARS) {
         const nL = npc.profile.l
         const nW = npc.profile.w
         const nR = nW / 2
         const nFrontX = npc.x - Math.sin(npc.angle) * (nL * 0.3)
         const nFrontZ = npc.z - Math.cos(npc.angle) * (nL * 0.3)
         const nBackX = npc.x + Math.sin(npc.angle) * (nL * 0.3)
         const nBackZ = npc.z + Math.cos(npc.angle) * (nL * 0.3)
         const npcPoints = [ {x: nFrontX, z: nFrontZ}, {x: nBackX, z: nBackZ} ]

         for (const p of playerPoints) {
           for (const n of npcPoints) {
             const dist = Math.sqrt(Math.pow(p.x - n.x, 2) + Math.pow(p.z - n.z, 2))
             if (dist < (pR + nR) * 0.95) { // 0.95 gives a tiny bit of leniency
                onCrash()
                return
             }
           }
         }
      }
    }

    // Cone Collision
    if (scenario === 'parking') {
      for (const cone of CONES) {
         for (const p of playerPoints) {
            const dist = Math.sqrt(Math.pow(p.x - cone.x, 2) + Math.pow(p.z - cone.z, 2))
            if (dist < (pR + 0.3)) { // Cone radius is approx 0.3
               onCrash()
               return
            }
         }
      }
    }

    // Boundary/Curb Collision (Map limits)
    if (scenario === 'parking') {
      if (pos.x < -49 || pos.x > 49 || pos.z < -74 || pos.z > 74) {
         onCrash()
         return
      }
    } else if (scenario === 'narrow') {
      // Narrow road bounds: Road is from Z=-20 to Z=20, width 6 (-3 to 3 on X).
      // Entrance zone is at Z=25, width 20 (-10 to 10 on X).
      // If Z < 20, X must be strictly between -3 and 3 (the walls).
      if (pos.z <= 20) {
         if (pos.x < -3 || pos.x > 3 || pos.z < -20) {
            onCrash()
            return
         }
      } else {
         // In the entrance zone
         if (pos.x < -10 || pos.x > 10 || pos.z > 30) {
            onCrash()
            return
         }
      }
    } else if (scenario === 'intersection') {
      // Intersection boundaries: The main roads are width 12 (-6 to +6).
      // The corners have massive building/sidewalk blocks.
      const isInsideRoadZ = pos.x > -6 && pos.x < 6
      const isInsideRoadX = pos.z > -6 && pos.z < 6
      if (!isInsideRoadZ && !isInsideRoadX) {
         // It's in the corners!
         onCrash()
         return
      }
    }

    // Mission Logic
    const mStep = missionStepRef.current

    // Coach Suggestions
    if (coachTextRef?.current) {
      let activeTarget: {x: number, z: number} | null = null
      
      if (scenario === 'parking') {
        if (mStep === 0) activeTarget = { x: 0, z: -2 }
        else if (mStep === 1) activeTarget = { x: 0, z: -12 }
        else if (mStep === 2 && targetZone) activeTarget = targetZone
      } else if (scenario === 'intersection') {
        if (mStep === 0) activeTarget = { x: 0, z: 9 }
        else if (mStep === 1) activeTarget = { x: -20, z: 0 }
      } else if (scenario === 'narrow') {
        if (mStep === 0) activeTarget = { x: 0, z: -5 }
        else if (mStep === 1) activeTarget = { x: 0, z: 20 }
      }

      if (activeTarget) {
        const dxT = activeTarget.x - pos.x
        const dzT = activeTarget.z - pos.z
        const dist = Math.sqrt(dxT*dxT + dzT*dzT)
        // The car natively faces -Z, so its target angle must be inverted
        const targetAngle = Math.atan2(-dxT, -dzT)
        
        let diff = (targetAngle - angle) % (Math.PI * 2)
        if (diff > Math.PI) diff -= Math.PI * 2
        if (diff < -Math.PI) diff += Math.PI * 2

        let text = "Go Straight ⬆️"
        if (dist < 3 && mStep === 2 && scenario === 'parking') {
          text = "Park carefully 🅿️"
        } else if (Math.abs(diff) > Math.PI / 1.5) {
          text = speed > 0.05 ? "U-Turn! 🔄" : "Reverse 🔽"
        } else if (diff > 0.8) {
          text = "Sharp Left ⏪"
        } else if (diff > 0.2) {
          text = "Slight Left ⬅️"
        } else if (diff < -0.8) {
          text = "Sharp Right ⏩"
        } else if (diff < -0.2) {
          text = "Slight Right ➡️"
        }
        
        if (speed < 0.001 && dist > 5) {
          if (Math.abs(diff) <= Math.PI / 1.5) {
            text = "Hit the Gas! " + text
          } else {
            text = "Hit the Gas! (Reverse) 🔽"
          }
        }

        coachTextRef.current.innerText = "Coach: " + text
      } else {
         coachTextRef.current.innerText = "Coach: Awaiting Instructions..."
      }
    }

    if (scenario === 'intersection') {
      // Intersection Mission: Approach the intersection and turn left
      // We start at Z=25. The stop line is around Z=9. The intersection is at Z=0.
      if (mStep === 0) {
        // Goal: Stop at the white line (Z between 9 and 12)
        if (pos.z < 12 && pos.z > 8 && Math.abs(speed) < 0.001) {
           advanceMission()
        } else if (pos.z < 8) {
           onCrash() // Blew the stop sign!
           return
        }
      } else if (mStep === 1) {
        // Goal: Complete the left turn successfully (Drive onto the X-axis road towards +X)
        if (pos.x > 15 && Math.abs(pos.z) < 6) {
           onWin()
        }
      }
    } else if (scenario === 'narrow') {
      // 3-Point Turn Mission
      if (mStep === 0) {
        // Goal: Drive into the narrow alley (pass Z = 0)
        if (pos.z < 0) {
           advanceMission()
        }
      } else if (mStep === 1) {
        // Goal: Execute the turn and drive back out of the alley (pass Z = 15 heading +Z)
        // Must be facing +Z direction roughly
        const headingZ = Math.cos(angle) // Note: -Math.cos(angle) is forward vector. If we want to face +Z, angle should be near Math.PI
        if (pos.z > 15 && Math.abs(angle - Math.PI) < 0.5) {
           onWin()
        }
      }
    } else if (scenario === 'parking') {
      if (mStep === 0) {
         // Mission 1: Slalom (Pass Z=0 safely)
         if (pos.z < 0) {
            advanceMission()
         }
      } else if (mStep === 1) {
         // Mission 2: Stop Sign (Stop between -10 and -14)
         if (pos.z < -9 && pos.z > -14 && Math.abs(speed) < 0.001) {
            advanceMission()
         } else if (pos.z < -14.5) {
            // Failed to stop!
            onCrash()
            return
         }
      } else if (mStep === 2) {
         // Mission 3: Parking
         // Win Condition: 75% of car inside Target Zone
         const targetRot = targetZone.angle
         const normAngle = ((angle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2)
         const normTarget = ((targetRot % (Math.PI*2)) + Math.PI*2) % (Math.PI*2)
         const angleDiff = Math.abs(normAngle - normTarget)
         const reverseAngleDiff = Math.abs(normAngle - ((normTarget + Math.PI) % (Math.PI*2)))
         const isAligned = Math.min(angleDiff, reverseAngleDiff) < 0.5 // Must be properly oriented

         // Transform car center to target zone's local space
         const distX = pos.x - targetZone.x
         const distZ = pos.z - targetZone.z
         const tzAngle = targetZone.angle
         const localX = distX * Math.cos(tzAngle) - distZ * Math.sin(tzAngle)
         const localZ = distX * Math.sin(tzAngle) + distZ * Math.cos(tzAngle)
         
         // Calculate area overlap assuming car is roughly aligned
         const carMinX = localX - profile.w / 2
         const carMaxX = localX + profile.w / 2
         const carMinZ = localZ - profile.l / 2
         const carMaxZ = localZ + profile.l / 2

         const bayMinX = -(targetZone.width || 3) / 2
         const bayMaxX = (targetZone.width || 3) / 2
         const bayMinZ = -(targetZone.length || 6) / 2
         const bayMaxZ = (targetZone.length || 6) / 2

         const overlapX = Math.max(0, Math.min(carMaxX, bayMaxX) - Math.max(carMinX, bayMinX))
         const overlapZ = Math.max(0, Math.min(carMaxZ, bayMaxZ) - Math.max(carMinZ, bayMinZ))
         
         const carArea = profile.w * profile.l
         const overlapArea = overlapX * overlapZ
         const overlapPercentage = overlapArea / carArea

         if (overlapPercentage >= 0.75 && isAligned && Math.abs(speed) < 0.01 && currentGear === 'P') {
            onWin()
         }
      }
    }
  })

  return (
    <group ref={groupRef} position={[START_POS.x, 0.5, START_POS.z]}>
      <VehicleMesh profile={profile} />
      <spotLight position={[0.6, 0.2, -profile.l/2]} angle={0.7} penumbra={0.5} intensity={2} castShadow target-position={[0.6, -1, -20]} />
      <spotLight position={[-0.6, 0.2, -profile.l/2]} angle={0.7} penumbra={0.5} intensity={2} castShadow target-position={[-0.6, -1, -20]} />
    </group>
  )
}

// Pre-compute geometries and materials to avoid recreation overhead
const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 6)
const treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.9 })
const treeLeavesGeo1 = new THREE.ConeGeometry(1.5, 3, 6)
const treeLeavesMat1 = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.8 })
const treeLeavesGeo2 = new THREE.ConeGeometry(1.2, 2.5, 6)
const treeLeavesMat2 = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 })

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} geometry={treeTrunkGeo} material={treeTrunkMat} />
      {/* Leaves */}
      <mesh position={[0, 2, 0]} geometry={treeLeavesGeo1} material={treeLeavesMat1} />
      <mesh position={[0, 3.5, 0]} geometry={treeLeavesGeo2} material={treeLeavesMat2} />
    </group>
  )
}

function TrafficCone({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[0.3, 0.8, 16]} />
      <meshStandardMaterial color="#f97316" roughness={0.6} />
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </mesh>
  )
}

function NPCCar({ data }: { data: typeof NPC_CARS[0] }) {
  const customProfile = { ...data.profile, color: data.color }
  return (
    <group position={[data.x, 0, data.z]} rotation={[0, data.angle, 0]}>
      <VehicleMesh profile={customProfile} />
    </group>
  )
}

function NavigationArrow({ carPosRef, targetZone, missionStep, scenario }: any) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const isMobile = viewport.aspect < 1
  const timeRef = useRef(0)

  // Draw a professional aerodynamic Chevron shape (V-shape)
  const chevronGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 1)       // Tip
    shape.lineTo(0.6, -0.8)  // Bottom right
    shape.lineTo(0, -0.3)    // Inner center cutout (makes it a V)
    shape.lineTo(-0.6, -0.8) // Bottom left
    shape.lineTo(0, 1)       // Close shape

    return new THREE.ExtrudeGeometry(shape, { 
      depth: 0.15, 
      bevelEnabled: true, 
      bevelThickness: 0.05, 
      bevelSize: 0.05, 
      bevelSegments: 3 
    })
  }, [])
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta
    const carPos = carPosRef.current
    
    // Dynamically calculate the active waypoint target based on the current scenario and mission step!
    let activeTarget: {x: number, z: number} | null = null
    
    if (scenario === 'parking') {
      if (missionStep === 0) activeTarget = { x: 0, z: -2 }
      else if (missionStep === 1) activeTarget = { x: 0, z: -12 }
      else if (missionStep === 2 && targetZone) activeTarget = targetZone
    } else if (scenario === 'intersection') {
      if (missionStep === 0) activeTarget = { x: 0, z: 9 }
      else if (missionStep === 1) activeTarget = { x: -20, z: 0 }
    } else if (scenario === 'narrow') {
      if (missionStep === 0) activeTarget = { x: 0, z: -5 }
      else if (missionStep === 1) activeTarget = { x: 0, z: 20 }
    }

    if (!activeTarget) {
      groupRef.current.visible = false
      return
    }
    
    groupRef.current.visible = true
    
    // Responsive height based on viewport aspect ratio
    const baseHeight = isMobile ? 2.2 : 4
    
    // Use timeRef instead of state.clock to avoid NaN corruption
    groupRef.current.position.set(
      carPos.x, 
      baseHeight + Math.sin(timeRef.current * 5) * (isMobile ? 0.2 : 0.4), 
      carPos.z
    )
    
    // Calculate angle to target
    const dx = activeTarget.x - carPos.x
    const dz = activeTarget.z - carPos.z
    
    // Only rotate if we are somewhat far away to prevent jittering when directly underneath it
    if (Math.abs(dx) > 0.5 || Math.abs(dz) > 0.5) {
      groupRef.current.rotation.y = Math.atan2(dx, dz)
    }
  })

  // Dynamically scale arrow for mobile screens
  const scale = isMobile ? 0.7 : 1

  return (
    <group ref={groupRef} scale={scale}>
      {/* 
        Professional 3D Extruded Chevron
        Rotated to point towards +Z and tilted down for visibility.
        The -0.075 on Z centers the extrusion depth.
      */}
      <mesh 
        geometry={chevronGeo} 
        position={[0, 0.5, 0]} 
        rotation={[Math.PI / 2 - 0.4, 0, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#0ea5e9" // Sleek Electric Blue
          emissive="#0284c7" 
          emissiveIntensity={2} 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

function ParkingLotEnvironment({ targetZone = PARKING_BAYS[0], missionStep }: any) {
  return (
    <group>
      {/* Ground */}
      <Plane args={[200, 300]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <meshStandardMaterial color="#64748b" roughness={0.8} />
      </Plane>

      {/* Lot Curbs */}
      <Box args={[100, 1, 1]} position={[0, 0.5, -75.5]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[100, 1, 1]} position={[0, 0.5, 75.5]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[1, 1, 150]} position={[-50.5, 0.5, 0]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[1, 1, 150]} position={[50.5, 0.5, 0]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>

      {/* Render All Parking Bays (White Lines) for empty spots AND NPC spots */}
      {[...PARKING_BAYS, ...NPC_CARS].map((bay, i) => (
        <group key={`bay-${i}`} position={[bay.x, 0.01, bay.z]} rotation={[0, bay.angle, 0]}>
           {/* Left Line */}
           <Plane args={[0.2, (bay as any).length || 6]} rotation={[-Math.PI / 2, 0, 0]} position={[-((bay as any).width || 3)/2, 0, 0]}>
             <meshBasicMaterial color="#ffffff" />
           </Plane>
           {/* Right Line */}
           <Plane args={[0.2, (bay as any).length || 6]} rotation={[-Math.PI / 2, 0, 0]} position={[((bay as any).width || 3)/2, 0, 0]}>
             <meshBasicMaterial color="#ffffff" />
           </Plane>
           {/* Back Line */}
           <Plane args={[(bay as any).width || 3, 0.2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, ((bay as any).length || 6)/2]}>
             <meshBasicMaterial color="#ffffff" />
           </Plane>
        </group>
      ))}

      {/* Render NPC Cars */}
      {NPC_CARS.map((npc, i) => <NPCCar key={`npc-${i}`} data={npc} />)}

      {/* Render Traffic Cones */}
      {CONES.map((cone, i) => <TrafficCone key={`cone-${i}`} position={[cone.x, 0.4, cone.z]} />)}

      {/* Decorative Trees */}
      <Tree position={[-15, 0, -35]} />
      <Tree position={[15, 0, -35]} />
      <Tree position={[-25, 0, -20]} />
      <Tree position={[25, 0, -20]} />
      <Tree position={[-25, 0, 0]} />
      <Tree position={[25, 0, 0]} />
      <Tree position={[-15, 0, 20]} />
      <Tree position={[15, 0, 20]} />
      <Tree position={[-25, 0, 35]} />
      <Tree position={[25, 0, 35]} />

      {/* Target Zone Highlight */}
      {missionStep === 2 ? (
        <group position={[targetZone.x, 0.02, targetZone.z]} rotation={[0, targetZone.angle, 0]}>
          <Plane args={[(targetZone.width || 3) - 0.2, (targetZone.length || 6) - 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
          </Plane>
          <Plane args={[(targetZone.width || 3), (targetZone.length || 6)]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <meshBasicMaterial color="#10b981" wireframe />
          </Plane>
        </group>
      ) : null}

      {/* Intersection Stop Line */}
      <Plane args={[12, 0.6]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -12]}>
        <meshBasicMaterial color={missionStep === 1 ? "#ef4444" : "#ffffff"} />
      </Plane>
      <Plane args={[12, 0.2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]}>
        <meshBasicMaterial color="#ffffff" />
      </Plane>
    </group>
  )
}

export function ParkingSimulator() {
  type Scenario = 'menu' | 'parking' | 'intersection' | 'narrow'
  const [scenario, setScenario] = useState<Scenario>('menu')

  const [hasWon, setHasWon] = useState(false)
  const [hasCrashed, setHasCrashed] = useState(false)
  const [score, setScore] = useState(0)
  
  // Load score from localStorage on mount
  useEffect(() => {
    const savedScore = localStorage.getItem('driving_sim_xp')
    if (savedScore) {
      setScore(parseInt(savedScore, 10))
    }
  }, [])

  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('driving_sim_xp', score.toString())
  }, [score])
  
  const [speedUI, setSpeedUI] = useState(0)
  const [steerAngleUI, setSteerAngleUI] = useState(0)
  const [gearUI, setGearUI] = useState<Gear>('D')
  
  const [vehicleId, setVehicleId] = useState<keyof typeof VEHICLE_PROFILES>('sedan')
  const profile = VEHICLE_PROFILES[vehicleId]

  const [targetZone, setTargetZone] = useState(PARKING_BAYS[0]) // Deterministic initial state to prevent hydration error

  useEffect(() => {
    // Randomize on client side after mount
    setTargetZone(PARKING_BAYS[Math.floor(Math.random() * PARKING_BAYS.length)])
  }, [])
  
  const [missionStep, setMissionStep] = useState(0)
  const missionStepRef = useRef(0)

  useEffect(() => {
    // Fixes hot-reload bugs where targetZone gets stuck on an old coordinate
    const isValid = PARKING_BAYS.some(bay => bay.x === targetZone.x && bay.z === targetZone.z)
    if (!isValid) {
      setTargetZone(PARKING_BAYS[Math.floor(Math.random() * PARKING_BAYS.length)])
    }
  }, [targetZone])

  const speedRef = useRef(0)
  const carPosRef = useRef({ x: START_POS.x, z: START_POS.z })
  const carAngleRef = useRef(START_POS.angle)
  const hasCrashedRef = useRef(false)
  const hasWonRef = useRef(false)

  const inputRef = useRef({
    gas: false, brake: false, steerAngle: 0, gear: 'D' as Gear,
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
    isDraggingSteering: false
  })

  const steeringWheelRef = useRef<HTMLDivElement>(null)
  const coachTextRef = useRef<HTMLDivElement>(null)

  const { initAudio, updateEngine, playCrash, playWin } = useVehicleSounds()

  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern) } catch(e) {}
    }
  }, [])

  const changeGear = (newGear: Gear) => {
    if (Math.abs(speedRef.current) > 0.05) return
    inputRef.current.gear = newGear
    setGearUI(newGear)
    vibrate(30)
  }

  const resetGame = () => {
    carPosRef.current = { x: START_POS.x, z: START_POS.z }
    carAngleRef.current = START_POS.angle
    speedRef.current = 0
    inputRef.current.steerAngle = 0
    inputRef.current.gear = 'D'
    setGearUI('D')
    setHasWon(false)
    setHasCrashed(false)
    hasCrashedRef.current = false
    hasWonRef.current = false
    
    let newSpot = PARKING_BAYS[Math.floor(Math.random() * PARKING_BAYS.length)]
    while (newSpot.z === targetZone.z && PARKING_BAYS.length > 1) {
       newSpot = PARKING_BAYS[Math.floor(Math.random() * PARKING_BAYS.length)]
    }
    setTargetZone(newSpot)
  }

  const handleCrash = useCallback(() => {
    if (hasCrashedRef.current) return
    hasCrashedRef.current = true
    setHasCrashed(true)
    vibrate([100, 50, 100, 50, 100])
    playCrash()
  }, [vibrate, playCrash])

  const handleAdvanceMission = useCallback(() => {
    if (missionStepRef.current < MISSIONS.length - 1) {
      missionStepRef.current += 1
      setMissionStep(missionStepRef.current)
      vibrate([100, 50, 100])
    }
  }, [vibrate])

  const handleWin = useCallback(() => {
    if (hasWonRef.current || hasCrashedRef.current) return
    hasWonRef.current = true
    setHasWon(true)
    setScore(s => s + 20)
    vibrate([50, 50, 50])
    playWin()
  }, [vibrate, playWin])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    inputRef.current.isDraggingSteering = true; updateSteering(e)
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!inputRef.current.isDraggingSteering) return; updateSteering(e)
  }
  const handlePointerUp = () => { inputRef.current.isDraggingSteering = false }

  const updateSteering = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!steeringWheelRef.current) return
    const rect = steeringWheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const dx = e.clientX - centerX
    const maxDrag = rect.width / 2
    const normalized = dx / maxDrag
    inputRef.current.steerAngle = Math.max(-1, Math.min(1, normalized))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); inputRef.current.gas = true }
      if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); inputRef.current.brake = true }
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); inputRef.current.ArrowLeft = true }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); inputRef.current.ArrowRight = true }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) inputRef.current.gas = false
      if (['ArrowDown', 's', 'S'].includes(e.key)) inputRef.current.brake = false
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) inputRef.current.ArrowLeft = false
      if (['ArrowRight', 'd', 'D'].includes(e.key)) inputRef.current.ArrowRight = false
    }
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[999] w-full h-[100dvh] flex flex-col items-center font-sans bg-sky-200 overflow-hidden">
      
      {/* Top Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <Link href="/student/dashboard" className="pointer-events-auto w-12 h-12 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <X size={24} />
        </Link>
        
        <div className="flex gap-2 pointer-events-auto bg-black/40 p-1 rounded-2xl backdrop-blur-md border border-white/10">
          {(Object.keys(VEHICLE_PROFILES) as (keyof typeof VEHICLE_PROFILES)[]).map(id => {
            const v = VEHICLE_PROFILES[id]
            const Icon = VEHICLE_ICONS[id]
            return (
              <button 
                key={id} 
                onClick={() => setVehicleId(id)} 
                title={v.name}
                className={`p-2 rounded-xl transition-all ${vehicleId === id ? 'bg-primary text-white shadow-lg scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>

        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-yellow-500/30 flex items-center gap-3 text-yellow-400 pointer-events-auto">
          <Trophy size={20} />
          <span className="font-bold text-xl">{score}</span>
        </div>
      </div>

      {/* Top Center HUD Container (Prevents Overlapping) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none w-full px-4">
        
        {/* Mission Objective */}
        <div className="bg-black/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-blue-500/50 text-white font-medium text-center shadow-[0_0_25px_rgba(59,130,246,0.4)] flex flex-col items-center w-full max-w-xs">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
             <Route size={16} />
             <span className="text-xs uppercase tracking-wider font-bold">Mission {missionStep + 1}</span>
          </div>
          <span className="text-sm leading-snug">
            {scenario === 'intersection' 
              ? (missionStep === 0 ? 'Stop at the white line' : 'Turn Left into the far lane') 
              : scenario === 'narrow'
              ? (missionStep === 0 ? 'Enter the narrow alley' : 'Perform 3-point turn & exit')
              : MISSIONS[missionStep]?.title?.replace(/Mission \d+: /, '') || MISSIONS[missionStep]?.title}
          </span>
        </div>

        {/* Driving Coach HUD */}
        <div ref={coachTextRef} className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-green-500/50 text-green-400 font-bold text-sm text-center shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all w-full max-w-xs">
          Coach: Awaiting Instructions...
        </div>
      </div>

      {/* 3D CANVAS WORLD */}
      <div className="absolute inset-0 touch-none bg-sky-200">
        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 5, 15], fov: 60 }}>
           <color attach="background" args={['#bae6fd']} />
           <gridHelper args={[500, 100, '#64748b', '#cbd5e1']} position={[0, -0.05, 0]} />
           <Environment preset="city" />
           
           <ambientLight intensity={0.5} />
           <directionalLight castShadow position={[10, 15, 10]} intensity={1.5} shadow-mapSize={[1024, 1024]} />
           {scenario === 'parking' && <ParkingLotEnvironment targetZone={targetZone} missionStep={missionStep} />}
           {scenario === 'intersection' && <CityIntersectionEnvironment />}
           {scenario === 'narrow' && <NarrowRoadEnvironment />}
           <Car 
             inputRef={inputRef}
             speedRef={speedRef}
             carPosRef={carPosRef}
             carAngleRef={carAngleRef}
             hasCrashedRef={hasCrashedRef}
             hasWonRef={hasWonRef}
             onSpeedChange={setSpeedUI}
             onCrash={handleCrash}
             onWin={handleWin}
             setSteerAngleUI={setSteerAngleUI}
             profile={profile}
             targetZone={targetZone}
             missionStepRef={missionStepRef}
             advanceMission={handleAdvanceMission}
             updateEngine={updateEngine}
             scenario={scenario}
             coachTextRef={coachTextRef}
           />
           <NavigationArrow 
             carPosRef={carPosRef} 
             targetZone={targetZone} 
             missionStep={missionStep} 
             scenario={scenario} 
           />
           <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={15} blur={2} far={4} />
        </Canvas>
      </div>

      {/* DR. DRIVING STYLE UI LAYOUT */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-20">
        <div className="bg-black/80 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border-2 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-mono text-emerald-400 font-bold text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-md">
          <span className="tabular-nums tracking-tighter w-10 sm:w-12 text-right drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{speedUI}</span> 
          <span className="text-[10px] sm:text-[12px] text-emerald-600 tracking-widest mt-1 sm:mt-2">KM/H</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 flex flex-col gap-2 sm:gap-4 items-center sm:items-start z-20 pointer-events-auto">
        <div className="bg-black/90 border-2 border-white/10 rounded-full p-1 flex flex-row items-center shadow-xl backdrop-blur-md scale-90 sm:scale-100 origin-bottom-left">
          {(['P', 'R', 'N', 'D'] as Gear[]).map(g => (
            <button
              key={g}
              onClick={() => changeGear(g)}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-black font-display text-lg sm:text-xl flex items-center justify-center transition-all mx-1 ${
                gearUI === g 
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(56,189,248,0.8)] scale-110' 
                  : 'text-text-3 hover:text-text-1 hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div 
          ref={steeringWheelRef}
          onPointerDown={(e) => { initAudio(); handlePointerDown(e); }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-32 h-32 sm:w-48 sm:h-48 relative flex items-center justify-center touch-none cursor-grab active:cursor-grabbing will-change-transform"
          style={{ transform: `rotate(${steerAngleUI}deg)` }}
        >
          <svg width="100%" height="100%" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
            <circle cx="80" cy="80" r="70" stroke="#111" strokeWidth="20" />
            <circle cx="80" cy="80" r="68" stroke="#222" strokeWidth="16" />
            <path d="M20 80 L60 80" stroke="#333" strokeWidth="16" />
            <path d="M140 80 L100 80" stroke="#333" strokeWidth="16" />
            <path d="M80 140 L80 100" stroke="#333" strokeWidth="16" />
            <circle cx="80" cy="80" r="26" fill="#111" stroke="#333" strokeWidth="4"/>
            <text x="80" y="84" fontFamily="sans-serif" fontSize="10" fill="#666" fontWeight="bold" textAnchor="middle" letterSpacing="1">SGDA</text>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2 sm:gap-4 items-end z-20 pointer-events-auto" onPointerDown={initAudio} onTouchStart={initAudio}>
         <button
          onPointerDown={() => { inputRef.current.brake = true }}
          onPointerUp={() => { inputRef.current.brake = false }}
          onPointerLeave={() => { inputRef.current.brake = false }}
          className="w-14 h-20 sm:w-20 sm:h-24 relative active:scale-95 transition-transform touch-none"
        >
          <svg width="100%" height="100%" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_15px_20px_rgba(220,38,38,0.4)]">
            <rect x="4" y="4" width="72" height="88" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="3"/>
            <rect x="8" y="8" width="64" height="80" rx="4" fill="#171717"/>
            <rect x="20" y="20" width="40" height="8" rx="4" fill="#ef4444" fillOpacity="0.8"/>
            <rect x="20" y="40" width="40" height="8" rx="4" fill="#ef4444" fillOpacity="0.8"/>
            <rect x="20" y="60" width="40" height="8" rx="4" fill="#ef4444" fillOpacity="0.8"/>
          </svg>
        </button>

        <button
          onPointerDown={() => { inputRef.current.gas = true }}
          onPointerUp={() => { inputRef.current.gas = false }}
          onPointerLeave={() => { inputRef.current.gas = false }}
          className="w-14 h-28 sm:w-16 sm:h-36 relative active:scale-95 transition-transform touch-none"
        >
          <svg width="100%" height="100%" viewBox="0 0 64 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_15px_20px_rgba(16,185,129,0.3)]">
            <rect x="4" y="4" width="56" height="120" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="3"/>
            <rect x="8" y="8" width="48" height="112" rx="4" fill="#171717"/>
            <rect x="16" y="20" width="32" height="6" rx="3" fill="#10b981" fillOpacity="0.8"/>
            <rect x="16" y="40" width="32" height="6" rx="3" fill="#10b981" fillOpacity="0.8"/>
            <rect x="16" y="60" width="32" height="6" rx="3" fill="#10b981" fillOpacity="0.8"/>
            <rect x="16" y="80" width="32" height="6" rx="3" fill="#10b981" fillOpacity="0.8"/>
            <rect x="16" y="100" width="32" height="6" rx="3" fill="#10b981" fillOpacity="0.8"/>
          </svg>
        </button>
      </div>

      {scenario === 'menu' && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl z-[60] flex flex-col items-center justify-center p-6 overflow-y-auto pointer-events-auto">
          <h1 className="text-4xl font-display font-black text-white mb-2 tracking-wide text-center">Select Training Module</h1>
          <p className="text-slate-300 mb-8 text-center max-w-lg">Choose a driving scenario to practice your skills. Each module focuses on a different real-world challenge.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
              {/* Parking Module */}
              <button onClick={() => setScenario('parking')} className="bg-slate-800/80 border-2 border-slate-700 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center text-left transition-all hover:scale-105 group">
                <div className="bg-sky-500/20 p-4 rounded-full mb-4 group-hover:bg-sky-500/40 transition-colors">
                  <CarIcon className="w-10 h-10 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center w-full">Basic Parking</h3>
                <p className="text-slate-400 text-sm text-center">Practice parallel and reverse bay parking in a controlled lot environment.</p>
              </button>

              {/* Intersection Module */}
              <button onClick={() => setScenario('intersection')} className="bg-slate-800/80 border-2 border-slate-700 hover:border-amber-500 rounded-2xl p-6 flex flex-col items-center text-left transition-all hover:scale-105 group">
                <div className="bg-amber-500/20 p-4 rounded-full mb-4 group-hover:bg-amber-500/40 transition-colors">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center w-full">City Intersections</h3>
                <p className="text-slate-400 text-sm text-center">Navigate 4-way stops, traffic lights, and right-of-way rules.</p>
              </button>

              {/* Narrow Turn */}
              <button onClick={() => setScenario('narrow')} className="bg-slate-800/80 border-2 border-slate-700 hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center text-left transition-all hover:scale-105 group">
                <div className="bg-rose-500/20 p-4 rounded-full mb-4 group-hover:bg-rose-500/40 transition-colors">
                  <RotateCcw className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center w-full">3-Point Turn</h3>
                <p className="text-slate-400 text-sm text-center">Execute a flawless three-point turn in a narrow dead-end street.</p>
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-white/5">
              <span className="text-slate-400 font-medium">Your Total XP:</span>
              <span className="text-emerald-400 font-mono font-bold text-2xl">{score}</span>
            </div>
        </div>
      )}

      {hasCrashed && scenario !== 'menu' && (
        <div className="absolute inset-0 bg-red-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center pointer-events-auto">
          <AlertTriangle className="w-32 h-32 text-red-500 mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
          <h2 className="text-6xl font-display font-black text-white mb-4 uppercase tracking-widest drop-shadow-lg text-center">Crash!</h2>
          <p className="text-red-300 font-mono text-xl mb-8 text-center max-w-md">You crashed the vehicle into an obstacle.</p>
          <button onClick={resetGame} className="mt-4 px-12 py-6 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-black text-xl rounded-2xl transition-all shadow-[0_10px_40px_rgba(239,68,68,0.6)] flex items-center gap-3 uppercase tracking-widest border-2 border-red-400">
            <RotateCcw className="w-8 h-8" /> Try Again
          </button>
        </div>
      )}

      {hasWon && (
        <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center pointer-events-auto">
          <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-[0_0_50px_rgba(250,204,21,1)]" />
          <h2 className="text-6xl font-display font-black text-white mb-4 uppercase tracking-widest text-center drop-shadow-lg">Success!</h2>
          <div className="bg-black/50 px-8 py-4 rounded-2xl border border-emerald-500/30 mb-10">
            <p className="text-emerald-300 font-mono text-3xl font-bold">+20 XP</p>
          </div>
          <button onClick={resetGame} className="px-12 py-6 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black text-xl rounded-2xl transition-all shadow-[0_10px_40px_rgba(16,185,129,0.6)] flex items-center gap-3 uppercase tracking-widest border-2 border-emerald-400">
            <RotateCcw className="w-8 h-8" /> Next Mission
          </button>
        </div>
      )}

    </div>
  )
}
