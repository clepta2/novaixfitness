// src/components/workout/WorkoutForm.js
// Formulário completo de treino - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import ExerciseForm from './ExerciseForm';

const CATEGORIES = ['Musculação', 'HIIT', 'Cardio', 'Yoga', 'Calistenia', 'Natação', 'Outro'];
const LEVELS = ['Iniciante', 'Intermediário', 'Avançado'];

function ChipSelector({ options, selected, onSelect }) {
  return (
    <View style={styles.chipRow}>
      {options.map(opt => (
        <TouchableOpacity key={opt} style={[styles.chip, selected === opt && styles.chipActive]} onPress={() => onSelect(opt)}>
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function WorkoutForm({ onSave, existingWorkout }) {
  const [name, setName] = useState(existingWorkout?.name || '');
  const [description, setDescription] = useState(existingWorkout?.description || '');
  const [category, setCategory] = useState(existingWorkout?.category || '');
  const [level, setLevel] = useState(existingWorkout?.level || 'Intermediário');
  const [duration, setDuration] = useState(String(existingWorkout?.duration || 45));
  const [isPremium, setIsPremium] = useState(existingWorkout?.is_premium || false);
  const [exercises, setExercises] = useState(existingWorkout?.exercises || []);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const totalSets = exercises.reduce((s, e) => s + (e.sets || 0), 0);

  const addExercise = (exercise) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setExercises(prev => editingExercise !== null ? prev.map((e, i) => i === editingExercise ? exercise : e) : [...prev, exercise]);
    setEditingExercise(null);
    setShowExerciseForm(false);
  };

  const removeExercise = (i) => {
    Alert.alert('Remover', 'Remover este exercício?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setExercises(prev => prev.filter((_, idx) => idx !== i)) },
    ]);
  };

  const moveExercise = (from, to) => {
    if (to < 0 || to >= exercises.length) return;
    setExercises(prev => { const a = [...prev]; const [item] = a.splice(from, 1); a.splice(to, 0, item); return a; });
  };

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Aviso', 'Nome é obrigatório.'); return; }
    if (!category) { Alert.alert('Aviso', 'Selecione uma categoria.'); return; }
    if (exercises.length === 0) { Alert.alert('Aviso', 'Adicione pelo menos um exercício.'); return; }
    onSave?.({ name: name.trim(), description: description.trim(), category, level, duration: parseInt(duration) || 45, isPremium, exercises, totalSets, exerciseCount: exercises.length });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMAÇÕES BÁSICAS</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>NOME *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Treino A - Peito" placeholderTextColor={COLORS.textMuted} />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descreva o treino..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={3} />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CATEGORIA *</Text>
          <ChipSelector options={CATEGORIES} selected={category} onSelect={setCategory} />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>NÍVEL</Text>
          <ChipSelector options={LEVELS} selected={level} onSelect={setLevel} />
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>DURAÇÃO (MIN)</Text>
            <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="45" placeholderTextColor={COLORS.textMuted} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>PREMIUM</Text>
            <TouchableOpacity style={[styles.toggleBtn, isPremium && styles.toggleActive]} onPress={() => setIsPremium(!isPremium)}>
              <Ionicons name={isPremium ? 'lock' : 'lock-open'} size={16} color={isPremium ? COLORS.background : COLORS.textMuted} />
              <Text style={[styles.toggleText, isPremium && styles.toggleTextActive]}>{isPremium ? 'Sim' : 'Não'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>EXERCÍCIOS ({exercises.length})</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setEditingExercise(null); setShowExerciseForm(true); }}>
            <Ionicons name="add-circle" size={16} color={COLORS.primary} />
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {exercises.length === 0 && (
          <View style={styles.emptyExercises}>
            <Ionicons name="barbell-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nenhum exercício adicionado</Text>
          </View>
        )}

        {exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseItem}>
            <View style={styles.exerciseNumber}>
              <Text style={styles.exerciseNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMeta}>{ex.muscle} • {ex.sets}x{ex.reps} • {ex.rest}s</Text>
            </View>
            <View style={styles.exerciseActions}>
              {i > 0 && <TouchableOpacity onPress={() => moveExercise(i, i - 1)}><Ionicons name="arrow-up" size={14} color={COLORS.textMuted} /></TouchableOpacity>}
              {i < exercises.length - 1 && <TouchableOpacity onPress={() => moveExercise(i, i + 1)}><Ionicons name="arrow-down" size={14} color={COLORS.textMuted} /></TouchableOpacity>}
              <TouchableOpacity onPress={() => { setEditingExercise(i); setShowExerciseForm(true); }}><Ionicons name="create-outline" size={14} color={COLORS.primary} /></TouchableOpacity>
              <TouchableOpacity onPress={() => removeExercise(i)}><Ionicons name="trash-outline" size={14} color={COLORS.error} /></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {showExerciseForm && (
        <View style={styles.exerciseFormWrapper}>
          <ExerciseForm
            exercise={editingExercise !== null ? exercises[editingExercise] : null}
            onSave={addExercise}
            onCancel={() => { setEditingExercise(null); setShowExerciseForm(false); }}
          />
        </View>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="save" size={20} color={COLORS.background} />
        <Text style={styles.saveText}>SALVAR TREINO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, marginHorizontal: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  field: { marginBottom: SPACING.md },
  fieldLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.xs },
  input: { height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.md },
  halfField: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.background },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  toggleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.background },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  emptyExercises: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.sm },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  exerciseNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  exerciseNumberText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  exerciseMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  exerciseActions: { flexDirection: 'row', gap: SPACING.sm },
  exerciseFormWrapper: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.success, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
