// src/styles/animations.ts
// Sistema de animacoes e efeitos visuais - NOVAIX FITNESS

import { Animated, Easing } from 'react-native';

// ─── Timing Presets ──────────────────────────────────────────
export const TIMING = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
} as const;

// ─── Easing Presets ──────────────────────────────────────────
export const EASING = {
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
} as const;

// ─── Fade Animations ────────────────────────────────────────
export function fadeIn(animValue: Animated.Value, duration: number = TIMING.normal, delay = 0) {
  return Animated.timing(animValue, { toValue: 1, duration, delay, useNativeDriver: true });
}

export function fadeOut(animValue: Animated.Value, duration: number = TIMING.normal, delay = 0) {
  return Animated.timing(animValue, { toValue: 0, duration, delay, useNativeDriver: true });
}

// ─── Slide Animations ───────────────────────────────────────
export function slideInUp(animValue: Animated.Value, distance = 30, duration: number = TIMING.normal) {
  return Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true });
}

export function slideInDown(animValue: Animated.Value, distance = 30, duration: number = TIMING.normal) {
  return Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true });
}

export function slideInLeft(animValue: Animated.Value, distance = 30, duration: number = TIMING.normal) {
  return Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true });
}

export function slideInRight(animValue: Animated.Value, distance = 30, duration: number = TIMING.normal) {
  return Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true });
}

// ─── Scale Animations ───────────────────────────────────────
export function scaleIn(animValue: Animated.Value, from = 0.8, duration: number = TIMING.normal) {
  return Animated.spring(animValue, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true });
}

export function pulse(animValue: Animated.Value, duration = 800) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animValue, { toValue: 1.05, duration, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration, useNativeDriver: true }),
    ])
  );
}

// ─── Stagger Animation ──────────────────────────────────────
export function staggerFadeIn(animValues: Animated.Value[], staggerDelay = 80) {
  return Animated.parallel(
    animValues.map((val, index) => fadeIn(val, TIMING.normal, index * staggerDelay))
  );
}

export function staggerSlideUp(animValues: Animated.Value[], staggerDelay = 80) {
  return Animated.parallel(
    animValues.map((val, index) => Animated.timing(val, { toValue: 0, duration: TIMING.normal, delay: index * staggerDelay, useNativeDriver: true }))
  );
}

// ─── Spring Presets ─────────────────────────────────────────
export function springBounce(animValue: Animated.Value) {
  return Animated.spring(animValue, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true });
}

export function springGentle(animValue: Animated.Value) {
  return Animated.spring(animValue, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true });
}

export function springSnappy(animValue: Animated.Value) {
  return Animated.spring(animValue, { toValue: 1, friction: 5, tension: 180, useNativeDriver: true });
}

// ─── Sequence Animations ────────────────────────────────────
export function fadeInThenSlide(fadeAnim: Animated.Value, slideAnim: Animated.Value, slideDistance = 20) {
  return Animated.parallel([
    fadeIn(fadeAnim, TIMING.slow),
    Animated.timing(slideAnim, { toValue: 0, duration: TIMING.slow, easing: EASING.easeOut, useNativeDriver: true }),
  ]);
}

// ─── Shake Animation ────────────────────────────────────────
export function shake(animValue: Animated.Value) {
  return Animated.sequence([
    Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 6, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: -6, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]);
}

// ─── Continuous Pulse (for live indicators) ─────────────────
export function continuousPulse(animValue: Animated.Value) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animValue, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ])
  );
}

// ─── Helper: Create Animated Value with initial ─────────────
export function createAnimValue(initial = 0): Animated.Value {
  return new Animated.Value(initial);
}

// ─── Helper: Parallel fade + slide from direction ───────────
export function entranceAnimation(fade: Animated.Value, slide: Animated.Value, direction: 'up' | 'down' | 'left' | 'right' = 'up', distance = 25) {
  const initialMap = { up: distance, down: -distance, left: -distance, right: distance };
  slide.setValue(initialMap[direction]);
  return Animated.parallel([
    fadeIn(fade, TIMING.slow),
    Animated.spring(slide, { toValue: 0, friction: 7, tension: 55, useNativeDriver: true }),
  ]);
}
