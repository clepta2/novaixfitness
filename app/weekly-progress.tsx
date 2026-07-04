
// app/weekly-progress.tsx
// Progresso semanal com animacoes - NOVAIX FITNESS


import { useMemo, useState, useEffect , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { FilterBar, WeekSummary, DayGrid, CategoryBars, DayDetails, GlobalStats, ErrorBoundary, Loading } from '../src/components';
import { useWeeklyProgress } from '../src/hooks/useWeeklyProgress';
import { useResponsive } from '../src/hooks/useResponsive';

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
  const { isSmall } = useResponsive();
  const [period, setPeriod] = useState('week');
  const weekData = useWeeklyProgress(user?.id, period);

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, [weekData]);

  return (
    <ErrorBoundary screenName="WeeklyProgress">
      <View style={layout.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 20 : 24 }]}>Progresso</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FilterBar selected={period} onSelect={setPeriod} style={{ marginBottom: SPACING.md }} />

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <WeekSummary data={weekData} />

            {period === 'week' && <DayGrid byDay={weekData?.byDay} />}

            {period === 'week' && weekData?.byDay && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>TREINOS POR DIA</Text>
                <BarChart
                  {...{data: { labels: weekData.byDay.map((d: any) => d.day), datasets: [{ data: weekData.byDay.map((d: any) => d.count) }] }, width: SCREEN_WIDTH - 80, height: 180, chartConfig, style: styles.chart, showValuesOnTopOfBars: true, fromZero: true} as any}
                />
              </View>
            )}

            {weekData?.bestDay && (
              <View style={styles.bestDayCard}>
                <View style={styles.bestDayIcon}>
                  <Ionicons name="trophy" size={24} color={COLORS.gold} />
                </View>
                <View style={styles.bestDayInfo}>
                  <Text style={styles.bestDayTitle}>Melhor dia: {weekData.bestDay.fullDay}</Text>
                  <Text style={styles.bestDayMeta}>{weekData.bestDay.count} treinos, {weekData.bestDay.minutes} minutos</Text>
                </View>
              </View>
            )}

            <CategoryBars categories={weekData?.categories} total={weekData?.totalWorkouts} />
            <DayDetails byDay={weekData?.byDay} />
            <GlobalStats totalWorkouts={weekData?.globalWorkouts} streak={weekData?.streak} totalXP={weekData?.totalXP} />
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  scroll: { padding: SPACING.lg },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  chartTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  chart: { borderRadius: BORDER_RADIUS.md },
  bestDayCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.gold + '10', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.gold + '30' },
  bestDayIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.gold + '20', justifyContent: 'center', alignItems: 'center' },
  bestDayInfo: { flex: 1 },
  bestDayTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  bestDayMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});
