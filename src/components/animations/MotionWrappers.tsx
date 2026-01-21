"use client";

import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';

// Check for reduced motion preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// ============================================
// ANIMATION VARIANTS
// ============================================

/**
 * Page fade-in with upward movement
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Simple fade-in animation
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

/**
 * Scale fade-in animation
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Stagger container for list items
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

/**
 * Stagger item with fade-in-up
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Hero text animation sequence
 */
export const heroText: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6
    }
  })
};

/**
 * Card hover effect variants
 */
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

/**
 * Progress bar animation
 */
export const progressFill: Variants = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

/**
 * Underline animation for links
 */
export const underlineExpand: Variants = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

// ============================================
// MOTION WRAPPER COMPONENTS
// ============================================

interface MotionWrapperProps extends Omit<MotionProps, 'viewport'> {
  children: any;
  className?: string;
  variants?: Variants;
  viewport?: boolean | { once?: boolean; amount?: number };
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Page wrapper with fade-in animation
 * Use this to wrap the main content of each page
 */
export function PageWrapper({
  children,
  className = '',
  variants = fadeInUp,
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? fadeIn : variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section wrapper with scroll-triggered animation
 * Use for page sections that should animate when scrolled into view
 */
export function SectionWrapper({
  children,
  className = '',
  variants = fadeInUp,
  viewport = { once: true, amount: 0.2 },
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={prefersReducedMotion ? undefined : viewport}
      variants={prefersReducedMotion ? fadeIn : variants}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/**
 * Staggered list wrapper
 * Use for grid/list layouts where items should animate sequentially
 */
export function StaggerWrapper({
  children,
  className = '',
  variants = staggerContainer,
  viewport = { once: true, amount: 0.1 },
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      viewport={prefersReducedMotion ? undefined : viewport}
      variants={prefersReducedMotion ? fadeIn : variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual stagger item
 * Use inside StaggerWrapper for each list item
 */
export function StaggerItem({
  children,
  className = '',
  variants = staggerItem,
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? fadeIn : variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hoverable card wrapper with elevation effect
 */
export function HoverCard({
  children,
  className = '',
  ...props
}: Omit<MotionWrapperProps, 'variants'>) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="rest"
      whileHover={prefersReducedMotion ? undefined : "hover"}
      variants={cardHover}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Text reveal animation
 * Use for headings and important text
 */
export function RevealText({
  children,
  className = '',
  delay = 0,
  ...props
}: Omit<MotionWrapperProps, 'variants'> & { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay, duration: 0.5 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.span>
  );
}

/**
 * Animated progress bar
 */
export function AnimatedProgress({
  value,
  className = '',
  delay = 0,
  ...props
}: { value: number; className?: string; delay?: number } & MotionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${value}%` }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0 : 1,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
      {...props}
    />
  );
}

/**
 * Floating animation for decorative elements
 */
export function Floating({
  children,
  className = '',
  duration = 3,
  delay = 0,
  ...props
}: any) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pulse animation for attention-grabbing elements
 */
export function Pulse({
  children,
  className = '',
  ...props
}: any) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll indicator with bounce animation
 */
export function ScrollIndicator({
  className = '',
  ...props
}: any) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-current rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className={className}
      {...props}
    >
      <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1 h-3 bg-current rounded-full"
        />
      </div>
    </motion.div>
  );
}

/**
 * Shimmer loading skeleton animation
 */
export function Shimmer({
  className = '',
  ...props
}: any) {
  return (
    <motion.div
      animate={{
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
      {...props}
    />
  );
}
