// app/onboarding/loading.js
// Tela de loading durante geração do plano IA

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { generateWorkoutPlan, generateMealPlan, saveWorkoutPlan } from '../../src/services/planGenerator';
import { supabase } from '../../src/config/supabase';

const STEPS = [
  { icon: 'analytics', label: 'ANALISANDO SEU PERFIL...' },
  { icon: 'barbell', label: 'SELECIONANDO EXERCÍCIOS...' },
  { icon: 'restaurant', label: 'CRIANDO PLANO ALIMENTAR...' },
  { icon: 'checkmark-circle', label: 'PRONTO!' },
];

export default function LoadingScreen() {
  const router = useRouter();
  const { user, onboarding, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [spinValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const spin = Animated.loop(Animated.timing(spinValue, { toValue: 1, duration: 2000, useNativeDriver: true }));
    spin.start();
    return () => spin.stop();
  }, [spinValue]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function process() {
      if (!onboarding || !user?.id) return;
      try {
        setCurrentStep(0);
        await updateProfile({ onboarding, onboarding_completed: true, current_step: 'pagamento' });
        if (cancelled) return;

        setCurrentStep(1);
        const planCtx = { weight: onboarding.weight || 70, goal: onboarding.goal || 'manter', level: onboarding.level || 'intermediario', gymType: onboarding.workoutType || 'academia', availableDays: onboarding.daysPerWeek || 4, injuries: onboarding.injuries || [], preferredMuscles: onboarding.preferredMuscles || [], preferredTime: onboarding.preferredTime, stressSleep: onboarding.stressSleep, ageRange: onboarding.ageRange, gender: onboarding.gender };
        const plan = await generateWorkoutPlan(planCtx);
        if (plan && user?.id) await saveWorkoutPlan(user.id, plan);
        if (cancelled) return;

        setCurrentStep(2);
        const mealCtx = { weight: onboarding.weight || 70, height: onboarding.height || 170, age: 25, goal: onboarding.goal || 'manter', dietaryRestrictions: onboarding.dietaryRestrictions || '' };
        const mealPlan = await generateMealPlan(mealCtx);
        if (mealPlan && user?.id) await supabase.from('user_meal_plans').upsert({ user_id: user.id, plan_data: mealPlan, is_active: true }, { onConflict: 'user_id' });
        if (cancelled) return;

        setCurrentStep(3);
        setTimeout(() => { if (!cancelled) router.replace('/(tabs)/home'); }, 1000);
      } catch (err) {
        if (!cancelled) { Alert.alert('Erro', 'Ocorreu um erro ao criar seu plano.', [{ text: 'Tentar Novamente', onPress: () => process() }, { text: 'Pular', onPress: () => router.replace('/(tabs)/home') }]); }
      }
    }
    process();
    return () => { cancelled = true; };
  }, [onboarding, user?.id]);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>PREPARANDO SEU PLANO</Text>
        <Text style={styles.subtitle}>Isso leva alguns segundos...</Text>
      </View>
      <Text style={styles.timer}>{mins}:{secs}</Text>
      <View style={styles.spinnerWrap}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <View style={styles.spinnerRing} />
        </Animated.View>
        <View style={styles.spinnerCenter}>
          <Text style={styles.brand}>N</Text>
        </View>
      </View>
      <View style={styles.steps}>
        {STEPS.map((step, i) => (
          <View key={i} style={[styles.stepItem, i <= currentStep && styles.stepActive]}>
            <Ionicons name={step.icon} size={16} color={i <= currentStep ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.stepText, i <= currentStep && styles.stepTextActive]}>{step.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  timer: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary, marginBottom: SPACING.xxl },
  spinnerWrap: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xxl },
  spinner: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  spinnerRing: { position: 'absolute', width: 108, height: 108, borderRadius: 54, borderWidth: 3, borderColor: 'transparent', borderTopColor: COLORS.primary },
  spinnerCenter: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  brand: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary },
  steps: { width: '100%', gap: SPACING.md },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, opacity: 0.5 },
  stepActive: { opacity: 1 },
  stepText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  stepTextActive: { color: COLORS.primary },
});
