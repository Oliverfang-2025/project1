/**
 * Semiconductor Animation Configuration
 *
 * Global configuration file for semiconductor chip packaging theme animations.
 * All animation parameters, colors, and Framer Motion variants are defined here.
 *
 * Color values are synchronized with tailwind.config.js
 */

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

/**
 * Global animation settings
 * - enabled: Master switch for all animations
 * - respectReducedMotion: Honor user's prefers-reduced-motion setting
 */
export const globalConfig = {
  enabled: true,
  respectReducedMotion: true,
};

// ============================================================================
// COLOR PALETTE
// ============================================================================

/**
 * Color definitions synchronized with tailwind.config.js
 * These colors represent the semiconductor/chip manufacturing theme
 */
export const colors = {
  // Primary tech blue (sky-500 from Tailwind)
  primary: '#0ea5e9',
  // Accent cyan color (cyan-400 from Tailwind)
  accent: '#22d3ee',
  // Gold for wire bonding (chip.gold from Tailwind)
  gold: '#d4a853',
  // Silicon material color (chip.silicon from Tailwind)
  silicon: '#4a5568',
  // Success/pass indicator (success from Tailwind)
  success: '#22c55e',
  // Warning indicator (warning from Tailwind)
  warning: '#f59e0b',
  // Error/fail indicator (error from Tailwind)
  error: '#ef4444',

  // Background colors for dark theme
  background: {
    primary: '#0a0a0f',    // Deepest - main page background
    secondary: '#111118',  // Medium - card/section background
    tertiary: '#1a1a24',   // Light - hover/highlight background
  },

  // Foreground/text colors
  foreground: {
    primary: '#fafafa',    // Main text
    muted: '#a1a1aa',      // Secondary text
    subtle: '#71717a',     // Auxiliary text
  },

  // Glow effect colors with transparency
  glow: {
    primary: 'rgba(14, 165, 233, 0.4)',   // Blue glow
    accent: 'rgba(34, 211, 238, 0.4)',    // Cyan glow
    gold: 'rgba(212, 168, 83, 0.6)',      // Gold wire glow
    success: 'rgba(34, 197, 94, 0.4)',    // Green glow
  },

  // Border colors
  border: {
    default: '#27272a',
    hover: '#3f3f46',
    active: '#52525b',
  },
};

// ============================================================================
// HERO SECTION - WAFER DICING CONFIGURATION
// ============================================================================

/**
 * Hero section animation config - Wafer dicing theme
 * Simulates the wafer cutting process with laser scan effects
 */
export const heroConfig = {
  // Wafer grid pattern settings
  waferGrid: {
    gridSize: 20,              // Grid cell size in pixels
    gridColor: colors.accent,  // Grid line color
    gridOpacity: 0.15,         // Grid line opacity (0-1)
    maskRadius: '60%',         // Radial gradient mask radius for circular wafer effect
  },

  // Laser scanning line effect
  laserScan: {
    enabled: true,
    duration: 8,               // Full scan cycle duration in seconds
    angle: 45,                 // Scan angle in degrees
    width: 2,                  // Laser line width in pixels
    glowSize: 20,              // Glow spread radius in pixels
    color: colors.accent,      // Laser color
  },

  // Mouse-following laser focus effect
  mouseTrail: {
    enabled: true,
    focusSize: 20,             // Laser focus point diameter in pixels
    trailLength: 5,            // Number of trail points
    trailLifetime: 500,        // Trail point fade duration in milliseconds
    color: colors.accent,      // Trail color
  },

  // Floating die particles
  floatingDies: {
    enabled: true,
    count: 8,                  // Number of floating die elements
    minSize: 30,               // Minimum die size in pixels
    maxSize: 60,               // Maximum die size in pixels
    floatDuration: 20,         // Float animation cycle in seconds
    opacity: 0.1,              // Die opacity
  },
};

// ============================================================================
// FEATURED PROJECTS - WIRE BONDING CONFIGURATION
// ============================================================================

/**
 * Projects section animation config - Wire bonding theme
 * Simulates the gold wire bonding process in chip packaging
 */
