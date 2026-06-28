// app/workout/create.js
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { ALL_CATEGORIES } from '../../src/data/categories';
import { Input, Button, ErrorBoundary, ExerciseSearch, ExerciseConfigurator, WorkoutPreview } from '../../src/components';
import StepIndicator from '../../src/components/workout/StepIndicator';

const STEPS = ['Info', 'Exercícios', 'Configurar', 'Preview'];
const LEVELS = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf' },
  { id: 'intermediate', label: 'Intermediário', icon: 'flame' },
  { id: 'advanced', label: 'Avançado', icon: 'flash' },
];
const LEVEL_COLORS = { beginner: COLORS.success, intermediate: COLORS.attention, advanced: COLORS.error };
const SECONDS_PER_SET = 45;
const DEFAULT_REST_SECONDS = 15;

export default function CreateWorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', level: 'intermediate', duration: '45' });
  const [exercises, setExercises] = useState([]);
  const [configIndex, setConfigIndex] = useState(-1);
  const [errors, setErrors] = useState({});

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const addExercise = useCallback((ex) => {
    if (exercises.find(e => e.name === ex.name)) return;
    setExercises(prev => [...prev, { ...ex, sets: 4, reps: '10-12', rest: DEFAULT_REST_SECONDS, weight: '', notes: '' }]);
  }, [exercises]);
  const removeExercise = useCallback((i) => {
    setExercises(prev => prev.filter((_, idx) => idx !== i));
    if (configIndex === i) setConfigIndex(-1);
    else if (configIndex > i) setConfigIndex(configIndex - 1);
  }, [configIndex]);
  const updateConfig = useCallback((cfg) => {
    setExercises(prev => prev.map((e, i) => i === configIndex ? { ...e, ...cfg } : e));
  }, [configIndex]);

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Nome obrigatório';
      if (!form.category) errs.category = 'Selecione uma categoria';
    }
    if (step === 1 && exercises.length === 0) { Alert.alert('Aviso', 'Adicione pelo menos um exercício'); return false; }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSave = async () => {
    if (!validateStep() || saving) return;
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
    } catch (err) { console.error('Erro ao salvar:', err); Alert.alert('Erro', 'Não foi possível salvar o treino'); }
    finally { setSaving(false); }
  };

  const handleBack = () => {
    const hasData = form.name || form.category || exercises.length > 0;
    if (hasData) {
      Alert.alert('Sair sem salvar?', 'Você tem dados não salvos. Deseja sair?', [
        { text: 'Ficar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <ErrorBoundary screenName="CreateWorkout">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CRIAR TREINO</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn} accessibilityLabel="Salvar treino">
            {saving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="checkmark" size={22} color={COLORS.primary} />}
          </TouchableOpacity>
        </View>
        <StepIndicator steps={STEPS} currentStep={step} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <View>
              <Input label="Nome do Treino" value={form.name} onChangeText={v => updateForm('name', v)} placeholder="Ex: Treino A - Peito" icon="create-outline" error={errors.name} />
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              <Text style={styles.label}>CATEGORIA</Text>
              <View style={styles.grid}>
                {ALL_CATEGORIES.map(c => (
                  <TouchableOpacity key={c.id} style={[styles.catCard, form.category === c.id && styles.catCardActive]} onPress={() => updateForm('category', c.id)}>
                    <Ionicons name={c.icon} size={20} color={form.category === c.id ? COLORS.background : c.color} />
                    <Text style={[styles.catLabel, form.category === c.id && { color: COLORS.background }]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>NÍVEL</Text>
              <View style={styles.levelRow}>
                {LEVELS.map(l => (
                  <TouchableOpacity key={l.id} style={[styles.levelCard, form.level === l.id && styles.levelCardActive, form.level === l.id && { borderColor: LEVEL_COLORS[l.id] }]} onPress={() => updateForm('level', l.id)}>
                    <Ionicons name={l.icon} size={18} color={form.level === l.id ? LEVEL_COLORS[l.id] : COLORS.textMuted} />
                    <Text style={[styles.levelLabel, form.level === l.id && { color: LEVEL_COLORS[l.id] }]}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Input label="Duração Estimada (min)" value={form.duration} onChangeText={v => updateForm('duration', v)} placeholder="45" icon="time-outline" keyboardType="numeric" />
            </View>
          )}
          {step === 1 && <ExerciseSearch onSelect={addExercise} selectedIds={exercises.map(e => e.name)} />}
          {step === 2 && (
            <View>
              {exercises.map((ex, i) => (
                <TouchableOpacity key={i} style={[styles.exRow, configIndex === i && styles.exRowActive]} onPress={() => setConfigIndex(configIndex === i ? -1 : i)}>
                  <View style={styles.exRowLeft}>
                    <View style={styles.exNum}><Text style={styles.exNumText}>{i + 1}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <Text style={styles.exMeta}>{ex.sets}x{ex.reps} • {ex.rest}s</Text>
                    </View>
                    <Ionicons name={configIndex === i ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
                  </View>
                  {configIndex === i && <ExerciseConfigurator exercise={ex} config={ex} onChange={updateConfig} onRemove={() => removeExercise(i)} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {step === 3 && <WorkoutPreview name={form.name} category={ALL_CATEGORIES.find(c => c.id === form.category)?.label} level={LEVELS.find(l => l.id === form.level)?.label} exercises={exercises} duration={form.duration} />}
        </ScrollView>
        <View style={styles.footer}>
          {step > 0 && <Button title="VOLTAR" variant="secondary" onPress={prevStep} style={{ flex: 1 }} />}
          {step < 3 ? (
            <Button title={step === 1 ? 'CONFIGURAR' : 'PRÓXIMO'} onPress={nextStep} style={{ flex: 1 }} icon="arrow-forward" iconPosition="right" />
          ) : (
            <Button title="SALVAR TREINO" onPress={handleSave} loading={saving} style={{ flex: 1 }} icon="checkmark-circle" />
          )}
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 1 },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  stepsRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepDotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  stepDotText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted },
  stepDotTextActive: { color: COLORS.background },
  stepLabel: { textAlign: 'center', fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  catCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border },
  catCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  levelRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  levelCard: { flex: 1, alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border },
  levelCardActive: { backgroundColor: COLORS.surfaceElevated },
  levelLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.error, marginBottom: SPACING.sm },
  exRow: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm, padding: SPACING.md },
  exRowActive: { borderColor: COLORS.primary },
  exRowLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  exNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  exNumText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  exName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  exMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  footer: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxxl, paddingTop: SPACING.md },
});
