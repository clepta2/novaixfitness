// src/components/onboarding/OnboardingLayout.tsx
// Layout compartilhado para todas as telas de onboarding - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { useResponsive } from '../../hooks/useResponsive';

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
  iconColor = COLORS.primary,
}: OnboardingLayoutProps) {
  const { isSmall } = useResponsive();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);
  const progressAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();

    Animated.spring(progressAnim, {
      toValue: (stepNumber / totalSteps) * 100,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [stepNumber]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingTop: Platform.OS === 'ios' ? 54 : 40 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header com progresso */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Step indicator */}
        <View style={styles.stepBadge}>
          <View style={styles.stepDot} />
          <Text style={styles.stepText}>PASSO {stepNumber} DE {totalSteps}</Text>
        </View>

        {/* Titulo */}
        <Text style={[styles.title, { fontSize: isSmall ? 24 : 28 }]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {/* Icone decorativo */}
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={icon as any} size={32} color={iconColor} />
          </View>
        )}

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressLabel}>{Math.round((stepNumber / totalSteps) * 100)}%</Text>
        </View>

        {/* Step dots */}
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < stepNumber && styles.dotCompleted,
                i === stepNumber - 1 && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Conteudo */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {children}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },

  // Step badge
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 1.5,
  },

  // Titulo
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: COLORS.textTitle,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },

  // Icone decorativo
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  // Progresso
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: COLORS.primary,
    width: 35,
    textAlign: 'right',
  },

  // Dots
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotCompleted: {
    backgroundColor: COLORS.primary,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },

  // Conteudo
  content: {
    flex: 1,
  },
});
