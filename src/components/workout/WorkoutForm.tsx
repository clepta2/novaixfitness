// src/components/workout/WorkoutForm.tsx
// Formulário completo de treino - NOVAIX FITNESS

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useWorkoutForm } from '../../hooks/useWorkoutForm';
import ExerciseForm from './ExerciseForm';
import BasicInfoSection from './BasicInfoSection';

interface Exercise {
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  rest: number;
  [key: string]: any;
}

interface ExerciseListItemProps {
  exercise: Exercise;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

function ExerciseListItem({ exercise, index, total, onMoveUp, onMoveDown, onEdit, onRemove }: ExerciseListItemProps): React.ReactElement {
  return (
    <View style={[styles.section, styles.exerciseItem]}>
      <View style={styles.exerciseNumber}>
        <Text style={styles.exerciseNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseMeta}>{exercise.muscle} • {exercise.sets}x{exercise.reps} • {exercise.rest}s</Text>
      </View>
      <View style={styles.exerciseActions}>
        {index > 0 && <TouchableOpacity onPress={onMoveUp}><Ionicons name="arrow-up" size={14} color={COLORS.textMuted} /></TouchableOpacity>}
        {index < total - 1 && <TouchableOpacity onPress={onMoveDown}><Ionicons name="arrow-down" size={14} color={COLORS.textMuted} /></TouchableOpacity>}
        <TouchableOpacity onPress={onEdit}><Ionicons name="create-outline" size={14} color={COLORS.primary} /></TouchableOpacity>
        <TouchableOpacity onPress={onRemove}><Ionicons name="trash-outline" size={14} color={COLORS.error} /></TouchableOpacity>
      </View>
    </View>
  );
}

interface WorkoutFormProps {
  onSave?: (data: any) => void;
  existingWorkout?: any;
}

interface FlatDataItem {
  type: string;
  id: string;
  exercise?: Exercise;
  index?: number;
}

export default function WorkoutForm({ onSave, existingWorkout }: WorkoutFormProps): React.ReactElement {
  const form = useWorkoutForm(existingWorkout);

  const flatData: FlatDataItem[] = [
    { type: 'basicInfo', id: 'basicInfo' },
    { type: 'exerciseHeader', id: 'exerciseHeader' },
    ...form.exercises.map((ex: Exercise, i: number) => ({ type: 'exercise', exercise: ex, index: i, id: `ex-${i}` })),
    ...(form.showExerciseForm ? [{ type: 'exerciseForm', id: 'exerciseForm' }] : []),
    { type: 'saveBtn', id: 'saveBtn' },
  ];

  const renderItem = ({ item }: { item: FlatDataItem }): React.ReactElement | null => {
    switch (item.type) {
      case 'basicInfo':
        return <BasicInfoSection {...form} />;
      case 'exerciseHeader':
        return (
          <View style={[styles.section, styles.sectionHeader]}>
            <Text style={styles.sectionTitle}>EXERCÍCIOS ({form.exercises.length})</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => form.openExerciseForm()}>
              <Ionicons name="add-circle" size={16} color={COLORS.primary} />
              <Text style={styles.addBtnText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        );
      case 'exercise':
        return (
          <ExerciseListItem
            exercise={item.exercise!}
            index={item.index!}
            total={form.exercises.length}
            onMoveUp={() => form.moveExercise(item.index!, item.index! - 1)}
            onMoveDown={() => form.moveExercise(item.index!, item.index! + 1)}
            onEdit={() => form.openExerciseForm(item.index!)}
            onRemove={() => form.removeExercise(item.index!)}
          />
        );
      case 'exerciseForm':
        return (
          <View style={styles.exerciseFormWrapper}>
            <ExerciseForm
              exercise={form.editingExercise !== null ? form.exercises[form.editingExercise] : null}
              onSave={form.addExercise}
              onCancel={form.closeExerciseForm}
            />
          </View>
        );
      case 'saveBtn':
        return (
          <TouchableOpacity style={styles.saveBtn} onPress={() => { if (form.validate()) onSave?.(form.getFormData()); }}>
            <Ionicons name="save" size={20} color={COLORS.background} />
            <Text style={styles.saveText}>SALVAR TREINO</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
      data={flatData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingBottom: SPACING.xl },
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
