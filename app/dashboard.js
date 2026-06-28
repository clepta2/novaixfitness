// app/dashboard.js
// Dashboard Unificado de Progresso - NOVAIX FITNESS

import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { getWorkoutAnalytics, getWorkoutFrequency, getMonthlyComparison, getWeightHistory, calculateMuscleBalance } from '../src/services/analytics';
import { layout, typography } from '../src/styles';
import { DashboardStats, MuscleRadarChart } from '../src/components';
import { shareProgress } from '../src/services/share';
import { styles } from '../src/styles/dashboardStyles';
import WeeklySummary from '../src/components/dashboard/WeeklySummary';
import QuickAccessGrid from '../src/components/dashboard/QuickAccessGrid';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const chartConfig = {
  backgroundColor: COLORS.surface, backgroundGradientFrom: COLORS.surface, backgroundGradientTo: COLORS.surface,
  decimalPlaces: 1, color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted, style: { borderRadius: 12 },
  propsForDots: { r: '3', strokeWidth: '2', stroke: COLORS.primary },
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [analytics, freq, monthly, weight, profile, recentWorkouts, prevWorkouts, weekWorkouts] = await Promise.all([
        getWorkoutAnalytics(user.id, 'month'),
        getWorkoutFrequency(user.id),
        getMonthlyComparison(user.id),
        getWeightHistory(user.id),
        supabase.from('profiles').select('total_xp, total_workouts, total_minutes, max_streak, physical_data').eq('id', user.id).single(),
        supabase.from('user_workouts').select('workouts(category), completed_at').eq('user_id', user.id).gte('completed_at', thirtyDaysAgo).order('completed_at', { ascending: false }),
        supabase.from('user_workouts').select('workouts(category)').eq('user_id', user.id).gte('completed_at', sixtyDaysAgo).lt('completed_at', thirtyDaysAgo),
        supabase.from('user_workouts').select('duration').eq('user_id', user.id).gte('completed_at', weekAgo),
      ]);

      const p = profile.data || {};
      const weekData = weekWorkouts.data || [];

      setData({
        analytics, freq, monthly, weightHistory: weight,
        muscleBalance: calculateMuscleBalance(recentWorkouts.data || []),
        prevMuscleBalance: calculateMuscleBalance(prevWorkouts.data || []),
        xp: p.total_xp || 0, totalWorkouts: p.total_workouts || 0, totalMinutes: p.total_minutes || 0,
        streak: p.max_streak || 0, height: p.physical_data?.height, weight: p.physical_data?.weight,
        recentWorkouts: recentWorkouts.data || [],
        weekWorkouts: weekData.length,
        weekMinutes: weekData.reduce((s, w) => s + (w.duration || 0), 0),
        weekCalories: Math.round(weekData.reduce((s, w) => s + (w.duration || 0), 0) * 8),
      });
    } catch (err) { if (__DEV__) console.error('Erro ao carregar dashboard:', err); }
    finally { setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const bmi = useMemo(() => {
    return data?.weight && data?.height ? (data.weight / ((data.height / 100) ** 2)).toFixed(1) : null;
  }, [data?.weight, data?.height]);

  const freqChartData = useMemo(() => {
    return data?.freq?.length > 0 ? { labels: data.freq.map(f => f.week), datasets: [{ data: data.freq.map(f => f.count || 0) }] } : null;
  }, [data?.freq]);

  const monthlyChartData = useMemo(() => {
    return data?.monthly?.length > 1 ? { labels: data.monthly.map(m => m.month), datasets: [{ data: data.monthly.map(m => m.workouts) }] } : null;
  }, [data?.monthly]);

  const weightChartData = useMemo(() => {
    return data?.weightHistory?.length > 1 ? { labels: data.weightHistory.map(w => w.date), datasets: [{ data: data.weightHistory.map(w => w.weight) }] } : null;
  }, [data?.weightHistory]);

  return (
    <View style={layout.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadData(); }} tintColor={COLORS.primary} />}
      >
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Meu Progresso</Text>
          <TouchableOpacity onPress={() => shareProgress({ streak: data?.streak || 0, totalWorkouts: data?.totalWorkouts || 0, totalMinutes: data?.totalMinutes || 0 })}>
            <Ionicons name="share-social" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <DashboardStats data={data} onPress={() => router.push('/analytics')} />

        <WeeklySummary
          weekWorkouts={data?.weekWorkouts || 0}
          weekMinutes={data?.weekMinutes || 0}
          weekCalories={data?.weekCalories || 0}
          recentWorkouts={data?.recentWorkouts || []}
        />

        {freqChartData && (
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/analytics')}>
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Frequência Semanal</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <BarChart
              data={freqChartData}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={chartConfig} style={styles.chart} fromZero showValuesOnTopOfBars
            />
          </TouchableOpacity>
        )}

        {data?.muscleBalance && <MuscleRadarChart data={data.muscleBalance} previousData={data.prevMuscleBalance} />}

        {monthlyChartData && (
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/analytics')}>
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Evolução Mensal</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <LineChart
              data={monthlyChartData}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={chartConfig} style={styles.chart} bezier fromZero
            />
          </TouchableOpacity>
        )}

        {weightChartData && (
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/body-measures')}>
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Evolução do Peso</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <LineChart
              data={weightChartData}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})` }}
              style={styles.chart} bezier fromZero
            />
          </TouchableOpacity>
        )}

        {bmi && (
          <TouchableOpacity style={styles.bmiCard} onPress={() => router.push('/body-measures')}>
            <View style={styles.bmiLeft}>
              <Text style={styles.bmiTitle}>IMC ATUAL</Text>
              <Text style={[styles.bmiValue, { color: parseFloat(bmi) < 25 ? COLORS.success : COLORS.attention }]}>{bmi}</Text>
            </View>
            <View style={styles.bmiRight}>
              <Text style={typography.caption}>Altura: {data.height}cm</Text>
              <Text style={typography.caption}>Peso: {data.weight}kg</Text>
              <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Ver detalhes →</Text>
            </View>
          </TouchableOpacity>
        )}

        <QuickAccessGrid router={router} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}
