// src/components/workout/WorkoutListView.tsx
// Listagem de Treinos no Player - NOVAIX FITNESS

import { memo, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import WorkoutListItem from './WorkoutListItem';
import ProgressSection from './ProgressSection';
import { layout, typography } from '../../styles';

interface DailyWorkout {
  id: string;
  completed: boolean;
  [key: string]: any;
}

interface ActiveWorkout {
  time: string;
  name: string;
  sets: number | string;
  reps: number | string;
  intensity: string;
  [key: string]: any;
}

interface WorkoutListViewProps {
  dailyWorkouts: DailyWorkout[];
  activeWorkout: ActiveWorkout;
  startWorkout: (workout: DailyWorkout | ActiveWorkout) => void;
}

export default memo(function WorkoutListView({ dailyWorkouts, activeWorkout, startWorkout }: WorkoutListViewProps): React.ReactElement {
  const completedCount = useMemo(() => dailyWorkouts.filter((w) => w.completed).length, [dailyWorkouts]);
  const totalCount = dailyWorkouts.length;

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <View>
            <Text style={typography.h2}>Daily Workouts</Text>
            <Text style={typography.bodyMuted}>Workouts Completed</Text>
          </View>
          <Text style={typography.bodySmall}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        <ProgressSection completed={completedCount} total={totalCount} />

        <Text style={typography.h5}>TREINOS CONCLUÍDOS ({completedCount})</Text>
        {dailyWorkouts.filter((w) => w.completed).map((w) => (
          <WorkoutListItem key={w.id} workout={w as any} isActive={false} onPress={startWorkout as any} />
        ))}

        <Text style={[typography.h5, { marginTop: SPACING.lg }]}>PRÓXIMOS TREINOS ({totalCount - completedCount})</Text>
        {dailyWorkouts.filter((w) => !w.completed).map((w) => (
          <WorkoutListItem key={w.id} workout={w as any} isActive={false} onPress={startWorkout as any} />
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
});

const styles = StyleSheet.create({
  activeCard: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, ...SHADOWS.glow },
  activeHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  activeTimeBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
});
