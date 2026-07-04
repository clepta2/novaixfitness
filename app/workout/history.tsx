// app/workout/history.js
// Histórico de treinos com filtro por período

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ErrorBoundary } from '../../src/components';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useWorkoutHistory, PERIODS } from '../../src/hooks/useWorkoutHistory';

export default function HistoryScreen() {
  const router = useRouter();
  const {
    workouts, selectedPeriod, setSelectedPeriod,
    loading, stats, formatDate, formatDuration,
  } = useWorkoutHistory();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} accessibilityLabel={`Abrir treino ${item.workouts?.title || 'Treino'}`} accessibilityRole="button" onPress={() => item.workout_id && router.push({ pathname: '/workout-detail', params: { id: item.workout_id } })}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>{item.workouts?.title || 'Treino'}</Text>
          <Text style={styles.cardDate}>{formatDate(item.completed_at)}</Text>
        </View>
        {item.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={COLORS.primary} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardStat}>
          <Ionicons name="time" size={14} color={COLORS.textMuted} />
          <Text style={styles.cardStatText}>{formatDuration(item.duration)}</Text>
        </View>
        <View style={styles.cardStat}>
          <Ionicons name="barbell" size={14} color={COLORS.textMuted} />
          <Text style={styles.cardStatText}>{item.workouts?.category || 'Treino'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ErrorBoundary screenName="WorkoutHistory">
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTÓRICO</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.periodBar}>
        {PERIODS.map((period) => (
          <TouchableOpacity key={period.id} style={[styles.periodPill, selectedPeriod === period.id && styles.periodPillActive]} accessibilityLabel={`Filtrar por ${period.label}`} accessibilityRole="button" onPress={() => setSelectedPeriod(period.id)}>
            <Text style={[styles.periodText, selectedPeriod === period.id && styles.periodTextActive]}>{period.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Treinos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatDuration(stats.duration)}</Text>
          <Text style={styles.statLabel}>Tempo total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.avgRating || '—'}</Text>
          <Text style={styles.statLabel}>Avaliação</Text>
        </View>
      </View>

      <FlatList data={workouts} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Carregando...' : 'Nenhum treino registrado'}</Text>} />
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  periodBar: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  periodPill: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface },
  periodPillActive: { backgroundColor: COLORS.primary },
  periodText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  periodTextActive: { color: COLORS.background },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
  list: { padding: SPACING.lg },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1 },
  cardTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  cardDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  ratingText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  cardFooter: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  cardStatText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxl },
});
