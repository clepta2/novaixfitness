// app/onboarding/meu_treino.js
// O USUÁRIO escolhe o que quer ter no treino DELE

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { MUSCLE_GROUPS, INTENSITY_OPTIONS, GOAL_OPTIONS } from '../../src/data/exerciseChoices';
import { useAuth } from '../../src/context/AuthContext';

export default function MeuTreinoScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const toggleMuscle = (muscleId) => {
    setSelectedMuscles(prev =>
      prev.includes(muscleId)
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
  };

  const toggleExercise = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleNext = async () => {
    if (step === 1 && selectedMuscles.length > 0) {
      setStep(2);
    } else if (step === 2 && selectedExercises.length > 0) {
      setStep(3);
    } else if (step === 3 && selectedIntensity) {
      setStep(4);
    } else if (step === 4 && selectedGoal) {
      const workoutData = {
        selectedMuscles,
        selectedExercises,
        intensity: selectedIntensity,
        goal: selectedGoal,
      };
      await saveOnboarding({ ...onboarding, ...workoutData });
      router.push('/onboarding/resumo');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const getExercisesForMuscles = () => {
    return MUSCLE_GROUPS
      .filter(m => selectedMuscles.includes(m.id))
      .flatMap(m => m.exercises);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      {/* Progresso */}
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
        ))}
      </View>

      {/* Passo 1: Quais grupos musculares? */}
      {step === 1 && (
        <>
          <Text style={styles.title}>QUE MÚSCULOS VOCÊ QUER TREINAR?</Text>
          <Text style={styles.subtitle}>Selecione todos que quiser</Text>
          <View style={styles.muscleGrid}>
            {MUSCLE_GROUPS.map((muscle) => (
              <TouchableOpacity
                key={muscle.id}
                style={[
                  styles.muscleCard,
                  selectedMuscles.includes(muscle.id) && styles.muscleCardActive
                ]}
                onPress={() => toggleMuscle(muscle.id)}
              >
                <Ionicons name={muscle.icon} size={24} color={selectedMuscles.includes(muscle.id) ? COLORS.primary : COLORS.textMuted} />
                <Text style={[
                  styles.muscleLabel,
                  selectedMuscles.includes(muscle.id) && styles.muscleLabelActive
                ]}>
                  {muscle.label}
                </Text>
                {selectedMuscles.includes(muscle.id) && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Selecionou {selectedMuscles.length} grupo(s)</Text>
        </>
      )}

      {/* Passo 2: Quais exercícios? */}
      {step === 2 && (
        <>
          <Text style={styles.title}>QUE EXERCÍCIOS VOCÊ QUER?</Text>
          <Text style={styles.subtitle}>Escolha os exercícios dos grupos selecionados</Text>
          
          {MUSCLE_GROUPS.filter(m => selectedMuscles.includes(m.id)).map((muscle) => (
            <View key={muscle.id} style={styles.muscleSection}>
              <Text style={styles.muscleSectionTitle}>{muscle.label}</Text>
              {muscle.exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    styles.exerciseCard,
                    selectedExercises.includes(exercise.id) && styles.exerciseCardActive
                  ]}
                  onPress={() => toggleExercise(exercise.id)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={[
                      styles.exerciseName,
                      selectedExercises.includes(exercise.id) && styles.exerciseNameActive
                    ]}>
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseMeta}>{exercise.equipment} · {exercise.level}</Text>
                  </View>
                  {selectedExercises.includes(exercise.id) && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <Text style={styles.hint}>Selecionou {selectedExercises.length} exercício(s)</Text>
        </>
      )}

      {/* Passo 3: Intensidade */}
      {step === 3 && (
        <>
          <Text style={styles.title}>QUE INTENSIDADE VOCÊ QUER?</Text>
          <Text style={styles.subtitle}>Isso define série, repetição e descanso</Text>
          <View style={styles.intensityGrid}>
            {INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.intensityCard,
                  selectedIntensity === option.id && styles.intensityCardActive
                ]}
                onPress={() => setSelectedIntensity(option.id)}
              >
                <Ionicons name={option.icon} size={32} color={selectedIntensity === option.id ? COLORS.primary : COLORS.textMuted} />
                <Text style={[
                  styles.intensityLabel,
                  selectedIntensity === option.id && styles.intensityLabelActive
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.intensityDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* O que cada intensidade faz */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>COMO FUNCIONA:</Text>
            <Text style={styles.infoText}>• Leve: 3 séries, 12-15 reps, 60s descanso</Text>
            <Text style={styles.infoText}>• Moderado: 4 séries, 10-12 reps, 90s descanso</Text>
            <Text style={styles.infoText}>• Intenso: 4-5 séries, 8-10 reps, 45-60s descanso</Text>
          </View>
        </>
      )}

      {/* Passo 4: Objetivo */}
      {step === 4 && (
        <>
          <Text style={styles.title}>QUAL SEU OBJETIVO?</Text>
          <Text style={styles.subtitle}>Isso ajusta o plano alimentar e dicas</Text>
          <View style={styles.goalGrid}>
            {GOAL_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.goalCard,
                  selectedGoal === option.id && styles.goalCardActive
                ]}
                onPress={() => setSelectedGoal(option.id)}
              >
                <Ionicons name={option.icon} size={24} color={selectedGoal === option.id ? COLORS.primary : COLORS.textMuted} />
                <Text style={[
                  styles.goalLabel,
                  selectedGoal === option.id && styles.goalLabelActive
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.goalDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Botões */}
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textMuted} />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {step === 4 ? 'FINALIZAR' : 'PRÓXIMO'}
          </Text>
          {step < 4 && <Ionicons name="arrow-forward" size={20} color={COLORS.background} />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  function canProceed() {
    if (step === 1) return selectedMuscles.length > 0;
    if (step === 2) return selectedExercises.length > 0;
    if (step === 3) return !!selectedIntensity;
    if (step === 4) return !!selectedGoal;
    return false;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  progressDotActive: { backgroundColor: COLORS.primary },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, marginTop: SPACING.lg, textAlign: 'center' },
  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  muscleCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  muscleCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  muscleLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  muscleLabelActive: { color: COLORS.primary },
  muscleSection: { marginBottom: SPACING.xl },
  muscleSectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.primary, marginBottom: SPACING.md },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  exerciseCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  exerciseNameActive: { color: COLORS.primary },
  exerciseMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  intensityGrid: { gap: SPACING.md },
  intensityCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  intensityCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  intensityLabel: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  intensityLabelActive: { color: COLORS.primary },
  intensityDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  infoBox: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  infoTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginBottom: SPACING.xs },
  goalGrid: { gap: SPACING.md },
  goalCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  goalCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  goalLabel: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  goalLabelActive: { color: COLORS.primary },
  goalDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  buttonRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface },
  backButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  nextButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
