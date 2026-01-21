"use client";

/**
 * HoverCard3D Component
 *
 * Enhanced card component with 3D tilt effect and semiconductor bonding point indicators.
 * Simulates the wire bonding theme from chip packaging process.
 *
 * Features:
 * - 3D perspective tilt based on mouse position
 * - Bonding point indicators at card corners with pulse animation
 * - Glow border effect on hover
 * - Smooth spring physics for natural movement
 * - Respects user's reduced motion preference
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { projectsConfig, colors } from '@/config/semiconductorAnimations';

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Custom hook to detect user's reduced motion preference
 * @returns boolean indicating if user prefers reduced motion
 */
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: any) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// ============================================================================
// TYPES
// ============================================================================

/**
 * Props for HoverCard3D component
 */
interface HoverCard3DProps {
  /** Card content */
  children: any;
  /** Additional CSS classes */
  className?: string;
  /** Maximum tilt angle in degrees (default: 10) */
  maxRotation?: number;
  /** CSS perspective distance in pixels (default: 1000) */
  perspective?: number;
  /** Whether to show bonding point indicators at corners (default: true) */
  showBondingPoints?: boolean;
  /** Whether to enable glow border effect on hover (default: true) */
  enableGlow?: boolean;
  /** Custom glow color (default: primary blue) */
  glowColor?: string;
  /** Enable shine/gloss effect following mouse (default: false) */
  enableShine?: boolean;
}

/**
 * Position type for bonding points
 */
type BondingPointPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Props for BondingPoint sub-component
 */
interface BondingPointProps {
  /** Corner position of the bonding point */
  position: BondingPointPosition;
  /** Whether the parent card is being hovered */
  isActive: boolean;
  /** Size of the bonding point in pixels */
  size?: number;
  /** Color of the bonding point */
  color?: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * BondingPoint Component
 *
 * Renders a small circular indicator at card corners, simulating
 * the bonding pads used in chip wire bonding process.
 */
function BondingPoint({
  position,
  isActive,
  size = projectsConfig.bondingPoints.size,
  color = colors.gold,
}: BondingPointProps) {
  // Position classes for each corner
  const positionClasses: Record<BondingPointPosition, string> = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <motion.div
      className={`absolute z-10 pointer-events-none ${positionClasses[position]}`}
      animate={
        isActive
          ? {
              scale: [1, projectsConfig.bondingPoints.pulseScale, 1],
              opacity: [0.3, 1, 0.3],
            }
          : {
              scale: 1,
              opacity: 0.3,
            }
      }
      transition={{
        duration: projectsConfig.bondingPoints.pulseDuration,
        repeat: isActive ? Infinity : 0,
        ease: 'easeInOut',
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        boxShadow: isActive ? `0 0 10px ${color}` : 'none',
      }}
    />
  );
}

/**
 * ShineEffect Component
 *
 * Renders a radial gradient that follows the mouse position,
 * creating a glossy/shine effect on the card surface.
 */
interface ShineEffectProps {
  /** X position as percentage (0-100) */
  x: number;
  /** Y position as percentage (0-100) */
  y: number;
  /** Whether the effect is active */
  isActive: boolean;
}

function ShineEffect({ x, y, isActive }: ShineEffectProps) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-inherit"
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
        borderRadius: 'inherit',
      }}
      animate={{
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
    />
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * HoverCard3D Component
 *
 * An enhanced card wrapper that provides 3D tilt effect on hover,
 * with semiconductor-themed bonding point indicators and glow effects.
 *
 * @example
 * ```tsx
 * <HoverCard3D className="bg-gray-800 rounded-lg p-6">
 *   <h3>Project Title</h3>
 *   <p>Project description...</p>
 * </HoverCard3D>
 * ```
 */
export function HoverCard3D({
  children,
  className = '',
  maxRotation = projectsConfig.card3D.maxRotation,
  perspective = projectsConfig.card3D.perspective,
  showBondingPoints = projectsConfig.bondingPoints.enabled,
  enableGlow = true,
  glowColor = colors.primary,
  enableShine = false,
}: HoverCard3DProps) {
  // Refs
  const cardRef = useRef(null) as any;

  // State
  const [isHovered, setIsHovered] = useState(false);
  const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Motion values for smooth rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Spring physics for natural movement feel
  const springConfig = { stiffness: 150, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  /**
   * Handle mouse movement over the card
   * Calculates rotation angles based on mouse position relative to card center
   */
  const handleMouseMove = useCallback(
    (e: any) => {
      if (prefersReducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized position (-1 to 1)
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Apply rotation (inverted Y for natural tilt feel)
      rotateX.set(-normalizedY * maxRotation);
      rotateY.set(normalizedX * maxRotation);

      // Update shine position as percentage
      if (enableShine) {
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;
        setShinePosition({ x: percentX, y: percentY });
      }
    },
    [prefersReducedMotion, maxRotation, rotateX, rotateY, enableShine]
  );

  /**
   * Handle mouse enter event
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  /**
   * Handle mouse leave event
   * Resets rotation to neutral position
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  // Return simplified version if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  // Generate glow box-shadow style
  const glowBoxShadow = enableGlow
    ? `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`
    : undefined;

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: perspective,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          boxShadow: isHovered && enableGlow ? glowBoxShadow : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-full"
      >
        {/* Bonding point indicators at corners */}
        {showBondingPoints && (
          <>
            <BondingPoint position="top-left" isActive={isHovered} />
            <BondingPoint position="top-right" isActive={isHovered} />
            <BondingPoint position="bottom-left" isActive={isHovered} />
            <BondingPoint position="bottom-right" isActive={isHovered} />
          </>
        )}

        {/* Shine/gloss effect overlay */}
        {enableShine && (
          <ShineEffect
            x={shinePosition.x}
            y={shinePosition.y}
            isActive={isHovered}
          />
        )}

        {/* Card content */}
        {children}
      </motion.div>
    </motion.div>
  );
}

// Default export
export default HoverCard3D;