export const projectsConfig = {
  // Bonding pad contact points
  bondingPoints: {
    enabled: true,
    size: 4,                   // Bonding point diameter in pixels
    color: colors.gold,        // Gold bonding pad color
    pulseScale: 1.5,           // Pulse animation scale factor
    pulseDuration: 0.6,        // Pulse animation duration in seconds
  },

  // Wire bonding connection lines
  wireBonding: {
    enabled: true,
    wireColor: colors.gold,    // Gold wire color
    wireWidth: 2,              // Wire stroke width in pixels
    particleCount: 20,         // Number of particles on wire
    particleSpeed: 2,          // Particle travel duration in seconds per cycle
    particleSize: 3,           // Particle diameter in pixels
  },

  // 3D card tilt effect on hover
  card3D: {
    enabled: true,
    maxRotation: 10,           // Maximum tilt angle in degrees
    perspective: 1000,         // CSS perspective distance in pixels
    transitionDuration: 0.3,   // Tilt transition duration in seconds
  },

  // Connection line between cards
  connectionLines: {
    enabled: true,
    color: colors.gold,
    opacity: 0.3,
    dashArray: '4 4',          // SVG dash pattern
    animationDuration: 2,      // Dash animation cycle in seconds
  },
};

// ============================================================================
// LATEST ARTICLES - MOLDING/ENCAPSULATION CONFIGURATION
// ============================================================================

/**
 * Articles section animation config - Molding/encapsulation theme
 * Simulates the epoxy molding compound flow in chip packaging
 */
export const articlesConfig = {
  // Fluid ripple effect on interaction
  fluidRipple: {
    enabled: true,
    rippleCount: 5,            // Maximum concurrent ripples
    rippleLifetime: 1500,      // Ripple animation duration in milliseconds
    rippleMaxScale: 2,         // Maximum ripple scale factor
    rippleColor: colors.primary,
    rippleOpacity: 0.3,        // Initial ripple opacity
  },

  // Border grow animation on hover
  borderGrow: {
    enabled: true,
    duration: 0.6,             // Border animation duration in seconds
    color: colors.accent,
    width: 2,                  // Border width in pixels
  },

  // Filling/molding effect
  moldingEffect: {
    enabled: true,
    fillDuration: 0.8,         // Fill animation duration in seconds
    fillColor: colors.primary,
    fillOpacity: 0.05,         // Background fill opacity
  },

  // Shimmer/shine effect
  shimmer: {
    enabled: true,
    duration: 2,               // Shimmer cycle duration in seconds
    angle: -45,                // Shimmer angle in degrees
    color: 'rgba(255, 255, 255, 0.1)',
  },
};

// ============================================================================
// ABOUT PREVIEW - TESTING/INSPECTION CONFIGURATION
// ============================================================================

/**
 * About section animation config - Testing/inspection theme
 * Simulates the automated optical inspection (AOI) and testing process
 */
export const aboutConfig = {
  // Vertical/horizontal scan line effect
  scanLine: {
    enabled: true,
    duration: 5,               // Full scan cycle duration in seconds
    direction: 'vertical' as const, // Scan direction: 'vertical' | 'horizontal'
    color: colors.accent,
    width: 2,                  // Scan line width in pixels
    glowSize: 10,              // Glow spread in pixels
  },

  // Status indicator light (pass/fail)
  statusIndicator: {
    enabled: true,
    size: 6,                   // Indicator diameter in pixels
    color: colors.success,     // Default to success/pass color
    pulseDuration: 2,          // Pulse animation duration in seconds
    glowSize: 8,               // Glow spread in pixels
  },

  // Hover-triggered scan effect
  hoverScan: {
    enabled: true,
    duration: 1,               // Scan animation duration in seconds
    height: 2,                 // Scan bar height in pixels
    color: colors.accent,
  },

  // Data readout/metrics display
  dataReadout: {
    enabled: true,
    updateInterval: 100,       // Update frequency in milliseconds
    digitCount: 6,             // Number of digits to display
    color: colors.accent,
  },

  // Grid overlay for inspection
  inspectionGrid: {
    enabled: true,
    size: 40,                  // Grid cell size in pixels
    color: colors.accent,
    opacity: 0.1,
  },
};

// ============================================================================
// FRAMER MOTION ANIMATION VARIANTS
// ============================================================================

/**
 * Reusable Framer Motion animation variants
 * Import and use with motion components: <motion.div variants={motionVariants.pulse} />
 */
