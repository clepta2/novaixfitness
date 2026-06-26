// src/components/workout/ProgressSection.js
// Seção de progresso dos treinos - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ProgressSection({ completed, total }) {
  const percentage = (completed / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>DAILY SUMMARY: {total} WORKOUTS</Text>
        <Text style={styles.text}>Completed: {completed} / Total: {total}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[styles.dot, i < completed && styles.dotCompleted]} />
        ))}
      </View>
    </View>
  );
}

export default memo(ProgressSection);

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    letterSpacing: 0.5,
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  dotCompleted: {
    backgroundColor: COLORS.primary,
  },
});
