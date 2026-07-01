// src/components/onboarding/OnboardingLayout.tsx
// Layout compartilhado para todas as telas de onboarding - NOVAIX FITNESS

import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import { Animated } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import StepIndicator from './StepIndicator';

interface OnboardingLayoutProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: string;
  iconColor?: string;
}

export default function OnboardingLayout({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  children,
  icon,
  iconColor,
}: OnboardingLayoutProps) {
  const { isSmall } = useResponsive();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingTop: Platform.OS === 'ios' ? 54 : 40 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <StepIndicator
          stepNumber={stepNumber}
          totalSteps={totalSteps}
          title={title}
          subtitle={subtitle}
          icon={icon}
          iconColor={iconColor}
        />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {children}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
  },
});
