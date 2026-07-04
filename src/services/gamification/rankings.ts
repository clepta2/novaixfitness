// src/services/gamification/rankings.ts
// Rankings, conquistas do usuário e helpers de nível — NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { tryIf } from '../../utils/tryIf';
import { getGamificationData } from './gamification';

export async function getRankings(period: string = 'weekly', limit = 50) {
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, total_xp')
      .order('total_xp', { ascending: false })
      .limit(limit);
    return (data || []).map((p: any, i: number) => ({ rank: i + 1, userId: p.id, name: p.name, avatar: p.avatar_url, xp: p.total_xp }));
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) {
    return result.data;
  } else {
    return [];
  }
}

export async function getUserRank(userId: string) {
  const result = await tryIf(async () => {
    const { data: profile } = await supabase
      .from('profiles').select('total_xp').eq('id', userId).single();
    if (!profile) return { rank: 0, xp: 0 };
    const { count } = await supabase
      .from('profiles').select('*', { count: 'exact', head: true })
      .gt('total_xp', profile.total_xp);
    return { rank: (count || 0) + 1, xp: profile.total_xp };
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) {
    return result.data;
  } else {
    return { rank: 0, xp: 0 };
  }
}

export async function getUserAchievements(userId: string) {
  if (!userId) return [];
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    return data || [];
  }, { retries: 1, baseDelay: 500 });
  if (result.ok) {
    return result.data;
  } else {
    return [];
  }
}

export function getXPForNextLevel(level: number) { return level * 100; }
export function getLevelProgress(totalXP: number) { return totalXP % 100; }

export async function getUserGamificationProfile(userId: string) {
  if (!userId) return null;
  return getGamificationData(userId);
}
