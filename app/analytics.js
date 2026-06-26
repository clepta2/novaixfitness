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
import { getWorkoutAnalytics, getWorkoutFrequency } from '../src/services/analytics';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [data, freq] = await Promise.all([
          getWorkoutAnalytics(user.id, period),
          getWorkoutFrequency(user.id),
        ]);
        setAnalytics(data);
        setFrequency(freq);
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

  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  };

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

        <View style={styles.chartCard}>
          <Text style={typography.h5}>FREQUENCIA SEMANAL</Text>
          <Text style={typography.caption}>Treinos por semana nos ultimos 12 meses</Text>
          {frequency.length > 0 && (
            <BarChart
              data={{
                labels: frequency.map(f => f.week),
                datasets: [{ data: frequency.map(f => f.count) }],
              }}
              width={SCREEN_WIDTH - 80}
              height={200}
              chartConfig={barChartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={typography.h5}>TREINOS POR CATEGORIA</Text>
          <Text style={typography.caption}>Distribuicao dos seus treinos</Text>
          {analytics?.byCategory && Object.keys(analytics.byCategory).length > 0 && (
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
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={typography.h5}>EVOLUCAO MENSAL</Text>
          <Text style={typography.caption}>Progresso ao longo do tempo</Text>
          {analytics?.byMonth && analytics.byMonth.length > 1 && (
            <LineChart
              data={{
                labels: analytics.byMonth.map(m => m.date.split('-')[1]),
                datasets: [{ data: analytics.byMonth.map(m => m.count) }],
              }}
              width={SCREEN_WIDTH - 80}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
              fromZero
            />
          )}
        </View>
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
});
