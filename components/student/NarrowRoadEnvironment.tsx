import React from 'react'
import { Plane, Box } from '@react-three/drei'

export function NarrowRoadEnvironment() {
  return (
    <group>
      {/* Ground (Dirt / Grass) */}
      <Plane args={[150, 150]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
         <meshStandardMaterial color="#3f2e1a" roughness={1} />
      </Plane>

      {/* The Narrow Dead-End Road */}
      {/* Width is very tight (e.g., 6 units wide), making a 3-point turn necessary */}
      <Plane args={[6, 40]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <meshStandardMaterial color="#475569" roughness={0.8} />
      </Plane>

      {/* Road Markings (Single dotted line maybe?) */}
      {[-1, 0, 1].map((i) => (
        <Plane key={`line-${i}`} args={[0.2, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, i * 10]}>
          <meshBasicMaterial color="#ffffff" />
        </Plane>
      ))}

      {/* Brick Walls flanking the narrow road */}
      {/* Left Wall */}
      <Box args={[1, 5, 40]} position={[-3.5, 2.5, 0]} castShadow receiveShadow>
         <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </Box>
      {/* Right Wall */}
      <Box args={[1, 5, 40]} position={[3.5, 2.5, 0]} castShadow receiveShadow>
         <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </Box>
      {/* Dead End Wall (Top) */}
      <Box args={[8, 5, 1]} position={[0, 2.5, -20.5]} castShadow receiveShadow>
         <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </Box>

      {/* Entrance / Exit Zone (Safe zone to start/finish) */}
      {/* A slightly wider road at the very bottom so they can drive into the alley */}
      <Plane args={[20, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 25]} receiveShadow>
         <meshStandardMaterial color="#334155" roughness={0.8} />
      </Plane>
      {/* Start Line */}
      <Plane args={[6, 0.4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 19]}>
        <meshBasicMaterial color="#10b981" />
      </Plane>
    </group>
  )
}
