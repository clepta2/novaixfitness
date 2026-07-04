import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { supabase } from '../../config/supabase';
import { FilterBar, getDateRange, PERIOD_FILTERS, WeekSummary, DayGrid, CategoryBars, DayDetails, GlobalStats } from '../index';
import { DAY_NAMES, DAY_FULL } from '../../data/filters';
import { Dimensions } from 'react-native';

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

interface DayData {
  workouts: number;
  minutes: number;
  categories: { [key: string]: number };
}

interface WeekData {
  byDay: { [key: number]: DayData };
  totalWorkouts: number;
  totalMinutes: number;
  avgPerDay: number;
}

interface ProgressWeeklyProps {
  userId?: string;
}

export default function ProgressWeekly({ userId }: ProgressWeeklyProps): React.JSX.Element {
  const [period, setPeriod] = useState<string>('week');
  const [weekData, setWeekData] = useState<WeekData | null>(null);

  useEffect(() => {
    async function loadWeekData(): Promise<void> {
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
      const byDay: { [key: number]: DayData } = {};
      DAY_NAMES.forEach((_: string, i: number) => { byDay[i] = { workouts: 0, minutes: 0, categories: {} }; });

      workouts.forEach((w: any) => {
        const d = new Date(w.completed_at);
        const dayIdx = (d.getDay() + 6) % 7;
        byDay[dayIdx].workouts++;
        byDay[dayIdx].minutes += w.duration || 0;
        const cat = w.workouts?.category || 'Outro';
        byDay[dayIdx].categories[cat] = (byDay[dayIdx].categories[cat] || 0) + 1;
      });

      const totalWorkouts = workouts.length;
      const totalMinutes = workouts.reduce((s: number, w: any) => s + (w.duration || 0), 0);
      const avgPerDay = totalWorkouts / 7;

      setWeekData({ byDay, totalWorkouts, totalMinutes, avgPerDay });
    }
    loadWeekData();
  }, [userId, period]);

  if (!weekData) {
    return <View style={styles.loading}><Text style={typography.bodyMuted}>Carregando...</Text></View>;
  }

  const chartData = {
    labels: DAY_NAMES.map((d: string) => d.substring(0, 2)),
    datasets: [{ data: DAY_NAMES.map((_: string, i: number) => weekData.byDay[i]?.minutes || 0) }],
  };

  return (
    <View>
      <FilterBar selected={period} onSelect={setPeriod} filters={PERIOD_FILTERS} style={{}} />

      <GlobalStats totalWorkouts={weekData.totalWorkouts} />

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
            showValuesOnTopOfBars={true}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>
      </View>

      <WeekSummary data={{ totalWorkouts: weekData.totalWorkouts, totalMinutes: weekData.totalMinutes }} />
      <DayGrid byDay={Object.entries(weekData.byDay).map(([key, val]: [string, any]) => ({ day: DAY_NAMES[Number(key)], count: val.workouts }))} />
      <CategoryBars categories={Object.values(weekData.byDay).reduce((acc: any, val: any) => { Object.entries(val.categories).forEach(([k, v]: [string, any]) => { acc[k] = (acc[k] || 0) + v; }); return acc; }, {})} total={weekData.totalWorkouts} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', paddingVertical: SPACING.xl * 2 },
  section: { marginBottom: SPACING.xl },
  chartContainer: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.md },
  chart: { borderRadius: BORDER_RADIUS.md },
});
