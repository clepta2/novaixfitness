import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/config/supabase';
import { layout, typography } from '../../../src/styles';
import { HistoryCard } from '../../../src/components';
import { HISTORY_FILTERS } from '../../../src/data/filters';

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchHistory = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .select('*, workouts(title, category, level, duration_minutes, id)')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      if (!error && data) setWorkouts(data);
    } catch (err) { if (__DEV__) console.error('Erro ao buscar histórico:', err); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchHistory(); }, [fetchHistory]);

  const filtered = useMemo(() => {
    if (filter === 'all') return workouts;
    if (filter === 'completed') return workouts.filter(w => w.completed);
    return workouts.filter(w => !w.completed);
  }, [workouts, filter]);

  const stats = useMemo(() => {
    const completed = workouts.filter(w => w.completed);
    const totalMin = workouts.reduce((s, w) => s + (w.duration || 0), 0);
    return { total: workouts.length, completed: completed.length, totalMin, avgDuration: workouts.length > 0 ? Math.round(totalMin / workouts.length) : 0 };
  }, [workouts]);

  return (
    <View style={layout.screen}>
      <View style={layout.header}>
        <TouchableOpacity onPress={() => router.back()} style={layout.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={typography.h4}>Histórico</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={layout.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>
          {workouts.length > 0 && (
            <View style={styles.statsRow}>
              {[{ v: stats.total, l: 'Total' }, { v: stats.completed, l: 'Concluídos' }, { v: `${stats.totalMin}m`, l: 'Tempo' }, { v: `${stats.avgDuration}m`, l: 'Média' }].map((s, i) => (
                <View key={i} style={styles.statBox}>
                  {i > 0 && <View style={styles.statDivider} />}
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{s.v}</Text>
                    <Text style={styles.statLabel}>{s.l}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {workouts.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {HISTORY_FILTERS.map((f) => (
                <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]} onPress={() => setFilter(f.key)}>
                  <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {filtered.length > 0 ? (
            filtered.map((item) => (
              <HistoryCard key={item.id} item={item} onPress={() => item.workout_id && router.push({ pathname: '/workout-detail', params: { id: item.workout_id } })} />
            ))
          ) : (
            <View style={styles.empty}>
              <Ionicons name="barbell-outline" size={48} color={COLORS.textMuted} />
              <Text style={[typography.h5, { marginTop: SPACING.md }]}>{filter === 'all' ? 'Nenhum treino ainda' : 'Nenhum treino neste filtro'}</Text>
              <Text style={typography.bodyMuted}>Inicie treinos para vê-los aqui!</Text>
            </View>
          )}
          <View style={{ height: 50 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  statValue: typography.statValue,
  statLabel: typography.statLabel,
  filterScroll: { marginBottom: SPACING.lg },
  filterBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  filterBtnActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  filterText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  filterTextActive: { color: COLORS.primary },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
});
