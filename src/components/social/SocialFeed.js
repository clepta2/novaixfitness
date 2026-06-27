// src/components/social/SocialFeed.js
// Feed de atividades sociais - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const ACTIVITY_TYPES = {
  workout: { icon: 'barbell', color: COLORS.success, label: 'Treinou' },
  streak: { icon: 'flame', color: COLORS.primary, label: 'Sequência' },
  achievement: { icon: 'trophy', color: COLORS.attention, label: 'Conquista' },
  meal: { icon: 'nutrition', color: COLORS.info, label: 'Refeição' },
};

function ActivityItem({ activity }) {
  const config = ACTIVITY_TYPES[activity.type] || ACTIVITY_TYPES.workout;

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>

      <View style={styles.activityInfo}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityUser}>{activity.user?.name || 'Atleta'}</Text>
          <Text style={styles.activityTime}>{activity.timeAgo}</Text>
        </View>
        <Text style={styles.activityText}>{activity.text}</Text>

        {activity.xp > 0 && (
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={10} color={COLORS.primary} />
            <Text style={styles.xpText}>+{activity.xp} XP</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.likeBtn}>
        <Ionicons name="heart-outline" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

function filterPosts(posts, filter) {
  if (filter === 'all') return posts;
  if (filter === 'workouts') return posts.filter(p => p.type === 'workout');
  if (filter === 'achievements') return posts.filter(p => p.type === 'achievement');
  return posts;
}

export default function SocialFeed({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadActivities(); }, [userId]);

  const loadActivities = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('user_id, workout_id, completed_at, workouts(name)')
        .gte('completed_at', weekAgo)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (!workouts || workouts.length === 0) { setLoading(false); return; }

      const userIds = [...new Set(workouts.map(w => w.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      const profileMap = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p.name; });

      const formatted = workouts.map(w => ({
        id: `${w.user_id}-${w.completed_at}`,
        type: 'workout',
        user: { name: profileMap[w.user_id] || 'Atleta' },
        text: `Completou "${w.workouts?.name || 'Treino'}"`,
        xp: Math.floor(Math.random() * 100) + 50,
        timeAgo: formatTimeAgo(w.completed_at),
      }));

      setActivities(formatted.slice(0, 10));
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterPosts(activities, filter);

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'workouts', label: 'Treinos' },
    { key: 'achievements', label: 'Conquistas' },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <Ionicons name="sync" size={20} color={COLORS.textMuted} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={18} color={COLORS.primary} />
        <Text style={styles.title}>ATIVIDADE DOS AMIGOS</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Nenhuma atividade recente</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ActivityItem activity={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  loading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  filterRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  filterBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  filterTextActive: { color: COLORS.background },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  activityItem: { flexDirection: 'row', gap: SPACING.md, padding: SPACING.sm },
  activityIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  activityUser: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  activityTime: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  activityText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs, alignSelf: 'flex-start', backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  xpText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary },
  likeBtn: { padding: SPACING.xs },
});
