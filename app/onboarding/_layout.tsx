// app/onboarding/_layout.tsx
// Layout do fluxo de Onboarding

import { Suspense } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../../src/constants/colors';

function OnboardingLoading() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export default function OnboardingLayout() {
  return (
    <Suspense fallback={<OnboardingLoading />}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="objetivo" />
        <Stack.Screen name="dados-fisicos" />
        <Stack.Screen name="modelo" />
        <Stack.Screen name="disponibilidade" />
        <Stack.Screen name="tipo-academia" />
        <Stack.Screen name="experiencia" />
        <Stack.Screen name="preferencias" />
        <Stack.Screen name="localizacao" />
        <Stack.Screen name="loading" />
        <Stack.Screen name="processando" />
        <Stack.Screen name="plano" />
        <Stack.Screen name="treino" />
        <Stack.Screen name="meu_treino" />
      </Stack>
    </Suspense>
  );
}
