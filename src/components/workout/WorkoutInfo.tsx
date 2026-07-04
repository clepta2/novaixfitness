// src/components/workout/WorkoutInfo.tsx
// Info do treino (stats + equipamentos) - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Workout {
  duration_minutes?: number;
  duration?: number;
  exercises?: unknown[];
  equipment?: string[];
}

interface WorkoutInfoProps {
  workout: Workout;
  totalSets?: number;
  calories?: number;
}

interface StatItemProps {
  icon: string;
  value: string;
  color: string;
  delay: number;
}

const STAT_CONFIG = [
  { icon: 'time', color: COLORS.primary },
  { icon: 'barbell', color: COLORS.success },
  { icon: 'repeat', color: COLORS.info },
  { icon: 'flame', color: COLORS.secondary },
];

function StatItem({ icon, value, color, delay }: StatItemProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statItem, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </Animated.View>
  );
}

export default memo(function WorkoutInfo({ workout, totalSets, calories }: WorkoutInfoProps): React.ReactElement {
  const duration = workout?.duration_minutes || workout?.duration || 45;
  const exerciseCount = workout?.exercises?.length || 0;
  const equipment = workout?.equipment || [];

  const stats = [
    { value: `${duration} min`, config: STAT_CONFIG[0] },
    { value: `${exerciseCount} exercícios`, config: STAT_CONFIG[1] },
    { value: `${totalSets || 0} séries`, config: STAT_CONFIG[2] },
    { value: `~${calories || 0} kcal`, config: STAT_CONFIG[3] },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <StatItem key={i} icon={stat.config.icon} value={stat.value} color={stat.config.color} delay={i * 50} />
        ))}
      </View>

      {equipment.length > 0 && (
        <View style={styles.equipmentSection}>
          <View style={styles.equipHeader}>
            <Ionicons name="fitness" size={16} color={COLORS.primary} />
            <Text style={styles.equipTitle}>EQUIPAMENTOS</Text>
          </View>
          <View style={styles.equipRow}>
            {equipment.map((eq, i) => (
              <View key={i} style={styles.equipChip}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                <Text style={styles.equipText}>{eq}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  statsGrid: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  statIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  equipmentSection: { marginTop: SPACING.md },
  equipHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  equipTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  equipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  equipChip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  equipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle },
});
