// src/components/analytics/ProgressPrediction.tsx
// Predição de progresso com IA

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SectionCard } from '../ui/SectionCard';
import SpaceBetween from '../ui/SpaceBetween';
import { MOCK_PROGRESS_PREDICTION, ProgressPredictionData } from '../../data/analyticsMock';
import { useColors } from '../../context/ThemeContext';
import { linearRegression } from '../../helpers/linearRegression';
import WeightCounter from './WeightCounter';
import ConfidenceBar from './ConfidenceBar';

interface Prediction {
  days: number;
  predictedWeight: number;
  change: number;
  confidence: number;
}

export default function ProgressPrediction({ data }: { data?: ProgressPredictionData }) {
  const predictionData = data || MOCK_PROGRESS_PREDICTION;
  const colors = useColors();
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const predictions = useMemo(() => {
    const { weightHistory, goal } = predictionData;
    const regression = linearRegression(weightHistory);
    const dailyRate = regression.slope;

    return [30, 60, 90].map(days => {
      const predictedWeight = weightHistory[weightHistory.length - 1] + dailyRate * days;
      const change = predictedWeight - weightHistory[weightHistory.length - 1];
      const confidence = Math.max(20, Math.min(95, regression.r2 * 100 - days * 0.3));
      const goalAdjusted = goal === 'perder_peso' ? Math.abs(change) : change;

      return {
        days, predictedWeight: Math.max(40, predictedWeight),
        change: Math.round(goalAdjusted * 10) / 10, confidence,
      };
    });
  }, [predictionData]);

  const getGoalIcon = () => {
    switch (predictionData.goal) {
      case 'perder_peso': return 'trending-down';
      case 'ganhar_massa': return 'trending-up';
      default: return 'remove';
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <SectionCard marginBottom={SPACING.md}>
        <SpaceBetween style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="sparkles" size={18} color={colors.primary} />
            <Text style={[styles.title, { color: colors.textTitle }]}>PREVISÃO IA</Text>
          </View>
          <View style={[styles.goalBadge, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name={getGoalIcon()} size={12} color={colors.primary} />
            <Text style={[styles.goalText, { color: colors.primary }]}>{predictionData.goal.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </SpaceBetween>

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Projeção baseada no seu histórico de {predictionData.monthsActive} meses
        </Text>

        <View style={styles.predictionsRow}>
          {predictions.map((pred) => (
            <View key={pred.days} style={[styles.predictionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.predictionDays, { color: colors.textMuted }]}>{pred.days} dias</Text>
              <WeightCounter value={pred.predictedWeight} />
              <View style={[styles.changeBadge, { backgroundColor: pred.change <= 0 ? (colors.successBg || '#E8F5E9') : (colors.errorBg || '#FFEBEE') }]}>
                <Ionicons name={pred.change <= 0 ? 'arrow-down' : 'arrow-up'} size={10}
                  color={pred.change <= 0 ? (colors.success || '#4CAF50') : (colors.error || '#F44336')} />
                <Text style={[styles.changeText, {
                  color: pred.change <= 0 ? (colors.success || '#4CAF50') : (colors.error || '#F44336'),
                }]}>
                  {pred.change <= 0 ? '' : '+'}{pred.change}kg
                </Text>
              </View>
            </View>
          ))}
        </View>

        <ConfidenceBar confidence={predictions[0].confidence} />

        <View style={[styles.insightsRow, { backgroundColor: colors.background }]}>
          <View style={styles.insightItem}>
            <Text style={[styles.insightLabel, { color: colors.textMuted }]}>Peso atual</Text>
            <Text style={[styles.insightValue, { color: colors.textTitle }]}>{predictionData.currentWeight}kg</Text>
          </View>
          <View style={[styles.insightDivider, { backgroundColor: colors.border }]} />
          <View style={styles.insightItem}>
            <Text style={[styles.insightLabel, { color: colors.textMuted }]}>Meta</Text>
            <Text style={[styles.insightValue, { color: colors.textTitle }]}>{(predictionData as any).goalWeight}kg</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.disclaimer, { backgroundColor: colors.background }]}>
          <Ionicons name="information-circle-outline" size={12} color={colors.textMuted} />
          <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
            Previsões baseadas em projeção linear. Resultados reais podem variar.
          </Text>
        </TouchableOpacity>
      </SectionCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, letterSpacing: 1 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, marginBottom: SPACING.lg },
  goalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm,
  },
  goalText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, letterSpacing: 0.5 },
  predictionsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  predictionCard: {
    flex: 1, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1,
  },
  predictionDays: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 10, marginBottom: SPACING.xs,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  changeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs,
  },
  changeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  insightsRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  insightItem: { flex: 1, alignItems: 'center', gap: 2 },
  insightLabel: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  insightValue: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
  insightDivider: { width: 1, height: 28 },
  disclaimer: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm,
  },
  disclaimerText: { fontFamily: 'Inter_400Regular', fontSize: 10, flex: 1 },
});
