// @ts-nocheck
// app/onboarding/tipo-academia.js
// Tela 5b - Tipo de Academia - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { OnboardingFooter, ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { ACADEMIA_TYPES } from '../../src/data/onboardingOptions';

export default function GymTypeScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedGym, setSelectedGym] = useState(null);

  const handleNext = async () => {
    if (!selectedGym) return;
    await saveOnboarding({ ...onboarding, gymType: selectedGym });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/experiencia');
  };

  return (
    <ErrorBoundary screenName="TipoAcademia">
    <View style={s.screen}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.stepPill}>
            <View style={s.stepDot} />
            <Text style={s.stepText}>PASSO 5 DE 6</Text>
          </View>
          <Text style={s.title}>QUAL TIPO DE ACADEMIA?</Text>
          <Text style={s.subtitle}>Isso ajuda a calibrar a sugestão de equipamentos</Text>
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: '83.3%' }]} />
            </View>
            <Text style={s.progressLabel}>83%</Text>
          </View>
        </View>

        {/* Cards de Opção */}
        <View style={s.cards}>
          {ACADEMIA_TYPES.map((gym) => {
            const isSelected = selectedGym === gym.id;
            return (
              <TouchableOpacity
                key={gym.id}
                style={[s.card, isSelected && s.cardActive, isSelected && { shadowColor: gym.color }]}
                onPress={() => setSelectedGym(gym.id)}
                activeOpacity={0.85}
                accessibilityLabel={`Academia ${gym.label}`}
                accessibilityRole="button"
              >
                <View style={[s.iconWrap, { backgroundColor: gym.color + (isSelected ? '30' : '15') }]}>
                  <Ionicons name={gym.icon} size={24} color={gym.color} />
                </View>
                <View style={s.info}>
                  <Text style={[s.label, isSelected && { color: COLORS.primary }]}>{gym.label}</Text>
                  <Text style={s.desc}>{gym.description}</Text>
                </View>
                <View style={[s.radio, isSelected && s.radioActive]}>
                  {isSelected && <View style={s.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <OnboardingFooter
        onBack={() => router.back()}
        onNext={handleNext}
        canProceed={!!selectedGym}
      />
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
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 36 },
  cards: { gap: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '06', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  info: { flex: 1 },
  label: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, marginBottom: 2 },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, lineHeight: 15 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  radioActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
});
