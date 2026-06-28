// app/gamification.js
// Hub de gamificacao - conquistas, niveis, desafios - NOVAIX FITNESS

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { getGamificationData } from '../src/services/gamification';
import { getLevelForXP, ACHIEVEMENTS, getUnlockedAchievements } from '../src/constants/gamification';
import { Header, ErrorBoundary } from '../src/components';
import LevelCard from '../src/components/gamification/LevelCard';
import AchievementGrid from '../src/components/gamification/AchievementGrid';
import WeeklyChallenges from '../src/components/gamification/WeeklyChallenges';
import XpBreakdown from '../src/components/gamification/XpBreakdown';

const STATS = [
  { key: 'totalXP', label: 'XP Total', icon: 'flash', color: COLORS.primary },
  { key: 'achievements', label: 'Conquistas', icon: 'trophy', color: COLORS.attention },
  { key: 'streak', label: 'Sequencia', icon: 'flame', color: COLORS.secondary },
  { key: 'totalWorkouts', label: 'Treinos', icon: 'barbell', color: COLORS.success },
];

function StatsSummary({ data }) {
  const values = {
    totalXP: `${data?.totalXP || 0}`,
    achievements: `${(data?.achievements || []).length}/${ACHIEVEMENTS.length}`,
    streak: `${data?.streak || 0} dias`,
    totalWorkouts: `${data?.totalWorkouts || 0}`,
  };
  return (
    <View style={styles.statsGrid}>
      {STATS.map(s => (
        <View key={s.key} style={styles.statCard}>
          <Ionicons name={s.icon} size={18} color={s.color} />
          <Text style={styles.statValue}>{values[s.key]}</Text>
          <Text style={styles.statLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

function GamificationContent() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    const result = await getGamificationData(user.id);
    setData(result);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const unlockedIds = (data?.achievements || []).map(a => a.id);
  const xpBreakdown = {
    workout: (data?.totalWorkouts || 0) * 50,
    streak: (data?.maxStreak || 0) * 5,
    social: ((data?.social_first_post_count || 0) + (data?.social_50_likes_count || 0) + (data?.social_25_comments_count || 0)) * 5,
    nutrition: 0,
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Ionicons name="trophy" size={48} color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando conquistas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
      showsVerticalScrollIndicator={false}
    >
      <Header title="CONQUISTAS E NIVEIS" showBack />

      <StatsSummary data={data} />

      <View style={styles.section}>
        <LevelCard xp={data?.totalXP || 0} />
      </View>

      <View style={styles.section}>
        <XpBreakdown breakdown={xpBreakdown} />
      </View>

      <View style={styles.section}>
        <AchievementGrid unlockedIds={unlockedIds} />
      </View>

      <View style={styles.section}>
        <WeeklyChallenges progress={{ workouts: data?.totalWorkouts || 0, minutes: data?.totalMinutes || 0, posts: data?.social_first_post_count || 0, streak: data?.maxStreak || 0 }} />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

export default function GamificationScreen() {
  return (
    <ErrorBoundary screenName="Gamification">
      <GamificationContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.massive },
  center: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  section: { marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  statCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  bottomSpacer: { height: SPACING.xxxl },
});