export const motionVariants = {
  // Laser scan line animation (diagonal movement)
  laserScan: {
    animate: {
      x: ['-100%', '200%'],
      y: ['-100%', '200%'],
    },
    transition: {
      duration: heroConfig.laserScan.duration,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Pulse animation for bonding points
  pulse: {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Subtle pulse for status indicators
  subtlePulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // SVG path drawing animation
  pathDraw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },

  // Path undraw animation (reverse)
  pathUndraw: {
    initial: { pathLength: 1, opacity: 1 },
    exit: { pathLength: 0, opacity: 0 },
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },

  // Ripple expansion animation
  ripple: {
    initial: { scale: 0, opacity: 0.5 },
    animate: { scale: 2, opacity: 0 },
    transition: {
      duration: 1.5,
      ease: 'easeOut',
    },
  },

  // Status indicator pulse (glow effect)
  statusPulse: {
    animate: {
      opacity: [1, 0.5, 1],
      boxShadow: [
        `0 0 8px ${colors.glow.success}`,
        `0 0 16px ${colors.glow.success}`,
        `0 0 8px ${colors.glow.success}`,
      ],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Scan box animation (top to bottom)
  scanBox: {
    initial: { top: 0, opacity: 0 },
    animate: { top: '100%', opacity: [0, 1, 1, 0] },
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },

  // Horizontal scan line
  horizontalScan: {
    initial: { left: 0 },
    animate: { left: '100%' },
    transition: {
      duration: aboutConfig.scanLine.duration,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Vertical scan line
  verticalScan: {
    initial: { top: 0 },
    animate: { top: '100%' },
    transition: {
      duration: aboutConfig.scanLine.duration,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Fade in animation
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },

  // Fade in with upward movement
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },

  // Scale in animation
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },

  // Glow pulse animation
  glowPulse: {
    animate: {
      boxShadow: [
        `0 0 10px ${colors.glow.primary}`,
        `0 0 20px ${colors.glow.primary}`,
        `0 0 10px ${colors.glow.primary}`,
      ],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Wire particle movement along path
  wireParticle: {
    initial: { offsetDistance: '0%' },
    animate: { offsetDistance: '100%' },
    transition: {
      duration: projectsConfig.wireBonding.particleSpeed,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // 3D card hover effect
  card3DHover: {
    initial: { rotateX: 0, rotateY: 0 },
    transition: {
      duration: projectsConfig.card3D.transitionDuration,
      ease: 'easeOut',
    },
  },

  // Border trace animation (clockwise)
  borderTrace: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: {
      duration: articlesConfig.borderGrow.duration,
      ease: 'easeInOut',
    },
  },

  // Shimmer effect
  shimmer: {
    initial: { x: '-100%' },
    animate: { x: '200%' },
    transition: {
      duration: articlesConfig.shimmer.duration,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Float animation for background elements
  float: {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, 0],
    },
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Stagger children animation container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Stagger item animation
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if reduced motion is preferred by the user
 * @returns boolean indicating if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation config based on global settings and user preferences
 * @param config - The animation config object
 * @returns The config if animations are enabled, or null/disabled state
 */
export const getAnimationConfig = <T extends { enabled: boolean }>(
  config: T
): T | null => {
  if (!globalConfig.enabled) return null;
  if (globalConfig.respectReducedMotion && prefersReducedMotion()) return null;
  if (!config.enabled) return null;
  return config;
};

/**
 * Create a custom pulse variant with specified parameters
 * @param scale - Pulse scale factor
 * @param duration - Pulse duration in seconds
 * @returns Framer Motion variant object
 */
export const createPulseVariant = (scale: number = 1.5, duration: number = 0.6) => ({
  animate: {
    scale: [1, scale, 1],
    opacity: [1, 0.5, 1],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
  },
});

/**
 * Create a custom scan variant with specified parameters
 * @param direction - Scan direction ('horizontal' | 'vertical')
 * @param duration - Scan duration in seconds
 * @returns Framer Motion variant object
 */
export const createScanVariant = (
  direction: 'horizontal' | 'vertical' = 'vertical',
  duration: number = 5
) => ({
  initial: direction === 'horizontal' ? { left: 0 } : { top: 0 },
  animate: direction === 'horizontal' ? { left: '100%' } : { top: '100%' },
  transition: {
    duration,
    repeat: Infinity,
    ease: 'linear',
  },
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type GlobalConfig = typeof globalConfig;
export type Colors = typeof colors;
export type HeroConfig = typeof heroConfig;
export type ProjectsConfig = typeof projectsConfig;
export type ArticlesConfig = typeof articlesConfig;
export type AboutConfig = typeof aboutConfig;
export type MotionVariants = typeof motionVariants;

// Direction type for scan animations
export type ScanDirection = 'horizontal' | 'vertical';

// Animation state type
export type AnimationState = 'initial' | 'animate' | 'exit';
