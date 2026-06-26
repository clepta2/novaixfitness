// src/components/profile/WeeklyChallenges.js
// Desafios semanais - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { WEEKLY_CHALLENGES } from '../../constants/gamification';

export default function WeeklyChallenges({ userId }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    async function loadProgress() {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('completed, duration, completed_at')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('completed_at', weekStart.toISOString());

      const { data: posts } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString());

      const totalWorkouts = workouts?.length || 0;
      const totalMinutes = workouts?.reduce((s, w) => s + (w.duration || 0), 0) || 0;
      const totalPosts = posts?.length || 0;

      setProgress({
        workouts: totalWorkouts,
        minutes: totalMinutes,
        posts: totalPosts,
      });
    }
    if (userId) loadProgress();
  }, [userId]);

  const getProgress = (challenge) => {
    let current = 0;
    switch (challenge.type) {
      case 'workouts': current = progress.workouts || 0; break;
      case 'minutes': current = progress.minutes || 0; break;
      case 'posts': current = progress.posts || 0; break;
      default: current = 0;
    }
    return Math.min(1, current / challenge.target);
  };

  const getCurrentValue = (challenge) => {
    switch (challenge.type) {
      case 'workouts': return progress.workouts || 0;
      case 'minutes': return progress.minutes || 0;
      case 'posts': return progress.posts || 0;
      default: return 0;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={20} color={COLORS.primary} />
        <Text style={styles.title}>DESAFIOS SEMANAIS</Text>
      </View>

      {WEEKLY_CHALLENGES.map((challenge) => {
        const prog = getProgress(challenge);
        const completed = prog >= 1;
        const current = getCurrentValue(challenge);

        return (
          <View key={challenge.id} style={[styles.challengeItem, completed && styles.challengeCompleted]}>
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
            {completed && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 },
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
});
