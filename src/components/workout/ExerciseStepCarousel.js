// src/components/workout/ExerciseStepCarousel.js
// Carrossel passo a passo animado - NOVAIX FITNESS

import React, { useState, useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ExerciseStepCarousel({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  if (!steps || steps.length === 0) return null;
  const item = steps[activeStep];

  const handleStepChange = (index) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setActiveStep(index);
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="list" size={14} color={COLORS.primary} />
          <Text style={styles.title}>PASSO A PASSO</Text>
        </View>
        <Text style={styles.progress}>{activeStep + 1}/{steps.length}</Text>
      </View>

      <Animated.View style={[styles.stepCard, { opacity: fadeAnim }]}>
        {item.image && <Image source={{ uri: item.image }} style={styles.stepImage} />}

        <View style={styles.stepContent}>
          <View style={styles.stepBadgeRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>PASSO {item.step || activeStep + 1}</Text>
            </View>
            {item.title && <Text style={styles.stepTitle}>{item.title}</Text>}
          </View>
          <Text style={styles.stepText}>{item.text}</Text>
        </View>
      </Animated.View>

      <View style={styles.dotsRow}>
        <TouchableOpacity onPress={() => handleStepChange(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>
          <Ionicons name="chevron-back" size={20} color={activeStep === 0 ? COLORS.border : COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.dots}>
          {steps.map((_, index) => (
            <TouchableOpacity key={index} style={[styles.dot, activeStep === index && styles.dotActive]} onPress={() => handleStepChange(index)} />
          ))}
        </View>

        <TouchableOpacity onPress={() => handleStepChange(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep === steps.length - 1}>
          <Ionicons name="chevron-forward" size={20} color={activeStep === steps.length - 1 ? COLORS.border : COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(ExerciseStepCarousel);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  progress: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  stepCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  stepImage: { width: '100%', height: 140, backgroundColor: COLORS.surface },
  stepContent: { padding: SPACING.md },
  stepBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  stepBadge: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  stepBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 9, color: COLORS.background, letterSpacing: 1 },
  stepTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  stepText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle, lineHeight: 18 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginTop: SPACING.md },
  dots: { flexDirection: 'row', gap: SPACING.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surfaceOverlay },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
});
