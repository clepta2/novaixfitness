import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { supabase } from '../../config/supabase';
import { FilterBar, getDateRange, PERIOD_FILTERS, WeekSummary, DayGrid, CategoryBars, DayDetails, GlobalStats } from '../index';
import { DAY_NAMES, DAY_FULL } from '../../data/filters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const chartConfig = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted,
  barPercentage: 0.6,
};

export default function ProgressWeekly({ userId }) {
  const [period, setPeriod] = useState('week');
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    async function loadWeekData() {
      if (!userId) return;
      const { start, end } = getDateRange(period);

      const [workoutsRes, profileRes] = await Promise.all([
        supabase.from('user_workouts')
          .select('completed, duration, completed_at, workouts(title, category)')
          .eq('user_id', userId).eq('completed', true)
          .gte('completed_at', start).lte('completed_at', end)
          .order('completed_at', { ascending: true }),
        supabase.from('profiles').select('physical_data, onboarding').eq('id', userId).single(),
      ]);

      const workouts = workoutsRes.data || [];
      const byDay = {};
      DAY_NAMES.forEach((_, i) => { byDay[i] = { workouts: 0, minutes: 0, categories: {} }; });

      workouts.forEach(w => {
        const d = new Date(w.completed_at);
        const dayIdx = (d.getDay() + 6) % 7;
        byDay[dayIdx].workouts++;
        byDay[dayIdx].minutes += w.duration || 0;
        const cat = w.workouts?.category || 'Outro';
        byDay[dayIdx].categories[cat] = (byDay[dayIdx].categories[cat] || 0) + 1;
      });

      const totalWorkouts = workouts.length;
      const totalMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0);
      const avgPerDay = totalWorkouts / 7;

      setWeekData({ byDay, totalWorkouts, totalMinutes, avgPerDay });
    }
    loadWeekData();
  }, [userId, period]);

  if (!weekData) {
    return <View style={styles.loading}><Text style={typography.bodyMuted}>Carregando...</Text></View>;
  }

  const chartData = {
    labels: DAY_NAMES.map(d => d.substring(0, 2)),
    datasets: [{ data: DAY_NAMES.map((_, i) => weekData.byDay[i]?.minutes || 0) }],
  };

  return (
    <View>
      <FilterBar selected={period} onSelect={setPeriod} filters={PERIOD_FILTERS} />

      <GlobalStats totalWorkouts={weekData.totalWorkouts} totalMinutes={weekData.totalMinutes} avgPerDay={weekData.avgPerDay} />

      <View style={styles.section}>
        <Text style={typography.label}>MINUTOS POR DIA</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={SCREEN_WIDTH - SPACING.xl * 2}
            height={180}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showBarTops={false}
            showValuesOnTopOfBars
          />
        </View>
      </View>

      <WeekSummary weekData={weekData} />
      <DayGrid weekData={weekData.byDay} />
      <CategoryBars weekData={weekData.byDay} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', paddingVertical: SPACING.xl * 2 },
  section: { marginBottom: SPACING.xl },
  chartContainer: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.md },
  chart: { borderRadius: BORDER_RADIUS.md },
});
