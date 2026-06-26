// src/services/gamification.js
// Serviço de gamificação - XP, Níveis, Conquistas - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { XP_VALUES, getLevelForXP, getUnlockedAchievements, checkNewAchievements } from '../constants/gamification';

export async function addXP(userId, type, amount) {
  const xpGain = amount || XP_VALUES[type] || 0;
  if (!userId || xpGain <= 0) return 0;

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', userId)
    .single();

  const currentXP = profile?.total_xp || 0;
  const newXP = currentXP + xpGain;

  await supabase
    .from('profiles')
    .update({ total_xp: newXP })
    .eq('id', userId);

  return newXP;
}

export async function getGamificationData(userId) {
  if (!userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_xp, total_workouts, total_minutes, max_streak')
    .eq('id', userId)
    .single();

  const { data: userWorkouts } = await supabase
    .from('user_workouts')
    .select('completed, completed_at, duration')
    .eq('user_id', userId);

  const totalXP = profile?.total_xp || 0;
  const totalWorkouts = profile?.total_workouts || userWorkouts?.filter(w => w.completed).length || 0;
  const totalMinutes = profile?.total_minutes || userWorkouts?.reduce((s, w) => s + (w.duration || 0), 0) || 0;
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
  };

  const achievements = getUnlockedAchievements({
    ...stats,
    social_first_post_count: 0,
    social_10_posts_count: 0,
    social_50_likes_count: 0,
  });

  return {
    ...stats,
    levelData: level,
    achievements,
    recentAchievements: achievements.slice(-5),
  };
}

export async function recordWorkoutCompletion(userId, workoutData) {
  if (!userId) return { xpGained: 0, newAchievements: [] };

  const currentData = await getGamificationData(userId);
  const prevAchievements = currentData?.achievements || [];

  const xpGained = await addXP(userId, 'WORKOUT_COMPLETED');

  const newXP = (currentData?.totalXP || 0) + XP_VALUES.STREAK_BONUS_PER_DAY * (currentData?.streak || 0);
  if (currentData?.streak > 0) {
    await addXP(userId, 'STREAK_BONUS_PER_DAY', XP_VALUES.STREAK_BONUS_PER_DAY * currentData.streak);
  }

  const updatedData = await getGamificationData(userId);
  const newAchievements = checkNewAchievements(updatedData, prevAchievements);

  if (newAchievements.length > 0) {
    await supabase.from('user_achievements').upsert(
      newAchievements.map(a => ({
        user_id: userId,
        achievement_id: a.id,
        unlocked_at: new Date().toISOString(),
      })),
      { onConflict: 'user_id,achievement_id' }
    );
  }

  return {
    xpGained: xpGained + (currentData?.streak > 0 ? XP_VALUES.STREAK_BONUS_PER_DAY * currentData.streak : 0),
    newAchievements,
    level: updatedData?.levelData,
    streak: updatedData?.streak,
  };
}

export async function updateMaxStreak(userId) {
  if (!userId) return;

  const { data: workouts } = await supabase
    .from('user_workouts')
    .select('completed, completed_at')
    .eq('user_id', userId);

  const streak = calculateStreak(workouts || []);

  await supabase
    .from('profiles')
    .update({ max_streak: streak })
    .eq('id', userId);
}

function calculateStreak(workouts) {
  if (!workouts.length) return 0;

  const dates = [...new Set(
    workouts
      .filter(w => w.completed && w.completed_at)
      .map(w => new Date(w.completed_at).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a));

  if (!dates.length) return 0;

  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}
