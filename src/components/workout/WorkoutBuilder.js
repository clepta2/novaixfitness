// src/components/workout/WorkoutBuilder.js
// Construtor de treinos personalizados - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import ExercisePicker from './ExercisePicker';
import ExerciseSlot from './ExerciseSlot';

export default function WorkoutBuilder({ onSave, existingWorkout }) {
  const [name, setName] = useState(existingWorkout?.name || '');
  const [selectedExercises, setSelectedExercises] = useState(existingWorkout?.exercises || []);
  const [showPicker, setShowPicker] = useState(false);

  const totalSets = selectedExercises.reduce((s, e) => s + (e.sets || 0), 0);
  const totalRest = selectedExercises.reduce((s, e) => s + ((e.rest || 60) * (e.sets || 0)), 0);
  const estimatedTime = Math.round((totalSets * 45 + totalRest) / 60);
  const muscles = [...new Set(selectedExercises.map(e => e.muscle))];

  const addExercise = (exercise) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setSelectedExercises(prev => [...prev, { ...exercise }]);
  };

  const removeExercise = (index) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index, exercise) => {
    setSelectedExercises(prev => prev.map((e, i) => i === index ? exercise : e));
  };

  const handleSave = () => {
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
            <View key={i} style={[styles.muscleBadge, { backgroundColor: (MUSCLE_COLORS[m] || COLORS.primary) + '20' }]}>
              <Text style={[styles.muscleText, { color: MUSCLE_COLORS[m] || COLORS.primary }]}>{m}</Text>
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
          <ExerciseSlot exercise={item} index={index} onRemove={removeExercise} onUpdate={updateExercise} />
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

      {showPicker && <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  header: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textMuted, letterSpacing: 1 },
  nameSection: { marginBottom: SPACING.lg },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.xs },
  nameInput: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  musclesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  muscleBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm },
  muscleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  exercisesList: { flex: 1, marginBottom: SPACING.md },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary + '15', paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.primary + '30', marginBottom: SPACING.sm },
  addText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary, letterSpacing: 0.5 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
