// app/onboarding/processando.js
// Tela de Carregamento - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { ProgressBar } from '../../src/components';
import { ROUTES } from '../../src/helpers/navigation';
import { layout, typography } from '../../src/styles';
import { useAuth } from '../../src/context/AuthContext';
import { generateWorkoutPlan, saveWorkoutPlan, generateMealPlan } from '../../src/services/planGenerator';
import { supabase } from '../../src/config/supabase';

const steps = [
  { icon: 'analytics', label: 'ANALISANDO DADOS CORPORAIS...' },
  { icon: 'barbell', label: 'SELECIONANDO TREINOS...' },
  { icon: 'calendar', label: 'GERANDO CALENDÁRIO...' },
  { icon: 'target', label: 'PERSONALIZANDO SEU PLANO...' },
];

export default function ProcessingScreen() {
  const router = useRouter();
  const { user, onboarding, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [spinValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, { toValue: 1, duration: 2000, useNativeDriver: true })
    );
    spin.start();
    return () => spin.stop();
  }, [spinValue]);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function processOnboarding() {
      if (!onboarding || !user?.id) return;

      try {
        setCurrentStep(0);
        const physicalData = {
          age: onboarding.age || null,
          weight: onboarding.weight || null,
          height: onboarding.height || null,
        };

        let formattedDob = null;
        if (onboarding.birth_date) {
          const parts = onboarding.birth_date.split('/');
          if (parts.length === 3) formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        await updateProfile({
          onboarding,
          physical_data: physicalData,
          birth_date: formattedDob,
          location: onboarding.location || null,
          onboarding_completed: true,
          current_step: 'pagamento',
        });

        if (cancelled) return;
        setCurrentStep(1);

        const planContext = {
          weight: onboarding.weight || 70,
          goal: onboarding.goal || 'manter',
          level: onboarding.level || 'intermediario',
          gymType: onboarding.gymType || 'academia',
          availableDays: onboarding.availableDays || 4,
          sessionDuration: onboarding.sessionDuration || 60,
        };
        const plan = await generateWorkoutPlan(planContext);
        if (plan && user?.id) await saveWorkoutPlan(user.id, plan);

        if (cancelled) return;
        setCurrentStep(2);

        const mealContext = {
          weight: onboarding.weight || 70,
          height: onboarding.height || 170,
          age: onboarding.age || 25,
          goal: onboarding.goal || 'manter',
          allergies: onboarding.allergies || '',
          restrictions: onboarding.restrictions || '',
        };
        const mealPlan = await generateMealPlan(mealContext);
        if (mealPlan && user?.id) {
          await supabase.from('user_meal_plans').upsert({
            user_id: user.id,
            plan_data: mealPlan,
            is_active: true,
          }, { onConflict: 'user_id' });
        }

        if (cancelled) return;
        setCurrentStep(3);

        setTimeout(() => {
          if (!cancelled) router.replace(ROUTES.PAYWALL);
        }, 800);
      } catch (error) {
        if (__DEV__) console.error('Erro ao processar onboarding:', error);
        if (!cancelled) {
          Alert.alert('Erro', 'Ocorreu um erro ao criar seu plano. Tente novamente.', [
            { text: 'Tentar Novamente', onPress: () => processOnboarding() },
            { text: 'Pular', onPress: () => router.replace(ROUTES.PAYWALL) },
          ]);
        }
      }
    }

    processOnboarding();
    return () => { cancelled = true; };
  }, [onboarding, user?.id]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={layout.centered}>
      <View style={styles.header}>
        <Text style={typography.h3}>PROCESSANDO...</Text>
        <Text style={typography.h5}>PREPARANDO SUA NOVA EVOLUÇÃO NO TREINO</Text>
        <View style={styles.progressContainer}><ProgressBar value={currentStep + 1} max={steps.length} /></View>
      </View>

      <Text style={typography.h5}>{formatTime(elapsedTime)}</Text>

      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <View style={styles.spinnerRing} />
        </Animated.View>
        <View style={styles.spinnerCenter}>
          <Text style={typography.brand}>N</Text>
        </View>
        <Text style={typography.caption}>Evolução Corporal</Text>
        <Text style={typography.h5}>CALCULANDO PLANO...</Text>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={[styles.stepItem, index <= currentStep && styles.stepItemActive]}>
            <Ionicons name={step.icon} size={16} color={index <= currentStep ? COLORS.primary : COLORS.textMuted} />
            <Text style={[typography.caption, index <= currentStep && { color: COLORS.primary }]}>{step.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  spinnerContainer: { alignItems: 'center', marginBottom: 40 },
  spinner: { width: 150, height: 150, borderRadius: 75, borderWidth: 8, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  spinnerRing: { position: 'absolute', width: 134, height: 134, borderRadius: 67, borderWidth: 4, borderColor: 'transparent', borderTopColor: COLORS.primary },
  spinnerCenter: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  stepsContainer: { width: '100%', gap: SPACING.md },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, opacity: 0.5 },
  stepItemActive: { opacity: 1 },
});
