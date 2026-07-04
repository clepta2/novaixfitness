// src/components/ui/Loading.tsx
// Componente de carregamento animado - NOVAIX FITNESS

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse' | 'overlay';
  color?: string;
}

// Loading com dots animados
function LoadingDots({ color = COLORS.primary }: { color?: string }) {
  const dots = useMemo(() => [0, 1, 2].map(() => new Animated.Value(0.3)), []);

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      )
    );
    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      {dots.map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot, backgroundColor: color }]} />
      ))}
    </View>
  );
}

// Loading com pulso
function LoadingPulse({ color = COLORS.primary }: { color?: string }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseRing, { transform: [{ scale }], borderColor: color }]} />
      <View style={[styles.pulseCenter, { backgroundColor: color }]} />
    </View>
  );
}

export default function Loading({
  text,
  size = 'large',
  variant = 'spinner',
  color = COLORS.primary,
}: LoadingProps) {
  if (variant === 'overlay') {
    return (
      <View style={styles.overlay}>
        <View style={styles.overlayCard}>
          <ActivityIndicator size="large" color={color} />
          {text && <Text style={styles.overlayText}>{text}</Text>}
        </View>
      </View>
    );
  }

  if (variant === 'dots') return <LoadingDots color={color} />;
  if (variant === 'pulse') return <LoadingPulse color={color} />;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  text: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
  dotsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  pulseContainer: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  pulseRing: { position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 2 },
  pulseCenter: { width: 16, height: 16, borderRadius: 8 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  overlayCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xxl, alignItems: 'center', gap: SPACING.md },
  overlayText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDescription },
});
