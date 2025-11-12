/**
 * Design System - Bright4Event Platform
 * Main color scheme: Blue (#0072F5) + Purple (#9C27FF)
 */

export const colors = {
  // Primary Colors
  primary: {
    blue: '#0072F5',
    purple: '#9C27FF',
    gold: '#FFD700',
  },

  // Background Colors
  background: {
    white: '#FFFFFF',
    lightGray: '#F8FAFC',
    darkFooter: '#0D0D1A',
    dark: '#0B0B0B',
    darkAlt: '#1a1a1a',
  },

  // Text Colors
  text: {
    primary: '#0D0D1A',
    secondary: '#64748B',
    light: '#94A3B8',
    white: '#FFFFFF',
  },

  // Status Colors
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#0EA5E9',
  },
} as const

export const gradients = {
  primary: 'linear-gradient(90deg, #0072F5 0%, #9C27FF 100%)',
  primaryVertical: 'linear-gradient(180deg, #0072F5 0%, #9C27FF 100%)',
  gold: 'linear-gradient(90deg, #FFD700 0%, #FDB931 100%)',
  darkBg: 'linear-gradient(180deg, #0B0B0B 0%, #1a1a1a 50%, #0B0B0B 100%)',
} as const

export const typography = {
  fontFamily: {
    primary: 'var(--font-be-vietnam-pro), sans-serif',
    heading: 'var(--font-poppins), sans-serif',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
} as const

export const spacing = {
  sectionPadding: 'py-16 md:py-24 lg:py-32',
  containerPadding: 'px-4 md:px-6 lg:px-8',
  cardPadding: 'p-6 md:p-8',
} as const

export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  fadeInFast: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
} as const

export const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  button: '0 10px 15px -3px rgba(0, 114, 245, 0.3)',
  glow: '0 0 20px rgba(0, 114, 245, 0.5)',
  glowPurple: '0 0 20px rgba(156, 39, 255, 0.5)',
} as const

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const
