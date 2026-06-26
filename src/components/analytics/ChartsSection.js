import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORY_COLORS = {
  'Musculacao': '#CCFF00', 'Cardio': '#FF6B35', 'Calistenia': '#00E676',
  'Flexibilidade': '#FFD600', 'HIIT': '#FF1744', 'Outro': '#94A3B8',
};

const chartConfig = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted,
  style: { borderRadius: 16 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
};

function ChartCard({ title, subtitle, children }) {
  return (
    <View style={styles.chartCard}>
      <Text style={typography.h5}>{title}</Text>
      {subtitle && <Text style={typography.caption}>{subtitle}</Text>}
      {children}
    </View>
  );
}

export function FrequencyChart({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <ChartCard title="FREQUENCIA SEMANAL" subtitle="Treinos por semana">
      <BarChart data={{ labels: data.map(f => f.week), datasets: [{ data: data.map(f => f.count || 0) }] }} width={SCREEN_WIDTH - 80} height={200} chartConfig={chartConfig} style={styles.chart} showValuesOnTopOfBars fromZero />
    </ChartCard>
  );
}

export function CategoryChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <ChartCard title="TREINOS POR CATEGORIA" subtitle="Distribuicao dos seus treinos">
        <Text style={styles.emptyChart}>Sem dados para exibir</Text>
      </ChartCard>
    );
  }
  return (
    <ChartCard title="TREINOS POR CATEGORIA" subtitle="Distribuicao dos seus treinos">
      <PieChart data={Object.entries(data).map(([name, count]) => ({ name, population: count, color: CATEGORY_COLORS[name] || '#94A3B8', legendFontColor: COLORS.textSecondary, legendFontSize: 12 }))} width={SCREEN_WIDTH - 80} height={200} chartConfig={chartConfig} accessor="population" backgroundColor="transparent" paddingLeft="15" />
    </ChartCard>
  );
}

export function DayOfWeekChart({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <ChartCard title="TREINOS POR DIA" subtitle="Qual dia voce mais treina?">
      <BarChart data={{ labels: data.map(d => d.day), datasets: [{ data: data.map(d => d.count) }] }} width={SCREEN_WIDTH - 80} height={180} chartConfig={chartConfig} style={styles.chart} showValuesOnTopOfBars fromZero />
    </ChartCard>
  );
}

export function MonthlyChart({ data }) {
  if (!data || data.length <= 1) return null;
  return (
    <ChartCard title="EVOLUCAO MENSAL" subtitle="Treinos e minutos por mes">
      <LineChart data={{ labels: data.map(m => m.month), datasets: [{ data: data.map(m => m.workouts), color: () => COLORS.primary }, { data: data.map(m => Math.round(m.minutes / 10)), color: () => COLORS.success }], legend: ['Treinos', 'Minutos (x10)'] }} width={SCREEN_WIDTH - 80} height={220} chartConfig={chartConfig} style={styles.chart} bezier fromZero />
    </ChartCard>
  );
}

export function HourChart({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <ChartCard title="HORARIOS PREFERIDOS" subtitle="Quando voce treina?">
      <BarChart data={{ labels: data.slice(0, 8).map(h => h.hour), datasets: [{ data: data.slice(0, 8).map(h => h.count) }] }} width={SCREEN_WIDTH - 80} height={180} chartConfig={chartConfig} style={styles.chart} showValuesOnTopOfBars fromZero />
    </ChartCard>
  );
}

const styles = StyleSheet.create({
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chart: { marginTop: SPACING.md, borderRadius: 12 },
  emptyChart: { textAlign: 'center', color: COLORS.textMuted, paddingVertical: SPACING.xl },
});
