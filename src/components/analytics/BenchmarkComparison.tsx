// src/components/analytics/BenchmarkComparison.tsx
// Comparação com benchmarks de usuários similares

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SectionCard } from '../ui/SectionCard';
import SpaceBetween from '../ui/SpaceBetween';
import { MOCK_BENCHMARK_DATA, BenchmarkData } from '../../data/analyticsMock';
import { useColors } from '../../context/ThemeContext';
import MetricBar from './MetricBar';
import PercentileRing from './PercentileRing';

interface MetricBarProps {
  label: string;
  userValue: number;
  peerValue: number;
  unit: string;
  higherIsBetter?: boolean;
}

export default function BenchmarkComparison({ data }: { data?: BenchmarkData }) {
  const benchmarkData = data || MOCK_BENCHMARK_DATA;
  const colors = useColors();
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const metrics: MetricBarProps[] = useMemo(() => [
    { label: 'Frequência semanal', userValue: benchmarkData.userStats.workoutsPerWeek, peerValue: benchmarkData.peerStats.workoutsPerWeek, unit: 'x' },
    { label: 'Duração média', userValue: benchmarkData.userStats.avgDuration, peerValue: benchmarkData.peerStats.avgDuration, unit: 'min' },
    { label: 'Streak atual', userValue: benchmarkData.userStats.streak, peerValue: benchmarkData.peerStats.streak, unit: 'dias' },
    { label: 'Total minutos', userValue: benchmarkData.userStats.totalMinutes, peerValue: benchmarkData.peerStats.totalMinutes, unit: 'min' },
    { label: 'IMC', userValue: benchmarkData.userStats.bmi, peerValue: benchmarkData.peerStats.bmi, unit: '', higherIsBetter: false },
  ], [benchmarkData]);

  const aboveAverage = metrics.filter(m => m.higherIsBetter ? m.userValue > m.peerValue : m.userValue < m.peerValue).length;

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <SectionCard marginBottom={SPACING.md}>
        <SpaceBetween style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="people" size={18} color={colors.purple || '#9C27B0'} />
            <Text style={[styles.title, { color: colors.textTitle }]}>BENCHMARK</Text>
          </View>
          <View style={[styles.peerBadge, { backgroundColor: colors.surfaceOverlay || '#2A3040' }]}>
            <Ionicons name="person" size={10} color={colors.textMuted} />
            <Text style={[styles.peerText, { color: colors.textMuted }]}>
              {benchmarkData.ageRange} | {benchmarkData.goal} | {benchmarkData.experience}
            </Text>
          </View>
        </SpaceBetween>

        <View style={[styles.topSection, { backgroundColor: colors.background }]}>
          <PercentileRing percentile={benchmarkData.percentile} />
          <View style={styles.topInfo}>
            <Text style={[styles.topTitle, { color: colors.textMuted }]}>Você está à frente de</Text>
            <Text style={[styles.topValue, { color: colors.primary }]}>{benchmarkData.percentile}%</Text>
            <Text style={[styles.topSubtitle, { color: colors.textMuted }]}>dos usuários do seu perfil</Text>
            <View style={styles.aboveAverageBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success || '#4CAF50'} />
              <Text style={[styles.aboveAverageText, { color: colors.success || '#4CAF50' }]}>
                Acima da média em {aboveAverage}/{metrics.length} métricas
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <MetricBar key={index} {...metric} />
          ))}
        </View>

        <TouchableOpacity style={[styles.infoRow, { backgroundColor: colors.background }]}>
          <Ionicons name="information-circle-outline" size={12} color={colors.textMuted} />
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Comparado com usuários de {benchmarkData.ageRange}, meta {benchmarkData.goal.toLowerCase()} e experiência {benchmarkData.experience.toLowerCase()}
          </Text>
        </TouchableOpacity>
      </SectionCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, letterSpacing: 1 },
  peerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm,
  },
  peerText: { fontFamily: 'Inter_400Regular', fontSize: 9 },
  topSection: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.lg,
    marginBottom: SPACING.xl, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg,
  },
  topInfo: { flex: 1 },
  topTitle: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  topValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28 },
  topSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, marginBottom: SPACING.sm },
  aboveAverageBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  aboveAverageText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  metricsContainer: { gap: SPACING.md, marginBottom: SPACING.md },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm,
  },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 10, flex: 1 },
});
