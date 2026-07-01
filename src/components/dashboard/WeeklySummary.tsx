import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface RecentWorkout {
  completed_at: string;
}

interface WeeklySummaryProps {
  weekWorkouts?: number;
  weekMinutes?: number;
  weekCalories?: number;
  recentWorkouts?: RecentWorkout[];
}

export default function WeeklySummary({ weekWorkouts = 0, weekMinutes = 0, weekCalories = 0, recentWorkouts = [] }: WeeklySummaryProps): React.JSX.Element {
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect((): void => {
    Animated.spring(fadeAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, []);

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={18} color={COLORS.primary} />
        <Text style={styles.title}>RESUMO DA SEMANA</Text>
      </View>

      <View style={styles.daysRow}>
        {weekDays.map((day, i) => {
          const isToday = i === adjustedToday;
          const hasWorkout = recentWorkouts.some(w => {
            const d = new Date(w.completed_at);
            return d.getDay() === (i === 6 ? 0 : i + 1);
          });
          return (
            <View key={i} style={[styles.dayCol, isToday && styles.dayColToday]}>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day}</Text>
              <View style={[styles.dayDot, hasWorkout && styles.dayDotActive, isToday && styles.dayDotToday]} />
            </View>
          );
        })}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weekWorkouts}</Text>
          <Text style={styles.statLabel}>Treinos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weekMinutes}</Text>
          <Text style={styles.statLabel}>Minutos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weekCalories}</Text>
          <Text style={styles.statLabel}>Calorias</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  dayCol: { alignItems: 'center', gap: SPACING.xs },
  dayColToday: { transform: [{ scale: 1.1 }] },
  dayLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  dayLabelToday: { fontFamily: 'Montserrat_600SemiBold', color: COLORS.primary },
  dayDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.surfaceOverlay },
  dayDotActive: { backgroundColor: COLORS.primary },
  dayDotToday: { borderWidth: 2, borderColor: COLORS.primary },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
});
