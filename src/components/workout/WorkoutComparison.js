// src/components/workout/WorkoutComparison.js
// Comparação com treino anterior - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ComparisonRow({ label, current, previous, unit = '', better = 'higher' }) {
  if (!previous) return null;
  const diff = current - previous;
  const isImprovement = better === 'higher' ? diff > 0 : diff < 0;
  const isSame = diff === 0;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.values}>
        <Text style={styles.previous}>{previous}{unit}</Text>
        <Ionicons name="arrow-forward" size={12} color={COLORS.textMuted} />
        <Text style={[styles.current, isImprovement && { color: COLORS.success }, !isImprovement && !isSame && { color: COLORS.error }]}>
          {current}{unit}
        </Text>
        {!isSame && (
          <View style={[styles.diff, { backgroundColor: isImprovement ? COLORS.success + '20' : COLORS.error + '20' }]}>
            <Ionicons name={isImprovement ? 'trending-up' : 'trending-down'} size={10} color={isImprovement ? COLORS.success : COLORS.error} />
            <Text style={[styles.diffText, { color: isImprovement ? COLORS.success : COLORS.error }]}>
              {diff > 0 ? '+' : ''}{diff}{unit}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function WorkoutComparison({ current, previous }) {
  if (!previous) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="git-compare" size={16} color={COLORS.info} />
        <Text style={styles.title}>VS. TREINO ANTERIOR</Text>
      </View>
      <View style={styles.card}>
        <ComparisonRow label="Duração" current={current.duration || 0} previous={previous.duration} unit=" min" />
        <ComparisonRow label="Exercícios" current={current.exercises || 0} previous={previous.exercises} />
        <ComparisonRow label="Séries" current={current.sets || 0} previous={previous.sets} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.xs },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, width: 80 },
  values: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  previous: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  current: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  diff: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: SPACING.xs, paddingVertical: 1, borderRadius: BORDER_RADIUS.sm },
  diffText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9 },
});
