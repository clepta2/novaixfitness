// app/onboarding/loading.tsx
// Tela de loading com animacoes premium - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { generateWorkoutPlan, generateMealPlan, saveWorkoutPlan } from '../../src/services/planGenerator';
import { supabase } from '../../src/config/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  { icon: 'analytics', label: 'ANALISANDO SEU PERFIL', color: COLORS.info },
  { icon: 'barbell', label: 'SELECIONANDO EXERCICIOS', color: COLORS.primary },
  { icon: 'restaurant', label: 'CRIANDO PLANO ALIMENTAR', color: COLORS.success },
  { icon: 'checkmark-circle', label: 'PRONTO!', color: COLORS.primary },
];

export default function LoadingScreen() {
  const router = useRouter();
  const { user, onboarding, updateProfile } = useAuth();
  const { isSmall } = useResponsive();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Animacoes
  const spinValue = useMemo(() => new Animated.Value(0), []);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  const pulseAnim = useMemo(() => new Animated.Value(1), []);
  const progressAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Animacao de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    // Rotacao do spinner
    const spin = Animated.loop(
      Animated.timing(spinValue, { toValue: 1, duration: 2000, useNativeDriver: true })
    );
    spin.start();

    // Pulso do centro
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => { spin.stop(); pulse.stop(); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Progresso animado
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (currentStep / STEPS.length) * 100,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

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
        setTimeout(() => { if (!cancelled) router.replace('/(tabs)/home'); }, 1200);
      } catch (err) {
        if (!cancelled) {
          Alert.alert('Erro', 'Ocorreu um erro ao criar seu plano.', [
            { text: 'Tentar Novamente', onPress: () => process() },
            { text: 'Pular', onPress: () => router.replace('/(tabs)/home') },
          ]);
        }
      }
    }
    process();
    return () => { cancelled = true; };
  }, [onboarding, user?.id]);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  return (
    <ErrorBoundary screenName="Loading">
      <View style={styles.screen}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>PREPARANDO SEU PLANO</Text>
            <Text style={styles.subtitle}>Isso leva alguns segundos...</Text>
          </View>

          {/* Timer */}
          <Text style={styles.timer}>{mins}:{secs}</Text>

          {/* Spinner animado */}
          <View style={styles.spinnerWrap}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
              <View style={styles.spinnerRing} />
            </Animated.View>
            <Animated.View style={[styles.spinnerCenter, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.brand}>N</Text>
            </Animated.View>
          </View>

          {/* Barra de progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressLabel}>{Math.round((currentStep / STEPS.length) * 100)}%</Text>
          </View>

          {/* Steps */}
          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={i} style={[styles.stepItem, i <= currentStep && styles.stepActive]}>
                <View style={[styles.stepIcon, { backgroundColor: (i <= currentStep ? step.color : COLORS.surfaceElevated) + '20' }]}>
                  <Ionicons name={step.icon as any} size={18} color={i <= currentStep ? step.color : COLORS.textMuted} />
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepLabel, i <= currentStep && styles.stepLabelActive]}>
                    {step.label}
                  </Text>
                  {i < currentStep && (
                    <Text style={styles.stepDone}>Concluido</Text>
                  )}
                  {i === currentStep && i < 3 && (
                    <Text style={styles.stepProgress}>Em andamento...</Text>
                  )}
                </View>
                {i <= currentStep && (
                  <Ionicons name="checkmark-circle" size={16} color={step.color} />
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  content: { width: '100%', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color: COLORS.textTitle, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary, marginBottom: SPACING.xxl },
  
  // Spinner
  spinnerWrap: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xxl },
  spinner: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center', position: 'absolute' },
  spinnerRing: { position: 'absolute', width: 108, height: 108, borderRadius: 54, borderWidth: 3, borderColor: 'transparent', borderTopColor: COLORS.primary },
  spinnerCenter: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', ...SHADOWS.md },
  brand: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary },

  // Progresso
  progressContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xxl },
  progressTrack: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary, width: 35 },

  // Steps
  steps: { width: '100%', gap: SPACING.md },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, opacity: 0.5 },
  stepActive: { opacity: 1 },
  stepIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  stepInfo: { flex: 1 },
  stepLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  stepLabelActive: { color: COLORS.textTitle },
  stepDone: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.success, marginTop: 2 },
  stepProgress: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.primary, marginTop: 2 },
});
