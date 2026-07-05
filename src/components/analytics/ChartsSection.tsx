// src/components/analytics/ChartsSection.js
// Seção de gráficos animada - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { CATEGORY_COLORS } from '../../constants/categoryColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const chartConfig = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted,
  style: { borderRadius: 12 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
};

function ChartCard({ title, subtitle, children, onPress, icon }: { title: string; subtitle?: string; children: React.ReactNode; onPress?: () => void; icon?: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <TouchableOpacity style={[styles.chartCard, { opacity: fadeAnim }]} onPress={onPress} activeOpacity={onPress ? 0.8 : 1} accessibilityLabel={title} accessibilityRole={onPress ? 'button' : undefined} accessibilityHint={onPress ? 'Expande o gráfico' : undefined}>
      <View style={styles.chartHeader}>
        <View style={styles.chartHeaderLeft}>
          {icon && <Ionicons name={icon as any} size={16} color={COLORS.primary} />}
          <Text style={styles.chartTitle}>{title}</Text>
        </View>
        {subtitle && <Text style={styles.chartSubtitle}>{subtitle}</Text>}
        {onPress && <Ionicons name="expand-outline" size={16} color={COLORS.textMuted} />}
      </View>
      {children}
    </TouchableOpacity>
  );
}

export function FrequencyChart({ data, onPress }) {
  if (!data || data.length === 0) return null;
  return (
    <ChartCard title="FREQÜÊNCIA SEMANAL" subtitle="Treinos por semana" icon="calendar" onPress={onPress}>
      <BarChart data={{ labels: data.map(f => f.week), datasets: [{ data: data.map(f => f.count || 0) }] }} width={SCREEN_WIDTH - 80} height={180} chartConfig={chartConfig} showValuesOnTopOfBars fromZero yAxisLabel="" yAxisSuffix="" {...{} as any} />
    </ChartCard>
  );
}

export function CategoryChart({ data, onPress }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <ChartCard title="TREINOS POR CATEGORIA" icon="pie-chart" subtitle="" onPress={undefined}>
        <View style={styles.emptyChart}>
          <Ionicons name="pie-chart-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Sem dados</Text>
        </View>
      </ChartCard>
    );
  }
  return (
    <ChartCard title="TREINOS POR CATEGORIA" icon="pie-chart" subtitle="" onPress={onPress}>
      <PieChart data={Object.entries(data).map(([name, count]) => ({ name, population: count, color: CATEGORY_COLORS[name] || COLORS.textDescription, legendFontColor: COLORS.textMuted, legendFontSize: 11 }))} width={SCREEN_WIDTH - 80} height={180} chartConfig={chartConfig} accessor="population" backgroundColor="transparent" paddingLeft="15" />
    </ChartCard>
  );
}

export function DayOfWeekChart({ data, onPress }) {
  if (!data || data.length === 0) return null;
  return (
    <ChartCard title="TREINOS POR DIA" subtitle="Qual dia você mais treina?" icon="calendar-outline" onPress={onPress}>
      <BarChart data={{ labels: data.map(d => d.day), datasets: [{ data: data.map(d => d.count) }] }} width={SCREEN_WIDTH - 80} height={160} chartConfig={chartConfig} showValuesOnTopOfBars fromZero yAxisLabel="" yAxisSuffix="" {...{} as any} />
    </ChartCard>
  );
}

export function MonthlyChart({ data, onPress }) {
  if (!data || data.length <= 1) return null;
  return (
    <ChartCard title="EVOLUÇÃO MENSAL" subtitle="Treinos e minutos por mês" icon="trending-up" onPress={onPress}>
      <LineChart data={{ labels: data.map(m => m.month), datasets: [{ data: data.map(m => m.workouts), color: () => COLORS.primary }, { data: data.map(m => Math.round(m.minutes / 10)), color: () => COLORS.success }], legend: ['Treinos', 'Minutos (x10)'] }} width={SCREEN_WIDTH - 80} height={200} chartConfig={chartConfig} bezier fromZero />
    </ChartCard>
  );
}

export function HourChart({ data, onPress }) {
  if (!data || data.length === 0) return null;
  return (
    <ChartCard title="HORÁRIOS PREFERIDOS" subtitle="Quando você treina?" icon="time" onPress={onPress}>
      <BarChart data={{ labels: data.slice(0, 8).map(h => h.hour), datasets: [{ data: data.slice(0, 8).map(h => h.count) }] }} width={SCREEN_WIDTH - 80} height={160} chartConfig={chartConfig} showValuesOnTopOfBars fromZero yAxisLabel="" yAxisSuffix="" {...{} as any} />
    </ChartCard>
  );
}

const styles = StyleSheet.create({
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  chartHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  chartTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 0.5 },
  chartSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  emptyChart: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.sm },
});
