// src/components/common/TutorialOverlay.js
// Overlay de tutorial interativo - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TutorialOverlay({ visible, steps, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) setCurrentStep(0);
  }, [visible]);

  if (!visible || !steps || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.stepCounter}>
            <Text style={styles.stepText}>{currentStep + 1}/{steps.length}</Text>
          </View>

          <View style={styles.iconContainer}>
            <Ionicons name={step.icon} size={48} color={COLORS.primary} />
          </View>

          <Text style={typography.h3}>{step.title}</Text>
          <Text style={[typography.body, styles.description]}>{step.description}</Text>

          <View style={styles.buttons}>
            {!isLast && (
              <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                <Text style={styles.skipText}>Pular tutorial</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>{isLast ? 'COMEÇAR!' : 'PRÓXIMO'}</Text>
              <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={20} color={COLORS.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.dots}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentStep && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: SCREEN_WIDTH - SPACING.xl * 2,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: SPACING.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepCounter: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
  },
  stepText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  description: {
    color: COLORS.textDescription,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.md,
  },
  buttons: {
    width: '100%',
    gap: SPACING.md,
  },
  skipBtn: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.lg,
  },
  nextText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    letterSpacing: 1,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
});
