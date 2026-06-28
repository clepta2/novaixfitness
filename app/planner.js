// app/planner.js
// Tela de planejamento semanal - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import { WeekCalendar } from '../src/components/planner';
import { defaultWeekPlan, DAY_NAMES_FULL, DAY_KEYS, CATEGORY_COLORS } from '../src/data/weekPlan';

export default function PlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [weekPlan, setWeekPlan] = useState(defaultWeekPlan);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    async function loadPlan() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('user_week_plans')
          .select('plan_data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.plan_data) setWeekPlan(data.plan_data);
      } catch (err) { if (__DEV__) console.error('Erro ao carregar plano:', err); }
    }
    loadPlan();
  }, [user?.id]);

  const todayKey = DAY_KEYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayPlan = weekPlan[todayKey];
  const totalWorkouts = DAY_KEYS.filter((k) => !weekPlan[k]?.isRest).length;
  const totalMinutes = DAY_KEYS.reduce((sum, k) => sum + (weekPlan[k]?.duration || 0), 0);

  const handleDayPress = useCallback((key, data) => {
    setSelectedDay(key === selectedDay ? null : key);
    if (data?.workoutId) {
      router.push({ pathname: '/workout-detail', params: { id: data.workoutId } });
    }
  }, [selectedDay, router]);

  const selectedData = selectedDay ? weekPlan[selectedDay] : null;

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>PLANEJADOR</Text>
          <View style={{ width: 24 }} />
        </View>

        <WeekCalendar weekPlan={weekPlan} onDayPress={handleDayPress} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Treinos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{7 - totalWorkouts}</Text>
            <Text style={styles.statLabel}>Descansos</Text>
          </View>
        </View>

        {selectedData && !selectedData.isRest ? (
          <View style={styles.detailCard}>
            <Text style={typography.label}>{DAY_NAMES_FULL[DAY_KEYS.indexOf(selectedDay)]}</Text>
            <Text style={styles.detailName}>{selectedData.workoutName}</Text>
            <View style={styles.detailMeta}>
              <View style={styles.detailChip}>
                <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                <Text style={styles.detailChipText}>{selectedData.duration} min</Text>
              </View>
              {selectedData.category && (
                <View style={[styles.detailChip, { borderColor: CATEGORY_COLORS[selectedData.category] + '40' }]}>
                  <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[selectedData.category] }]} />
                  <Text style={styles.detailChipText}>{selectedData.category}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => router.push({ pathname: '/workout-detail', params: { id: selectedData.workoutId } })}
            >
              <Ionicons name="play" size={18} color={COLORS.background} />
              <Text style={styles.startBtnText}>INICIAR TREINO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.todayCard}>
            <Text style={typography.label}>HOJE</Text>
            {todayPlan && !todayPlan.isRest ? (
              <>
                <Text style={styles.todayWorkoutName}>{todayPlan.workoutName}</Text>
                <View style={styles.detailMeta}>
                  <View style={styles.detailChip}>
                    <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.detailChipText}>{todayPlan.duration} min</Text>
                  </View>
                  {todayPlan.category && (
                    <View style={[styles.detailChip, { borderColor: CATEGORY_COLORS[todayPlan.category] + '40' }]}>
                      <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[todayPlan.category] }]} />
                      <Text style={styles.detailChipText}>{todayPlan.category}</Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.restCard}>
                <Ionicons name="bed-outline" size={32} color={COLORS.textMuted} />
                <Text style={styles.restText}>Dia de descanso</Text>
                <Text style={styles.restSubtext}>Recupere-se para o próximo treino</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.weekOverview}>
          <Text style={typography.label}>RESUMO DA SEMANA</Text>
          <View style={styles.overviewGrid}>
            {DAY_KEYS.map((key) => {
              const day = weekPlan[key];
              const isActive = !day?.isRest;
              const isCurrentDay = key === todayKey;
              return (
                <View key={key} style={[styles.overviewDay, isCurrentDay && styles.overviewDayActive]}>
                  <Text style={[styles.overviewDayLabel, isCurrentDay && styles.overviewDayLabelActive]}>
                    {DAY_NAMES_FULL[DAY_KEYS.indexOf(key)].substring(0, 3).toUpperCase()}
                  </Text>
                  <View style={[styles.overviewDot, isActive && { backgroundColor: COLORS.success }, isCurrentDay && styles.overviewDotActive]} />
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: COLORS.border },
  detailCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary + '30' },
  detailName: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginTop: SPACING.sm, marginBottom: SPACING.md },
  detailMeta: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  detailChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  detailChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, height: 48 },
  startBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
  todayCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  todayWorkoutName: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.sm, marginBottom: SPACING.md },
  restCard: { alignItems: 'center', paddingVertical: SPACING.lg, gap: SPACING.xs },
  restText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textDescription },
  restSubtext: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  weekOverview: { marginTop: SPACING.xl },
  overviewGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md },
  overviewDay: { alignItems: 'center', gap: SPACING.xs },
  overviewDayActive: {},
  overviewDayLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 },
  overviewDayLabelActive: { color: COLORS.primary },
  overviewDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  overviewDotActive: { backgroundColor: COLORS.success },
});
