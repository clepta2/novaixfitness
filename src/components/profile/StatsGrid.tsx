// src/components/profile/StatsGrid.js
// Grid de estatísticas animado - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const STAT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  streak: { icon: 'flame', color: COLORS.secondary, label: 'Streak' },
  workouts: { icon: 'barbell', color: COLORS.primary, label: 'Treinos' },
  time: { icon: 'time', color: COLORS.info, label: 'Tempo' },
  favorites: { icon: 'heart', color: COLORS.error, label: 'Favoritos' },
};

interface StatCardProps {
  icon: string;
  color: string;
  label: string;
  value: number;
  index: number;
}

function StatCard({ icon, color, label, value, index }: StatCardProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 80, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

interface StatsGridProps {
  stats: Record<string, number>;
}

function StatsGrid({ stats }: StatsGridProps): React.JSX.Element {
  return (
    <View style={styles.grid}>
      {Object.entries(stats).map(([key, value], i) => {
        const config = STAT_CONFIG[key];
        if (!config) return null;
        return <StatCard key={key} icon={config.icon} color={config.color} label={config.label} value={value} index={i} />;
      })}
    </View>
  );
}

export default StatsGrid;

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  card: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
});
