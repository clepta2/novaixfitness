// src/components/nutrition/MacroChart.js
// Gráfico circular de distribuição de macros - NOVAIX FITNESS

import React, { useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 140;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(macro) {
  const colors = { protein: COLORS.success, carbs: COLORS.primary, fat: COLORS.secondary };
  return colors[macro] || COLORS.textMuted;
}

function MacroChartInner({ protein = 0, carbs = 0, fat = 0 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, [protein, carbs, fat]);

  const total = protein + carbs + fat;
  if (total === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Registre refeições para ver o gráfico</Text>
      </View>
    );
  }

  const proteinPct = (protein / total) * 100;
  const carbsPct = (carbs / total) * 100;
  const fatPct = (fat / total) * 100;

  const proteinOffset = CIRCUMFERENCE;
  const carbsOffset = CIRCUMFERENCE - (proteinPct / 100) * CIRCUMFERENCE;
  const fatOffset = CIRCUMFERENCE - ((proteinPct + carbsPct) / 100) * CIRCUMFERENCE;

  const macros = [
    { label: 'Proteína', value: protein, pct: proteinPct, color: COLORS.success },
    { label: 'Carboidratos', value: carbs, pct: carbsPct, color: COLORS.primary },
    { label: 'Gordura', value: fat, pct: fatPct, color: COLORS.secondary },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DISTRIBUIÇÃO DE MACROS</Text>

      <View style={styles.chartRow}>
        <Svg width={SIZE} height={SIZE}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={COLORS.surfaceOverlay} strokeWidth={STROKE} />
          <AnimatedCircle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none" stroke={COLORS.success} strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={proteinOffset}
            strokeLinecap="round" transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
          <AnimatedCircle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none" stroke={COLORS.primary} strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={carbsOffset}
            strokeLinecap="round" transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
          <AnimatedCircle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none" stroke={COLORS.secondary} strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={fatOffset}
            strokeLinecap="round" transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
          <SvgText x={SIZE / 2} y={SIZE / 2 - 8} textAnchor="middle" fill={COLORS.textTitle} fontSize={20} fontFamily="Montserrat_800ExtraBold">{total}g</SvgText>
          <SvgText x={SIZE / 2} y={SIZE / 2 + 12} textAnchor="middle" fill={COLORS.textMuted} fontSize={10} fontFamily="Inter_400Regular">total</SvgText>
        </Svg>

        <View style={styles.legend}>
          {macros.map(m => (
            <View key={m.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: m.color }]} />
              <View style={styles.legendInfo}>
                <Text style={styles.legendLabel}>{m.label}</Text>
                <Text style={styles.legendValue}>{m.value}g ({Math.round(m.pct)}%)</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default memo(MacroChartInner);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  empty: { padding: SPACING.xxl, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xl },
  legend: { flex: 1, gap: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendInfo: { flex: 1 },
  legendLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  legendValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
});
