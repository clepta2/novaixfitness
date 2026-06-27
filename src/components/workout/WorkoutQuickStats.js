// src/components/workout/WorkoutQuickStats.js
// Estatísticas rápidas do treino - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const STAT_CONFIG = [
  { icon: 'time', label: 'Duração', color: COLORS.primary },
  { icon: 'flame', label: 'Calorias', color: COLORS.secondary },
  { icon: 'barbell', label: 'Exercícios', color: COLORS.success },
  { icon: 'repeat', label: 'Séries', color: COLORS.info },
];

export default function WorkoutQuickStats({ duration, calories, exerciseCount, totalSets }) {
  const values = [`${duration}min`, `${calories}`, `${exerciseCount}`, `${totalSets}`];

  return (
    <View style={styles.container}>
      {STAT_CONFIG.map((stat, i) => (
        <View key={i} style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: stat.color + '15' }]}>
            <Ionicons name={stat.icon} size={16} color={stat.color} />
          </View>
          <Text style={styles.value}>{values[i]}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.lg },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  iconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  label: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, marginTop: 2 },
});
