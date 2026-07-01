// @ts-nocheck
// app/onboarding/preferencias.js
// Tela 3 - Preferências Consolidadas (Disponibilidade + Academia + Experiência) - NOVAIX FITNESS
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { OnboardingFooter, ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { useStaggeredEntry } from '../../src/utils/animations';
import { WEEK_DAYS, LOCATIONS, GYM_TYPES, LEVELS } from '../../src/data/onboardingOptions';
export default function PreferenciasScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [step, setStep] = useState(0); // 0=dias, 1=local, 2=academia, 3=nivel
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [anim0, anim1] = [0, 1].map(useStaggeredEntry);
  const steps = ['DIAS POR SEMANA', 'ONDE VAI TREINAR', 'TIPO DE ACADEMIA', 'SEU NÍVEL'];
  const progress = ((step + 1) / 4) * 100;
  const canProceed = () => {
    if (step === 0) return !!selectedDays;
    if (step === 1) return !!selectedLocation;
    if (step === 2) return true; // academia opcional
    if (step === 3) return !!selectedLevel;
    return false;
  };
  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // Finalizar
    await saveOnboarding({
      ...onboarding,
      daysPerWeek: selectedDays,
      location: selectedLocation,
      gymType: selectedGym,
      level: selectedLevel,
    });
    await updateProfile({ current_step: 'pagamento' });
    router.push('/onboarding/processando');
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else router.back();
  };
  return (
    <ErrorBoundary screenName="Preferencias">
      <View style={s.screen}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={[s.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
            <View style={s.stepPill}>
              <View style={s.stepDot} />
              <Text style={s.stepText}>PASSO 3 DE 3</Text>
            </View>
            <Text style={s.title}>{steps[step]}</Text>
            <Text style={s.subtitle}>
              {step === 0 ? 'Quantos dias por semana você pode treinar?' :
               step === 1 ? 'Onde você prefere treinar?' :
               step === 2 ? 'Qual sua academia? (opcional)' :
               'Isso define a intensidade dos treinos'}
            </Text>
            <View style={s.progressWrap}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={s.progressLabel}>{Math.round(progress)}%</Text>
            </View>
          </Animated.View>
          <Animated.View style={{ opacity: anim1.opacity, transform: [{ translateY: anim1.translateY }] }}>
            {step === 0 && (
              <View style={s.daysRow}>
                {WEEK_DAYS.map((day) => {
                  const isSelected = selectedDays === day.id;
                  return (
                    <TouchableOpacity key={day.id} style={[s.dayCard, isSelected && s.dayCardActive]} onPress={() => setSelectedDays(day.id)} activeOpacity={0.8}>
                      <Text style={[s.dayNum, isSelected && s.dayNumActive]}>{day.label}</Text>
                      <Text style={[s.daySub, isSelected && { color: COLORS.primary }]}>{day.sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {step === 1 && (
              <View style={s.locRow}>
                {LOCATIONS.map((loc) => {
                  const isSelected = selectedLocation === loc.id;
                  return (
                    <TouchableOpacity key={loc.id} style={[s.locCard, isSelected && { borderColor: loc.color, backgroundColor: loc.color + '10' }]} onPress={() => setSelectedLocation(loc.id)} activeOpacity={0.85}>
                      <View style={[s.locIcon, { backgroundColor: loc.color + (isSelected ? '30' : '18') }]}>
                        <Ionicons name={loc.icon} size={24} color={loc.color} />
                      </View>
                      <Text style={[s.locLabel, isSelected && { color: loc.color }]}>{loc.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {step === 2 && (
              <View style={s.gymGrid}>
                {GYM_TYPES.map((gym) => {
                  const isSelected = selectedGym === gym.id;
                  return (
                    <TouchableOpacity key={gym.id} style={[s.gymCard, isSelected && s.gymCardActive]} onPress={() => setSelectedGym(gym.id)} activeOpacity={0.85}>
                      <Ionicons name={gym.icon} size={20} color={isSelected ? COLORS.primary : COLORS.textMuted} />
                      <Text style={[s.gymLabel, isSelected && { color: COLORS.primary }]}>{gym.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {step === 3 && (
              <View style={s.levelRow}>
                {LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  return (
                    <TouchableOpacity key={level.id} style={[s.levelCard, isSelected && { borderColor: level.color, backgroundColor: level.color + '10' }]} onPress={() => setSelectedLevel(level.id)} activeOpacity={0.85}>
                      <View style={[s.levelIcon, { backgroundColor: level.color + (isSelected ? '30' : '18') }]}>
                        <Ionicons name={level.icon} size={28} color={level.color} />
                      </View>
                      <Text style={[s.levelLabel, isSelected && { color: level.color }]}>{level.label}</Text>
                      {isSelected && <View style={[s.checkBadge, { backgroundColor: level.color }]}><Ionicons name="checkmark" size={12} color={COLORS.background} /></View>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Animated.View>
        </ScrollView>
        <OnboardingFooter onBack={handleBack} onNext={handleNext} canProceed={canProceed()} nextLabel={step === 3 ? 'FINALIZAR' : 'PRÓXIMO'} />
      </View>
    </ErrorBoundary>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', lineHeight: 34, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 36 },
  daysRow: { flexDirection: 'row', gap: SPACING.sm },
  dayCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 2, borderColor: COLORS.border, paddingVertical: SPACING.lg, alignItems: 'center', gap: 4 },
  dayCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  dayNum: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textMuted },
  dayNumActive: { color: COLORS.primary },
  daySub: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  locRow: { flexDirection: 'row', gap: SPACING.sm },
  locCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center', gap: SPACING.sm },
  locIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  locLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle },
  gymGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  gymCard: { width: '30%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center', gap: SPACING.xs },
  gymCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  gymLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  levelRow: { flexDirection: 'row', gap: SPACING.sm },
  levelCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.lg, alignItems: 'center', gap: SPACING.sm, position: 'relative' },
  levelIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  levelLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  checkBadge: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
