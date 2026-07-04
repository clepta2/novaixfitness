// src/components/workout/WorkoutBuilder.tsx
// Construtor de treinos personalizados - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import ExercisePicker from './ExercisePicker';
import ExerciseSlot from './ExerciseSlot';

interface Exercise {
  name?: string;
  muscle?: string;
  sets?: number;
  rest?: number;
  [key: string]: unknown;
}

interface ExistingWorkout {
  name?: string;
  exercises?: Exercise[];
}

interface WorkoutBuilderProps {
  onSave?: (data: { name: string; exercises: Exercise[]; duration: number; totalSets: number; exerciseCount: number }) => void;
  existingWorkout?: ExistingWorkout;
}

const MUSCLE_COLORS: Record<string, string> = {
  'Peito': COLORS.primary,
  'Costas': COLORS.success,
  'Pernas': COLORS.info,
  'Ombros': COLORS.secondary,
  'Bíceps': COLORS.attention,
  'Tríceps': COLORS.error,
  'Abdômen': COLORS.primary,
  'Glúteos': COLORS.success,
};

export default function WorkoutBuilder({ onSave, existingWorkout }: WorkoutBuilderProps): React.ReactElement {
  const [name, setName] = useState<string>(existingWorkout?.name || '');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(existingWorkout?.exercises || []);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const totalSets = selectedExercises.reduce((s, e) => s + (e.sets || 0), 0);
  const totalRest = selectedExercises.reduce((s, e) => s + ((e.rest || 60) * (e.sets || 0)), 0);
  const estimatedTime = Math.round((totalSets * 45 + totalRest) / 60);
  const muscles = [...new Set(selectedExercises.map(e => e.muscle))];

  const addExercise = (exercise: Exercise): void => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setSelectedExercises(prev => [...prev, { ...exercise }]);
  };

  const removeExercise = (index: number): void => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, exercise: Exercise): void => {
    setSelectedExercises(prev => prev.map((e, i) => i === index ? exercise : e));
  };

  const handleSave = (): void => {
    if (!name.trim()) { Alert.alert('Aviso', 'Dê um nome ao treino.'); return; }
    if (selectedExercises.length === 0) { Alert.alert('Aviso', 'Adicione pelo menos um exercício.'); return; }
    onSave?.({ name: name.trim(), exercises: selectedExercises, duration: estimatedTime, totalSets, exerciseCount: selectedExercises.length });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CONSTRUTOR DE TREINO</Text>
      </View>

      <View style={styles.nameSection}>
        <Text style={styles.label}>NOME DO TREINO</Text>
        <TextInput style={styles.nameInput} value={name} onChangeText={setName} placeholder="Ex: Treino A - Peito e Tríceps" placeholderTextColor={COLORS.textMuted} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{selectedExercises.length}</Text>
          <Text style={styles.statLabel}>Exercícios</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Séries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>~{estimatedTime}</Text>
          <Text style={styles.statLabel}>min</Text>
        </View>
      </View>

      {muscles.length > 0 && (
        <View style={styles.musclesRow}>
          {muscles.map((m, i) => (
            <View key={i} style={[styles.muscleBadge, { backgroundColor: (MUSCLE_COLORS[m as string] || COLORS.primary) + '20' }]}>
              <Text style={[styles.muscleText, { color: MUSCLE_COLORS[m as string] || COLORS.primary }]}>{m}</Text>
            </View>
          ))}
        </View>
      )}

      <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        data={selectedExercises}
        renderItem={({ item, index }) => (
          <ExerciseSlot exercise={item as any} index={index} onRemove={removeExercise} onUpdate={updateExercise} />
        )}
        keyExtractor={(_, i) => String(i)}
        style={styles.exercisesList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => setShowPicker(true)}>
        <Ionicons name="add-circle" size={20} color={COLORS.primary} />
        <Text style={styles.addText}>ADICIONAR EXERCÍCIO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
        <Text style={styles.saveText}>SALVAR TREINO</Text>
      </TouchableOpacity>

      {showPicker && <ExercisePicker onSelect={addExercise as any} onClose={() => setShowPicker(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg } as ViewStyle,
  header: { marginBottom: SPACING.lg } as ViewStyle,
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textMuted, letterSpacing: 1 } as TextStyle,
  nameSection: { marginBottom: SPACING.lg } as ViewStyle,
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.xs } as TextStyle,
  nameInput: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 14 } as TextStyle,
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border } as ViewStyle,
  statItem: { flex: 1, alignItems: 'center' } as ViewStyle,
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.primary } as TextStyle,
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 } as TextStyle,
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border } as ViewStyle,
  musclesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md } as ViewStyle,
  muscleBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm } as ViewStyle,
  muscleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 } as TextStyle,
  exercisesList: { flex: 1, marginBottom: SPACING.md } as ViewStyle,
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary + '15', paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.primary + '30', marginBottom: SPACING.sm } as ViewStyle,
  addText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary, letterSpacing: 0.5 } as TextStyle,
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg } as ViewStyle,
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 } as TextStyle,
});
