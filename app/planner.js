import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { WeekCalendar, AdaptationBanner, DayEditorModal } from '../src/components/planner';
import DayDetailView, { TodayCard } from '../src/components/planner/DayDetailView';
import WeekOverview from '../src/components/planner/WeekOverview';
import { defaultWeekPlan, DAY_KEYS } from '../src/data/weekPlan';
import { loadWeeklyPlan, updateDayPlan } from '../src/services/planService';
import { shouldAdaptPlan, getAdaptationReason } from '../src/services/planAdaptation';

export default function PlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [weekPlan, setWeekPlan] = useState(defaultWeekPlan);
  const [selectedDay, setSelectedDay] = useState(null);
  const [adaptReason, setAdaptReason] = useState(null);
  const [adapting, setAdapting] = useState(false);
  const [editingDay, setEditingDay] = useState(null);

  useEffect(() => {
    async function loadPlan() {
      if (!user?.id) return;
      const plan = await loadWeeklyPlan(user.id);
      if (plan) setWeekPlan(plan);
      try {
        const needsAdapt = await shouldAdaptPlan(user.id);
        if (needsAdapt) {
          const reason = await getAdaptationReason(user.id);
          setAdaptReason(reason);
        }
      } catch {}
    }
    loadPlan();
  }, [user?.id]);

  const todayKey = DAY_KEYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayPlan = weekPlan[todayKey];
  const totalWorkouts = DAY_KEYS.filter((k) => !weekPlan[k]?.isRest).length;
  const totalMinutes = DAY_KEYS.reduce((sum, k) => sum + (weekPlan[k]?.duration || 0), 0);

  const handleDayPress = useCallback((key) => {
    setSelectedDay(key === selectedDay ? null : key);
  }, [selectedDay]);

  const handleEditDay = useCallback(async (dayData) => {
    if (!editingDay || !user?.id) return;
    await updateDayPlan(user.id, editingDay, dayData);
    setWeekPlan(prev => ({ ...prev, [editingDay]: dayData }));
    setEditingDay(null);
  }, [editingDay, user?.id]);

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

        <AdaptationBanner reason={adaptReason} loading={adapting} onAdapt={() => {}} />
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
          <DayDetailView
            dayKey={selectedDay}
            dayData={selectedData}
            onEdit={() => setEditingDay(selectedDay)}
            onStart={() => router.push({ pathname: '/workout-detail', params: { id: selectedData.workoutId } })}
          />
        ) : (
          <TodayCard dayData={todayPlan} />
        )}

        <WeekOverview weekPlan={weekPlan} todayKey={todayKey} />
        <View style={{ height: 40 }} />
      </ScrollView>

      <DayEditorModal
        visible={!!editingDay}
        dayKey={editingDay}
        currentData={editingDay ? weekPlan[editingDay] : null}
        onSave={handleEditDay}
        onClose={() => setEditingDay(null)}
      />
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
});
