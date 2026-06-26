// src/components/workout/WorkoutListItem.js
// Item de treino na lista - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function WorkoutListItem({ workout, isActive, onPress }) {
  const isCompleted = workout.completed;
  const isLocked = workout.locked;

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.active, isCompleted && styles.completed]}
      onPress={() => !isLocked && onPress?.(workout)}
      activeOpacity={isLocked ? 1 : 0.7}
    >
      <View style={styles.time}>
        <Text style={styles.timeText}>{workout.time}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.focus}>{workout.focus}</Text>
        <Text style={styles.details}>
          {workout.sets > 0 ? `${workout.sets} S` : ''}{' '}
          {workout.reps > 0 ? `| ${workout.reps} Rep` : ''}{' '}
          | {workout.intensity}
        </Text>
      </View>

      <View style={styles.status}>
        {isCompleted ? (
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={16} color={COLORS.background} />
          </View>
        ) : isLocked ? (
          <Ionicons name="lock-closed" size={18} color={COLORS.textMuted} />
        ) : (
          <Ionicons name="play-circle" size={24} color={COLORS.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default memo(WorkoutListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  active: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  completed: {
    opacity: 0.7,
  },
  time: {
    width: 50,
    marginRight: SPACING.md,
  },
  timeText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
  focus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textDescription,
    marginTop: 2,
  },
  details: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  status: {
    marginLeft: SPACING.md,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
