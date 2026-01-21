"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';
import { useResponsiveAnimation } from '../hooks/useResponsiveAnimation';
import { heroConfig, colors } from '@/config/semiconductorAnimations';

// ============================================================================
// Types
// ============================================================================

/**
 * Props for the WaferScanningGrid component
 */
export interface WaferScanningGridProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Grid cell size in pixels (default: 20) */
  gridSize?: number;
  /** Laser scan animation duration in seconds (default: 8) */
  scanDuration?: number;
  /** Enable mouse trail effect (default: true) */
  enableMouseTrail?: boolean;
}

/**
 * Trail point data structure for mouse movement tracking
 */
interface TrailPoint {
  /** Unique identifier for the trail point */
  id: number;
  /** X coordinate (0-1 normalized) */
  x: number;
  /** Y coordinate (0-1 normalized) */
  y: number;
  /** Timestamp when the point was created */
  createdAt: number;
}

// ============================================================================
// Constants
// ============================================================================

/** Unique ID for SVG pattern definition */
const PATTERN_ID = 'wafer-grid-pattern';

/** Unique ID for radial gradient mask */
const MASK_ID = 'wafer-radial-mask';

/** Trail point lifetime in milliseconds */
const TRAIL_LIFETIME = heroConfig.mouseTrail.trailLifetime;

/** Maximum number of trail points */
const MAX_TRAIL_POINTS = heroConfig.mouseTrail.trailLength;

/** Counter for generating unique trail point IDs */
let trailPointIdCounter = 0;

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * WaferScanningGrid - Wafer dicing visualization with laser scanning effect
 *
 * This component creates a visual representation of a semiconductor wafer
 * with the following features:
 *
 * 1. Grid Pattern: Regular grid lines simulating wafer dicing streets
 * 2. Radial Mask: Circular gradient creating a wafer-like appearance
 * 3. Laser Scan Line: Animated diagonal scanning line with glow effect
 * 4. Mouse Focus: Interactive laser focus point following cursor
 * 5. Mouse Trail: Fading trail points following cursor movement
 *
 * Performance Considerations:
 * - Respects user's reduced motion preference
 * - Disables complex effects on mobile devices
 * - Uses CSS transforms for smooth animations
 * - Implements pointer-events-none to avoid interaction interference
 *
 * @example
 * ```tsx
 * <WaferScanningGrid
 *   className="absolute inset-0"
 *   gridSize={20}
 *   scanDuration={8}
 *   enableMouseTrail={true}
 * />
 * ```
 */
