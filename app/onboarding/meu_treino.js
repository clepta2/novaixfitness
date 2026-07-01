import { useState } from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { MUSCLE_GROUPS, INTENSITY_OPTIONS, GOAL_OPTIONS } from '../../src/data/exerciseChoices';
import { useAuth } from '../../src/context/AuthContext';
import {
  MuscleStep,
  ExerciseStep,
  IntensityStep,
  GoalStep,
  OnboardingNavButtons,
} from '../../src/components';

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

  const canProceed = () => {
    if (step === 1) return selectedMuscles.length > 0;
    if (step === 2) return selectedExercises.length > 0;
    if (step === 3) return !!selectedIntensity;
    if (step === 4) return !!selectedGoal;
    return false;
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
      router.push('/onboarding/processando');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
        ))}
      </View>

      {step === 1 && (
        <MuscleStep
          muscles={MUSCLE_GROUPS}
          selectedMuscles={selectedMuscles}
          onToggle={toggleMuscle}
        />
      )}

      {step === 2 && (
        <ExerciseStep
          muscles={MUSCLE_GROUPS}
          selectedMuscles={selectedMuscles}
          selectedExercises={selectedExercises}
          onToggle={toggleExercise}
        />
      )}

      {step === 3 && (
        <IntensityStep
          options={INTENSITY_OPTIONS}
          selectedIntensity={selectedIntensity}
          onSelect={setSelectedIntensity}
        />
      )}

      {step === 4 && (
        <GoalStep
          options={GOAL_OPTIONS}
          selectedGoal={selectedGoal}
          onSelect={setSelectedGoal}
        />
      )}

      <OnboardingNavButtons
        step={step}
        totalSteps={4}
        canProceed={canProceed()}
        onBack={handleBack}
        onNext={handleNext}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  progressDotActive: { backgroundColor: COLORS.primary },
});
