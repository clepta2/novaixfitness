import { useState } from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { PLAN_TYPES, ACTIVE_REST_ACTIVITIES } from '../../src/data/workoutPlanOptions';
import { useAuth } from '../../src/context/AuthContext';
import {
  PlanTypeStep,
  SubtypeStep,
  DaysStep,
  RestStep,
  OnboardingNavButtons,
} from '../../src/components';

export default function PlanoScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedRestActivities, setSelectedRestActivities] = useState([]);

  const currentPlan = PLAN_TYPES.find(p => p.id === selectedPlan);

  const canProceed = () => {
    if (step === 1) return !!selectedPlan;
    if (step === 2) return !!selectedSubtype;
    if (step === 3) return !!selectedDays;
    if (step === 4) return true;
    return false;
  };

  const handleNext = async () => {
    if (step === 1 && selectedPlan) {
      setStep(2);
    } else if (step === 2 && selectedSubtype) {
      setStep(3);
    } else if (step === 3 && selectedDays) {
      setStep(4);
    } else if (step === 4) {
      const planData = {
        workoutType: selectedPlan,
        workoutSubtype: selectedSubtype,
        daysPerWeek: selectedDays,
        restActivities: selectedRestActivities,
      };
      await saveOnboarding({ ...onboarding, ...planData });
      router.push('/onboarding/resumo');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleRestActivity = (activityId) => {
    setSelectedRestActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
        ))}
      </View>

      {step === 1 && (
        <PlanTypeStep
          plans={PLAN_TYPES}
          selectedPlan={selectedPlan}
          onSelect={setSelectedPlan}
        />
      )}

      {step === 2 && currentPlan && (
        <SubtypeStep
          plan={currentPlan}
          selectedSubtype={selectedSubtype}
          onSelect={setSelectedSubtype}
        />
      )}

      {step === 3 && (
        <DaysStep
          daysPerWeek={currentPlan?.daysPerWeek || []}
          selectedDays={selectedDays}
          onSelect={setSelectedDays}
        />
      )}

      {step === 4 && (
        <RestStep
          activities={ACTIVE_REST_ACTIVITIES}
          selectedActivities={selectedRestActivities}
          onToggle={toggleRestActivity}
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
