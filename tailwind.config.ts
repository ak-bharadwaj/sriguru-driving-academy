import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specific custom tokens from ARCHITECTURE.md mapped to tailwind config
        void: {
          DEFAULT: '#07090F', // Page background
        },
        surface: {
          DEFAULT: '#0D1117', // Card/panel background
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)', // All borders
        },
        primary: {
          DEFAULT: '#2563EB', // Electric blue - actions
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber - XP, rewards, highlights
        },
        success: {
          DEFAULT: '#10B981', // Green - completed, attendance
        },
        danger: {
          DEFAULT: '#EF4444', // Red - warnings, errors
        },
        text: {
          1: '#F1F5F9', // Primary text
          2: '#94A3B8', // Secondary text
          3: '#475569', // Muted text
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        // Named spacing scale from ARCHITECTURE.md
        'space-xs': '4px',
        'space-sm': '8px',
        'space-md': '16px',
        'space-lg': '32px',
        'space-xl': '64px',
        'space-section': '120px',
      },
      transitionTimingFunction: {
        // Named animation curves from ARCHITECTURE.md
        'spring': 'var(--ease-spring)',
        'smooth': 'var(--ease-smooth)',
        'snap': 'var(--ease-snap)',
      },
    },
  },
  plugins: [],
};
export default config;
