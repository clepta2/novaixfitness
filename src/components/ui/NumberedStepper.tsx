import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface NumberedStepperProps {
  steps: string[];
  currentStep: number;
}

export default function NumberedStepper({ steps, currentStep }: NumberedStepperProps) {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        return (
          <View key={index} style={styles.step}>
            <View style={[styles.circle, isCompleted && styles.circleCompleted, isActive && styles.circleActive]}>
              <Text style={[styles.text, (isCompleted || isActive) && styles.textActive]}>
                {isCompleted ? '✓' : index + 1}
              </Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={2}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { alignItems: 'center', flex: 1, gap: SPACING.xs },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: { backgroundColor: COLORS.primary },
  circleActive: { backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.primary + '40' },
  text: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  textActive: { color: COLORS.background },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  labelActive: { color: COLORS.primary, fontWeight: '500' },
});
