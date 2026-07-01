// src/components/progress/MeasurementChart.tsx
// Gráfico de medidas animado - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MEASUREMENT_TYPES = [
  { key: 'weight', label: 'Peso', icon: 'scale', unit: 'kg' },
  { key: 'bodyFat', label: 'Gordura', icon: 'water', unit: '%' },
  { key: 'chest', label: 'Peito', icon: 'body', unit: 'cm' },
  { key: 'waist', label: 'Cintura', icon: 'resize', unit: 'cm' },
  { key: 'hip', label: 'Quadril', icon: 'body', unit: 'cm' },
  { key: 'arm', label: 'Braço', icon: 'barbell', unit: 'cm' },
];

const chartConfig = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted,
  style: { borderRadius: 12 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
};

interface ChartDataPoint {
  date: string;
  value: number;
}

interface MeasurementChartProps {
  selectedChart: string;
  onSelectChart: (chart: string) => void;
  chartData?: ChartDataPoint[];
}

export default function MeasurementChart({ selectedChart, onSelectChart, chartData }: MeasurementChartProps): React.JSX.Element {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [selectedChart]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.selector}>
        {MEASUREMENT_TYPES.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.btn, selectedChart === m.key && styles.btnActive]}
            onPress={() => onSelectChart(m.key)}
          >
            <Ionicons name={m.icon as any} size={14} color={selectedChart === m.key ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.btnText, selectedChart === m.key && styles.btnTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {chartData && chartData.length > 1 ? (
        <View style={styles.chartCard}>
          <LineChart
            data={{ labels: chartData.map((d: ChartDataPoint) => d.date), datasets: [{ data: chartData.map((d: ChartDataPoint) => d.value) }] }}
            width={SCREEN_WIDTH - 80} height={200}
            chartConfig={chartConfig} bezier fromZero
          />
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Ionicons name="analytics-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Registre mais medidas para ver o gráfico</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  selector: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  btnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  btnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  btnTextActive: { color: COLORS.background },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  emptyChart: { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
});
