/**
 * Centralized Theme Configuration
 * All color and styling constants in one place
 *
 * Design System Rules:
 * - Light Mode: Main sections use #f9f9f9 background, cards/boxes use white (#ffffff) for contrast
 * - Dark Mode: Transparent/dark backgrounds with cards using #111111
 * - Buttons/CTAs: 30% opacity orange → 100% on hover
 * - Calendar button: Always 100% orange
 * - Text: Dark fonts in light mode, white in dark mode
 */

export const colors = {
  brand: {
    primary: '#f48337',
    primaryRGB: '244, 131, 55', // For opacity variations
    secondary: '#d6c5ab',
    dark: '#111111', // Standard dark card background
  },
  text: {
    // Light mode
    light: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    // Dark mode
    dark: {
      primary: 'dark:text-white',
      secondary: 'dark:text-white/90',
      tertiary: 'dark:text-white/80',
      muted: 'dark:text-white/60',
    },
  },
  background: {
    light: {
      primary: 'bg-white',
      secondary: 'bg-[#f9f9f9]',
      tertiary: 'bg-gray-50',
      // Orange overlay style - use sparingly
      overlay: 'bg-[#f48337]/30',
      // Standard card background
      card: 'bg-white',
    },
    dark: {
      primary: 'dark:bg-gray-900',
      secondary: 'dark:bg-black/20',
      tertiary: 'dark:bg-gray-800',
      // Orange overlay style for dark mode
      overlay: 'dark:bg-[#f48337]/30',
      // Standard card background - solid #111111
      card: 'dark:bg-[#111111]',
    },
  },
  border: {
    light: 'ring-1 ring-gray-200',
    dark: 'dark:ring-1 dark:ring-white/10',
    orange: 'ring-1 ring-[#f48337]/30',
    // Adaptive border for light/dark modes
    adaptive: 'ring-1 ring-gray-200 dark:ring-[#f48337]/30',
  },
  button: {
    // Standard CTA button style
    cta: 'bg-[#f48337]/30 hover:bg-[#f48337] transition-all',
    // Full orange button (for special actions like calendar)
    primary: 'bg-[#f48337] hover:bg-[#f48337]/90 transition-colors',
  },
}

export const typography = {
  heading: {
    h1: 'text-5xl md:text-6xl font-bold',
    h2: 'text-4xl md:text-5xl font-bold',
    h3: 'text-3xl md:text-4xl font-bold',
    h4: 'text-2xl md:text-3xl font-bold',
    h5: 'text-xl md:text-2xl font-bold',
  },
  body: {
    large: 'text-xl leading-relaxed',
    normal: 'text-base leading-relaxed',
    small: 'text-sm leading-relaxed',
  },
}

export const spacing = {
  section: {
    padding: 'py-24 px-6',
    marginBottom: 'mb-16',
  },
  card: {
    padding: 'p-8',
    rounded: 'rounded-2xl',
  },
}

/**
 * Utility function to combine theme classes
 */
export function getCardClasses(variant: 'light' | 'glass' | 'orange' = 'light'): string {
  const base = `${spacing.card.rounded} backdrop-blur transition-all ${spacing.card.padding}`

  if (variant === 'light') {
    return `${base} ${colors.background.light.secondary} ${colors.background.dark.secondary} ${colors.border.light} ${colors.border.dark}`
  }

  if (variant === 'orange') {
    return `${base} ${colors.background.light.overlay} ${colors.background.dark.overlay} ${colors.border.orange}`
  }

  return `${base} bg-white/5 ring-1 ring-white/10`
}

export function getTextClasses(level: 'primary' | 'secondary' | 'tertiary' = 'primary'): string {
  return `${colors.text.light[level]} ${colors.text.dark[level]}`
}

export function getHeadingClasses(size: keyof typeof typography.heading = 'h2'): string {
  return `${typography.heading[size]} ${getTextClasses('primary')}`
}

/**
 * Get consistent orange overlay background
 */
export function getOrangeOverlayClasses(): string {
  return `${colors.background.light.overlay} ${colors.background.dark.overlay} ${colors.border.orange}`
}

/**
 * Get standard card background (white in light mode, #111111 in dark mode)
 */
export function getCardBackground(): string {
  return `${colors.background.light.card} ${colors.background.dark.card}`
}

/**
 * Get CTA button classes (30% → 100% orange pattern)
 */
export function getCTAButtonClasses(): string {
  return `${colors.button.cta} text-gray-900 dark:text-white hover:text-white`
}

/**
 * Get primary button classes (always 100% orange)
 */
export function getPrimaryButtonClasses(): string {
  return `${colors.button.primary} text-white`
}

/**
 * Get adaptive border (gray in light mode, orange in dark mode)
 */
export function getAdaptiveBorder(): string {
  return colors.border.adaptive
}
