// src/components/profile/WeeklyChallenges.js
// Desafios semanais - NOVAIX FITNESS

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { WEEKLY_CHALLENGES } from '../../constants/gamification';
import { addXP } from '../../services/gamification';
import { SECTION_TITLES, LABELS, BUTTONS, MESSAGES } from '../../data/profileTexts';

export default function WeeklyChallenges({ userId, compact = false }) {
  const router = useRouter();
  const [progress, setProgress] = useState({});
  const [claimed, setClaimed] = useState(new Set());

  useEffect(() => {
    async function loadProgress() {
      try {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const [workoutsRes, postsRes, claimedRes] = await Promise.all([
          supabase.from('user_workouts').select('completed, duration, completed_at').eq('user_id', userId).eq('completed', true).gte('completed_at', weekStart.toISOString()),
          supabase.from('posts').select('id').eq('user_id', userId).gte('created_at', weekStart.toISOString()),
          supabase.from('user_achievements').select('achievement_id').eq('user_id', userId).gte('unlocked_at', weekStart.toISOString()),
        ]);

        const totalWorkouts = workoutsRes.data?.length || 0;
        const totalMinutes = workoutsRes.data?.reduce((s, w) => s + (w.duration || 0), 0) || 0;
        const totalPosts = postsRes.data?.length || 0;

        const streakRes = await supabase.from('profiles').select('streak').eq('id', userId).single();
        const streak = streakRes.data?.streak || 0;

        const claimedIds = new Set((claimedRes.data || []).map(a => a.achievement_id));

        setProgress({ workouts: totalWorkouts, minutes: totalMinutes, posts: totalPosts, streak });
        setClaimed(claimedIds);
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar desafios:', err);
      }
    }
    if (userId) loadProgress();
  }, [userId]);

  const getProgress = (challenge) => {
    let current = 0;
    switch (challenge.type) {
      case 'workouts': current = progress.workouts || 0; break;
      case 'minutes': current = progress.minutes || 0; break;
      case 'posts': current = progress.posts || 0; break;
      case 'streak': current = progress.streak || 0; break;
      default: current = 0;
    }
    return Math.min(1, current / challenge.target);
  };

  const getCurrentValue = (challenge) => {
    switch (challenge.type) {
      case 'workouts': return progress.workouts || 0;
      case 'minutes': return progress.minutes || 0;
      case 'posts': return progress.posts || 0;
      case 'streak': return progress.streak || 0;
      default: return 0;
    }
  };

  const handleClaim = useCallback(async (challenge) => {
    const prog = getProgress(challenge);
    if (prog < 1 || claimed.has(challenge.id)) return;

    try {
      await supabase.from('user_achievements').upsert({
        user_id: userId, achievement_id: challenge.id, unlocked_at: new Date().toISOString(),
      }, { onConflict: 'user_id,achievement_id' });

      await addXP(userId, 'CHALLENGE_COMPLETED', challenge.xpReward);
      setClaimed(prev => new Set([...prev, challenge.id]));
      Alert.alert(MESSAGES.challengeComplete, MESSAGES.challengeReward(challenge.xpReward));
    } catch (err) {
      if (__DEV__) console.error('Erro ao resgatar desafio:', err);
    }
  }, [userId, claimed]);

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.header}>
        <Ionicons name="flash" size={20} color={COLORS.primary} />
        <Text style={styles.title}>{SECTION_TITLES.challenges}</Text>
        <TouchableOpacity onPress={() => router.push('/gamification')} style={styles.seeMore} accessibilityLabel="Ver todos os desafios" accessibilityRole="button">
          <Text style={styles.seeMoreText}>{LABELS.seeMore}</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {(compact ? WEEKLY_CHALLENGES.slice(0, 3) : WEEKLY_CHALLENGES).map((challenge) => {
        const prog = getProgress(challenge);
        const completed = prog >= 1;
        const isClaimed = claimed.has(challenge.id);
        const current = getCurrentValue(challenge);

        return (
          <View key={challenge.id} style={[styles.challengeItem, completed && !isClaimed && styles.challengeCompleted]}>
            <View style={[styles.challengeIcon, completed && styles.challengeIconDone]}>
              <Ionicons name={challenge.icon} size={18} color={completed ? COLORS.background : COLORS.primary} />
            </View>
            <View style={styles.challengeInfo}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.challengeName, completed && styles.challengeNameDone]}>{challenge.name}</Text>
                <Text style={styles.challengeXP}>+{challenge.xpReward} XP</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${prog * 100}%`, backgroundColor: completed ? COLORS.success : COLORS.primary }]} />
              </View>
              <Text style={styles.challengeProgress}>{current}/{challenge.target}</Text>
            </View>
            {isClaimed ? (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            ) : completed ? (
              <TouchableOpacity onPress={() => handleClaim(challenge)} style={styles.claimBtn} accessibilityLabel={`Resgatar ${challenge.name}`} accessibilityRole="button">
                <Text style={styles.claimText}>{BUTTONS.claim}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  containerCompact: { padding: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1, flex: 1 },
  seeMore: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeMoreText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
  challengeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.md },
  challengeCompleted: { opacity: 0.7 },
  challengeIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  challengeIconDone: { backgroundColor: COLORS.success },
  challengeInfo: { flex: 1 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  challengeName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle },
  challengeNameDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  challengeXP: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  progressBar: { height: 4, backgroundColor: COLORS.background, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  challengeProgress: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  claimBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 8 },
  claimText: { fontFamily: 'Montserrat_700Bold', fontSize: 9, color: COLORS.background, letterSpacing: 0.5 },
});
