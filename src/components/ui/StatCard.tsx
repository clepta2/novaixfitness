// src/components/ui/StatCard.js
// Componente de estatística reutilizável - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function StatCard({
  icon,
  label,
  value,
  color = COLORS.primary,
  loading = false,
  delay = undefined,
  index = undefined,
}: {
  icon: any;
  label: string;
  value: any;
  color?: string;
  loading?: boolean;
  delay?: number;
  index?: number;
}) {
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  const animDelay = delay ?? (index != null ? index * 80 : 0);
  const animate = delay != null || index != null;

  useEffect(() => {
    if (!animate) {
      scaleAnim.setValue(1);
      fadeAnim.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        friction: 8,
        delay: animDelay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        delay: animDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const displayValue = loading ? '...' : value;

  return (
    <Animated.View
      style={[
        styles.card,
        animate && { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={[styles.iconBg, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.value, { color }]}>{displayValue}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  value: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
