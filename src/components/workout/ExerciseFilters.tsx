// src/components/workout/ExerciseFilters.tsx
// Filtros da biblioteca de exercícios - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface MuscleGroupItem {
  key: string;
  label: string;
  icon: string;
  color: string;
}

interface DifficultyItem {
  key: string;
  label: string;
  color: string;
}

const MUSCLE_GROUPS: MuscleGroupItem[] = [
  { key: 'all', label: 'Todos', icon: 'grid', color: COLORS.primary },
  { key: 'Peito', label: 'Peito', icon: 'body', color: COLORS.success },
  { key: 'Costas', label: 'Costas', icon: 'body', color: COLORS.info },
  { key: 'Pernas', label: 'Pernas', icon: 'walk', color: COLORS.secondary },
  { key: 'Ombros', label: 'Ombros', icon: 'body', color: COLORS.attention },
  { key: 'Braços', label: 'Braços', icon: 'barbell', color: COLORS.primary },
  { key: 'Abdômen', label: 'Abdômen', icon: 'fitness', color: COLORS.success },
];

const EQUIPMENT = ['Todos', 'Nenhum', 'Halteres', 'Barra', 'Máquina', 'Cabo', 'Proprio'];

const DIFFICULTY: DifficultyItem[] = [
  { key: 'all', label: 'Todos', color: COLORS.textMuted },
  { key: 'Iniciante', label: 'Iniciante', color: COLORS.success },
  { key: 'Intermediário', label: 'Intermediário', color: COLORS.attention },
  { key: 'Avançado', label: 'Avançado', color: COLORS.error },
];

export { MUSCLE_GROUPS, EQUIPMENT, DIFFICULTY };

interface ExerciseFiltersProps {
  selectedMuscle: string;
  onSelectMuscle: (key: string) => void;
  selectedEquipment: string;
  onSelectEquipment: (equipment: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (key: string) => void;
  stats: { total: number; muscles: number; avgCalories: number };
}

export default function ExerciseFilters({
  selectedMuscle,
  onSelectMuscle,
  selectedEquipment,
  onSelectEquipment,
  selectedDifficulty,
  onSelectDifficulty,
  stats,
}: ExerciseFiltersProps): React.ReactElement {
  return (
    <>
      <View style={styles.muscleRow}>
        {MUSCLE_GROUPS.map(m => (
          <TouchableOpacity
            key={m.key}
            style={[styles.muscleBtn, selectedMuscle === m.key && { backgroundColor: m.color }]}
            onPress={() => onSelectMuscle(m.key)}
          >
            <Ionicons name={m.icon as any} size={14} color={selectedMuscle === m.key ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.muscleText, selectedMuscle === m.key && styles.muscleTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {EQUIPMENT.map(eq => (
            <TouchableOpacity
              key={eq}
              style={[styles.filterBtn, selectedEquipment === eq && styles.filterActive]}
              onPress={() => onSelectEquipment(eq)}
            >
              <Text style={[styles.filterText, selectedEquipment === eq && styles.filterTextActive]}>{eq}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>{stats.total} exercícios</Text>
        <Text style={styles.statsDot}>•</Text>
        <Text style={styles.statsText}>{stats.muscles} grupos</Text>
        <Text style={styles.statsDot}>•</Text>
        <Text style={styles.statsText}>~{stats.avgCalories} kcal/exercício</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  muscleRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.xs, marginBottom: SPACING.sm },
  muscleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  muscleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  muscleTextActive: { color: COLORS.background },
  filterRow: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  filterBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, marginRight: SPACING.xs },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  filterTextActive: { color: COLORS.background },
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg },
  statsText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  statsDot: { color: COLORS.border },
});
