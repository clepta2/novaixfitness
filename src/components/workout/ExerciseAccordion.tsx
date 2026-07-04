// src/components/workout/ExerciseAccordion.tsx
// Accordion de exercício com passo a passo - NOVAIX FITNESS

import React, { useRef, useEffect, useMemo, memo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import ExerciseStepCarousel from './ExerciseStepCarousel';
import LoadHistory from './LoadHistory';
import { getFallbackExerciseDetails } from '../../data/exercises';

interface ExerciseData {
  name: string;
  muscle: string;
  sets?: number;
  reps?: string;
  rest?: number;
  steps?: string[];
  tips?: string[];
  mistakes?: string[];
  alternatives?: { name: string; reason: string }[];
  [key: string]: any;
}

interface ExerciseAccordionInnerProps {
  exercise: ExerciseData;
  isOpen: boolean;
  onToggle: () => void;
  index?: number;
}

function ExerciseAccordionInner({ exercise, isOpen, onToggle, index = 0 }: ExerciseAccordionInnerProps): React.ReactElement {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heightAnim, { toValue: isOpen ? 1 : 0, tension: 30, friction: 8, useNativeDriver: false }),
      Animated.timing(rotateAnim, { toValue: isOpen ? 1 : 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [isOpen]);

  const { steps, tips, mistakes, alternatives } = useMemo(() => {
    const details = getFallbackExerciseDetails(exercise.name, exercise.muscle);
    return {
      steps: exercise.steps && exercise.steps.length > 0 ? exercise.steps : details.steps,
      tips: exercise.tips && exercise.tips.length > 0 ? exercise.tips : details.tips,
      mistakes: exercise.mistakes && exercise.mistakes.length > 0 ? exercise.mistakes : details.mistakes,
      alternatives: exercise.alternatives || [],
    };
  }, [exercise.name, exercise.muscle, exercise.steps, exercise.tips, exercise.mistakes, exercise.alternatives]);

  const chevronRotation = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.accordion}>
      <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.8} accessibilityLabel={`Exercicio ${exercise.name}, ${isOpen ? 'expandido' : 'colapsado'}`} accessibilityRole="button" accessibilityState={{ expanded: isOpen }}>
        <View style={styles.headerLeft}>
          <View style={[styles.numberBadge, isOpen && styles.numberBadgeActive]}>
            <Text style={[styles.numberText, isOpen && styles.numberTextActive]}>{(index || 0) + 1}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.title, isOpen && styles.titleActive]}>{exercise.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{exercise.sets}x{exercise.reps}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.meta}>{exercise.muscle}</Text>
              {exercise.rest && (
                <>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.meta}>{exercise.rest}s descanso</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View style={[styles.content, { opacity: heightAnim }]}>
          <TouchableOpacity style={styles.videoBtn}>
            <Ionicons name="play-circle" size={40} color={COLORS.primary} />
            <Text style={styles.videoLabel}>Assistir execução</Text>
          </TouchableOpacity>

          <ExerciseStepCarousel steps={steps.map((s: any) => ({ text: s }))} />
          <LoadHistory exerciseName={exercise.name} />

          {tips && tips.length > 0 && (
            <View style={styles.tipsSection}>
              <View style={[styles.tipsHeader, { borderLeftColor: COLORS.success }]}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={[styles.tipsTitle, { color: COLORS.success }]}>DICAS</Text>
              </View>
              {tips.map((tip: string, i: number) => (
                <View key={i} style={styles.tipItem}>
                  <View style={[styles.tipDot, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {mistakes && mistakes.length > 0 && (
            <View style={styles.tipsSection}>
              <View style={[styles.tipsHeader, { borderLeftColor: COLORS.error }]}>
                <Ionicons name="close-circle" size={16} color={COLORS.error} />
                <Text style={[styles.tipsTitle, { color: COLORS.error }]}>ERROS COMUNS</Text>
              </View>
              {mistakes.map((mistake: string, i: number) => (
                <View key={i} style={styles.tipItem}>
                  <View style={[styles.tipDot, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.tipText}>{mistake}</Text>
                </View>
              ))}
            </View>
          )}

          {alternatives.length > 0 && (
            <View style={styles.altSection}>
              <Text style={styles.altTitle}>SEM ESSE EQUIPAMENTO?</Text>
              {alternatives.map((alt, i) => (
                <View key={i} style={styles.altCard}>
                  <Ionicons name="swap-horizontal" size={16} color={COLORS.primary} />
                  <View style={styles.altInfo}>
                    <Text style={styles.altName}>{alt.name}</Text>
                    <Text style={styles.altReason}>{alt.reason}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordion: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  numberBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center' },
  numberBadgeActive: { backgroundColor: COLORS.primary + '20' },
  numberText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted },
  numberTextActive: { color: COLORS.primary },
  headerInfo: { flex: 1 },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  titleActive: { color: COLORS.primary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: 2 },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  metaDot: { color: COLORS.border },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  videoBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary + '10', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md },
  videoLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  tipsSection: { marginBottom: SPACING.md },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderLeftWidth: 3, paddingLeft: SPACING.sm, marginBottom: SPACING.sm },
  tipsTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, letterSpacing: 1 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.xs },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, flex: 1, lineHeight: 18 },
  altSection: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  altTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary, letterSpacing: 1, marginBottom: SPACING.sm },
  altCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  altInfo: { flex: 1 },
  altName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  altReason: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});

export default memo(ExerciseAccordionInner);
