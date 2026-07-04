// src/components/workout/WorkoutStatsSummary.tsx
// Resumo de estatísticas de treinos - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
}

interface WorkoutStatsSummaryProps {
  stats: {
    total: number;
    completed: number;
    totalMinutes: number;
    avgRating: number;
  };
}

function StatCard({ icon, value, label, color, delay = 0 }: StatCardProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { borderLeftColor: color, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={14} color={color} />
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

export default function WorkoutStatsSummary({ stats }: WorkoutStatsSummaryProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <StatCard icon="barbell" value={stats.total} label="Treinos" color={COLORS.primary} delay={0} />
      <StatCard icon="checkmark-circle" value={stats.completed} label="Concluídos" color={COLORS.success} delay={50} />
      <StatCard icon="time" value={`${stats.totalMinutes}`} label="Minutos" color={COLORS.info} delay={100} />
      <StatCard icon="star" value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'} label="Avaliação" color={COLORS.attention} delay={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.md },
  card: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, alignItems: 'center', borderLeftWidth: 3 },
  iconContainer: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, marginTop: 2 },
});
