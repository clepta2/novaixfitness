// src/utils/animations.js
// Biblioteca de animações universais - NOVAIX FITNESS

import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

// ─── HOOKS BÁSICOS ─────────────────────────────────────────

export function useFadeInUp(delay = 0) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(20));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return { opacity, translateY };
}

export function useStaggeredEntry(index: number, baseDelay = 80) {
  return useFadeInUp(index * baseDelay);
}

export function useAnimatedNumber(targetValue: number, duration = 800) {
  const [animValue] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animValue, { toValue: targetValue, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [targetValue]);
  return animValue;
}

export function useAnimatedProgress(percentage: number, duration = 1000) {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, { toValue: Math.min(percentage, 100), duration, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [percentage]);
  return progress;
}

export function usePulseGlow(active = true) {
  const [pulse] = useState(() => new Animated.Value(0.4));
  useEffect(() => {
    if (!active) { pulse.setValue(0); return; }
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.4, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    anim.start();
    return () => anim.stop();
  }, [active]);
  return pulse;
}

// ─── HOOKS NOVOS ────────────────────────────────────────────

export function useCardPress() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 0.97, tension: 50, friction: 3, useNativeDriver: true }).start();
  }, []);

  const onPressOut = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }).start();
  }, []);

  return { scaleAnim, onPressIn, onPressOut };
}

export function useCountUp(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, { toValue: target, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    const listener = animValue.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => animValue.removeListener(listener);
  }, [target]);

  return display;
}

export function useShimmer(active = true) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    const anim = Animated.loop(
      Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true })
    );
    anim.start();
    return () => anim.stop();
  }, [active]);

  return shimmerAnim;
}

export function usePageTransition() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return { opacity, translateX };
}

export function useConfetti(active = false) {
  const particles = useRef(Array.from({ length: 20 }, () => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(1),
    rotation: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    if (!active) return;
    particles.forEach((p, i) => {
      const angle = (Math.PI * 2 * i) / particles.length;
      const distance = 80 + Math.random() * 40;
      Animated.parallel([
        Animated.timing(p.x, { toValue: Math.cos(angle) * distance, duration: 800, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: Math.sin(angle) * distance - 50, duration: 800, useNativeDriver: true }),
        Animated.timing(p.opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(p.rotation, { toValue: Math.random() * 360, duration: 800, useNativeDriver: true }),
      ]).start();
    });
  }, [active]);

  return particles;
}

export function useShake(active = false) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [active]);

  return shakeAnim;
}
