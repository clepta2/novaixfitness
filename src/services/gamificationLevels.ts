// src/services/gamificationLevels.ts
// XP, niveis e rankings - re-export de constants + funcoes DB

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { XP_VALUES as CANONICAL_XP_VALUES, getLevelForXP } from '../constants/gamificationLevels';

export { XP_VALUES, LEVELS, getLevelForXP, getNextLevel, getXPProgress } from '../constants/gamificationLevels';

export const XP_VALUES_SERVICE: Record<string, number> = {
  workout_completed: CANONICAL_XP_VALUES.WORKOUT_COMPLETED,
  exercise_completed: 10,
  meal_logged: CANONICAL_XP_VALUES.POST_CREATED,
  water_logged: CANONICAL_XP_VALUES.DAILY_LOGIN,
  streak_milestone: 100,
  achievement_unlocked: 200,
  daily_login: CANONICAL_XP_VALUES.DAILY_LOGIN,
  profile_completed: CANONICAL_XP_VALUES.PROFILE_COMPLETED,
  first_workout: CANONICAL_XP_VALUES.FIRST_WORKOUT,
  sharing: CANONICAL_XP_VALUES.SHARE_WORKOUT,
};

export const LEVEL_THRESHOLDS: number[] = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
  5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000,
];

export interface UserProfile {
  xp: number;
  level: number;
}

export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1; else break;
  }
  return level;
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= LEVEL_THRESHOLDS.length) return 0;
  return LEVEL_THRESHOLDS[currentLevel] - currentXP;
}

export function getLevelProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= LEVEL_THRESHOLDS.length) return 100;
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel];
  return Math.round(((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
}

export async function awardXP(userId: string, eventType: string, metadata: Record<string, unknown> = {}): Promise<{ xp: number; totalXP: number; level: number; leveledUp: boolean }> {
  const xp = XP_VALUES_SERVICE[eventType] || 10;
  const { data: profile } = await supabase.from(TABLES.PROFILES).select('xp, level').eq('id', userId).single();
  const newXP = (profile?.xp || 0) + xp;
  const newLevel = calculateLevel(newXP);

  await supabase.from(TABLES.PROFILES).update({ xp: newXP, level: newLevel }).eq('id', userId);

  if (newLevel > (profile?.level || 1)) {
    await supabase.from(TABLES.NOTIFICATIONS).insert({
      user_id: userId, type: 'level_up', title: `Nivel ${newLevel}!`,
      body: `Parabens! Voce alcancou o nivel ${newLevel}!`, data: { level: newLevel },
    });
  }

  await supabase.from(TABLES.XP_LOGS).insert({ user_id: userId, event_type: eventType, xp_earned: xp, metadata });
  return { xp, totalXP: newXP, level: newLevel, leveledUp: newLevel > (profile?.level || 1) };
}

export async function getRankings(period: string = 'weekly', limit: number = 50): Promise<UserProfile[]> {
  let query = supabase.from(TABLES.PROFILES)
    .select('id, name, avatar_url, xp, level, total_workouts')
    .order('xp', { ascending: false }).limit(limit);
  if (period === 'weekly') {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    query = query.gte('last_workout_at', weekAgo);
  }
  const { data } = await query;
  return (data || []) as UserProfile[];
}

export async function getUserRank(userId: string): Promise<{ rank: number; xp: number } | null> {
  const { data: profile } = await supabase.from(TABLES.PROFILES).select('xp').eq('id', userId).single();
  if (!profile) return null;
  const { count } = await supabase.from(TABLES.PROFILES).select('id', { count: 'exact', head: true }).gt('xp', profile.xp);
  return { rank: (count || 0) + 1, xp: profile.xp };
}
