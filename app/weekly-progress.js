import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import {
  FilterBar,
  getDateRange,
  PERIOD_FILTERS,
  WeekSummary,
  DayGrid,
  CategoryBars,
  DayDetails,
  GlobalStats
} from '../src/components';
import { DAY_NAMES, DAY_FULL } from '../src/data/filters';

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

export default function WeeklyProgressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [period, setPeriod] = useState('week');
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    async function loadWeekData() {
      if (!user?.id) return;
      const { start, end } = getDateRange(period);

      const [workoutsRes, profileRes] = await Promise.all([
        supabase.from('user_workouts')
          .select('completed, duration, completed_at, workouts(title, category)')
          .eq('user_id', user.id).eq('completed', true)
          .gte('completed_at', start)
          .lte('completed_at', end),
        supabase.from('profiles')
          .select('total_xp, total_workouts, max_streak')
          .eq('id', user.id).single(),
      ]);

      const workouts = workoutsRes.data || [];
      const profile = profileRes.data || {};
      
      const filter = PERIOD_FILTERS.find(p => p.key === period) || PERIOD_FILTERS[1];
      const totalDays = filter.days;

      let byDay = [];
      if (totalDays <= 7) {
        byDay = Array(totalDays).fill(null).map((_, i) => {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          const dayStart = new Date(d);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(d);
          dayEnd.setHours(23, 59, 59, 999);

          const dayWorkouts = workouts.filter(w => {
            const date = new Date(w.completed_at);
            return date >= dayStart && date <= dayEnd;
          });

          const dayIndex = d.getDay();
          return {
            day: totalDays === 1 ? 'Hoje' : DAY_NAMES[dayIndex],
            fullDay: totalDays === 1 ? 'Hoje' : DAY_FULL[dayIndex],
            count: dayWorkouts.length,
            minutes: dayWorkouts.reduce((s, w) => s + (w.duration || 0), 0),
            workouts: dayWorkouts.map(w => ({
              name: w.workouts?.title || 'Treino',
              category: w.workouts?.category || '',
              duration: w.duration || 0,
            })),
          };
        });
      } else {
        const dayMap = {};
        workouts.forEach(w => {
          const dateStr = new Date(w.completed_at).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
          if (!dayMap[dateStr]) {
            dayMap[dateStr] = {
              day: new Date(w.completed_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
              fullDay: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
              count: 0,
              minutes: 0,
              workouts: [],
              timestamp: new Date(w.completed_at).getTime()
            };
          }
          dayMap[dateStr].count += 1;
          dayMap[dateStr].minutes += w.duration || 0;
          dayMap[dateStr].workouts.push({
            name: w.workouts?.title || 'Treino',
            category: w.workouts?.category || '',
            duration: w.duration || 0,
          });
        });
        byDay = Object.values(dayMap).sort((a, b) => b.timestamp - a.timestamp);
      }

      const categories = {};
      workouts.forEach(w => {
        const cat = w.workouts?.category || 'Outro';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      const bestDay = byDay.reduce((best, d) => d.count > best.count ? d : best, byDay[0] || { count: 0 });
      
      // Calculate active days from all workouts in period
      const activeDaysSet = new Set(workouts.map(w => new Date(w.completed_at).toDateString()));

      setWeekData({
        byDay,
        totalWorkouts: workouts.length,
        totalMinutes: workouts.reduce((s, w) => s + (w.duration || 0), 0),
        activeDays: activeDaysSet.size,
        totalDays,
        bestDay: bestDay.count > 0 ? bestDay : null,
        categories,
        totalXP: profile.total_xp || 0,
        globalWorkouts: profile.total_workouts || 0,
        streak: profile.max_streak || 0,
      });
    }
    loadWeekData();
  }, [user?.id, period]);

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Progresso</Text>
          <View style={{ width: 24 }} />
        </View>

        <FilterBar selected={period} onSelect={setPeriod} style={{ marginBottom: SPACING.md }} />

        <WeekSummary data={weekData} />

        {period === 'week' && <DayGrid byDay={weekData?.byDay} />}

        {period === 'week' && weekData?.byDay && (
          <View style={styles.chartCard}>
            <Text style={typography.label}>TREINOS POR DIA</Text>
            <BarChart
              data={{ labels: weekData.byDay.map(d => d.day), datasets: [{ data: weekData.byDay.map(d => d.count) }] }}
              width={SCREEN_WIDTH - 80} height={180}
              chartConfig={chartConfig} style={styles.chart}
              showValuesOnTopOfBars fromZero
            />
          </View>
        )}

        {weekData?.bestDay && (
          <View style={styles.bestDayCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <View style={styles.bestDayInfo}>
              <Text style={typography.h5}>Melhor dia: {weekData.bestDay.fullDay}</Text>
              <Text style={typography.bodySmall}>{weekData.bestDay.count} treinos, {weekData.bestDay.minutes} minutos</Text>
            </View>
          </View>
        )}

        <CategoryBars categories={weekData?.categories} total={weekData?.totalWorkouts} />
        <DayDetails byDay={weekData?.byDay} />
        <GlobalStats totalWorkouts={weekData?.globalWorkouts} streak={weekData?.streak} totalXP={weekData?.totalXP} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chart: { marginTop: SPACING.md, borderRadius: BORDER_RADIUS.md },
  bestDayCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.attentionBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.attention + '30' },
  bestDayInfo: { flex: 1 },
});
