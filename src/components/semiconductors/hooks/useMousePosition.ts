"use client";

import { useEffect, useCallback } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';

/**
 * Custom ref object interface for compatibility with React 18+
 */
interface ElementRef {
  current: HTMLElement | null;
}

/**
 * Configuration options for the useMousePosition hook
 */
export interface UseMousePositionOptions {
  /** Reference to the container element. If not provided, tracks window-level mouse position */
  containerRef?: ElementRef;
  /** Spring animation configuration for smooth tracking */
  springConfig?: {
    /** Spring stiffness - higher values create snappier motion (default: 150) */
    stiffness?: number;
    /** Spring damping - higher values reduce oscillation (default: 15) */
    damping?: number;
  };
}

/**
 * Return type for the useMousePosition hook
 */
export interface MousePosition {
  /** Raw X position (0-1 normalized within container, or pixels for window) */
  x: MotionValue<number>;
  /** Raw Y position (0-1 normalized within container, or pixels for window) */
  y: MotionValue<number>;
  /** Smoothed X position with spring animation */
  springX: MotionValue<number>;
  /** Smoothed Y position with spring animation */
  springY: MotionValue<number>;
}

/**
 * Default spring configuration values
 */
const DEFAULT_SPRING_CONFIG = {
  stiffness: 150,
  damping: 15,
};

/**
 * Hook to track mouse position with smooth spring-based animation
 *
 * Features:
 * - Tracks mouse position relative to a container or the window
 * - Returns both raw and spring-smoothed motion values
 * - Normalizes coordinates to 0-1 range when using a container ref
 * - Automatically cleans up event listeners on unmount
 *
 * @param options - Configuration options
 * @returns Object containing raw and smoothed x/y motion values
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { springX, springY } = useMousePosition({
 *   containerRef,
 *   springConfig: { stiffness: 200, damping: 20 }
 * });
 *
 * return (
 *   <motion.div
 *     ref={containerRef}
 *     style={{ x: springX, y: springY }}
 *   />
 * );
 * ```
 */
export function useMousePosition(options?: UseMousePositionOptions): MousePosition {
  const { containerRef, springConfig } = options || {};

  // Merge user config with defaults
  const finalSpringConfig = {
    ...DEFAULT_SPRING_CONFIG,
    ...springConfig,
  };

  // Raw motion values for immediate position tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring-smoothed motion values for fluid animation
  const springX = useSpring(x, finalSpringConfig);
  const springY = useSpring(y, finalSpringConfig);

  /**
   * Handle mouse move events and update position values
   * Normalizes coordinates to 0-1 range when container is specified
   */
  const handleMouseMove = useCallback((event: any) => {
    if (containerRef?.current) {
      // Get container bounds for relative positioning
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate normalized position (0-1 range)
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;

      // Clamp values to 0-1 range to handle edge cases
      x.set(Math.max(0, Math.min(1, relativeX)));
      y.set(Math.max(0, Math.min(1, relativeY)));
    } else {
      // Use absolute window coordinates
      x.set(event.clientX);
      y.set(event.clientY);
    }
  }, [containerRef, x, y]);

  useEffect(() => {
    // Determine the event target (container element or window)
    const target = containerRef?.current || window;

    // Add mouse move listener
    target.addEventListener('mousemove', handleMouseMove);

    // Cleanup listener on unmount or when dependencies change
    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef, handleMouseMove]);

  return {
    x,
    y,
    springX,
    springY,
  };
}

export default useMousePosition;
