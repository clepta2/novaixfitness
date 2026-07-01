// app/workout/history.js
// Histórico de treinos com filtro por período

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';

const PERIODS = [
  { id: 'week', label: '7 dias' },
  { id: 'month', label: '30 dias' },
  { id: 'quarter', label: '3 meses' },
  { id: 'year', label: '1 ano' },
  { id: 'all', label: 'Tudo' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, duration: 0, avgRating: 0 });

  useEffect(() => {
    loadWorkouts();
  }, [selectedPeriod, user?.id]);

  const loadWorkouts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let query = supabase.from('user_workouts').select('*, workouts(title, category)').eq('user_id', user.id).eq('completed', true).order('completed_at', { ascending: false });

      const now = new Date();
      if (selectedPeriod === 'week') query = query.gte('completed_at', new Date(now - 7 * 86400000).toISOString());
      else if (selectedPeriod === 'month') query = query.gte('completed_at', new Date(now - 30 * 86400000).toISOString());
      else if (selectedPeriod === 'quarter') query = query.gte('completed_at', new Date(now - 90 * 86400000).toISOString());
      else if (selectedPeriod === 'year') query = query.gte('completed_at', new Date(now - 365 * 86400000).toISOString());

      const { data } = await query;
      setWorkouts(data || []);

      const total = data?.length || 0;
      const duration = data?.reduce((sum, w) => sum + (w.duration || 0), 0) || 0;
      const ratings = data?.filter(w => w.rating).map(w => w.rating) || [];
      const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
      setStats({ total, duration, avgRating });
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDuration = (min) => {
    if (!min) return '0min';
    if (min < 60) return `${min}min`;
    return `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}min` : ''}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/workout-detail?id=${item.workout_id}`)}>
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
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTÓRICO</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.periodBar}>
        {PERIODS.map((period) => (
          <TouchableOpacity key={period.id} style={[styles.periodPill, selectedPeriod === period.id && styles.periodPillActive]} onPress={() => setSelectedPeriod(period.id)}>
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
