// src/components/social/Leaderboard.js
// Ranking global de atletas - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const RANK_COLORS = [COLORS.attention, COLORS.textMuted, COLORS.secondary];
const RANK_ICONS = ['trophy', 'medal', 'ribbon'];

function RankItem({ item, index, isCurrentUser }) {
  const rankColor = index < 3 ? RANK_COLORS[index] : COLORS.textMuted;
  const rankIcon = index < 3 ? RANK_ICONS[index] : null;

  return (
    <View style={[styles.rankItem, isCurrentUser && styles.rankItemCurrent]}>
      <View style={[styles.rankBadge, { backgroundColor: rankColor + '20' }]}>
        {rankIcon ? (
          <Ionicons name={rankIcon} size={16} color={rankColor} />
        ) : (
          <Text style={[styles.rankNumber, { color: rankColor }]}>{index + 1}</Text>
        )}
      </View>

      <View style={styles.rankInfo}>
        <Text style={[styles.rankName, isCurrentUser && styles.rankNameCurrent]}>{item.name}</Text>
        <Text style={styles.rankLevel}>{item.level || 'Nível 1'}</Text>
      </View>

      <View style={styles.rankStats}>
        <Text style={styles.rankXP}>{item.xp?.toLocaleString() || 0} XP</Text>
        <Text style={styles.rankWorkouts}>{item.workouts || 0} treinos</Text>
      </View>
    </View>
  );
}

export default function Leaderboard({ userId }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => { loadLeaders(); }, [period]);

  const loadLeaders = async () => {
    setLoading(true);
    try {
      let query = supabase.from('profiles')
        .select('id, name, total_xp, total_workouts, subscription_plan')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (period === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        query = supabase.from('user_workouts')
          .select('user_id, count')
          .gte('completed_at', weekAgo)
          .order('count', { ascending: false });
      }

      const { data } = await query;

      if (period === 'week' && data) {
        const userCounts = {};
        data.forEach(w => { userCounts[w.user_id] = (userCounts[w.user_id] || 0) + 1; });
        const sorted = Object.entries(userCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 50);

        const userIds = sorted.map(([id]) => id);
        const { data: profiles } = await supabase.from('profiles')
          .select('id, name, total_xp, subscription_plan')
          .in('id', userIds);

        const profileMap = {};
        (profiles || []).forEach(p => { profileMap[p.id] = p; });

        setLeaders(sorted.map(([id, count], i) => ({
          rank: i + 1,
          name: profileMap[id]?.name || 'Atleta',
          xp: profileMap[id]?.total_xp || 0,
          workouts: count,
          level: profileMap[id]?.subscription_plan || 'free',
        })));
      } else {
        setLeaders((data || []).map((p, i) => ({
          rank: i + 1,
          name: p.name || 'Atleta',
          xp: p.total_xp || 0,
          workouts: p.total_workouts || 0,
          level: p.subscription_plan || 'free',
        })));
      }
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { key: 'all', label: 'Todos' },
    { key: 'week', label: 'Esta Semana' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={COLORS.primary} />
        <Text style={styles.title}>RANKING GLOBAL</Text>
      </View>

      <View style={styles.periodRow}>
        {periods.map(p => (
          <TouchableOpacity key={p.key} style={[styles.periodBtn, period === p.key && styles.periodActive]} onPress={() => setPeriod(p.key)}>
            <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loading}>
          <Ionicons name="sync" size={20} color={COLORS.textMuted} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : leaders.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Nenhum atleta no ranking ainda</Text>
        </View>
      ) : (
        <FlatList
          data={leaders}
          keyExtractor={(item, i) => `${item.rank}-${i}`}
          renderItem={({ item, index }) => (
            <RankItem item={item} index={index} isCurrentUser={item.id === userId} />
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  periodRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  periodBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  periodActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  periodTextActive: { color: COLORS.background },
  loading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  rankItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  rankItemCurrent: { backgroundColor: COLORS.primary + '10' },
  rankBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  rankNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 12 },
  rankInfo: { flex: 1 },
  rankName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  rankNameCurrent: { color: COLORS.primary },
  rankLevel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  rankStats: { alignItems: 'flex-end' },
  rankXP: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
  rankWorkouts: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
