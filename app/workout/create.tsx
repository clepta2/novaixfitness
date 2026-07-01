
// app/workout/create.tsx
// Criacao de treino com novos componentes - NOVAIX FITNESS

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { ALL_CATEGORIES } from '../../src/data/categories';
import { 
  Input, ErrorBoundary, ExerciseSearch, ExerciseConfigurator, 
  WorkoutPreview, GradientButton, Stepper
} from '../../src/components';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useCreateWorkout, STEPS, LEVELS, LEVEL_COLORS } from '../../src/hooks/useCreateWorkout';

export default function CreateWorkoutScreen() {
  const { isSmall } = useResponsive();
  const {
    step, saving, form, exercises,
    errors, updateForm, addExercise, removeExercise, updateConfig,
    nextStep, prevStep, handleSave, handleBack,
  } = useCreateWorkout();

  return (
    <ErrorBoundary screenName="CreateWorkout">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CRIAR TREINO</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
            {saving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="checkmark" size={22} color={COLORS.primary} />}
          </TouchableOpacity>
        </View>

        {/* Stepper */}
        <Stepper 
          steps={STEPS.map(s => ({ label: s.label, icon: s.icon }))} 
          currentStep={step} 
          size={isSmall ? 'sm' : 'md'}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 0: Informacoes basicas */}
          {step === 0 && (
            <View>
              <Input 
                label="Nome do Treino" 
                value={form.name} 
                onChangeText={(v: string) => updateForm('name', v)} 
                placeholder="Ex: Treino A - Peito" 
                icon="create-outline" 
                error={errors.name} 
                success={form.name && !errors.name ? 'Nome valido' : undefined}
              />
              
              {errors.category && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                  <Text style={styles.errorText}>{errors.category}</Text>
                </View>
              )}

              <Text style={styles.sectionLabel}>CATEGORIA</Text>
              <View style={styles.grid}>
                {ALL_CATEGORIES.map(c => (
                  <TouchableOpacity 
                    key={c.id} 
                    style={[styles.catCard, form.category === c.id && styles.catCardActive]} 
                    onPress={() => updateForm('category', c.id)}
                  >
                    <View style={[styles.catIconWrap, { backgroundColor: (form.category === c.id ? COLORS.background : c.color) + '20' }]}>
                      <Ionicons name={c.icon} size={20} color={form.category === c.id ? COLORS.background : c.color} />
                    </View>
                    <Text style={[styles.catLabel, form.category === c.id && { color: COLORS.background }]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionLabel}>NIVEL</Text>
              <View style={styles.levelRow}>
                {LEVELS.map(l => (
                  <TouchableOpacity 
                    key={l.id} 
                    style={[styles.levelCard, form.level === l.id && { borderColor: LEVEL_COLORS[l.id], backgroundColor: LEVEL_COLORS[l.id] + '10' }]} 
                    onPress={() => updateForm('level', l.id)}
                  >
                    <Ionicons name={l.icon} size={18} color={form.level === l.id ? LEVEL_COLORS[l.id] : COLORS.textMuted} />
                    <Text style={[styles.levelLabel, form.level === l.id && { color: LEVEL_COLORS[l.id] }]}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionLabel}>DURACAO (minutos)</Text>
              <View style={styles.durationRow}>
                {[30, 45, 60, 90].map(d => (
                  <TouchableOpacity 
                    key={d} 
                    style={[styles.durationCard, form.duration === d && styles.durationCardActive]} 
                    onPress={() => updateForm('duration', d)}
                  >
                    <Text style={[styles.durationText, form.duration === d && styles.durationTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 1: Exercicios */}
          {step === 1 && (
            <View>
              <ExerciseSearch onSelect={addExercise} />
              <View style={styles.exerciseList}>
                {exercises.map((ex, i) => (
                  <ExerciseConfigurator 
                    key={i} 
                    exercise={ex} 
                    index={i}
                    config={ex.config || {}} 
                    onUpdate={(config) => updateConfig(i, config)} 
                    onRemove={() => removeExercise(i)} 
                  />
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <View>
              <WorkoutPreview 
                name={form.name} 
                category={ALL_CATEGORIES.find(c => c.id === form.category)?.label} 
                level={LEVELS.find(l => l.id === form.level)?.label} 
                exercises={exercises} 
                duration={form.duration} 
              />
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
              <Ionicons name="arrow-back" size={18} color={COLORS.textTitle} />
              <Text style={styles.prevBtnText}>Voltar</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <GradientButton title="PROXIMO" icon="arrow-forward" iconPosition="right" onPress={nextStep} size={isSmall ? 'sm' : 'md'} />
          ) : (
            <GradientButton title="SALVAR TREINO" icon="checkmark" onPress={handleSave} loading={saving} size={isSmall ? 'sm' : 'md'} />
          )}
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: SPACING.xl, marginBottom: SPACING.sm },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.error },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  catCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  catCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catIconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  catLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  levelRow: { flexDirection: 'row', gap: SPACING.sm },
  levelCard: { flex: 1, alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  levelLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted },
  durationRow: { flexDirection: 'row', gap: SPACING.sm },
  durationCard: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  durationCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  durationText: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  durationTextActive: { color: COLORS.background },
  exerciseList: { gap: SPACING.sm, marginTop: SPACING.md },
  footer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: COLORS.border },
  prevBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
  prevBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
});
