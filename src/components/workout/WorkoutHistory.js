// src/components/workout/WorkoutHistory.js
// Histórico completo de treinos - NOVAIX FITNESS

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import HistoryCard from './HistoryCard';
import WorkoutStatsSummary from './WorkoutStatsSummary';

const PERIODS = [
  { key: 'all', label: 'Todos' },
  { key: 'week', label: '7 dias' },
  { key: 'month', label: '30 dias' },
  { key: 'quarter', label: '3 meses' },
];

const SORT_OPTIONS = [
  { key: 'recent', label: 'Mais recente', icon: 'time' },
  { key: 'oldest', label: 'Mais antigo', icon: 'time-outline' },
  { key: 'rating', label: 'Melhor avaliado', icon: 'star' },
  { key: 'duration', label: 'Mais longo', icon: 'timer' },
];

export default function WorkoutHistory({ userId, onSelect }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [sort, setSort] = useState('recent');
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => { loadWorkouts(); }, [userId, period]);

  const loadWorkouts = async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      let query = supabase.from('user_workouts').select('*, workouts(title, category, duration_minutes)').eq('user_id', userId);
      if (period !== 'all') {
        const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
        query = query.gte('completed_at', new Date(Date.now() - days * 86400000).toISOString());
      }
      const { data } = await query.order('completed_at', { ascending: false });
      setWorkouts(data || []);
    } catch (err) { console.error('Erro ao carregar histórico:', err); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let result = workouts;
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(w => w.workouts?.title?.toLowerCase().includes(lower) || w.workouts?.category?.toLowerCase().includes(lower));
    }
    if (sort === 'oldest') result = [...result].reverse();
    else if (sort === 'rating') result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'duration') result = [...result].sort((a, b) => (b.duration || 0) - (a.duration || 0));
    return result;
  }, [workouts, search, sort]);

  const stats = useMemo(() => {
    const total = workouts.length;
    const completed = workouts.filter(w => w.completed).length;
    const totalMinutes = workouts.reduce((s, w) => s + (w.duration || w.workouts?.duration_minutes || 0), 0);
    const rated = workouts.filter(w => w.rating > 0);
    const avgRating = rated.length > 0 ? rated.reduce((s, w) => s + w.rating, 0) / rated.length : 0;
    return { total, completed, totalMinutes, avgRating };
  }, [workouts]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Buscar treino..." placeholderTextColor={COLORS.textMuted} />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={COLORS.textMuted} /></TouchableOpacity>}
        </View>
      </View>

      <WorkoutStatsSummary stats={stats} />

      <View style={styles.filterBar}>
        <View style={styles.periodRow}>
          {PERIODS.map(p => (
            <TouchableOpacity key={p.key} style={[styles.periodBtn, period === p.key && styles.periodActive]} onPress={() => setPeriod(p.key)}>
              <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
          <Ionicons name="swap-vertical" size={14} color={COLORS.textMuted} />
          <Text style={styles.sortText}>{SORT_OPTIONS.find(s => s.key === sort)?.label}</Text>
        </TouchableOpacity>
        {showSort && (
          <View style={styles.sortDropdown}>
            {SORT_OPTIONS.map(s => (
              <TouchableOpacity key={s.key} style={[styles.sortOption, sort === s.key && styles.sortOptionActive]} onPress={() => { setSort(s.key); setShowSort(false); }}>
                <Ionicons name={s.icon} size={14} color={sort === s.key ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.sortOptionText, sort === s.key && styles.sortOptionTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loading}><Ionicons name="sync" size={24} color={COLORS.textMuted} /><Text style={styles.loadingText}>Carregando...</Text></View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="barbell-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum treino encontrado</Text>
          <Text style={styles.emptyText}>{search ? 'Tente outro termo' : 'Comece seu primeiro treino!'}</Text>
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          data={filtered}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item, index }) => <HistoryCard item={item} index={index} onPress={() => onSelect?.(item)} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<Text style={styles.footer}>{filtered.length} treino(s)</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchRow: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, height: 44, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  filterBar: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  periodRow: { flexDirection: 'row', gap: SPACING.xs },
  periodBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  periodActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  periodTextActive: { color: COLORS.background },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.sm },
  sortText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  sortDropdown: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, marginTop: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  sortOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  sortOptionActive: { backgroundColor: COLORS.primary + '10' },
  sortOptionText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  sortOptionTextActive: { color: COLORS.primary },
  list: { padding: SPACING.lg, paddingTop: 0 },
  loading: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.md },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  footer: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md },
});
