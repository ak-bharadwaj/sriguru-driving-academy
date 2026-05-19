import React from 'react'

interface SignProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  glow?: boolean
}

/**
 * STOP SIGN
 * A premium, highly detailed octagonal Stop Sign component.
 */
export const StopSign: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]' : ''}`}
      {...props}
    >
      {/* Outer Octagon */}
      <path
        d="M 30,8 L 70,8 L 92,30 L 92,70 L 70,92 L 30,92 L 8,70 L 8,30 Z"
        fill="#EF4444"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Inner Octagon border for high precision realism */}
      <path
        d="M 31.5,12.5 L 68.5,12.5 L 87.5,31.5 L 87.5,68.5 L 68.5,87.5 L 31.5,87.5 L 12.5,68.5 L 12.5,31.5 Z"
        fill="none"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
      {/* Text "STOP" using clean display typography paths */}
      <text
        x="50"
        y="58"
        fill="#FFFFFF"
        fontSize="21"
        fontWeight="800"
        fontFamily="'Outfit', sans-serif"
        textAnchor="middle"
        letterSpacing="-0.02em"
      >
        STOP
      </text>
    </svg>
  )
}

/**
 * YIELD SIGN
 * An upside-down red-bordered triangular Yield Sign.
 */
export const YieldSign: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]' : ''}`}
      {...props}
    >
      {/* Red Triangular Frame */}
      <path
        d="M 10,16 L 90,16 L 50,86 Z"
        fill="#FFFFFF"
        stroke="#EF4444"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      {/* Inner Red Core Line */}
      <path
        d="M 23,23.5 L 77,23.5 L 50,70 Z"
        fill="none"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
      {/* Word "YIELD" */}
      <text
        x="50"
        y="36"
        fill="#B91C1C"
        fontSize="10"
        fontWeight="800"
        fontFamily="'Outfit', sans-serif"
        textAnchor="middle"
        letterSpacing="0.05em"
      >
        YIELD
      </text>
    </svg>
  )
}

interface SpeedLimitProps extends SignProps {
  limit?: number
}

/**
 * SPEED LIMIT SIGN
 * Parameterized circular speed limit sign.
 */
export const SpeedLimitSign: React.FC<SpeedLimitProps> = ({
  limit = 50,
  size = 64,
  glow = false,
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]' : ''}`}
      {...props}
    >
      {/* Circular base */}
      <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#EF4444" strokeWidth="8" />
      {/* Inner border line */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#B91C1C" strokeWidth="1" />
      {/* Speed limit texts */}
      <text
        x="50"
        y="42"
        fill="#1E293B"
        fontSize="10"
        fontWeight="700"
        fontFamily="'Outfit', sans-serif"
        textAnchor="middle"
        letterSpacing="0.05em"
      >
        MAXIMUM
      </text>
      <text
        x="50"
        y="78"
        fill="#0F172A"
        fontSize="34"
        fontWeight="800"
        fontFamily="'Outfit', sans-serif"
        textAnchor="middle"
        letterSpacing="-0.04em"
      >
        {limit}
      </text>
    </svg>
  )
}

/**
 * NO ENTRY SIGN
 * Circular red sign with a solid horizontal white bar.
 */
export const NoEntrySign: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]' : ''}`}
      {...props}
    >
      {/* Outer border & Red background */}
      <circle cx="50" cy="50" r="44" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="#B91C1C" strokeWidth="1.5" />
      {/* Horizontal bar */}
      <rect x="20" y="42" width="60" height="16" rx="2" fill="#FFFFFF" />
    </svg>
  )
}

/**
 * PEDESTRIAN CROSSING SIGN
 * High-contrast yellow/amber warning diamond with pedestrian walker vector.
 */
export const PedestrianCrossingSign: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]' : ''}`}
      {...props}
    >
      {/* Diamond Base (Rotated Square) */}
      <path
        d="M 50,6 L 94,50 L 50,94 L 6,50 Z"
        fill="#F59E0B"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Inner Diamond Line */}
      <path
        d="M 50,11 L 89,50 L 50,89 L 11,50 Z"
        fill="none"
        stroke="#78350F"
        strokeWidth="1.2"
      />
      
      {/* Pedestrian Silhouette (Drawn with highly expressive custom paths) */}
      <g fill="#0F172A">
        {/* Head */}
        <circle cx="50" cy="30" r="4.5" />
        {/* Walk vector torso, arms, legs */}
        <path d="M 49,36 L 53,48 L 57,58 L 61,69 L 57,71 L 52.5,60.5 L 45,71 L 41,68 L 47,56 L 44,45 L 39,47 L 37.5,43 L 45.5,39 Z" />
        <path d="M 50.5,37.5 L 56,41 L 62,37.5 L 63.5,41 L 58,45 L 54,49.5 L 52.5,44.5 Z" />
        {/* Zebra Pathing beneath feet */}
        <path d="M 28,75 L 72,75 M 24,80 L 76,80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

interface TrafficLightProps extends SignProps {
  state?: 'red' | 'yellow' | 'green' | 'all' | 'none'
}

/**
 * TRAFFIC LIGHT SIGN
 * A vertical enclosure showing customized light states with glow effects.
 */
export const TrafficLight: React.FC<TrafficLightProps> = ({
  state = 'green',
  size = 64,
  glow = true,
  className = '',
  ...props
}) => {
  // Determine if a specific light is active
  const isRed = state === 'red' || state === 'all'
  const isYellow = state === 'yellow' || state === 'all'
  const isGreen = state === 'green' || state === 'all'

  const numericSize = typeof size === 'number' ? size : parseFloat(size) || 64

  return (
    <svg
      width={numericSize * 0.6}
      height={numericSize}
      viewBox="0 0 60 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300`}
      {...props}
    >
      {/* Shield backing plate (yellow highway shape) */}
      <rect x="2" y="2" width="56" height="96" rx="14" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
      {/* Main black body */}
      <rect x="8" y="8" width="44" height="84" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      
      {/* RED LIGHT */}
      <circle
        cx="30"
        cy="24"
        r="10"
        fill={isRed ? '#EF4444' : '#1E1B1B'}
        stroke={isRed ? '#FFA3A3' : '#0F172A'}
        strokeWidth="1"
        className="transition-colors duration-300"
        style={isRed && glow ? { filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.9))' } : {}}
      />
      {/* RED GLARE HOOD */}
      <path d="M 20,20 C 20,13 40,13 40,20" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* YELLOW LIGHT */}
      <circle
        cx="30"
        cy="50"
        r="10"
        fill={isYellow ? '#F59E0B' : '#221C11'}
        stroke={isYellow ? '#FDE047' : '#0F172A'}
        strokeWidth="1"
        className="transition-colors duration-300"
        style={isYellow && glow ? { filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.9))' } : {}}
      />
      {/* YELLOW GLARE HOOD */}
      <path d="M 20,46 C 20,39 40,39 40,46" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* GREEN LIGHT */}
      <circle
        cx="30"
        cy="76"
        r="10"
        fill={isGreen ? '#10B981' : '#111C18'}
        stroke={isGreen ? '#A7F3D0' : '#0F172A'}
        strokeWidth="1"
        className="transition-colors duration-300"
        style={isGreen && glow ? { filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.9))' } : {}}
      />
      {/* GREEN GLARE HOOD */}
      <path d="M 20,72 C 20,65 40,65 40,72" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
