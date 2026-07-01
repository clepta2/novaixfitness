import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { SOCIAL_FEED } from '../../data/socialTexts';
import ActivityItem from './ActivityItem';

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
        user: { name: profileMap[w.user_id] || SOCIAL_FEED.defaultUser },
        text: SOCIAL_FEED.completedPrefix + `"${w.workouts?.name || 'Treino'}"`,
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
    { key: 'all', label: SOCIAL_FEED.filterAll },
    { key: 'workouts', label: SOCIAL_FEED.filterWorkouts },
    { key: 'achievements', label: SOCIAL_FEED.filterAchievements },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <Ionicons name="sync" size={20} color={COLORS.textMuted} />
        <Text style={styles.loadingText}>{SOCIAL_FEED.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={18} color={COLORS.primary} />
        <Text style={styles.title}>{SOCIAL_FEED.title}</Text>
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
          <Text style={styles.emptyText}>{SOCIAL_FEED.emptyState}</Text>
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
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
});
