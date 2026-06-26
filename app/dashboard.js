// app/dashboard.js
// Dashboard Unificado de Progresso - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { getWorkoutAnalytics, getWorkoutFrequency, getMonthlyComparison, getWeightHistory } from '../src/services/analytics';
import { layout, typography } from '../src/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORY_COLORS = {
  'Musculacao': '#CCFF00', 'Cardio': '#FF6B35', 'Calistenia': '#00E676',
  'Flexibilidade': '#FFD600', 'HIIT': '#FF1744', 'Outro': '#94A3B8',
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [analytics, freq, monthly, weight, profile] = await Promise.all([
        getWorkoutAnalytics(user.id, 'month'),
        getWorkoutFrequency(user.id),
        getMonthlyComparison(user.id),
        getWeightHistory(user.id),
        supabase.from('profiles').select('total_xp, total_workouts, total_minutes, max_streak, physical_data').eq('id', user.id).single(),
      ]);

      setData({
        analytics, freq, monthly, weight,
        xp: profile.data?.total_xp || 0,
        totalWorkouts: profile.data?.total_workouts || 0,
        totalMinutes: profile.data?.total_minutes || 0,
        streak: profile.data?.max_streak || 0,
        height: profile.data?.physical_data?.height,
        weight: profile.data?.physical_data?.weight,
      });
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
    labelColor: () => COLORS.textMuted,
    style: { borderRadius: 12 },
    propsForDots: { r: '3', strokeWidth: '2', stroke: COLORS.primary },
  };

  const bmi = data?.weight && data?.height
    ? (data.weight / ((data.height / 100) ** 2)).toFixed(1) : null;

  return (
    <View style={layout.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Meu Progresso</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats principais */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/analytics')}>
            <Ionicons name="barbell" size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{data?.totalWorkouts || 0}</Text>
            <Text style={styles.statLabel}>Treinos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/analytics')}>
            <Ionicons name="time" size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{Math.round((data?.totalMinutes || 0) / 60)}h</Text>
            <Text style={styles.statLabel}>Tempo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/analytics')}>
            <Ionicons name="flame" size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{data?.streak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/analytics')}>
            <Ionicons name="star" size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{data?.xp || 0}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </TouchableOpacity>
        </View>

        {/* Frequencia semanal */}
        {data?.freq?.length > 0 && (
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/analytics')}>
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Frequencia Semanal</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <BarChart
              data={{ labels: data.freq.map(f => f.week), datasets: [{ data: data.freq.map(f => f.count || 0) }] }}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={chartConfig} style={styles.chart} fromZero showValuesOnTopOfBars
            />
          </TouchableOpacity>
        )}

        {/* Evolucao mensal */}
        {data?.monthly?.length > 1 && (
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/analytics')}>
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Evolucao Mensal</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <LineChart
              data={{
                labels: data.monthly.map(m => m.month),
                datasets: [{ data: data.monthly.map(m => m.workouts) }],
              }}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={chartConfig} style={styles.chart} bezier fromZero
            />
          </TouchableOpacity>
        )}

        {/* Peso */}
        {data?.weight?.length > 1 && (
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/body-measures')}>
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Evolucao do Peso</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <LineChart
              data={{
                labels: data.weight.map(w => w.date),
                datasets: [{ data: data.weight.map(w => w.weight) }],
              }}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})` }}
              style={styles.chart} bezier fromZero
            />
          </TouchableOpacity>
        )}

        {/* IMC */}
        {bmi && (
          <View style={styles.bmiCard}>
            <View style={styles.bmiLeft}>
              <Text style={typography.label}>IMC ATUAL</Text>
              <Text style={[styles.bmiValue, { color: parseFloat(bmi) < 25 ? COLORS.success : COLORS.attention }]}>{bmi}</Text>
            </View>
            <View style={styles.bmiRight}>
              <Text style={typography.caption}>Altura: {data.height}cm</Text>
              <Text style={typography.caption}>Peso: {data.weight}kg</Text>
              <TouchableOpacity onPress={() => router.push('/body-measures')}>
                <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Ver detalhes →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Acesso rapido */}
        <View style={styles.quickAccess}>
          <Text style={typography.label}>ACESSO RAPIDO</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: 'bar-chart', label: 'Analytics', route: '/analytics', color: COLORS.primary },
              { icon: 'calendar', label: 'Semanal', route: '/weekly-progress', color: '#00E676' },
              { icon: 'body', label: 'Medidas', route: '/body-measures', color: '#FF6B35' },
              { icon: 'camera', label: 'Fotos', route: '/progress-photos', color: '#FFD600' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.quickItem} onPress={() => router.push(item.route)}>
                <View style={[styles.quickIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={typography.caption}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary, marginTop: SPACING.xs },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  chart: { marginTop: SPACING.sm, borderRadius: 12 },
  bmiCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  bmiLeft: { flex: 1 },
  bmiValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36 },
  bmiRight: { alignItems: 'flex-end', gap: 4 },
  quickAccess: { marginBottom: SPACING.md },
  quickGrid: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  quickItem: { flex: 1, alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  quickIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
});
