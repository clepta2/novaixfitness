// src/components/workout/ExerciseStepCarousel.js
// Carrossel passo a passo - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ExerciseStepCarousel({ steps }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!steps || steps.length === 0) return null;
  const item = steps[activeStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PASSO A PASSO</Text>
        <Text style={styles.progress}>
          {activeStep + 1} de {steps.length}
        </Text>
      </View>

      <View style={styles.stepCard}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.stepImage} />
        ) : null}
        <View style={styles.stepContent}>
          <View style={styles.stepBadgeRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>PASSO {item.step}</Text>
            </View>
            {item.title && <Text style={styles.stepTitle}>{item.title}</Text>}
          </View>
          <Text style={styles.stepText}>{item.text}</Text>
        </View>
      </View>

      <View style={styles.dots}>
        {steps.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, activeStep === index && styles.dotActive]}
            onPress={() => setActiveStep(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  progress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.primary,
  },
  stepCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.surface,
  },
  stepContent: {
    padding: SPACING.lg,
  },
  stepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  stepTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.primary,
  },
  stepBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.background,
    letterSpacing: 1,
  },
  stepText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textTitle,
    lineHeight: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
});
