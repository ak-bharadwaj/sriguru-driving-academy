import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config = withUt({
  darkMode: 'class',
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
          DEFAULT: 'rgb(var(--color-void) / <alpha-value>)', // Page background
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)', // Card/panel background
          // surface-2 = slightly elevated surface — used throughout for nested cards/inputs
          2: 'rgb(var(--color-surface-2) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)', // All borders
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)', // Electric blue - actions
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)', // Amber - XP, rewards, highlights
        },
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)', // Green - completed, attendance
        },
        danger: {
          DEFAULT: 'rgb(var(--color-danger) / <alpha-value>)', // Red - warnings, errors
        },
        text: {
          1: 'rgb(var(--color-text-1) / <alpha-value>)', // Primary text
          2: 'rgb(var(--color-text-2) / <alpha-value>)', // Secondary text
          3: 'rgb(var(--color-text-3) / <alpha-value>)', // Muted text
          // text-void = text colored like the page background (used for text on colored buttons)
          void: 'rgb(var(--color-void) / <alpha-value>)',
        },
        'app-blue': '#4579FF',
        'app-yellow': '#F9F1C5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        // font-data-mono alias — used in schedule/analytics pages for numeric data
        'data-mono': ['var(--font-mono)', 'monospace'],
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
      boxShadow: {
        'app': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'app-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
});
export default config;
