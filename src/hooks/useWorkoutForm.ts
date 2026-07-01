// src/hooks/useWorkoutForm.ts
// Hook para gerenciar formulário de treino - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

const CATEGORIES = ['Musculação', 'HIIT', 'Cardio', 'Yoga', 'Calistenia', 'Natação', 'Outro'];
const LEVELS = ['Iniciante', 'Intermediário', 'Avançado'];

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
  [key: string]: unknown;
}

interface ExistingWorkout {
  name?: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: number;
  is_premium?: boolean;
  exercises?: Exercise[];
}

export function useWorkoutForm(existingWorkout: ExistingWorkout | null = null) {
  const [name, setName] = useState(existingWorkout?.name || '');
  const [description, setDescription] = useState(existingWorkout?.description || '');
  const [category, setCategory] = useState(existingWorkout?.category || '');
  const [level, setLevel] = useState(existingWorkout?.level || 'Intermediário');
  const [duration, setDuration] = useState(String(existingWorkout?.duration || 45));
  const [isPremium, setIsPremium] = useState(existingWorkout?.is_premium || false);
  const [exercises, setExercises] = useState<Exercise[]>(existingWorkout?.exercises || []);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<number | null>(null);

  const totalSets = exercises.reduce((s, e) => s + (e.sets || 0), 0);

  const addExercise = useCallback((exercise: Exercise) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setExercises(prev => editingExercise !== null
      ? prev.map((e, i) => i === editingExercise ? exercise : e)
      : [...prev, exercise]
    );
    setEditingExercise(null);
    setShowExerciseForm(false);
  }, [editingExercise]);

  const removeExercise = useCallback((i: number) => {
    Alert.alert('Remover', 'Remover este exercício?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setExercises(prev => prev.filter((_, idx) => idx !== i)) },
    ]);
  }, []);

  const moveExercise = useCallback((from: number, to: number) => {
    if (to < 0 || to >= exercises.length) return;
    setExercises(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }, [exercises.length]);

  const openExerciseForm = useCallback((index: number | null = null) => {
    setEditingExercise(index);
    setShowExerciseForm(true);
  }, []);

  const closeExerciseForm = useCallback(() => {
    setEditingExercise(null);
    setShowExerciseForm(false);
  }, []);

  const validate = useCallback(() => {
    if (!name.trim()) { Alert.alert('Aviso', 'Nome é obrigatório.'); return false; }
    if (!category) { Alert.alert('Aviso', 'Selecione uma categoria.'); return false; }
    if (exercises.length === 0) { Alert.alert('Aviso', 'Adicione pelo menos um exercício.'); return false; }
    return true;
  }, [name, category, exercises.length]);

  const getFormData = useCallback(() => ({
    name: name.trim(),
    description: description.trim(),
    category,
    level,
    duration: parseInt(duration) || 45,
    isPremium,
    exercises,
    totalSets,
    exerciseCount: exercises.length,
  }), [name, description, category, level, duration, isPremium, exercises, totalSets]);

  return {
    name, setName,
    description, setDescription,
    category, setCategory,
    level, setLevel,
    duration, setDuration,
    isPremium, setIsPremium,
    exercises,
    showExerciseForm,
    editingExercise,
    totalSets,
    addExercise,
    removeExercise,
    moveExercise,
    openExerciseForm,
    closeExerciseForm,
    validate,
    getFormData,
    CATEGORIES,
    LEVELS,
  };
}
