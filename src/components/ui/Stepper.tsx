// src/components/ui/Stepper.tsx
// Stepper visual para onboarding e formularios - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Step {
  label: string;
  icon?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Stepper({
  steps,
  currentStep,
  showLabels = true,
  size = 'md',
}: StepperProps) {
  const progressAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const progress = currentStep / (steps.length - 1);
    Animated.spring(progressAnim, {
      toValue: progress,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [currentStep, steps.length]);

  const sizeConfig = {
    sm: { dotSize: 24, lineHeight: 2, fontSize: 10, iconSize: 12 },
    md: { dotSize: 32, lineHeight: 3, fontSize: 11, iconSize: 16 },
    lg: { dotSize: 40, lineHeight: 4, fontSize: 12, iconSize: 20 },
  }[size];

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const dotColor = isCompleted ? COLORS.primary : isActive ? COLORS.primary : COLORS.surfaceElevated;
          const textColor = isCompleted || isActive ? COLORS.primary : COLORS.textMuted;

          return (
            <View key={index} style={styles.stepWrapper}>
              <View style={[styles.dot, {
                width: sizeConfig.dotSize,
                height: sizeConfig.dotSize,
                borderRadius: sizeConfig.dotSize / 2,
                backgroundColor: dotColor,
                borderWidth: isActive ? 2 : 0,
                borderColor: COLORS.primary,
              }]}>
                {step.icon && (
                  <Ionicons
                    name={step.icon as any}
                    size={sizeConfig.iconSize}
                    color={isCompleted || isActive ? COLORS.background : COLORS.textMuted}
                  />
                )}
                {!step.icon && isCompleted && (
                  <Ionicons name="checkmark" size={sizeConfig.iconSize} color={COLORS.background} />
                )}
                {!step.icon && isActive && (
                  <View style={[styles.activeIndicator, { width: 8, height: 8, borderRadius: 4 }]} />
                )}
              </View>
              {showLabels && (
                <Text style={[styles.label, { fontSize: sizeConfig.fontSize, color: textColor }]} numberOfLines={1}>
                  {step.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Barra de progresso */}
      <View style={[styles.progressTrack, { height: sizeConfig.lineHeight }]}>
        <Animated.View style={[styles.progressFill, {
          width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          height: sizeConfig.lineHeight,
        }]} />
      </View>
    </View>
  );
}

// Stepper horizontal simplificado para poucos passos
export function SimpleStepper({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.simpleContainer}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[
          styles.simpleDot,
          i <= current ? styles.simpleDotActive : styles.simpleDotInactive,
        ]} />
      ))}
    </View>
  );
}

// Stepper com numeros
export function NumberedStepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <View style={styles.numberedContainer}>
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        return (
          <View key={index} style={styles.numberedStep}>
            <View style={[styles.numberedCircle, isCompleted && styles.numberedCircleCompleted, isActive && styles.numberedCircleActive]}>
              <Text style={[styles.numberedText, (isCompleted || isActive) && styles.numberedTextActive]}>
                {isCompleted ? '✓' : index + 1}
              </Text>
            </View>
            <Text style={[styles.numberedLabel, isActive && styles.numberedLabelActive]} numberOfLines={2}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.md },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: SPACING.xs,
  },
  dot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    maxWidth: 70,
  },
  progressTrack: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  simpleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  simpleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  simpleDotActive: { backgroundColor: COLORS.primary },
  simpleDotInactive: { backgroundColor: COLORS.surfaceElevated },
  numberedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberedStep: {
    alignItems: 'center',
    flex: 1,
    gap: SPACING.xs,
  },
  numberedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberedCircleCompleted: { backgroundColor: COLORS.primary },
  numberedCircleActive: { backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.primary + '40' },
  numberedText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  numberedTextActive: { color: COLORS.background },
  numberedLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  numberedLabelActive: { color: COLORS.primary, fontWeight: '500' },
});
