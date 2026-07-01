// app/onboarding/disponibilidade.js
// Tela 4 - Disponibilidade - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { OnboardingFooter } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';

const weekDays = [
  { id: 2, label: '2x', sub: '2 dias/sem' },
  { id: 3, label: '3x', sub: '3 dias/sem' },
  { id: 4, label: '4x', sub: '4 dias/sem' },
  { id: 5, label: '5x', sub: '5 dias/sem' },
  { id: 6, label: '6x', sub: '6 dias/sem' },
];

const locations = [
  { id: 'gym', label: 'Academia', icon: 'barbell-outline', color: COLORS.primary, desc: 'Equipamentos completos' },
  { id: 'home', label: 'Casa', icon: 'home-outline', color: COLORS.cyan, desc: 'Peso corporal' },
  { id: 'park', label: 'Parque', icon: 'leaf-outline', color: COLORS.success, desc: 'Ao ar livre' },
];

export default function AvailabilityScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleNext = async () => {
    if (!selectedDays || !selectedLocation) return;
    await saveOnboarding({ ...onboarding, daysPerWeek: selectedDays, location: selectedLocation });
    await updateProfile({ current_step: 'onboarding' });
    router.push(selectedLocation === 'gym' ? '/onboarding/tipo-academia' : '/onboarding/experiencia');
  };

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.stepPill}>
            <View style={s.stepDot} />
            <Text style={s.stepText}>PASSO 4 DE 6</Text>
          </View>
          <Text style={s.title}>SUA{'\n'}DISPONIBILIDADE</Text>
          <Text style={s.subtitle}>Quantos dias e onde voce vai treinar?</Text>
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: '66.6%' }]} />
            </View>
            <Text style={s.progressLabel}>67%</Text>
          </View>
        </View>

        {/* Dias por semana */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.accentDot} />
            <Text style={s.sectionLabel}>DIAS POR SEMANA</Text>
          </View>
          <View style={s.daysRow}>
            {weekDays.map((day) => {
              const isSelected = selectedDays === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  style={[s.dayCard, isSelected && s.dayCardActive]}
                  onPress={() => setSelectedDays(day.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.dayNum, isSelected && s.dayNumActive]}>{day.label}</Text>
                  <Text style={[s.daySub, isSelected && { color: COLORS.primary }]}>{day.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedDays && (
            <Text style={s.hint}>
              {selectedDays <= 3 ? '💪 Otimo para iniciantes e intermediarios' :
               selectedDays <= 4 ? '🔥 Balanco ideal entre treino e descanso' :
               '⚡ Para atletas dedicados com experiencia'}
            </Text>
          )}
        </View>

        {/* Local de treino */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.accentDot} />
            <Text style={s.sectionLabel}>ONDE VOCE VAI TREINAR?</Text>
          </View>
          <View style={s.locRow}>
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[s.locCard, isSelected && { borderColor: loc.color, backgroundColor: loc.color + '10', shadowColor: loc.color }]}
                  onPress={() => setSelectedLocation(loc.id)}
                  activeOpacity={0.85}
                >
                  <View style={[s.locIcon, { backgroundColor: loc.color + (isSelected ? '30' : '18') }]}>
                    <Ionicons name={loc.icon} size={24} color={loc.color} />
                  </View>
                  <Text style={[s.locLabel, isSelected && { color: loc.color }]}>{loc.label}</Text>
                  <Text style={s.locDesc}>{loc.desc}</Text>
                  {isSelected && (
                    <View style={[s.checkDot, { backgroundColor: loc.color }]}>
                      <Ionicons name="checkmark" size={10} color={COLORS.background} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <OnboardingFooter onBack={() => router.back()} onNext={handleNext} canProceed={!!selectedDays && !!selectedLocation} />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, textAlign: 'center', lineHeight: 36, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 36 },
  section: { marginBottom: SPACING.xxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  accentDot: { width: 3, height: 16, backgroundColor: COLORS.primary, borderRadius: 2 },
  sectionLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1.5 },
  daysRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  dayCard: { flex: 1, minWidth: 54, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 2, borderColor: COLORS.border, paddingVertical: SPACING.md, alignItems: 'center', gap: 2 },
  dayCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  dayNum: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.textMuted },
  dayNumActive: { color: COLORS.primary },
  daySub: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.md, paddingHorizontal: SPACING.xs },
  locRow: { flexDirection: 'row', gap: SPACING.sm },
  locCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center', gap: SPACING.xs, position: 'relative', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  locIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  locLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  locDesc: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  checkDot: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
});
