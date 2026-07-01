import React from 'react';
// src/components/planner/DayWorkoutSlot.js
// Slot de treino para um dia - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { CATEGORY_COLORS } from '../../data/weekPlan';

export default function DayWorkoutSlot({ dayData, dayName, dateNumber, isToday, onPress }) {
  const isRest = dayData?.isRest;
  const catColor = CATEGORY_COLORS[dayData?.category] || COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.column, isToday && styles.todayColumn]}
      onPress={() => onPress?.(dayData)}
      activeOpacity={0.7}
    >
      <Text style={[styles.dayName, isToday && styles.dayNameToday]}>{dayName}</Text>
      <Text style={[styles.dateNum, isToday && styles.dateNumToday]}>{dateNumber}</Text>

      <View style={[styles.slot, isRest ? styles.restSlot : styles.workoutSlot, isToday && styles.slotToday]}>
        {isRest ? (
          <>
            <Ionicons name="bed-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.restLabel}>Descanso</Text>
          </>
        ) : (
          <>
            <View style={[styles.catDot, { backgroundColor: catColor }]} />
            <Text style={styles.workoutLabel} numberOfLines={2}>
              {dayData?.workoutName}
            </Text>
            {dayData?.duration > 0 && (
              <Text style={styles.durationText}>{dayData.duration}min</Text>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 72,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  todayColumn: {
    opacity: 1,
  },
  dayName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  dayNameToday: {
    color: COLORS.primary,
  },
  dateNum: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
  dateNumToday: {
    color: COLORS.primary,
  },
  slot: {
    width: 64,
    height: 72,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderWidth: 1,
  },
  workoutSlot: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  restSlot: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderLight,
  },
  slotToday: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '0A',
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  workoutLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: COLORS.textTitle,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  durationText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: COLORS.textDescription,
  },
  restLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
