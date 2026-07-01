import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface StepIndicatorProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
}

export default function StepIndicator({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  icon,
  iconColor = COLORS.primary,
}: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stepBadge}>
        <View style={styles.stepDot} />
        <Text style={styles.stepText}>PASSO {stepNumber} DE {totalSteps}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
          <Ionicons name={icon as any} size={32} color={iconColor} />
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(stepNumber / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{Math.round((stepNumber / totalSteps) * 100)}%</Text>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: SPACING.xxl },
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
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 35, textAlign: 'right' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotCompleted: { backgroundColor: COLORS.primary },
  dotActive: { backgroundColor: COLORS.primary, width: 24 },
});
