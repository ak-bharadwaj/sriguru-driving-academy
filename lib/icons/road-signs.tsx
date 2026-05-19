import React from 'react'

interface SignProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  glow?: boolean
}

/**
 * STOP_SIGN
 * Octagonal premium red stop sign.
 */
export const STOP_SIGN: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
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
      <path
        d="M 30,8 L 70,8 L 92,30 L 92,70 L 70,92 L 30,92 L 8,70 L 8,30 Z"
        fill="#EF4444"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M 31.5,12.5 L 68.5,12.5 L 87.5,31.5 L 87.5,68.5 L 68.5,87.5 L 31.5,87.5 L 12.5,68.5 L 12.5,31.5 Z"
        fill="none"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
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
 * Red triangular yield sign.
 */
export const YIELD: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
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
      <path
        d="M 10,16 L 90,16 L 50,86 Z"
        fill="#FFFFFF"
        stroke="#EF4444"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M 23,23.5 L 77,23.5 L 50,70 Z"
        fill="none"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
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
 * SPEED_LIMIT
 * Parameters: limit (number)
 */
export const SPEED_LIMIT: React.FC<SpeedLimitProps> = ({
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
      <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#EF4444" strokeWidth="8" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#B91C1C" strokeWidth="1" />
      <text
        x="50"
        y="42"
        fill="#1E293B"
        fontSize="9"
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
 * NO_ENTRY
 * Red background, white bar.
 */
export const NO_ENTRY: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
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
      <circle cx="50" cy="50" r="44" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#B91C1C" strokeWidth="1.5" />
      <rect x="20" y="42" width="60" height="16" rx="2" fill="#FFFFFF" />
    </svg>
  )
}

/**
 * PEDESTRIAN_CROSSING
 * Diamond amber sign, walking outline.
 */
export const PEDESTRIAN_CROSSING: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
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
      <path
        d="M 50,6 L 94,50 L 50,94 L 6,50 Z"
        fill="#F59E0B"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 50,11 L 89,50 L 50,89 L 11,50 Z"
        fill="none"
        stroke="#78350F"
        strokeWidth="1.2"
      />
      <g fill="#0F172A">
        <circle cx="50" cy="30" r="4.5" />
        <path d="M 49,36 L 53,48 L 57,58 L 61,69 L 57,71 L 52.5,60.5 L 45,71 L 41,68 L 47,56 L 44,45 L 39,47 L 37.5,43 L 45.5,39 Z" />
        <path d="M 50.5,37.5 L 56,41 L 62,37.5 L 63.5,41 L 58,45 L 54,49.5 L 52.5,44.5 Z" />
        <path d="M 28,75 L 72,75 M 24,80 L 76,80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

interface TrafficLightProps extends SignProps {
  state?: 'red' | 'amber' | 'green'
}

/**
 * TRAFFIC_LIGHT
 * Parameters: state ('red' | 'amber' | 'green')
 */
export const TRAFFIC_LIGHT: React.FC<TrafficLightProps> = ({
  state = 'green',
  size = 64,
  glow = true,
  className = '',
  ...props
}) => {
  const isRed = state === 'red'
  const isAmber = state === 'amber'
  const isGreen = state === 'green'

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
      <rect x="2" y="2" width="56" height="96" rx="14" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
      <rect x="8" y="8" width="44" height="84" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      
      {/* RED */}
      <circle
        cx="30"
        cy="24"
        r="10"
        fill={isRed ? '#EF4444' : '#1E1B1B'}
        stroke={isRed ? '#FFA3A3' : '#0F172A'}
        strokeWidth="1"
        style={isRed && glow ? { filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.9))' } : {}}
      />
      <path d="M 20,20 C 20,13 40,13 40,20" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* AMBER (Yellow) */}
      <circle
        cx="30"
        cy="50"
        r="10"
        fill={isAmber ? '#F59E0B' : '#221C11'}
        stroke={isAmber ? '#FDE047' : '#0F172A'}
        strokeWidth="1"
        style={isAmber && glow ? { filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.9))' } : {}}
      />
      <path d="M 20,46 C 20,39 40,39 40,46" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* GREEN */}
      <circle
        cx="30"
        cy="76"
        r="10"
        fill={isGreen ? '#10B981' : '#111C18'}
        stroke={isGreen ? '#A7F3D0' : '#0F172A'}
        strokeWidth="1"
        style={isGreen && glow ? { filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.9))' } : {}}
      />
      <path d="M 20,72 C 20,65 40,65 40,72" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/**
 * GIVE_WAY
 * Red inverted triangular border with white center.
 */
export const GIVE_WAY: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]' : ''}`}
      {...props}
    >
      <path
        d="M 8,12 L 92,12 L 50,88 Z"
        fill="#FFFFFF"
        stroke="#EF4444"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M 23,21 L 77,21 L 50,70 Z"
        fill="none"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/**
 * SCHOOL_ZONE
 * High contrast warning pentagon showing child pedestrians.
 */
export const SCHOOL_ZONE: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]' : ''}`}
      {...props}
    >
      {/* Pentagon base shape */}
      <path
        d="M 50,6 L 94,38 L 78,92 L 22,92 L 6,38 Z"
        fill="#F59E0B"
        stroke="#0F172A"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M 50,12 L 88,40 L 74,86 L 26,86 L 12,40 Z"
        fill="none"
        stroke="#78350F"
        strokeWidth="1.5"
      />
      
      {/* Vector silhouette of two children walking (Detailed Pathing) */}
      <g fill="#0F172A">
        {/* Child 1 (Older child) */}
        <circle cx="42" cy="38" r="4" />
        <path d="M 40,43 L 44,55 L 46,65 L 49,76 L 45,77 L 42,66 L 36,77 L 32,74 L 38,62 L 35.5,52 L 31,54 L 30,50 L 37.5,46 Z" />
        {/* Backpack */}
        <path d="M 33,48 C 31,48 31,58 33,60" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        
        {/* Child 2 (Younger child) */}
        <circle cx="58" cy="46" r="3" />
        <path d="M 56,50 L 60,60 L 61,68 L 63,76 L 60,77 L 58,68 L 53,77 L 50,75 L 55,65 L 53,57 L 49.5,59 L 48.5,56 L 54,52 Z" />
      </g>
    </svg>
  )
}

/**
 * NO_PARKING
 * Blue circle, red border, red slash.
 */
export const NO_PARKING: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
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
      <circle cx="50" cy="50" r="44" fill="#2563EB" stroke="#EF4444" strokeWidth="8" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#B91C1C" strokeWidth="1.5" />
      
      {/* Red diagonal slash */}
      <line x1="22" y1="22" x2="78" y2="78" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
      <line x1="22" y1="22" x2="78" y2="78" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * ONE_WAY
 * Blue rectangular backing with broad forward arrow.
 */
export const ONE_WAY: React.FC<SignProps> = ({ size = 64, glow = false, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${glow ? 'drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]' : ''}`}
      {...props}
    >
      {/* Rounded blue rectangle */}
      <rect x="8" y="15" width="84" height="70" rx="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="4" />
      
      {/* Broad White Arrow pointing right */}
      <path
        d="M 18,50 L 58,50 M 58,50 L 44,32 M 58,50 L 44,68"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="36"
        y="74"
        fill="#FFFFFF"
        fontSize="7.5"
        fontWeight="800"
        fontFamily="'Outfit', sans-serif"
        textAnchor="middle"
        letterSpacing="0.05em"
      >
        ONE WAY
      </text>
    </svg>
  )
}
