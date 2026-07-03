// src/hooks/useEntryAnimation.ts
// Hook de animacao de entrada padronizada - NOVAIX FITNESS

import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface UseEntryAnimationOptions {
  delay?: number;
  duration?: number;
  slideDistance?: number;
  enabled?: boolean;
}

export function useEntryAnimation(options: UseEntryAnimationOptions = {}) {
  const { delay = 0, duration = 500, slideDistance = 20, enabled = true } = options;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(slideDistance)).current;

  useEffect(() => {
    if (!enabled) return;
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 55, delay, useNativeDriver: true }),
    ]).start();
  }, [enabled]);

  return { fade, slide };
}
