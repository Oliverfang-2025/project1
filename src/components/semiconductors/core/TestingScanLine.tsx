"use client";

/**
 * TestingScanLine Component
 *
 * A semiconductor chip testing/inspection themed component that simulates
 * the automated optical inspection (AOI) process used in chip packaging.
 *
 * Features:
 * - Background scan line effect (vertical/horizontal)
 * - Status indicator lights (pass/testing/idle states)
 * - Hover-triggered scan effect for interactive elements
 *
 * @module components/semiconductors/core/TestingScanLine
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsiveAnimation } from '../hooks/useResponsiveAnimation';
import { aboutConfig, colors } from '@/config/semiconductorAnimations';

// ============================================================================
// StatusIndicator Component
// ============================================================================

/**
 * Props for StatusIndicator component
 */
interface StatusIndicatorProps {
  /** Current status state */
  status?: 'pass' | 'testing' | 'idle';
  /** Indicator size in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StatusIndicator - A status light component for testing/inspection displays
 *
 * Displays a colored indicator light that changes appearance based on status:
 * - pass: Green with slow pulse animation
 * - testing: Yellow/amber with fast blink animation
 * - idle: Gray with no animation
 *
 * @example
 * ```tsx
 * <StatusIndicator status="pass" size={8} />
 * <StatusIndicator status="testing" />
 * <StatusIndicator status="idle" size={4} />
 * ```
 */
export function StatusIndicator({
  status = 'pass',
  size = aboutConfig.statusIndicator.size,
  className = '',
}: StatusIndicatorProps) {
  const animConfig = useResponsiveAnimation();

  // Define status-specific colors
  const statusColors = {
    pass: colors.success,      // Green (#22c55e)
    testing: colors.warning,   // Yellow/amber (#f59e0b)
    idle: colors.foreground.subtle, // Gray (#71717a)
  };

  // Define status-specific glow colors
  const statusGlows = {
    pass: colors.glow.success,
    testing: 'rgba(245, 158, 11, 0.4)',
    idle: 'transparent',
  };

  const color = statusColors[status];
  const glowColor = statusGlows[status];

  // Return static version for reduced motion or disabled animations
  if (animConfig.reducedMotion || !animConfig.enabled) {
    return (
      <div
        className={`rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
    );
  }

  // Animation variants based on status
  const getAnimation = () => {
    switch (status) {
      case 'pass':
        // Slow pulse animation for pass state
        return {
          animate: {
            scale: [1, 1.1, 1],
            opacity: [1, 0.7, 1],
            boxShadow: [
              `0 0 ${aboutConfig.statusIndicator.glowSize}px ${glowColor}`,
              `0 0 ${aboutConfig.statusIndicator.glowSize * 2}px ${glowColor}`,
              `0 0 ${aboutConfig.statusIndicator.glowSize}px ${glowColor}`,
            ],
          },
          transition: {
            duration: aboutConfig.statusIndicator.pulseDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        };
      case 'testing':
        // Fast blink animation for testing state
        return {
          animate: {
            opacity: [1, 0.3, 1],
            boxShadow: [
              `0 0 ${aboutConfig.statusIndicator.glowSize}px ${glowColor}`,
              `0 0 2px ${glowColor}`,
              `0 0 ${aboutConfig.statusIndicator.glowSize}px ${glowColor}`,
            ],
          },
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        };
      case 'idle':
      default:
        // No animation for idle state
        return {
          animate: {},
          transition: {},
        };
    }
  };

  const animation = getAnimation();

  return (
    <motion.div
      className={`rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={animation.animate}
      transition={animation.transition}
    />
  );
}

// ============================================================================
// HoverScanEffect Component
// ============================================================================

/**
 * Props for HoverScanEffect component
 */
interface HoverScanEffectProps {
  /** Child elements to wrap */
  children: any;
  /** Additional CSS classes */
  className?: string;
  /** Scan animation duration in seconds */
  scanDuration?: number;
}

/**
 * HoverScanEffect - A wrapper component that adds a scan line effect on hover
 *
 * When the user hovers over the element, a glowing scan line moves from
 * top to bottom, simulating an inspection scan.
 *
 * @example
 * ```tsx
 * <HoverScanEffect scanDuration={0.8}>
 *   <div className="card">Content here</div>
 * </HoverScanEffect>
 * ```
 */
export function HoverScanEffect({
  children,
  className = '',
  scanDuration = aboutConfig.hoverScan.duration,
}: HoverScanEffectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const animConfig = useResponsiveAnimation();

  // Event handlers with any type per project guidelines
  const handleMouseEnter = (e: any) => {
    setIsHovered(true);
  };

  const handleMouseLeave = (e: any) => {
    setIsHovered(false);
  };

  // If animations are disabled, just render children without effect
  if (!animConfig.enabled || animConfig.reducedMotion) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Scan line effect container */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Moving scan line */}
            <motion.div
              className="absolute left-0 right-0"
              style={{
                height: aboutConfig.hoverScan.height,
                background: `linear-gradient(
                  90deg,
                  transparent 0%,
                  ${aboutConfig.hoverScan.color} 20%,
                  ${aboutConfig.hoverScan.color} 80%,
                  transparent 100%
                )`,
                boxShadow: `0 0 10px ${colors.glow.accent}`,
              }}
              initial={{ top: 0, opacity: 0 }}
              animate={{
                top: '100%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: scanDuration,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// TestingScanLine Component (Main)
// ============================================================================

/**
 * Props for TestingScanLine component
 */
interface TestingScanLineProps {
  /** Additional CSS classes */
  className?: string;
  /** Scan cycle duration in seconds */
  scanDuration?: number;
  /** Scan direction */
  direction?: 'vertical' | 'horizontal';
}

/**
 * TestingScanLine - Background scan line effect for testing/inspection displays
 *
 * Creates a continuously moving scan line effect that simulates automated
 * optical inspection equipment. The scan line moves in the specified direction
 * with a glowing effect that fades at the edges.
 *
 * This component should be positioned absolutely within a container and
 * uses pointer-events-none to avoid interfering with user interactions.
 *
 * @example
 * ```tsx
 * <div className="relative h-64">
 *   <TestingScanLine direction="vertical" scanDuration={5} />
 *   <div>Content here</div>
 * </div>
 * ```
 */
export function TestingScanLine({
  className = '',
  scanDuration = aboutConfig.scanLine.duration,
  direction = aboutConfig.scanLine.direction,
}: TestingScanLineProps) {
  const animConfig = useResponsiveAnimation();

  // Return null if animations are disabled or reduced motion is preferred
  if (!animConfig.enabled || animConfig.reducedMotion) {
    return null;
  }

  // Check if scan line is enabled in config
  if (!aboutConfig.scanLine.enabled) {
    return null;
  }

  // Calculate scan line styles based on direction
  const isVertical = direction === 'vertical';

  // Scan line dimensions and positioning
  const scanLineStyle: any = isVertical
    ? {
        // Vertical scan: horizontal line moving top to bottom
        left: 0,
        right: 0,
        height: aboutConfig.scanLine.width,
        width: '100%',
      }
    : {
        // Horizontal scan: vertical line moving left to right
        top: 0,
        bottom: 0,
        width: aboutConfig.scanLine.width,
        height: '100%',
      };

  // Animation properties based on direction
  const animationProps = isVertical
    ? {
        initial: { top: '-2px' },
        animate: { top: 'calc(100% + 2px)' },
      }
    : {
        initial: { left: '-2px' },
        animate: { left: 'calc(100% + 2px)' },
      };

  // Gradient direction for the glow effect
  const gradientDirection = isVertical ? 'to right' : 'to bottom';

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        // Radial gradient mask to fade scan line at edges
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
      }}
    >
      {/* Scanning line */}
      <motion.div
        className="absolute"
        style={{
          ...scanLineStyle,
          background: `linear-gradient(
            ${gradientDirection},
            transparent 0%,
            ${aboutConfig.scanLine.color}40 10%,
            ${aboutConfig.scanLine.color} 50%,
            ${aboutConfig.scanLine.color}40 90%,
            transparent 100%
          )`,
          boxShadow: `0 0 ${aboutConfig.scanLine.glowSize}px ${colors.glow.accent}`,
        }}
        initial={animationProps.initial}
        animate={animationProps.animate}
        transition={{
          duration: scanDuration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Secondary glow trail for enhanced effect */}
      <motion.div
        className="absolute"
        style={{
          ...scanLineStyle,
          background: `linear-gradient(
            ${gradientDirection},
            transparent 0%,
            ${aboutConfig.scanLine.color}20 30%,
            ${aboutConfig.scanLine.color}40 50%,
            ${aboutConfig.scanLine.color}20 70%,
            transparent 100%
          )`,
          filter: `blur(${aboutConfig.scanLine.glowSize / 2}px)`,
          ...(isVertical
            ? { height: aboutConfig.scanLine.glowSize * 2 }
            : { width: aboutConfig.scanLine.glowSize * 2 }),
        }}
        initial={animationProps.initial}
        animate={animationProps.animate}
        transition={{
          duration: scanDuration,
          repeat: Infinity,
          ease: 'linear',
          delay: 0.05, // Slight delay for trail effect
        }}
      />
    </div>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default TestingScanLine;
