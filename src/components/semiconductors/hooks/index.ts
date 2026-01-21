/**
 * Semiconductor Animation Hooks
 *
 * This module exports all hooks related to semiconductor-themed animations.
 * These hooks provide responsive, accessible, and performant animation configurations.
 */

// Mouse position tracking hook
export {
  useMousePosition,
  type UseMousePositionOptions,
  type MousePosition,
} from './useMousePosition';

// Main responsive animation hook
export {
  useResponsiveAnimation,
  getAnimationVariants,
  default as useResponsiveAnimationDefault,
} from './useResponsiveAnimation';

// Type exports
export type {
  DeviceType,
  AnimationConfig,
  UseResponsiveAnimationOptions,
} from './useResponsiveAnimation';
