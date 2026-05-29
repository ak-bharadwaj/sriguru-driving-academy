import React from 'react'
import { Plane, Box, Sky } from '@react-three/drei'

export function CityIntersectionEnvironment() {
  return (
    <group>
      {/* Ground / Grass */}
      <Plane args={[300, 300]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
         <meshStandardMaterial color="#166534" roughness={0.9} />
      </Plane>

      {/* Main Road (Z-axis) */}
      <Plane args={[12, 300]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <meshStandardMaterial color="#334155" roughness={0.8} />
      </Plane>

      {/* Cross Street (X-axis) */}
      <Plane args={[300, 12]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <meshStandardMaterial color="#334155" roughness={0.8} />
      </Plane>

      {/* Intersection Square (slightly elevated to prevent z-fighting if needed, but 0 is fine) */}
      <Plane args={[12, 12]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
         <meshStandardMaterial color="#334155" roughness={0.8} />
      </Plane>

      {/* Center Lines (Z-axis road) */}
      {[-14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
        <group key={`z-line-${i}`}>
          <Plane args={[0.2, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, i * 10]}>
            <meshBasicMaterial color="#fcd34d" />
          </Plane>
          {/* Double Yellow Line */}
          <Plane args={[0.2, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.02, i * 10]}>
            <meshBasicMaterial color="#fcd34d" />
          </Plane>
        </group>
      ))}

      {/* Center Lines (X-axis road) */}
      {[-14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
        <group key={`x-line-${i}`}>
          <Plane args={[4, 0.2]} rotation={[-Math.PI / 2, 0, 0]} position={[i * 10, 0.02, 0]}>
            <meshBasicMaterial color="#fcd34d" />
          </Plane>
          <Plane args={[4, 0.2]} rotation={[-Math.PI / 2, 0, 0]} position={[i * 10, 0.02, 0.4]}>
            <meshBasicMaterial color="#fcd34d" />
          </Plane>
        </group>
      ))}

      {/* Stop Lines (White) */}
      <Plane args={[5.8, 0.6]} rotation={[-Math.PI / 2, 0, 0]} position={[3.1, 0.03, 8]}>
        <meshBasicMaterial color="#ffffff" />
      </Plane>
      <Plane args={[5.8, 0.6]} rotation={[-Math.PI / 2, 0, 0]} position={[-3.1, 0.03, -8]}>
        <meshBasicMaterial color="#ffffff" />
      </Plane>
      <Plane args={[0.6, 5.8]} rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.03, -3.1]}>
        <meshBasicMaterial color="#ffffff" />
      </Plane>
      <Plane args={[0.6, 5.8]} rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.03, 3.1]}>
        <meshBasicMaterial color="#ffffff" />
      </Plane>

      {/* Sidewalk Curbs (Limits) - Expanded to match 300x300 lot */}
      {/* Corner 1: Top Left (-X, -Z) */}
      <Box args={[144, 1, 144]} position={[-78, 0.5, -78]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      {/* Corner 2: Top Right (+X, -Z) */}
      <Box args={[144, 1, 144]} position={[78, 0.5, -78]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      {/* Corner 3: Bottom Left (-X, +Z) */}
      <Box args={[144, 1, 144]} position={[-78, 0.5, 78]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>
      {/* Corner 4: Bottom Right (+X, +Z) */}
      <Box args={[144, 1, 144]} position={[78, 0.5, 78]} castShadow receiveShadow>
         <meshStandardMaterial color="#94a3b8" />
      </Box>

      {/* Simple Buildings on the corners */}
      <Box args={[20, 30, 20]} position={[-20, 15, -20]} castShadow receiveShadow>
        <meshStandardMaterial color="#ef4444" />
      </Box>
      <Box args={[15, 20, 15]} position={[20, 10, -20]} castShadow receiveShadow>
        <meshStandardMaterial color="#3b82f6" />
      </Box>
      <Box args={[25, 40, 25]} position={[-25, 20, 25]} castShadow receiveShadow>
        <meshStandardMaterial color="#f59e0b" />
      </Box>
      <Box args={[20, 15, 20]} position={[20, 7.5, 20]} castShadow receiveShadow>
        <meshStandardMaterial color="#10b981" />
      </Box>

      {/* Traffic Lights / Stop Signs Placeholder */}
      <group position={[7, 0, 7]}>
        <mesh position={[0, 2.5, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 5]}/><meshStandardMaterial color="#333"/></mesh>
        <mesh position={[0, 4.5, 0]} castShadow><boxGeometry args={[1, 3, 1]}/><meshStandardMaterial color="#111"/></mesh>
        <mesh position={[0, 5.5, 0.55]}><circleGeometry args={[0.3]}/><meshBasicMaterial color="#ef4444"/></mesh>
      </group>
      
      <group position={[-7, 0, -7]}>
        <mesh position={[0, 2.5, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 5]}/><meshStandardMaterial color="#333"/></mesh>
        <mesh position={[0, 4.5, 0]} castShadow><boxGeometry args={[1, 3, 1]}/><meshStandardMaterial color="#111"/></mesh>
        <mesh position={[0, 5.5, -0.55]} rotation={[0, Math.PI, 0]}><circleGeometry args={[0.3]}/><meshBasicMaterial color="#ef4444"/></mesh>
      </group>
    </group>
  )
}
