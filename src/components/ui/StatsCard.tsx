// src/components/ui/StatsCard.tsx
// Card de estatisticas com animacao - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface StatsCardProps {
  icon: string;
  value: number | string;
  label: string;
  color?: string;
  trend?: number;
  suffix?: string;
}

export default function StatsCard({
  icon,
  value,
  label,
  color = COLORS.primary,
  trend,
  suffix = '',
}: StatsCardProps) {
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  const opacityAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}
        </Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      {trend !== undefined && (
        <View style={[styles.trend, { backgroundColor: trend >= 0 ? COLORS.success + '15' : COLORS.error + '15' }]}>
          <Ionicons
            name={trend >= 0 ? 'trending-up' : 'trending-down'}
            size={12}
            color={trend >= 0 ? COLORS.success : COLORS.error}
          />
          <Text style={[styles.trendText, { color: trend >= 0 ? COLORS.success : COLORS.error }]}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

// StatsCard horizontal para listas
export function HorizontalStatsCard({
  icon,
  value,
  label,
  color = COLORS.primary,
}: {
  icon: string;
  value: number | string;
  label: string;
  color?: string;
}) {
  return (
    <View style={styles.horizontalContainer}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.horizontalContent}>
        <Text style={styles.horizontalValue}>{value}</Text>
        <Text style={styles.horizontalLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  content: {
    marginBottom: SPACING.sm,
  },
  value: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  horizontalContent: {
    flex: 1,
  },
  horizontalValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.textTitle,
  },
  horizontalLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
