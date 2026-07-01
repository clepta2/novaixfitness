// src/components/analytics/MuscleRadarChart.js
// Gráfico Radar de Equilíbrio Muscular - NOVAIX FITNESS

import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { G, Circle, Line, Polygon, Text as SvgText, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, RadialGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const GROUPS = [
  { key: 'chest', label: 'Peito', short: 'PEI', icon: 'body' },
  { key: 'back', label: 'Costas', short: 'COS', icon: 'body' },
  { key: 'legs', label: 'Pernas', short: 'PER', icon: 'walk' },
  { key: 'shoulders', label: 'Ombros', short: 'OMB', icon: 'body' },
  { key: 'arms', label: 'Braços', short: 'BRA', icon: 'barbell' },
  { key: 'core', label: 'Abdômen', short: 'ABD', icon: 'fitness' },
];

const SIZE = 220, CENTER = 110, RADIUS = 75, LEVELS = 5;

function polarToCartesian(index, value, total: any) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return { x: CENTER + (value / 100) * RADIUS * Math.cos(angle), y: CENTER + (value / 100) * RADIUS * Math.sin(angle) };
}

function getTrend(current, previous: any) {
  if (!previous) return null;
  const diff = current - previous;
  if (diff > 10) return { icon: '↑', color: COLORS.success, text: `+${diff}%` };
  if (diff < -10) return { icon: '↓', color: COLORS.error, text: `${diff}%` };
  return { icon: '→', color: COLORS.textMuted, text: '~0' };
}

function getBalanceScore(values: any) {
  const avg = values.reduce((s, v) => s + v.current, 0) / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v.current - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return Math.max(0, Math.min(100, Math.round(100 - stdDev)));
}

function getInsight(values: any) {
  const sorted = [...values].sort((a, b) => a.current - b.current);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  if (strongest.current - weakest.current > 40) {
    return `${weakest.label} precisa de mais atenção`;
  }
  return 'Equilíbrio adequado';
}

export default function MuscleRadarChart({ data = {}, previousData = null }) {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const pulseAnim = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    Animated.spring(animatedValue, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [animatedValue, pulseAnim]);

  const values = useMemo(() => GROUPS.map(g => ({
    ...g,
    current: Math.min(100, Math.max(0, data[g.key] || 0)),
    previous: previousData ? Math.min(100, Math.max(0, previousData[g.key] || 0)) : null,
  })), [data, previousData]);

  const currentPoints = values.map((v, i) => { const p = polarToCartesian(i, v.current, values.length); return `${p.x},${p.y}`; }).join(' ');
  const prevPoints = previousData ? values.map((v, i) => { const p = polarToCartesian(i, v.previous || 0, values.length); return `${p.x},${p.y}`; }).join(' ') : null;

  const balanceScore = getBalanceScore(values);
  const insight = getInsight(values);
  const maxVal = Math.max(...values.map(v => v.current));
  const minVal = Math.min(...values.map(v => v.current));

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.25],
    outputRange: [0.6, 0.1]
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>EQUILÍBRIO MUSCULAR</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{balanceScore}</Text>
            <Text style={styles.scoreLabel}>SCORE</Text>
          </View>
        </View>
        {previousData && <Text style={styles.subtitle}>vs. período anterior</Text>}
      </View>

      <View style={styles.chartRow}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <RadialGradient id="radarGrad" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.45" />
              <Stop offset="100%" stopColor={COLORS.surface} stopOpacity="0.0" />
            </RadialGradient>
            <Filter id="glow">
              <FeGaussianBlur stdDeviation="4" result="coloredBlur" />
              <FeMerge><FeMergeNode in="coloredBlur" /><FeMergeNode in="SourceGraphic" /></FeMerge>
            </Filter>
            <Filter id="softGlow">
              <FeGaussianBlur stdDeviation="2" result="blur" />
              <FeMerge><FeMergeNode in="blur" /><FeMergeNode in="SourceGraphic" /></FeMerge>
            </Filter>
          </Defs>
          <G>
            {Array.from({ length: LEVELS }, (_, i) => (
              <Circle key={i} cx={CENTER} cy={CENTER} r={(RADIUS / LEVELS) * (i + 1)} fill="none" stroke={COLORS.border} strokeWidth={1} opacity={0.3} />
            ))}
            {values.map((_, i) => {
              const p = polarToCartesian(i, 100, values.length);
              return <Line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke={COLORS.border} strokeWidth={1} opacity={0.3} />;
            })}
            {prevPoints && <Polygon points={prevPoints} fill={COLORS.textMuted + '10'} stroke={COLORS.textMuted} strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />}
            <AnimatedPolygon points={currentPoints} fill="url(#radarGrad)" stroke={COLORS.primary} strokeWidth={2.5} filter="url(#glow)" />
            {values.map((v, i) => {
              const p = polarToCartesian(i, v.current, values.length);
              const isMax = v.current === maxVal && v.current > 0;
              const isMin = v.current === minVal && v.current > 0;
              return (
                <G key={i}>
                  {isMax && (
                    <AnimatedCircle cx={p.x} cy={p.y} r={12} fill={COLORS.success} opacity={pulseOpacity} />
                  )}
                  <Circle cx={p.x} cy={p.y} r={isMax ? 7 : 5} fill={isMax ? COLORS.success : isMin ? COLORS.attention : COLORS.primary} stroke={COLORS.background} strokeWidth={2} filter="url(#softGlow)" />
                  {v.current > 0 && <SvgText x={p.x} y={p.y - 12} textAnchor="middle" fill={COLORS.textTitle} fontSize={8} fontFamily="Montserrat_700Bold">{v.current}%</SvgText>}
                </G>
              );
            })}
            {values.map((v, i) => {
              const lp = { x: CENTER + (RADIUS + 22) * Math.cos((Math.PI * 2 * i) / values.length - Math.PI / 2), y: CENTER + (RADIUS + 22) * Math.sin((Math.PI * 2 * i) / values.length - Math.PI / 2) };
              return <SvgText key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill={COLORS.textMuted} fontSize={9} fontFamily="Montserrat_700Bold">{v.short}</SvgText>;
            })}
          </G>
        </Svg>
      </View>

      <View style={styles.insightRow}>
        <Ionicons name="bulb" size={14} color={COLORS.attention} />
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      <View style={styles.legend}>
        {values.map(v => {
          const trend = getTrend(v.current, v.previous);
          const isMax = v.current === maxVal && v.current > 0;
          const isMin = v.current === minVal && v.current > 0;
          return (
            <View key={v.key} style={[styles.legendItem, isMax && styles.legendItemMax, isMin && styles.legendItemMin]}>
              <View style={[styles.dot, { backgroundColor: isMax ? COLORS.success : isMin ? COLORS.attention : COLORS.primary }]} />
              <Text style={styles.legendLabel}>{v.label}</Text>
              <Text style={[styles.legendValue, isMax && { color: COLORS.success }, isMin && { color: COLORS.attention }]}>{v.current}%</Text>
              {trend && <Text style={[styles.trend, { color: trend.color }]}>{trend.icon}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { marginBottom: SPACING.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  scoreBadge: { alignItems: 'center', backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  scoreText: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary },
  scoreLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 8, color: COLORS.primary, letterSpacing: 1 },
  chartRow: { alignItems: 'center', marginBottom: SPACING.sm },
  insightRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '10', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.md },
  insightText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, flex: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  legendItemMax: { backgroundColor: COLORS.success + '15' },
  legendItemMin: { backgroundColor: COLORS.attention + '15' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textDescription },
  legendValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textTitle },
  trend: { fontFamily: 'Montserrat_700Bold', fontSize: 10 },
});
