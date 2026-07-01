// app/onboarding/_layout.js
// Layout do fluxo de Onboarding - NOVAIX FITNESS

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
        <Stack.Screen name="objetivo" />
        <Stack.Screen name="dados-fisicos" lazy />
        <Stack.Screen name="modelo" lazy />
        <Stack.Screen name="disponibilidade" lazy />
        <Stack.Screen name="tipo-academia" lazy />
        <Stack.Screen name="experiencia" lazy />
        <Stack.Screen name="processando" lazy />
      </Stack>
    </Suspense>
  );
}
