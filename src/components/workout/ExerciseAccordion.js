// src/components/workout/ExerciseAccordion.js
// Accordion de exercício com passo a passo - NOVAIX FITNESS

import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import ExerciseStepCarousel from './ExerciseStepCarousel';

const { width } = Dimensions.get('window');

export default function ExerciseAccordion({ exercise, isOpen, onToggle }) {
  return (
    <View style={styles.accordion}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.accordionLeft}>
          <View style={styles.accordionIcon}>
            <Ionicons name="barbell" size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.accordionTitle}>{exercise.name}</Text>
            <Text style={styles.accordionMeta}>{exercise.sets}x{exercise.reps} • {exercise.muscle}</Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.accordionContent}>
          <TouchableOpacity style={styles.exerciseVideo}>
            <Ionicons name="play-circle" size={48} color={COLORS.primary} />
            <Text style={styles.exerciseVideoLabel}>Assistir execução</Text>
          </TouchableOpacity>

          <ExerciseStepCarousel steps={exercise.steps} />

          <TipsList title="DICAS" items={exercise.tips} icon="checkmark-circle" color={COLORS.success} />
          <TipsList title="ERROS COMUNS" items={exercise.mistakes} icon="close-circle" color={COLORS.error} />

          <View style={styles.alternativesSection}>
            <Text style={styles.tipsTitle}>SEM ESSE EQUIPAMENTO?</Text>
            <Text style={styles.alternativesSubtitle}>Treinos alternativos para o mesmo músculo:</Text>
            {exercise.alternatives.map((alt, i) => (
              <View key={i} style={styles.alternativeCard}>
                <View style={styles.alternativeIcon}>
                  <Ionicons name="swap-horizontal" size={16} color={COLORS.primary} />
                </View>
                <View style={styles.alternativeInfo}>
                  <Text style={styles.alternativeName}>{alt.name}</Text>
                  <Text style={styles.alternativeReason}>{alt.reason}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function TipsList({ title, items, icon, color }) {
  return (
    <View style={styles.tipsSection}>
      <Text style={styles.tipsTitle}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.tipItem}>
          <Ionicons name={icon} size={16} color={color} />
          <Text style={styles.tipText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  accordionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  accordionMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  accordionContent: {
    padding: SPACING.lg,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  exerciseVideo: {
    height: 120,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  exerciseVideoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  tipsSection: {
    marginBottom: SPACING.xl,
  },
  tipsTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textTitle,
    flex: 1,
    lineHeight: 18,
  },
  alternativesSection: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  alternativesSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textDescription,
    marginBottom: SPACING.md,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alternativeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: COLORS.textTitle,
  },
  alternativeReason: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
