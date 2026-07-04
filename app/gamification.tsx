
// app/gamification.tsx
// Gamification com rankings animados e melhorias visuais - NOVAIX FITNESS

import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { ACHIEVEMENTS } from '../src/constants/gamification';
import { Header, ErrorBoundary, LevelCard, AchievementGrid, GamificationChallenges, XpBreakdown, RankingCard, Loading, EmptyState } from '../src/components';
import { useGamification } from '../src/hooks/useGamification';
import { useAuth } from '../src/context/AuthContext';
import { useI18n } from '../src/i18n';
import { useResponsive } from '../src/hooks/useResponsive';

function StatsSummary({ data }) {
  const { t } = useI18n();
  const stats = [
    { key: 'totalXP', label: t('gamification.totalXP'), icon: 'flash', color: COLORS.primary },
    { key: 'achievements', label: t('gamification.achievements'), icon: 'trophy', color: COLORS.attention },
    { key: 'streak', label: t('gamification.streakLabel'), icon: 'flame', color: COLORS.secondary },
    { key: 'totalWorkouts', label: t('gamification.workouts'), icon: 'barbell', color: COLORS.success },
  ];
  const values = {
    totalXP: `${data?.total_xp || data?.totalXP || 0}`,
    achievements: `${unlockedIds?.length || 0}/${ACHIEVEMENTS.length}`,
    streak: t('common.days', { count: data?.streak || 0 }),
    totalWorkouts: `${data?.totalWorkouts || 0}`,
  };
  return (
    <View style={styles.statsGrid}>
      {stats.map((s) => (
        <View key={s.key} style={[styles.statCard, { borderLeftColor: s.color, borderLeftWidth: 3 }]}>
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
  const { t } = useI18n();
  const {
    data, loading, refreshing, error,
    onRefresh, unlockedIds, xpBreakdown,
  } = useGamification();

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading variant="pulse" />
        <Text style={styles.loadingText}>{t('gamification.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.loadingText}>{error}</Text>
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
      <Header title={t('gamification.title')} showBack />

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <StatsSummary data={data} />
      </Animated.View>

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
        <RankingCard userId={user?.id} />
      </View>

      <View style={styles.section}>
        <GamificationChallenges progress={{ workouts: data?.totalWorkouts || 0, minutes: data?.totalMinutes || 0, posts: data?.social_first_post_count || 0, streak: data?.maxStreak || 0 }} />
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
  statCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  bottomSpacer: { height: SPACING.xxxl },
});
