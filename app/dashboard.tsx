
// app/dashboard.js
// Dashboard Unificado de Progresso - NOVAIX FITNESS

import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { useDashboard } from '../src/hooks/useDashboard';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout, typography } from '../src/styles';
import { DashboardStats, MuscleRadarChart, ErrorBoundary, WeeklySummary, QuickAccessGrid } from '../src/components';
import { shareProgress } from '../src/services/share';
import { styles } from '../src/styles/dashboardStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const chartConfig = {
  backgroundColor: COLORS.surface, backgroundGradientFrom: COLORS.surface, backgroundGradientTo: COLORS.surface,
  decimalPlaces: 1, color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted, style: { borderRadius: 12 },
  propsForDots: { r: '3', strokeWidth: '2', stroke: COLORS.primary },
};

export default function DashboardScreen() {
  const router = useRouter();
  const { data, refreshing, bmi, freqChartData, monthlyChartData, weightChartData, onRefresh } = useDashboard();

  return (
    <ErrorBoundary screenName="Dashboard">
    <View style={layout.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Meu Progresso</Text>
          <TouchableOpacity onPress={() => shareProgress({ streak: data?.streak || 0, totalWorkouts: data?.totalWorkouts || 0, totalMinutes: data?.totalMinutes || 0 })} accessibilityLabel="Compartilhar progresso" accessibilityRole="button">
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
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/analytics')} accessibilityLabel="Ver gráfico frequência semanal" accessibilityRole="button">
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
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/analytics')} accessibilityLabel="Ver gráfico evolução mensal" accessibilityRole="button">
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
          <TouchableOpacity style={styles.chartCard} onPress={() => router.push('/body-measures')} accessibilityLabel="Ver gráfico evolução do peso" accessibilityRole="button">
            <View style={styles.chartHeader}>
              <Text style={typography.h5}>Evolução do Peso</Text>
              <Ionicons name="expand-outline" size={18} color={COLORS.textMuted} />
            </View>
            <LineChart
              data={weightChartData}
              width={SCREEN_WIDTH - 80} height={160}
              chartConfig={{ ...chartConfig, color: (opacity = 1) => `${COLORS.success}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` }}
              style={styles.chart} bezier fromZero
            />
          </TouchableOpacity>
        )}

        {bmi && (
          <TouchableOpacity style={styles.bmiCard} onPress={() => router.push('/body-measures')} accessibilityLabel="Ver detalhes do IMC" accessibilityRole="button">
            <View style={styles.bmiLeft}>
              <Text style={styles.bmiTitle}>IMC ATUAL</Text>
              <Text style={[styles.bmiValue, { color: parseFloat(bmi) < 25 ? COLORS.success : COLORS.attention }]}>{bmi}</Text>
            </View>
            <View style={styles.bmiRight}>
              <Text style={typography.caption}>Altura: {data.height || '-'}cm</Text>
              <Text style={typography.caption}>Peso: {data.weight || '-'}kg</Text>
              <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Ver detalhes →</Text>
            </View>
          </TouchableOpacity>
        )}

        <QuickAccessGrid router={router} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
}
