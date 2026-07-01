// app/onboarding/disponibilidade.tsx
// Tela de Disponibilidade com melhorias visuais - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import OnboardingLayout from '../../src/components/onboarding/OnboardingLayout';
import { WEEK_DAYS_LONG, LOCATIONS_EXTENDED } from '../../src/data/onboardingOptions';

export default function AvailabilityScreen() {
  const router = useRouter();
  const { isSmall } = useResponsive();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const canProceed = !!selectedDays && !!selectedLocation;

  const handleNext = useCallback(async () => {
    if (!selectedDays || !selectedLocation) return;
    await saveOnboarding({ ...onboarding, daysPerWeek: selectedDays, location: selectedLocation });
    await updateProfile({ current_step: 'onboarding' });
    router.push(selectedLocation === 'gym' ? '/onboarding/tipo-academia' : '/onboarding/experiencia');
  }, [selectedDays, selectedLocation, onboarding, saveOnboarding, updateProfile, router]);

  return (
    <ErrorBoundary screenName="Disponibilidade">
      <OnboardingLayout
        stepNumber={4}
        totalSteps={6}
        title="SUA DISPONIBILIDADE"
        subtitle="Quantos dias e onde voce vai treinar?"
        icon="calendar"
        iconColor={COLORS.info}
      >
        {/* Dias por semana */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.accentDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.sectionLabel}>DIAS POR SEMANA</Text>
          </View>
          <View style={styles.daysRow}>
            {WEEK_DAYS_LONG.map((day) => {
              const isSelected = selectedDays === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  style={[styles.dayCard, isSelected && styles.dayCardActive]}
                  onPress={() => setSelectedDays(day.id)}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{day.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Local de treino */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.accentDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.sectionLabel}>ONDE VAI TREINAR?</Text>
          </View>
          <View style={styles.locationRow}>
            {LOCATIONS_EXTENDED.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.locationCard, isSelected && styles.locationCardActive]}
                  onPress={() => setSelectedLocation(loc.id)}
                >
                  <View style={[styles.locationIconWrap, { backgroundColor: (isSelected ? COLORS.primary : COLORS.textMuted) + '15' }]}>
                    <Ionicons name={loc.icon as any} size={24} color={isSelected ? COLORS.primary : COLORS.textMuted} />
                  </View>
                  <Text style={[styles.locationLabel, isSelected && styles.locationLabelActive]}>{loc.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Botao proximo */}
        <View style={styles.btnWrap}>
          <TouchableOpacity
            style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <Text style={[styles.nextBtnText, !canProceed && styles.nextBtnTextDisabled]}>CONTINUAR</Text>
            <Ionicons name="arrow-forward" size={18} color={!canProceed ? COLORS.textMuted : COLORS.background} />
          </TouchableOpacity>
        </View>
      </OnboardingLayout>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 1 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  dayCard: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
  },
  dayCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  dayTextActive: { color: COLORS.background },
  locationRow: { flexDirection: 'row', gap: SPACING.sm },
  locationCard: {
    flex: 1, alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  locationCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  locationIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  locationLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  locationLabelActive: { color: COLORS.primary },
  btnWrap: { marginTop: SPACING.md },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md,
  },
  nextBtnDisabled: { backgroundColor: COLORS.surfaceElevated },
  nextBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  nextBtnTextDisabled: { color: COLORS.textMuted },
});
