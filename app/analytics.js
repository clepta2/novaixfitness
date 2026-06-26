// app/analytics.js
// Tela de Analytics e Graficos - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { getWorkoutAnalytics, getWorkoutFrequency, getMonthlyComparison } from '../src/services/analytics';
import { layout, typography } from '../src/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PERIODS = [
  { key: 'week', label: '7 dias' },
  { key: 'month', label: '1 mes' },
  { key: 'quarter', label: '3 meses' },
  { key: 'year', label: '1 ano' },
];

const CATEGORY_COLORS = {
  'Musculacao': '#CCFF00',
  'Cardio': '#FF6B35',
  'Calistenia': '#00E676',
  'Flexibilidade': '#FFD600',
  'HIIT': '#FF1744',
  'Outro': '#94A3B8',
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [frequency, setFrequency] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [data, freq, monthly] = await Promise.all([
          getWorkoutAnalytics(user.id, period),
          getWorkoutFrequency(user.id),
          getMonthlyComparison(user.id),
        ]);
        setAnalytics(data);
        setFrequency(freq);
        setMonthlyData(monthly);
      } catch (err) {
        console.error('Erro ao carregar analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id, period]);

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

  const comp = analytics?.comparison;

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Analytics</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.periodSelector}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.periodBtn, period === p.key && styles.periodActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[typography.bodySmall, period === p.key && styles.periodTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comparacao com periodo anterior */}
        {comp && (
          <View style={[styles.chartCard, comp.pctChange >= 0 ? styles.positiveCard : styles.negativeCard]}>
            <View style={styles.comparisonRow}>
              <View>
                <Text style={typography.caption}>Vs. periodo anterior</Text>
                <Text style={[styles.comparisonValue, { color: comp.pctChange >= 0 ? COLORS.success : COLORS.error }]}>
                  {comp.pctChange >= 0 ? '+' : ''}{comp.pctChange}%
                </Text>
              </View>
              <View style={styles.comparisonDetails}>
                <Text style={typography.bodySmall}>{comp.workouts >= 0 ? '+' : ''}{comp.workouts} treinos</Text>
                <Text style={typography.bodySmall}>{comp.minutes >= 0 ? '+' : ''}{comp.minutes} min</Text>
              </View>
            </View>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="barbell" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{analytics?.totalWorkouts || 0}</Text>
            <Text style={styles.statLabel}>Treinos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{analytics?.totalMinutes || 0}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="speedometer" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{analytics?.avgDuration || 0}</Text>
            <Text style={styles.statLabel}>Media (min)</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{analytics?.streak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Melhor dia/hora */}
        {analytics?.bestDay && (
          <View style={styles.insightsRow}>
            <View style={styles.insightCard}>
              <Ionicons name="calendar" size={18} color={COLORS.primary} />
              <Text style={styles.insightLabel}>Melhor dia</Text>
              <Text style={styles.insightValue}>{analytics.bestDay}</Text>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="time" size={18} color={COLORS.primary} />
              <Text style={styles.insightLabel}>Melhor horario</Text>
              <Text style={styles.insightValue}>{analytics.bestHour}</Text>
            </View>
          </View>
        )}

        {/* Grafico de barras - frequencia semanal */}
        <View style={styles.chartCard}>
          <Text style={typography.h5}>FREQUENCIA SEMANAL</Text>
          <Text style={typography.caption}>Treinos por semana</Text>
          {frequency.length > 0 && (
            <BarChart
              data={{
                labels: frequency.map(f => f.week),
                datasets: [{ data: frequency.map(f => f.count || 0) }],
              }}
              width={SCREEN_WIDTH - 80}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          )}
        </View>

        {/* Grafico de pizza - categorias */}
        <View style={styles.chartCard}>
          <Text style={typography.h5}>TREINOS POR CATEGORIA</Text>
          <Text style={typography.caption}>Distribuicao dos seus treinos</Text>
          {analytics?.byCategory && Object.keys(analytics.byCategory).length > 0 ? (
            <PieChart
              data={Object.entries(analytics.byCategory).map(([name, count]) => ({
                name,
                population: count,
                color: CATEGORY_COLORS[name] || '#94A3B8',
                legendFontColor: COLORS.textSecondary,
                legendFontSize: 12,
              }))}
              width={SCREEN_WIDTH - 80}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          ) : (
            <Text style={styles.emptyChart}>Sem dados para exibir</Text>
          )}
        </View>

        {/* Grafico de barras - melhor dia da semana */}
        {analytics?.byDayOfWeek?.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={typography.h5}>TREINOS POR DIA</Text>
            <Text style={typography.caption}>Qual dia voce mais treina?</Text>
            <BarChart
              data={{
                labels: analytics.byDayOfWeek.map(d => d.day),
                datasets: [{ data: analytics.byDayOfWeek.map(d => d.count) }],
              }}
              width={SCREEN_WIDTH - 80}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          </View>
        )}

        {/* Grafico de linha - evolucao mensal */}
        {monthlyData.length > 1 && (
          <View style={styles.chartCard}>
            <Text style={typography.h5}>EVOLUCAO MENSAL</Text>
            <Text style={typography.caption}>Treinos e minutos por mes</Text>
            <LineChart
              data={{
                labels: monthlyData.map(m => m.month),
                datasets: [
                  { data: monthlyData.map(m => m.workouts), color: () => COLORS.primary },
                  { data: monthlyData.map(m => Math.round(m.minutes / 10)), color: () => COLORS.success },
                ],
                legend: ['Treinos', 'Minutos (x10)'],
              }}
              width={SCREEN_WIDTH - 80}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
              fromZero
            />
          </View>
        )}

        {/* Horarios preferidos */}
        {analytics?.byHour?.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={typography.h5}>HORARIOS PREFERIDOS</Text>
            <Text style={typography.caption}>Quando voce treina?</Text>
            <BarChart
              data={{
                labels: analytics.byHour.slice(0, 8).map(h => h.hour),
                datasets: [{ data: analytics.byHour.slice(0, 8).map(h => h.count) }],
              }}
              width={SCREEN_WIDTH - 80}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  periodSelector: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  periodBtn: { flex: 1, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  periodActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary, marginTop: SPACING.sm },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chart: { marginTop: SPACING.md, borderRadius: 12 },
  emptyChart: { textAlign: 'center', color: COLORS.textMuted, paddingVertical: SPACING.xl },
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  comparisonValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32 },
  comparisonDetails: { alignItems: 'flex-end' },
  positiveCard: { borderColor: COLORS.success + '40' },
  negativeCard: { borderColor: COLORS.error + '40' },
  insightsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  insightCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  insightLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  insightValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary },
});
