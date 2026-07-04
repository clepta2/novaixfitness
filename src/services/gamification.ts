// src/services/gamification.ts
// Serviço de gamificação - XP, Níveis, Conquistas

import { supabase } from '../config/supabase';
import { XP_VALUES, getLevelForXP, getUnlockedAchievements, checkNewAchievements } from '../constants/gamification';
import { sendPushToUser } from './notifications/pushNotifications';
import { APP_CONFIG } from '../config/app';
import { calculateCustomWorkoutXP } from '../config/gamificationConfig';
import { calculateStreak } from '../helpers/streak';

interface WorkoutData {
  id?: string;
  exercises?: any[];
  [key: string]: any;
}

interface GamificationData {
  totalXP: number;
  totalWorkouts: number;
  totalMinutes: number;
  streak: number;
  maxStreak: number;
  level: number;
  levelData: any;
  achievements: any[];
  recentAchievements: any[];
  social_first_post_count: number;
  social_10_posts_count: number;
  social_50_likes_count: number;
  social_25_comments_count: number;
}

interface WorkoutCompletionResult {
  xpGained: number;
  newAchievements: any[];
  level?: any;
  streak?: number;
}

export async function addXP(userId: string, type: string, amount?: number): Promise<number> {
  const xpGain = amount ?? XP_VALUES[type as keyof typeof XP_VALUES] ?? 0;
  if (!userId || xpGain <= 0) return 0;

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();

    const currentXP = profile?.total_xp || 0;
    const newXP = currentXP + xpGain;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ total_xp: newXP })
      .eq('id', userId);
    if (updateError) throw updateError;

    return newXP;
  } catch (err) {
    if (__DEV__) console.error('Erro ao adicionar XP:', err);
    return 0;
  }
}

export async function getGamificationData(userId: string): Promise<GamificationData | null> {
  if (!userId) return null;

  try {
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

    const totalXP = profile?.total_xp || 0;
    const totalWorkouts = profile?.total_workouts ?? userWorkouts?.filter(w => w.completed).length ?? 0;
    const totalMinutes = profile?.total_minutes ?? userWorkouts?.reduce((s, w) => s + (w.duration || 0), 0) ?? 0;
    const streak = calculateStreak(userWorkouts || []);
    const maxStreak = Math.max(profile?.max_streak || 0, streak);

    const level = getLevelForXP(totalXP);

    const stats = {
      totalXP,
      totalWorkouts,
      totalMinutes,
      streak,
      maxStreak,
      level: level.level,
      social_first_post_count: postsCount >= 1 ? 1 : 0,
      social_10_posts_count: postsCount >= 10 ? 1 : 0,
      social_50_likes_count: likesCount >= 50 ? 1 : 0,
      social_25_comments_count: commentsCount >= 25 ? 1 : 0,
    };

    const achievements = getUnlockedAchievements(stats);

    return {
      ...stats,
      levelData: level,
      achievements,
      recentAchievements: achievements.slice(-5),
    };
  } catch (err) {
    if (__DEV__) console.error('Erro ao buscar dados de gamificação:', err);
    return null;
  }
}

export async function recordWorkoutCompletion(
  userId: string,
  workoutData: WorkoutData,
  logs: any[] = [],
  duration: number = 0
): Promise<WorkoutCompletionResult> {
  if (!userId) return { xpGained: 0, newAchievements: [] };

  try {
    const currentData = await getGamificationData(userId);
    const prevAchievements = currentData?.achievements || [];

    const workoutXP = workoutData?.id?.length === 36
      ? XP_VALUES.WORKOUT_COMPLETED
      : calculateCustomWorkoutXP(logs, workoutData?.exercises?.length || 0, duration);

    await addXP(userId, 'WORKOUT_COMPLETED', workoutXP);

    let streakBonus = 0;
    if (currentData?.streak && currentData.streak > 0) {
      streakBonus = XP_VALUES.STREAK_BONUS_PER_DAY * currentData.streak;
      await addXP(userId, 'STREAK_BONUS_PER_DAY', streakBonus);
    }

    const updatedData = await getGamificationData(userId);
    const newAchievements = updatedData ? checkNewAchievements(updatedData, prevAchievements) : [];

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

      for (const a of newAchievements) {
        if (a.xpReward) {
          await addXP(userId, 'ACHIEVEMENT_UNLOCKED', a.xpReward);
        }
      }
    }

    return {
      xpGained: workoutXP + streakBonus,
      newAchievements,
      level: updatedData?.levelData,
      streak: updatedData?.streak,
    };
  } catch (err) {
    if (__DEV__) console.error('Erro ao registrar conclusão:', err);
    return { xpGained: 0, newAchievements: [] };
  }
}

export async function awardActionXP(userId: string, action: string): Promise<number> {
  const xpGain = XP_VALUES[action as keyof typeof XP_VALUES] || 0;
  if (!userId || xpGain <= 0) return 0;
  return addXP(userId, action, xpGain);
}

export async function updateMaxStreak(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const { data: profile } = await supabase.from('profiles').select('max_streak').eq('id', userId).single();
    const { data: workouts } = await supabase.from('user_workouts').select('completed, completed_at').eq('user_id', userId);
    const streak = calculateStreak(workouts || []);
    const currentMax = profile?.max_streak || 0;
    await supabase.from('profiles').update({ max_streak: Math.max(streak, currentMax) }).eq('id', userId);
  } catch (err) {
    if (__DEV__) console.error('Erro ao atualizar streak:', err);
  }
}

export { calculateLevel, awardXP, checkAchievements, getRankings, getUserRank, getUserAchievements, getXPForNextLevel, getLevelProgress, getUserGamificationProfile } from './gamification/gamification';
