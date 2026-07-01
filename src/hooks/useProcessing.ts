// src/hooks/useProcessing.ts
// Hook de logica do processamento de onboarding - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '../helpers/navigation';
import { useAuth } from '../context/AuthContext';
import { generateWorkoutPlan, saveWorkoutPlan, generateMealPlan } from '../services/planGenerator';
import { supabase } from '../config/supabase';

interface ProcessingStep {
  icon: string;
  label: string;
}

const STEPS: ProcessingStep[] = [
  { icon: 'analytics', label: 'ANALISANDO DADOS CORPORAIS...' },
  { icon: 'barbell', label: 'SELECIONANDO TREINOS...' },
  { icon: 'calendar', label: 'GERANDO CALENDARIO...' },
  { icon: 'target', label: 'PERSONALIZANDO SEU PLANO...' },
];

export default function useProcessing() {
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

        let formattedDob: string | null = null;
        if (onboarding.birth_date) {
          const parts = String(onboarding.birth_date).split('/');
          if (parts.length === 3) formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        await updateProfile({
          onboarding, physical_data: physicalData, birth_date: formattedDob,
          location: onboarding.location || null, onboarding_completed: true, current_step: 'pagamento',
        });

        if (cancelled) return;
        setCurrentStep(1);

        const planContext = {
          weight: onboarding.weight || 70, goal: onboarding.goal || 'manter',
          level: onboarding.level || 'intermediario', gymType: onboarding.gymType || 'academia',
          availableDays: onboarding.availableDays || 4, sessionDuration: onboarding.sessionDuration || 60,
        };
        const plan = await generateWorkoutPlan(planContext);
        if (plan && user?.id) await saveWorkoutPlan(user.id, plan);

        if (cancelled) return;
        setCurrentStep(2);

        const mealContext = {
          weight: onboarding.weight || 70, height: onboarding.height || 170,
          age: onboarding.age || 25, goal: onboarding.goal || 'manter',
          allergies: onboarding.allergies || '', restrictions: onboarding.restrictions || '',
        };
        const mealPlan = await generateMealPlan(mealContext);
        if (mealPlan && user?.id) {
          await supabase.from('user_meal_plans').upsert(
            { user_id: user.id, plan_data: mealPlan, is_active: true },
            { onConflict: 'user_id' }
          );
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
  }, [onboarding, user?.id, updateProfile, router]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return { currentStep, elapsedTime, spin, formatTime, steps: STEPS };
}
