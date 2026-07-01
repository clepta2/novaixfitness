// @ts-nocheck
// app/onboarding/localizacao.js
// Tela 3 - Localização - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { OnboardingFooter, ErrorBoundary, LocationSection } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';

export default function OnboardingStepLocalizacao() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();

  const [state, setState] = useState(onboarding?.state || '');
  const [city, setCity] = useState(onboarding?.city || '');
  const [cep, setCep] = useState(onboarding?.cep || '');
  const [street, setStreet] = useState(onboarding?.street || '');
  const [neighborhood, setNeighborhood] = useState(onboarding?.neighborhood || '');
  const [number, setNumber] = useState(onboarding?.number || '');
  const [nearTo, setNearTo] = useState(onboarding?.near_to || '');

  // Localização é opcional, mas se o usuário preencher o CEP, podemos validar o formato básico
  const isCepValid = !cep || cep.replace(/\D/g, '').length === 8;
  const canProceed = isCepValid;

  const handleNext = async () => {
    if (!canProceed) return;
    await saveOnboarding({
      ...onboarding,
      state,
      city,
      cep,
      street,
      neighborhood,
      number,
      near_to: nearTo,
    });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/modelo'); // Próximo passo: Modelo Corporal
  };

  return (
    <ErrorBoundary screenName="OnboardingStepLocalizacao">
      <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <View style={s.stepPill}>
              <View style={s.stepDot} />
              <Text style={s.stepText}>PASSO 3 DE 7</Text>
            </View>
            <Text style={s.title}>SUA LOCALIZAÇÃO</Text>
            <Text style={s.subtitle}>Isso ajuda a encontrar parceiros e treinos perto de você</Text>
            <View style={s.progressWrap}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: '42.8%' }]} />
              </View>
              <Text style={s.progressLabel}>43%</Text>
            </View>
          </View>

          <LocationSection
            state={state}
            setState={setState}
            city={city}
            setCity={setCity}
            cep={cep}
            setCep={setCep}
            street={street}
            setStreet={setStreet}
            neighborhood={neighborhood}
            setNeighborhood={setNeighborhood}
            number={number}
            setNumber={setNumber}
            nearTo={nearTo}
            setNearTo={setNearTo}
          />
        </ScrollView>

        <View style={s.footerWrap}>
          <OnboardingFooter onBack={() => router.back()} onNext={handleNext} canProceed={canProceed} />
        </View>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  footerWrap: { borderTopWidth: 1, borderTopColor: COLORS.border },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.md },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.lg },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 30 },
});
