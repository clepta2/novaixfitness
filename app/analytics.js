import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { getWorkoutAnalytics, getWorkoutFrequency, getMonthlyComparison } from '../src/services/analytics';
import { FilterBar } from '../src/components';
import ComparisonCard from '../src/components/analytics/ComparisonCard';
import StatsGrid from '../src/components/analytics/StatsGrid';
import InsightsRow from '../src/components/analytics/InsightsRow';
import { FrequencyChart, CategoryChart, DayOfWeekChart, MonthlyChart, HourChart } from '../src/components/analytics/ChartsSection';
import { layout, typography } from '../src/styles';

export default function AnalyticsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [frequency, setFrequency] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [data, freq, monthly] = await Promise.all([
          getWorkoutAnalytics(user.id, period),
          getWorkoutFrequency(user.id),
          getMonthlyComparison(user.id),
        ]);
        setAnalytics(data);
        setFrequency(freq);
        setMonthlyData(monthly);
      } catch (err) {
        console.error('Erro ao carregar analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id, period]);

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <View style={typography.h2}><View /></View>
          <View style={{ width: 24 }} />
        </View>

        <FilterBar selected={period} onSelect={setPeriod} style={{ marginBottom: SPACING.md }} />
        <ComparisonCard comparison={analytics?.comparison} />
        <StatsGrid analytics={analytics} />
        <InsightsRow bestDay={analytics?.bestDay} bestHour={analytics?.bestHour} />
        <FrequencyChart data={frequency} />
        <CategoryChart data={analytics?.byCategory} />
        <DayOfWeekChart data={analytics?.byDayOfWeek} />
        <MonthlyChart data={monthlyData} />
        <HourChart data={analytics?.byHour} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
});
