// src/components/workout/ExercisePicker.js
// Seletor de exercícios para o construtor - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MUSCLE_COLORS = {
  'Peito': COLORS.success, 'Costas': COLORS.info, 'Pernas': COLORS.secondary,
  'Ombros': COLORS.attention, 'Braços': COLORS.primary, 'Abdômen': COLORS.success,
};

const DEFAULT_EXERCISES = [
  { name: 'Supino Reto', muscle: 'Peito', equipment: 'Halteres', sets: 4, reps: '10-12', rest: 90 },
  { name: 'Agachamento', muscle: 'Pernas', equipment: 'Barra', sets: 4, reps: '8-10', rest: 120 },
  { name: 'Puxada Frontal', muscle: 'Costas', equipment: 'Máquina', sets: 4, reps: '10-12', rest: 90 },
  { name: 'Desenvolvimento', muscle: 'Ombros', equipment: 'Halteres', sets: 3, reps: '10-12', rest: 60 },
  { name: 'Rosca Direta', muscle: 'Braços', equipment: 'Halteres', sets: 3, reps: '12-15', rest: 60 },
  { name: 'Abdominal Crunch', muscle: 'Abdômen', equipment: 'Nenhum', sets: 3, reps: '15-20', rest: 45 },
  { name: 'Leg Press', muscle: 'Pernas', equipment: 'Máquina', sets: 4, reps: '10-12', rest: 90 },
  { name: 'Remada Curvada', muscle: 'Costas', equipment: 'Barra', sets: 4, reps: '10-12', rest: 90 },
  { name: 'Elevação Lateral', muscle: 'Ombros', equipment: 'Halteres', sets: 3, reps: '12-15', rest: 60 },
  { name: 'Tríceps Pulley', muscle: 'Braços', equipment: 'Cabo', sets: 3, reps: '12-15', rest: 60 },
  { name: 'Prancha', muscle: 'Abdômen', equipment: 'Nenhum', sets: 3, reps: '30-45s', rest: 30 },
  { name: 'Flexão', muscle: 'Peito', equipment: 'Nenhum', sets: 3, reps: '10-15', rest: 60 },
];

export { DEFAULT_EXERCISES };

export default function ExercisePicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');

  const muscles = ['all', ...new Set(DEFAULT_EXERCISES.map(e => e.muscle))];

  const filtered = DEFAULT_EXERCISES.filter(e => {
    if (selectedMuscle !== 'all' && e.muscle !== selectedMuscle) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ADICIONAR EXERCÍCIO</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar exercício..."
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleRow}>
          {muscles.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.muscleBtn, selectedMuscle === m && styles.muscleActive]}
              onPress={() => setSelectedMuscle(m)}
            >
              <Text style={[styles.muscleText, selectedMuscle === m && styles.muscleTextActive]}>
                {m === 'all' ? 'Todos' : m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.list}>
          {filtered.map((ex, i) => (
            <TouchableOpacity key={i} style={styles.item} onPress={() => onSelect(ex)}>
              <View style={[styles.itemIcon, { backgroundColor: (MUSCLE_COLORS[ex.muscle] || COLORS.primary) + '15' }]}>
                <Ionicons name="barbell" size={16} color={MUSCLE_COLORS[ex.muscle] || COLORS.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{ex.name}</Text>
                <Text style={styles.itemMeta}>{ex.muscle} • {ex.equipment} • {ex.sets}x{ex.reps}</Text>
              </View>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, maxHeight: '75%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  closeBtn: { padding: SPACING.xs },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  searchInput: { flex: 1, height: 44, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  muscleRow: { marginBottom: SPACING.md },
  muscleBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, marginRight: SPACING.xs },
  muscleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  muscleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  muscleTextActive: { color: COLORS.background },
  list: { maxHeight: 350 },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  itemMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
