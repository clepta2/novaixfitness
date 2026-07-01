// src/services/gamificationAchievements.ts
// Conquistas do usuario - usa canonical data de constants

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { awardXP } from './gamificationLevels';
import {
  ACHIEVEMENTS as CANONICAL_ACHIEVEMENTS,
  type Achievement,
  getUnlockedAchievements,
} from '../constants/gamificationAchievements';

export type { Achievement };

const STAT_KEY_MAP: Record<string, string> = {
  streak: 'maxStreak',
  workout: 'totalWorkouts',
  time: 'totalMinutes',
  level: 'level',
  xp: 'totalXP',
};

function mapStats(stats: Record<string, number>): { [key: string]: number | undefined } {
  const mapped: { [key: string]: number | undefined } = {};
  for (const achievement of CANONICAL_ACHIEVEMENTS) {
    if (achievement.category === 'social' || achievement.category === 'weekly') {
      mapped[`${achievement.id}_count`] = stats[`${achievement.id}_count`]
        ?? stats[achievement.id]
        ?? 0;
    }
  }
  for (const [cat, key] of Object.entries(STAT_KEY_MAP)) {
    mapped[key] = stats[key] ?? stats[cat] ?? 0;
  }
  return mapped;
}

function checkAchievementCondition(achievementId: string, stats: Record<string, number>): boolean {
  const mapped = mapStats(stats);
  const achievement = CANONICAL_ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return false;
  const key = STAT_KEY_MAP[achievement.category];
  const value = key ? (mapped[key] ?? 0) : (mapped[`${achievementId}_count`] ?? 0);
  return value >= achievement.requirement;
}

export function getAchievements(): Achievement[] { return CANONICAL_ACHIEVEMENTS; }

export async function getUserAchievements(userId: string): Promise<(Achievement & { unlocked_at: string })[]> {
  const { data } = await supabase.from(TABLES.USER_ACHIEVEMENTS)
    .select('achievement_id, unlocked_at').eq('user_id', userId);
  return (data || []).map(ua => ({
    ...CANONICAL_ACHIEVEMENTS.find(a => a.id === ua.achievement_id)!,
    unlocked_at: ua.unlocked_at, unlocked: true,
  }));
}

export async function checkAchievements(userId: string): Promise<Achievement[]> {
  const { data: stats } = await supabase.rpc('get_user_stats', { p_user_id: userId });
  if (!stats) return [];
  const newAchievements: Achievement[] = [];
  for (const ach of CANONICAL_ACHIEVEMENTS) {
    const { data: existing } = await supabase.from(TABLES.USER_ACHIEVEMENTS)
      .select('id').eq('user_id', userId).eq('achievement_id', ach.id).single();
    if (existing) continue;
    if (checkAchievementCondition(ach.id, stats)) {
      await supabase.from(TABLES.USER_ACHIEVEMENTS).insert({ user_id: userId, achievement_id: ach.id });
      await awardXP(userId, 'achievement_unlocked', { achievement_id: ach.id });
      newAchievements.push(ach);
    }
  }
  return newAchievements;
}
