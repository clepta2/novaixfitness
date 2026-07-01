
// app/analytics.tsx
// Dashboard de Analytics com animacoes - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import { useMountedRef } from '../src/hooks/useMountedRef';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { useAuth } from '../src/context/AuthContext';
import { getWorkoutAnalytics, getWorkoutFrequency, getMonthlyComparison } from '../src/services/analytics';
import { FilterBar, ComparisonCard, InsightsRow, FrequencyChart, CategoryChart, DayOfWeekChart, MonthlyChart, HourChart, ErrorBoundary, AnalyticsStatsGrid as StatsGrid, Loading, EmptyState } from '../src/components';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout, typography } from '../src/styles';

export default function AnalyticsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [period, setPeriod] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [frequency, setFrequency] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useMountedRef();

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [data, freq, monthly] = await Promise.all([
        getWorkoutAnalytics(user.id, period),
        getWorkoutFrequency(user.id),
        getMonthlyComparison(user.id),
      ]);
      if (!mounted.current) return;
      setAnalytics(data);
      setFrequency(freq);
      setMonthlyData(monthly);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar analytics:', err);
    } finally {
      if (!mounted.current) return;
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user?.id, period]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (loading) {
    return (
      <View style={layout.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 22 : 28 }]}>Analytics</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Loading variant="pulse" />
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="Analytics">
      <View style={layout.screen}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
            </TouchableOpacity>
            <Text style={[typography.h2, { fontSize: isSmall ? 22 : 28 }]}>Analytics</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Conteudo animado */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <FilterBar selected={period} onSelect={setPeriod} style={{ marginBottom: SPACING.md }} />
            <ComparisonCard comparison={analytics?.comparison} />
            <StatsGrid analytics={analytics} />
            <InsightsRow bestDay={analytics?.bestDay} bestHour={analytics?.bestHour} />
            <FrequencyChart data={frequency} />
            <CategoryChart data={analytics?.byCategory} />
            <DayOfWeekChart data={analytics?.byDayOfWeek} />
            <MonthlyChart data={monthlyData} />
            <HourChart data={analytics?.byHour} />
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
