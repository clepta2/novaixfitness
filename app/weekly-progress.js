// app/weekly-progress.js
// Tela de Progresso Semanal - NOVAIX FITNESS

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const DAY_FULL = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

export default function WeeklyProgressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeekData() {
      if (!user?.id) return;

      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const [workoutsRes, profileRes] = await Promise.all([
        supabase
          .from('user_workouts')
          .select('completed, duration, completed_at, workouts(title, category)')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('completed_at', weekStart.toISOString())
          .lte('completed_at', weekEnd.toISOString()),
        supabase
          .from('profiles')
          .select('total_xp, total_workouts, max_streak')
          .eq('id', user.id)
          .single(),
      ]);

      const workouts = workoutsRes.data || [];
      const profile = profileRes.data || {};

      const byDay = Array(7).fill(null).map((_, i) => {
        const dayWorkouts = workouts.filter(w => {
          const d = new Date(w.completed_at);
          return d.getDay() === i;
        });
        return {
          day: DAY_NAMES[i],
          fullDay: DAY_FULL[i],
          count: dayWorkouts.length,
          minutes: dayWorkouts.reduce((s, w) => s + (w.duration || 0), 0),
          workouts: dayWorkouts.map(w => ({
            name: w.workouts?.title || 'Treino',
            category: w.workouts?.category || '',
            duration: w.duration || 0,
          })),
        };
      });

      const totalWorkouts = workouts.length;
      const totalMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0);
      const activeDays = byDay.filter(d => d.count > 0).length;
      const bestDay = byDay.reduce((best, d) => d.count > best.count ? d : best, byDay[0]);

      const categories = {};
      workouts.forEach(w => {
        const cat = w.workouts?.category || 'Outro';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      setWeekData({
        byDay,
        totalWorkouts,
        totalMinutes,
        activeDays,
        bestDay: bestDay.count > 0 ? bestDay : null,
        categories,
        totalXP: profile.total_xp || 0,
        globalWorkouts: profile.total_workouts || 0,
        streak: profile.max_streak || 0,
      });

      setLoading(false);
    }

    loadWeekData();
  }, [user?.id]);

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
    labelColor: () => COLORS.textMuted,
    barPercentage: 0.6,
  };

  const today = new Date().getDay();

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Progresso Semanal</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Resumo da semana */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <Text style={typography.h5}>RESUMO DA SEMANA</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weekData?.totalWorkouts || 0}</Text>
              <Text style={styles.summaryLabel}>Treinos</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weekData?.totalMinutes || 0}</Text>
              <Text style={styles.summaryLabel}>Minutos</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weekData?.activeDays || 0}/7</Text>
              <Text style={styles.summaryLabel}>Dias Ativos</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weekData?.totalXP || 0}</Text>
              <Text style={styles.summaryLabel}>XP Total</Text>
            </View>
          </View>
        </View>

        {/* Dias da semana */}
        <View style={styles.daysCard}>
          <Text style={typography.label}>DIAS DA SEMANA</Text>
          <View style={styles.daysGrid}>
            {weekData?.byDay?.map((day, i) => {
              const isToday = i === today;
              const hasWorkout = day.count > 0;
              return (
                <View key={i} style={[styles.dayItem, isToday && styles.dayToday]}>
                  <Text style={[styles.dayName, isToday && styles.dayNameToday]}>{day.day}</Text>
                  <View style={[styles.dayCircle, hasWorkout && styles.dayCircleActive]}>
                    {hasWorkout ? (
                      <Ionicons name="checkmark" size={16} color={COLORS.background} />
                    ) : (
                      <Text style={styles.dayEmpty}>-</Text>
                    )}
                  </View>
                  <Text style={styles.dayCount}>{day.count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Gráfico de barras */}
        {weekData?.byDay && (
          <View style={styles.chartCard}>
            <Text style={typography.label}>TREINOS POR DIA</Text>
            <BarChart
              data={{
                labels: weekData.byDay.map(d => d.day),
                datasets: [{ data: weekData.byDay.map(d => d.count) }],
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

        {/* Melhor dia */}
        {weekData?.bestDay && (
          <View style={styles.bestDayCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <View style={styles.bestDayInfo}>
              <Text style={typography.h5}>Melhor dia: {weekData.bestDay.fullDay}</Text>
              <Text style={typography.bodySmall}>{weekData.bestDay.count} treinos, {weekData.bestDay.minutes} minutos</Text>
            </View>
          </View>
        )}

        {/* Treinos por categoria */}
        {weekData?.categories && Object.keys(weekData.categories).length > 0 && (
          <View style={styles.categoriesCard}>
            <Text style={typography.label}>CATEGORIAS</Text>
            {Object.entries(weekData.categories).map(([cat, count]) => (
              <View key={cat} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{cat}</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryFill, { width: `${(count / weekData.totalWorkouts) * 100}%` }]} />
                </View>
                <Text style={styles.categoryCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Detalhes por dia */}
        <View style={styles.detailsSection}>
          <Text style={typography.label}>DETALHES POR DIA</Text>
          {weekData?.byDay?.filter(d => d.count > 0).map((day, i) => (
            <View key={i} style={styles.dayDetail}>
              <View style={styles.dayDetailHeader}>
                <Text style={typography.h5}>{day.fullDay}</Text>
                <Text style={typography.caption}>{day.count} treinos • {day.minutes} min</Text>
              </View>
              {day.workouts.map((w, j) => (
                <View key={j} style={styles.workoutRow}>
                  <Ionicons name="barbell" size={14} color={COLORS.primary} />
                  <Text style={styles.workoutName}>{w.name}</Text>
                  <Text style={styles.workoutDuration}>{w.duration}min</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Stats globais */}
        <View style={styles.globalCard}>
          <Text style={typography.label}>ESTATISTICAS GLOBAIS</Text>
          <View style={styles.globalRow}>
            <View style={styles.globalItem}>
              <Ionicons name="trophy" size={18} color={COLORS.primary} />
              <Text style={styles.globalValue}>{weekData?.globalWorkouts || 0}</Text>
              <Text style={styles.globalLabel}>Total Treinos</Text>
            </View>
            <View style={styles.globalItem}>
              <Ionicons name="flame" size={18} color={COLORS.primary} />
              <Text style={styles.globalValue}>{weekData?.streak || 0}</Text>
              <Text style={styles.globalLabel}>Melhor Streak</Text>
            </View>
            <View style={styles.globalItem}>
              <Ionicons name="star" size={18} color={COLORS.primary} />
              <Text style={styles.globalValue}>{weekData?.totalXP || 0}</Text>
              <Text style={styles.globalLabel}>XP Total</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  summaryCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  summaryGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  daysCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  daysGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md },
  dayItem: { alignItems: 'center', gap: 4 },
  dayToday: { transform: [{ scale: 1.1 }] },
  dayName: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  dayNameToday: { color: COLORS.primary, fontFamily: 'Montserrat_600SemiBold' },
  dayCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  dayCircleActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  dayEmpty: { color: COLORS.textMuted, fontSize: 12 },
  dayCount: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chart: { marginTop: SPACING.md, borderRadius: 12 },
  bestDayCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: '#FFD700' + '10', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: '#FFD700' + '30' },
  bestDayInfo: { flex: 1 },
  categoriesCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md },
  categoryName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, width: 80 },
  categoryBar: { flex: 1, height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden', marginHorizontal: SPACING.sm },
  categoryFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  categoryCount: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary, width: 30, textAlign: 'right' },
  detailsSection: { gap: SPACING.sm, marginBottom: SPACING.md },
  dayDetail: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  dayDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  workoutRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 4 },
  workoutName: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textSecondary },
  workoutDuration: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  globalCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  globalRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: SPACING.md },
  globalItem: { alignItems: 'center', gap: 4 },
  globalValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.primary },
  globalLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
