
// app/onboarding/index.js
// Tela principal do onboarding - 2 Fases

import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { OnboardingFooter, ErrorBoundary, OnboardingStep } from '../../src/components';
import { ONBOARDING_STEPS, getStep, getNextStep, getCurrentPhase } from '../../src/data/onboardingFlow';
import { useAuth } from '../../src/context/AuthContext';
import { sanitizeObject } from '../../src/middleware/validation';
import { formatUserError } from '../../src/middleware/errorHandler';
import { useI18n } from '../../src/i18n';

export default function OnboardingScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const { t } = useI18n();
  const [currentStepId, setCurrentStepId] = useState('goal');
  const [data, setData] = useState(onboarding || {});

  useEffect(() => {
    if (onboarding?.currentStep) setCurrentStepId(onboarding.currentStep);
  }, [onboarding]);

  const currentStep = getStep(currentStepId);
  
  const currentPhase = getCurrentPhase(currentStepId);

  const handleUpdate = useCallback((newData) => {
    setData(prev => ({ ...prev, ...sanitizeObject(newData) }));
  }, []);

  const handleNext = useCallback(async () => {
    try {
      if (currentStep?.type === 'redirect' && currentStep?.redirectScreen) {
        await saveOnboarding({ ...data, currentStep: currentStepId } as any);
        router.push(currentStep.redirectScreen as string);
        return;
      }
      const nextStepId = getNextStep(currentStepId, data) as any;
      if (nextStepId === 'processing') {
        await saveOnboarding(data);
        router.push('/onboarding/processando');
        return;
      }
      if (nextStepId) setCurrentStepId(nextStepId);
    } catch (error) {
      Alert.alert(t('common.error'), formatUserError(error));
    }
  }, [currentStep, currentStepId, data, saveOnboarding, router, t]);

  const handleBack = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStepId);
    if (currentIndex > 0) setCurrentStepId(ONBOARDING_STEPS[currentIndex - 1].id);
  }, [currentStepId]);

  if (!currentStep) return null;

  return (
    <ErrorBoundary screenName="Onboarding">
    <View style={styles.screen}>
      {currentStep.phase && (
        <View style={styles.phaseBar}>
          <View style={[styles.phaseIndicator, currentPhase === 1 && styles.phaseActive]}>
            <View style={[styles.phaseDot, currentPhase === 1 && styles.phaseDotActive]} />
            <Text style={[styles.phaseText, currentPhase === 1 && styles.phaseTextActive]}>{t('onboarding.you')}</Text>
          </View>
          <View style={styles.phaseLine} />
          <View style={[styles.phaseIndicator, currentPhase === 2 && styles.phaseActive]}>
            <View style={[styles.phaseDot, currentPhase === 2 && styles.phaseDotActive]} />
            <Text style={[styles.phaseText, currentPhase === 2 && styles.phaseTextActive]}>{t('onboarding.body')}</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <OnboardingStep step={currentStep} data={data} onUpdate={handleUpdate} onNext={currentStep.type === 'info' || currentStep.type === 'redirect' ? handleNext : undefined} />
      </ScrollView>

      {currentStep.type !== 'info' && currentStep.type !== 'redirect' && (
        <View style={styles.footerWrap}>
          <OnboardingFooter onBack={handleBack} onNext={handleNext} canProceed={true} />
        </View>
      )}
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  phaseBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, paddingTop: Platform.OS === 'ios' ? 54 : 40, gap: SPACING.sm },
  phaseIndicator: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, opacity: 0.5 },
  phaseActive: { opacity: 1 },
  phaseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  phaseDotActive: { backgroundColor: COLORS.primary },
  phaseText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  phaseTextActive: { color: COLORS.primary },
  phaseLine: { width: 30, height: 2, backgroundColor: COLORS.surface },
  scroll: { flexGrow: 1, paddingTop: SPACING.md },
  footerWrap: { borderTopWidth: 1, borderTopColor: COLORS.border },
});

