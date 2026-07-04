// src/hooks/useCreateWorkout.ts
// Hook para criação de treino - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { COLORS } from '../constants/colors';

export const STEPS: string[] = ['Info', 'Exercícios', 'Preview'];

interface LevelOption {
  id: string;
  label: string;
  icon: string;
}

export const LEVELS: LevelOption[] = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf' },
  { id: 'intermediate', label: 'Intermediário', icon: 'flame' },
  { id: 'advanced', label: 'Avançado', icon: 'flash' },
];

export const LEVEL_COLORS: Record<string, string> = {
  beginner: COLORS.success,
  intermediate: COLORS.attention,
  advanced: COLORS.error,
};

const SECONDS_PER_SET = 45;
const DEFAULT_REST_SECONDS = 15;

interface WorkoutForm {
  name: string;
  category: string;
  level: string;
  duration: string;
}

interface ExerciseItem {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  weight: string;
  notes: string;
  [key: string]: unknown;
}

interface FormErrors {
  name?: string;
  category?: string;
}

export function useCreateWorkout() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<WorkoutForm>({ name: '', category: '', level: 'intermediate', duration: '45' });
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [configIndex, setConfigIndex] = useState(-1);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateForm = (key: keyof WorkoutForm, value: string) => setForm(f => ({ ...f, [key]: value }));

  const addExercise = useCallback((ex: { name: string; [key: string]: unknown }) => {
    setExercises(prev => {
      if (prev.find(e => e.name === ex.name)) return prev;
      return [...prev, { ...ex, sets: 4, reps: '10-12', rest: DEFAULT_REST_SECONDS, weight: '', notes: '' }];
    });
  }, []);

  const removeExercise = useCallback((i: number) => {
    setExercises(prev => prev.filter((_, idx) => idx !== i));
    setConfigIndex(prev => {
      if (prev === i) return -1;
      if (prev > i) return prev - 1;
      return prev;
    });
  }, []);

  const updateConfig = useCallback((indexOrCfg: number | Partial<ExerciseItem>, cfg?: Partial<ExerciseItem>) => {
    const idx = typeof indexOrCfg === 'number' ? indexOrCfg : configIndex;
    const config = typeof indexOrCfg === 'number' ? cfg : indexOrCfg;
    setExercises(prev => prev.map((e, i) => i === idx ? { ...e, ...config } : e));
  }, [configIndex]);

  const validateStep = (): boolean => {
    const errs: FormErrors = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Nome obrigatório';
      if (!form.category) errs.category = 'Selecione uma categoria';
    }
    if (step === 1 && exercises.length === 0) { Alert.alert('Aviso', 'Adicione pelo menos um exercício'); return false; }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSave = async () => {
    if (!validateStep() || saving || !user?.id) return;
    setSaving(true);
    try {
      const totalSets = exercises.reduce((s, e) => s + (e.sets || 4), 0);
      const estimated = parseInt(form.duration) || Math.round((totalSets * SECONDS_PER_SET + exercises.reduce((s, e) => s + (e.rest || DEFAULT_REST_SECONDS) * (e.sets || 4), 0)) / 60);
      const { error } = await supabase.from('user_workouts').insert({
        user_id: user.id, name: form.name.trim(), category: form.category,
        level: form.level, duration: estimated, exercises: exercises.map((e, i) => ({ ...e, order: i })),
        is_custom: true, completed: false,
      });
      if (error) throw error;
      Alert.alert('Sucesso', 'Treino criado com sucesso!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err) { if (__DEV__) console.error('Erro ao salvar:', err); Alert.alert('Erro', 'Não foi possível salvar o treino'); }
    finally { setSaving(false); }
  };

  const handleBack = () => {
    const hasData = form.name || form.category || exercises.length > 0;
    if (hasData) {
      Alert.alert('Sair sem salvar?', 'Você tem dados não salvos. Deseja sair?', [
        { text: 'Ficar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => router.back() },
      ]);
    } else { router.back(); }
  };

  return {
    step, setStep, saving, form, exercises, configIndex, setConfigIndex,
    errors, updateForm, addExercise, removeExercise, updateConfig,
    validateStep, nextStep, prevStep, handleSave, handleBack,
  };
}
