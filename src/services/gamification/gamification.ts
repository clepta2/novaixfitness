// src/services/gamification.ts
// Serviço de gamificação - XP, Níveis, Conquistas - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { XP_VALUES, getLevelForXP, calculateLevel, getUnlockedAchievements, checkNewAchievements } from '../../constants/gamification';
import { tryIf } from '../../utils/tryIf';
import { incrementXP } from '../../utils/atomicUpdates';

export { calculateLevel };
import { sendPushToUser } from '../notifications/pushNotifications';
import { APP_CONFIG } from '../../config/app';
import { calculateCustomWorkoutXP } from '../../config/gamificationConfig';
import { calcStreak } from '../../helpers/streaks';

export async function addXP(userId: string, type: string, amount?: number) {
  const xpGain = amount ?? XP_VALUES[type] ?? 0;
  if (!userId || xpGain <= 0) return 0;

  const result = await tryIf(async () => {
    await incrementXP(userId, xpGain);

    // Return updated total for callers
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();
    return profile?.total_xp ?? 0;
  }, { retries: 2, baseDelay: 500 });

  return result.ok ? result.data : 0;
}

export async function getGamificationData(userId: string) {
  if (!userId) return null;

  const result = await tryIf(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp, total_workouts, total_minutes, max_streak')
      .eq('id', userId)
      .single();

    const { data: userWorkouts } = await supabase
      .from('user_workouts')
      .select('completed, completed_at, duration')
      .eq('user_id', userId);

    const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    const { count: likesCount } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    const { count: commentsCount } = await supabase.from('post_comments').select('*', { count: 'exact', head: true }).eq('user_id', userId);

    const totalXP = profile?.total_xp ?? 0;
    const totalWorkouts = profile?.total_workouts ?? userWorkouts?.filter(w => w.completed).length ?? 0;
    const totalMinutes = profile?.total_minutes ?? userWorkouts?.reduce((s, w) => s + (w.duration || 0), 0) ?? 0;
    const streak = calcStreak(userWorkouts || []);
    const maxStreak = Math.max(profile?.max_streak || 0, streak);

    const level = getLevelForXP(totalXP);

    const stats = {
      totalXP,
      totalWorkouts,
      totalMinutes,
      streak,
      maxStreak,
      level: level.level,
      social_first_post_count: (postsCount ?? 0) >= 1 ? 1 : 0,
      social_10_posts_count: (postsCount ?? 0) >= 10 ? 1 : 0,
      social_50_likes_count: (likesCount ?? 0) >= 50 ? 1 : 0,
      social_25_comments_count: (commentsCount ?? 0) >= 25 ? 1 : 0,
    };

    const achievements = getUnlockedAchievements(stats);

    return {
      ...stats,
      levelData: level,
      achievements,
      recentAchievements: achievements.slice(-5),
    };
  }, { retries: 1, baseDelay: 500 });

  if (result.ok) {
    return result.data;
  } else {
    if (__DEV__) console.error('Erro ao buscar dados de gamificação:', result.error);
    return null;
  }
}

export async function recordWorkoutCompletion(userId: string, workoutData: any, logs: any[] = [], duration: number = 0) {
  if (!userId) return { xpGained: 0, newAchievements: [], streak: 0 };

  const result = await tryIf(async () => {
    const currentData = await getGamificationData(userId);
    const prevAchievements = currentData?.achievements || [];

    const workoutXP = workoutData?.id?.length === 36
      ? XP_VALUES.WORKOUT_COMPLETED
      : calculateCustomWorkoutXP(logs, workoutData?.exercises?.length || 0, duration);

    await addXP(userId, 'WORKOUT_COMPLETED', workoutXP);

    let streakBonus = 0;
    if ((currentData?.streak ?? 0) > 0) {
      streakBonus = XP_VALUES.STREAK_BONUS_PER_DAY * (currentData?.streak ?? 0);
      await addXP(userId, 'STREAK_BONUS_PER_DAY', streakBonus);
    }

    const updatedData = await getGamificationData(userId);
    const newAchievements = checkNewAchievements(updatedData as unknown as { [key: string]: number | undefined }, prevAchievements);

    const streakMilestones = Object.keys(APP_CONFIG.notifications.streakMessages).map(Number);
    const newStreak = updatedData?.streak || 0;
    if (streakMilestones.includes(newStreak)) {
      await sendPushToUser(userId, `Streak de ${newStreak} dias!`, APP_CONFIG.notifications.streakMessages[newStreak], { type: 'streak', streak_days: newStreak });
    }

    if (newAchievements.length > 0) {
      await supabase.from('user_achievements').upsert(
        newAchievements.map(a => ({
          user_id: userId,
          achievement_id: a.id,
          unlocked_at: new Date().toISOString(),
        })),
        { onConflict: 'user_id,achievement_id' }
      );

      let achievementXP = 0;
      for (const a of newAchievements) {
        if (a.xpReward) {
          await addXP(userId, 'ACHIEVEMENT_UNLOCKED', a.xpReward);
          achievementXP += a.xpReward;
        }
      }
    }

    return {
      xpGained: workoutXP + streakBonus + (newAchievements?.reduce((sum, a) => sum + (a.xpReward || 0), 0) || 0),
      newAchievements,
      level: updatedData?.levelData,
      streak: updatedData?.streak,
    };
  }, { retries: 1, baseDelay: 500 });

  if (result.ok) {
    return result.data;
  } else {
    if (__DEV__) console.error('Erro ao registrar conclusão:', result.error);
    return { xpGained: 0, newAchievements: [] };
  }
}

export async function awardActionXP(userId: string, action: string) {
  const xpGain = XP_VALUES[action] || 0;
  if (!userId || xpGain <= 0) return 0;
  return addXP(userId, action, xpGain);
}

export async function updateMaxStreak(userId: string) {
  if (!userId) return;
  const result = await tryIf(async () => {
    const { data: workouts } = await supabase.from('user_workouts').select('completed, completed_at').eq('user_id', userId);
    const streak = calcStreak(workouts || []);
    await supabase.from('profiles').update({ max_streak: streak }).eq('id', userId);
  }, { retries: 1, baseDelay: 500 });
  if (!result.ok) {
    if (__DEV__) console.error('Erro ao atualizar streak:', result.error);
  }
}
// --- Funções implementadas ---
export async function awardXP(userId: string, eventType: string, metadata?: Record<string, unknown>) {
  const xpGain = XP_VALUES[eventType] || 0;
  if (!userId || xpGain <= 0) return 0;
  return addXP(userId, eventType, xpGain);
}

export async function checkAchievements(userId: string) {
  if (!userId) return [];
  const result = await tryIf(async () => {
    const data = await getGamificationData(userId);
    if (!data) return [];
    const newAchievements = checkNewAchievements(data as unknown as Record<string, number | undefined>, []);
    if (newAchievements.length > 0) {
      await supabase.from('user_achievements').upsert(
        newAchievements.map(a => ({ user_id: userId, achievement_id: a.id, unlocked_at: new Date().toISOString() })),
        { onConflict: 'user_id,achievement_id' }
      );
    }
    return newAchievements;
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) {
    return result.data;
  } else {
    return [];
  }
}

export async function getUserGamificationProfile(userId: string) {
  if (!userId) return null;
  return getGamificationData(userId);
}

// Re-export rankings and helpers from sub-module
export { getRankings, getUserRank, getUserAchievements, getXPForNextLevel, getLevelProgress } from './rankings';