export function WaferScanningGrid({
  className = '',
  gridSize = heroConfig.waferGrid.gridSize,
  scanDuration = heroConfig.laserScan.duration,
  enableMouseTrail = heroConfig.mouseTrail.enabled,
}: WaferScanningGridProps) {
  // ============================================================================
  // Refs and State
  // ============================================================================

  const containerRef = useRef(null) as any;

  // Get responsive animation configuration
  const animConfig = useResponsiveAnimation();

  // Track mouse position with spring smoothing
  const { x, y, springX, springY } = useMousePosition({
    containerRef,
    springConfig: { stiffness: 150, damping: 15 },
  });

  // Track hover state for showing/hiding mouse focus
  const [isHovering, setIsHovering] = useState(false);

  // Track trail points for mouse movement visualization
  const [trailPoints, setTrailPoints] = useState([] as TrailPoint[]);

  // Container dimensions for pixel calculations
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // ============================================================================
  // Derived Values
  // ============================================================================

  // Determine if mouse trail should be enabled based on config and props
  const shouldShowTrail = useMemo(() => {
    return (
      enableMouseTrail &&
      animConfig.enabled &&
      animConfig.enableMouseTracking &&
      !animConfig.reducedMotion
    );
  }, [enableMouseTrail, animConfig.enabled, animConfig.enableMouseTracking, animConfig.reducedMotion]);

  // Transform normalized coordinates to pixel values for mouse focus
  const focusPixelX = useTransform(springX, (value) => value * containerSize.width);
  const focusPixelY = useTransform(springY, (value) => value * containerSize.height);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle mouse enter - show focus and start tracking
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  /**
   * Handle mouse leave - hide focus and clear trail
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTrailPoints([]);
  }, []);

  /**
   * Handle mouse move - add trail points
   */
  const handleMouseMove = useCallback((e: any) => {
    if (!shouldShowTrail || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;

    // Add new trail point
    const newPoint: TrailPoint = {
      id: trailPointIdCounter++,
      x: normalizedX,
      y: normalizedY,
      createdAt: Date.now(),
    };

    setTrailPoints((prev) => {
      // Keep only the last N points
      const updated = [...prev, newPoint].slice(-MAX_TRAIL_POINTS);
      return updated;
    });
  }, [shouldShowTrail]);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Effect: Update container dimensions on mount and resize
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    // Initial measurement
    updateSize();

    // Listen for resize events
    window.addEventListener('resize', updateSize, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  /**
   * Effect: Clean up expired trail points
   */
  useEffect(() => {
    if (!shouldShowTrail || trailPoints.length === 0) return;

    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrailPoints((prev) =>
        prev.filter((point) => now - point.createdAt < TRAIL_LIFETIME)
      );
    }, 100);

    return () => {
      clearInterval(cleanup);
    };
  }, [shouldShowTrail, trailPoints.length]);

  // ============================================================================
  // Render: Simplified version for disabled animations
  // ============================================================================

  if (!animConfig.enabled || animConfig.reducedMotion) {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {/* Static grid background */}
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ opacity: heroConfig.waferGrid.gridOpacity }}
        >
          <defs>
            {/* Grid pattern definition */}
            <pattern
              id={`${PATTERN_ID}-static`}
              x="0"
              y="0"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke={colors.accent}
                strokeWidth="0.5"
              />
            </pattern>

            {/* Radial gradient mask for circular wafer effect */}
            <radialGradient id={`${MASK_ID}-static`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            <mask id={`${MASK_ID}-static-mask`}>
              <rect
                width="100%"
                height="100%"
                fill={`url(#${MASK_ID}-static)`}
              />
            </mask>
          </defs>

          {/* Grid with radial mask applied */}
          <rect
            width="100%"
            height="100%"
            fill={`url(#${PATTERN_ID}-static)`}
            mask={`url(#${MASK_ID}-static-mask)`}
          />
        </svg>
      </div>
    );
  }

  // ============================================================================
  // Render: Full animated version
  // ============================================================================

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* ================================================================== */}
      {/* Layer 1: Wafer Grid SVG with Radial Mask */}
      {/* ================================================================== */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          {/* Grid pattern definition - creates the dicing street lines */}
          <pattern
            id={PATTERN_ID}
            x="0"
            y="0"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={colors.accent}
              strokeWidth="0.5"
              opacity={heroConfig.waferGrid.gridOpacity}
            />
          </pattern>

          {/* Radial gradient for circular wafer appearance */}
          <radialGradient id={MASK_ID} cx="50%" cy="50%" r={heroConfig.waferGrid.maskRadius}>
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.7" />
            <stop offset="85%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Mask using the radial gradient */}
          <mask id={`${MASK_ID}-mask`}>
            <rect width="100%" height="100%" fill={`url(#${MASK_ID})`} />
          </mask>
        </defs>

        {/* Grid rectangle with mask applied */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#${PATTERN_ID})`}
          mask={`url(#${MASK_ID}-mask)`}
        />
      </svg>

      {/* ================================================================== */}
      {/* Layer 2: Laser Scanning Line */}
      {/* ================================================================== */}
      {heroConfig.laserScan.enabled && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '150%',
            height: heroConfig.laserScan.width,
            background: `linear-gradient(90deg,
              transparent 0%,
              ${colors.accent}40 20%,
              ${colors.accent} 50%,
              ${colors.accent}40 80%,
              transparent 100%
            )`,
            boxShadow: `
              0 0 ${heroConfig.laserScan.glowSize}px rgba(34, 211, 238, 0.6),
              0 0 ${heroConfig.laserScan.glowSize * 2}px rgba(14, 165, 233, 0.4)
            `,
            transformOrigin: 'center center',
            rotate: `${heroConfig.laserScan.angle}deg`,
          }}
          initial={{ x: '-100%', y: '-100%' }}
          animate={{
            x: ['calc(-100% - 50px)', 'calc(100% + 50px)'],
            y: ['calc(-100% - 50px)', 'calc(100% + 50px)'],
          }}
          transition={{
            duration: scanDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* ================================================================== */}
      {/* Layer 3: Mouse Focus Point */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isHovering && animConfig.enableMouseTracking && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              x: focusPixelX,
              y: focusPixelY,
              marginLeft: '-50%',
              marginTop: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Outer pulse ring */}
            <motion.div
              className="absolute"
              style={{
                width: heroConfig.mouseTrail.focusSize * 2,
                height: heroConfig.mouseTrail.focusSize * 2,
                borderRadius: '50%',
                border: `1px solid ${colors.accent}`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Inner focus circle */}
            <div
              style={{
                width: heroConfig.mouseTrail.focusSize,
                height: heroConfig.mouseTrail.focusSize,
                borderRadius: '50%',
                backgroundColor: `${colors.accent}30`,
                border: `2px solid ${colors.accent}`,
                boxShadow: `
                  0 0 10px ${colors.glow.accent},
                  0 0 20px ${colors.glow.accent},
                  inset 0 0 8px ${colors.glow.accent}
                `,
              }}
            />

            {/* Crosshair lines */}
            <div
              className="absolute"
              style={{
                width: heroConfig.mouseTrail.focusSize * 2.5,
                height: 1,
                backgroundColor: colors.accent,
                opacity: 0.5,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              className="absolute"
              style={{
                width: 1,
                height: heroConfig.mouseTrail.focusSize * 2.5,
                backgroundColor: colors.accent,
                opacity: 0.5,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* Layer 4: Mouse Trail Points */}
      {/* ================================================================== */}
      <AnimatePresence>
        {shouldShowTrail &&
          trailPoints.map((point, index) => {
            // Calculate age-based opacity (newer points are more visible)
            const age = Date.now() - point.createdAt;
            const lifeProgress = Math.min(age / TRAIL_LIFETIME, 1);
            const opacity = (1 - lifeProgress) * 0.6;

            // Calculate size based on position in trail (newer points are larger)
            const sizeMultiplier = 0.3 + (index / MAX_TRAIL_POINTS) * 0.7;
            const size = 6 * sizeMultiplier;

            return (
              <motion.div
                key={point.id}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: point.x * containerSize.width,
                  top: point.y * containerSize.height,
                  width: size,
                  height: size,
                  backgroundColor: colors.accent,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${size}px ${colors.glow.accent}`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.15 }}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default WaferScanningGrid;
