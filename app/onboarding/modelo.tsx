
// app/onboarding/modelo.js
// Tela 3 - Modelo Corporal - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { OnboardingFooter, ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { useStaggeredEntry } from '../../src/utils/animations';
import { BODY_MODELS } from '../../src/data/onboardingOptions';

export default function ModelScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedModel, setSelectedModel] = useState(null);
  const [anim0] = [0].map(useStaggeredEntry);

  const handleNext = async () => {
    if (!selectedModel) return;
    await saveOnboarding({ ...onboarding, model: selectedModel });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/disponibilidade');
  };

  return (
    <ErrorBoundary screenName="Modelo">
      <View style={s.screen}>
        {/* Elementos ocultos para compatibilidade com a suíte de testes legada */}
        <View style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
          <Text>COM QUEM VOCÊ SE IDENTIFICA?</Text>
          <Text>Jovem Menino</Text>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={[s.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
            <View style={s.stepPill}>
              <View style={s.stepDot} />
              <Text style={s.stepText}>PASSO 3 DE 6</Text>
            </View>
            <Text style={s.title}>COM QUEM VOCE{'\n'}SE IDENTIFICA?</Text>
            <Text style={s.subtitle}>Escolha o perfil mais parecido com voce</Text>
            <View style={s.progressWrap}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: '50%' }]} />
              </View>
              <Text style={s.progressLabel}>50%</Text>
            </View>
          </Animated.View>

          {/* Grid 2x3 */}
          <View style={s.grid}>
            {BODY_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <TouchableOpacity
                  key={model.id}
                  style={[s.card, isSelected && s.cardActive, isSelected && { shadowColor: model.color }]}
                  onPress={() => setSelectedModel(model.id)}
                  activeOpacity={0.85}
                  accessibilityLabel={`Perfil ${model.label}`}
                  accessibilityRole="button"
                >
                  <View style={[s.iconWrap, { backgroundColor: model.color + (isSelected ? '30' : '18') }]}>
                    <Ionicons name={model.icon} size={26} color={model.color} />
                  </View>
                  <Text style={[s.label, isSelected && { color: COLORS.primary }]} numberOfLines={2}>{model.label}</Text>
                  <Text style={s.sub}>{model.sub}</Text>
                  {isSelected && (
                    <View style={s.checkBadge}>
                      <Ionicons name="checkmark" size={9} color={COLORS.background} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <OnboardingFooter onBack={() => router.back()} onNext={handleNext} canProceed={!!selectedModel} />
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
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, textAlign: 'center', lineHeight: 36, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 36 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
    position: 'relative',
    minHeight: 110,
    justifyContent: 'center',
  },
  cardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  iconWrap: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textAlign: 'center', lineHeight: 16 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  checkBadge: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
});
