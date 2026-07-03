// src/components/analytics/PercentileRing.tsx
// Anel percentil animado para benchmark

import { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { COLORS } from '../../constants/colors';

interface PercentileRingProps {
  percentile: number;
}

export default function PercentileRing({ percentile }: PercentileRingProps) {
  const [animatedValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentile, duration: 1500, useNativeDriver: false,
    }).start();
  }, [percentile, animatedValue]);

  const color = percentile >= 70 ? COLORS.success || '#4CAF50' : percentile >= 40 ? COLORS.primary : COLORS.attention || '#FFC107';
  const label = percentile >= 90 ? 'Top' : percentile >= 70 ? 'Acima' : percentile >= 40 ? 'Médio' : 'Abaixo';

  return (
    <View style={styles.container}>
      <View style={styles.ringOuter}>
        <View style={[styles.ring, { borderColor: COLORS.border || '#2A3040' }]}>
          <View style={[styles.ringFill, { borderColor: color, borderWidth: 4 }]} />
        </View>
        <View style={styles.center}>
          <Text style={[styles.value, { color }]}>{percentile}</Text>
          <Text style={styles.label}>percentil</Text>
        </View>
      </View>
      <View style={[styles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.badgeText, { color }]}>TOP {100 - percentile}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  ringOuter: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.surface || '#1E232A',
    alignItems: 'center', justifyContent: 'center',
  },
  ring: {
    width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 4,
  },
  ringFill: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
  },
  center: { alignItems: 'center' },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 22 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  badge: {
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs,
  },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 9, letterSpacing: 0.5 },
});
