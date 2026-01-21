"use client";

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

/**
 * Device type classification based on viewport width
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

/**
 * Animation configuration interface
 * Contains all settings for responsive animations
 */
export interface AnimationConfig {
  // General settings
  enabled: boolean;
  reducedMotion: boolean;
  deviceType: DeviceType;

  // Performance settings
  particleCount: number;
  enableComplexEffects: boolean;

  // Timing settings
  scanSpeed: number;
  transitionDuration: number;

  // Feature flags
  enableMouseTracking: boolean;
  enableRipples: boolean;
  enableGlow: boolean;
}

/**
 * Options for useResponsiveAnimation hook
 */
export interface UseResponsiveAnimationOptions {
  // Custom overrides for any device type
  overrides?: Partial<AnimationConfig>;
  // Force a specific device type (useful for testing)
  forceDeviceType?: DeviceType;
  // Disable all animations regardless of settings
  forceDisabled?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Breakpoints matching Tailwind CSS defaults
 * - mobile: < 640px (below sm)
 * - tablet: 640px - 1023px (sm to below lg)
 * - desktop: >= 1024px (lg and above)
 */
const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

/**
 * Default animation configurations per device type
 * Optimized for performance on each device category
 */
const DEFAULT_CONFIGS: Record<DeviceType, Omit<AnimationConfig, 'enabled' | 'reducedMotion' | 'deviceType'>> = {
  desktop: {
    particleCount: 30,
    enableComplexEffects: true,
    scanSpeed: 8,
    transitionDuration: 0.6,
    enableMouseTracking: true,
    enableRipples: true,
    enableGlow: true,
  },
  tablet: {
    particleCount: 15,
    enableComplexEffects: true,
    scanSpeed: 10,
    transitionDuration: 0.5,
    enableMouseTracking: true,
    enableRipples: true,
    enableGlow: true,
  },
  mobile: {
    particleCount: 0,
    enableComplexEffects: false,
    scanSpeed: 12,
    transitionDuration: 0.4,
    enableMouseTracking: false,
    enableRipples: false,
    enableGlow: true,
  },
};

/**
 * Conservative default config for SSR and initial render
 * Uses mobile settings to ensure good performance before hydration
 */
const SSR_SAFE_CONFIG: AnimationConfig = {
  enabled: false,
  reducedMotion: true,
  deviceType: 'mobile',
  ...DEFAULT_CONFIGS.mobile,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determines device type based on viewport width
 * @param width - Current viewport width in pixels
 * @returns DeviceType classification
 */
function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) {
    return 'mobile';
  }
  if (width < BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Checks if user prefers reduced motion
 * @returns boolean indicating reduced motion preference
 */
function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return true; // Assume reduced motion for SSR safety
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets current viewport width safely
 * @returns viewport width or 0 if not available
 */
function getViewportWidth(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  return window.innerWidth;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useResponsiveAnimation - A hook for responsive animation configuration
 *
 * This hook provides device-aware animation settings that automatically
 * adjust based on viewport size and user preferences.
 *
 * Features:
 * - Detects device type (desktop/tablet/mobile)
 * - Respects prefers-reduced-motion setting
 * - SSR-safe implementation (avoids hydration mismatches)
 * - Supports custom configuration overrides
 * - Automatically updates on window resize
 *
 * @param options - Configuration options
 * @returns AnimationConfig object with current settings
 *
 * @example
 * ```tsx
 * const config = useResponsiveAnimation();
 *
 * if (config.enabled && config.enableMouseTracking) {
 *   // Enable mouse tracking animations
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom overrides
 * const config = useResponsiveAnimation({
 *   overrides: { particleCount: 50 }
 * });
 * ```
 */
export function useResponsiveAnimation(
  options?: UseResponsiveAnimationOptions
): AnimationConfig {
  const { overrides, forceDeviceType, forceDisabled } = options || {};

  // Track mounted state for SSR safety
  const [mounted, setMounted] = useState(false);

  // Track viewport width for device detection
  const [viewportWidth, setViewportWidth] = useState(0);

  // Track reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(true);

  // Memoized device type calculation
  const deviceType = forceDeviceType || (mounted ? getDeviceType(viewportWidth) : 'mobile');

  // Handle resize events with debounce
  const handleResize = useCallback(() => {
    setViewportWidth(getViewportWidth());
  }, []);

  // Handle reduced motion preference changes
  const handleReducedMotionChange = useCallback((event: any) => {
    setReducedMotion(event.matches);
  }, []);

  // Effect: Set mounted state and initial values
  useEffect(() => {
    // Mark as mounted (client-side)
    setMounted(true);

    // Set initial viewport width
    setViewportWidth(getViewportWidth());

    // Set initial reduced motion preference
    setReducedMotion(checkReducedMotion());
  }, []);

  // Effect: Setup resize listener
  useEffect(() => {
    if (!mounted) return;

    // Add resize event listener
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted, handleResize]);

  // Effect: Setup reduced motion preference listener
  useEffect(() => {
    if (!mounted) return;

    // Create media query for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Add change listener
    // Using addEventListener for modern browsers, with fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
    } else {
      // Fallback for older browsers (Safari < 14)
      mediaQuery.addListener(handleReducedMotionChange);
    }

    // Cleanup on unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleReducedMotionChange);
      }
    };
  }, [mounted, handleReducedMotionChange]);

  // Return SSR-safe config before mount
  if (!mounted) {
    return SSR_SAFE_CONFIG;
  }

  // Determine if animations should be enabled
  const enabled = !forceDisabled && !reducedMotion;

  // Get base config for current device type
  const baseConfig = DEFAULT_CONFIGS[deviceType];

  // Build final configuration
  const config: AnimationConfig = {
    enabled,
    reducedMotion,
    deviceType,
    ...baseConfig,
    // Apply overrides if provided
    ...overrides,
  };

  // If reduced motion is preferred, disable complex effects
  if (reducedMotion) {
    config.enableComplexEffects = false;
    config.enableRipples = false;
    config.particleCount = 0;
    config.enableMouseTracking = false;
  }

  // If animations are disabled, use minimal config
  if (!enabled) {
    config.particleCount = 0;
    config.enableComplexEffects = false;
    config.enableMouseTracking = false;
    config.enableRipples = false;
  }

  return config;
}

// ============================================================================
// Utility Exports
// ============================================================================

/**
 * Get animation variants based on config
 * Useful for creating Framer Motion variants
 */
export function getAnimationVariants(config: AnimationConfig) {
  const { transitionDuration, enabled, enableGlow } = config;

  return {
    // Basic fade in/out
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: enabled ? transitionDuration : 0 },
    },

    // Scale with fade
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: enabled ? transitionDuration : 0 },
    },

    // Slide up with fade
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: enabled ? transitionDuration : 0 },
    },

    // Glow effect (only if enabled)
    glow: enableGlow ? {
      boxShadow: [
        '0 0 0px rgba(0, 255, 136, 0)',
        '0 0 20px rgba(0, 255, 136, 0.3)',
        '0 0 0px rgba(0, 255, 136, 0)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    } : {},
  };
}

/**
 * Default export for convenience
 */
export default useResponsiveAnimation;
