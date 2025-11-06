// Color constants for the application
export const COLORS = {
  // Primary colors
  gold: '#FFD700',
  goldLight: '#FFD76A',
  goldDark: '#FDB931',
  orange: '#FF9E00',

  // Background colors
  bgDark: '#0B0B0B',
  bgMedium: '#0E0E0E',
  bgLight: '#1a1a1a',
  bgLighter: '#1F1F1F',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#FAF3E0',
  textMuted: '#9CA3AF',

  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const

export const GRADIENTS = {
  primary: 'linear-gradient(to right, #FFD700, #FF9E00)',
  primaryReverse: 'linear-gradient(to right, #FF9E00, #FFD700)',
  gold: 'linear-gradient(to right, #FFD76A, #FDB931, #FFD76A)',
  dark: 'linear-gradient(to bottom right, #1F1B13, #0B0B0B)',
} as const

export const OPACITY = {
  disabled: 0.5,
  hover: 0.8,
  subtle: 0.6,
  light: 0.3,
  veryLight: 0.1,
} as const
