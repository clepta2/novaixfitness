// src/components/workout/ExerciseProgress.tsx
// Stepper de exercicios - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ExerciseProgressProps {
  exercises: unknown[];
  currentIndex: number;
  currentSet: number;
  totalSets: number;
}

function ExerciseProgress({ exercises, currentIndex, currentSet, totalSets }: ExerciseProgressProps): React.ReactElement {
  const total = exercises?.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.counter}>Exercicio {currentIndex + 1} de {total}</Text>
        <Text style={styles.setInfo}>Serie {currentSet} de {totalSets}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dotsScroll}>
        <View style={styles.dotsRow}>
          {exercises?.map((ex, i) => (
            <View key={i} style={styles.dotWrapper}>
              <View style={[
                styles.dot,
                i < currentIndex && styles.dotCompleted,
                i === currentIndex && styles.dotActive,
              ]}>
                <Text style={[
                  styles.dotNumber,
                  i < currentIndex && styles.dotNumberCompleted,
                  i === currentIndex && styles.dotNumberActive,
                ]}>{i + 1}</Text>
              </View>
              {i < total - 1 && (
                <View style={[styles.line, i < currentIndex && styles.lineCompleted]} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / total) * 100}%` }]} />
      </View>
    </View>
  );
}

export default memo(ExerciseProgress);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  counter: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  setInfo: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary },
  dotsScroll: { marginBottom: SPACING.md },
  dotsRow: { flexDirection: 'row', alignItems: 'center' },
  dotWrapper: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  dotCompleted: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  dotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dotNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted },
  dotNumberCompleted: { color: COLORS.background },
  dotNumberActive: { color: COLORS.background },
  line: { width: 20, height: 2, backgroundColor: COLORS.border },
  lineCompleted: { backgroundColor: COLORS.success },
  progressBar: { height: 4, backgroundColor: COLORS.background, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
});
