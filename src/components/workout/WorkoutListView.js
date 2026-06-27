// src/components/workout/WorkoutListView.js
// Listagem de Treinos no Player - NOVAIX FITNESS

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import WorkoutListItem from './WorkoutListItem';
import ProgressSection from './ProgressSection';
import { layout, typography } from '../../styles';

export default function WorkoutListView({ dailyWorkouts, activeWorkout, startWorkout }) {
  const completedCount = dailyWorkouts.filter((w) => w.completed).length;
  const totalCount = dailyWorkouts.length;

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <View>
            <Text style={typography.h2}>Daily Workouts</Text>
            <Text style={typography.bodyMuted}>Workouts Completed</Text>
          </View>
          <Text style={typography.bodySmall}>24/06/2026</Text>
        </View>

        <ProgressSection completed={completedCount} total={totalCount} />

        <Text style={typography.h5}>TREINOS CONCLUÍDOS ({completedCount})</Text>
        {dailyWorkouts.filter((w) => w.completed).map((w) => (
          <WorkoutListItem key={w.id} workout={w} onPress={startWorkout} />
        ))}

        <Text style={[typography.h5, { marginTop: SPACING.lg }]}>PRÓXIMOS TREINOS ({totalCount - completedCount})</Text>
        {dailyWorkouts.filter((w) => !w.completed).map((w) => (
          <WorkoutListItem key={w.id} workout={w} onPress={startWorkout} />
        ))}

        <Text style={[typography.h5, { marginTop: SPACING.lg }]}>TREINO ATIVO (1)</Text>
        <TouchableOpacity style={styles.activeCard} onPress={() => startWorkout(activeWorkout)} activeOpacity={0.8}>
          <View style={styles.activeHeader}>
            <View style={styles.activeTimeBadge}>
              <Text style={typography.h5}>{activeWorkout.time}</Text>
            </View>
            <Text style={typography.h4}>{activeWorkout.name}</Text>
          </View>
          <Text style={typography.bodySmall}>{activeWorkout.sets} S | {activeWorkout.reps} Rep | {activeWorkout.intensity}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  activeCard: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, ...SHADOWS.glow },
  activeHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  activeTimeBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
});
