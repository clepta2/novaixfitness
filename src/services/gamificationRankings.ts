// src/services/gamificationRankings.js
// Rankings e perfil de gamificacao do usuario

import { supabase } from '../config/supabase';

export async function getRankings(period = 'weekly', limit = 50) {
  let query = supabase.from('profiles')
    .select('id, name, avatar_url, xp, level, total_workouts')
    .order('xp', { ascending: false }).limit(limit);
  if (period === 'weekly') {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    query = query.gte('last_workout_at', weekAgo);
  }
  const { data } = await query;
  return data || [];
}

export async function getUserRank(userId) {
  const { data: profile } = await supabase.from('profiles').select('xp').eq('id', userId).single();
  if (!profile) return null;
  const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).gt('xp', profile.xp);
  return { rank: (count || 0) + 1, xp: profile.xp };
}

export async function getUserGamificationProfile(userId) {
  const { data } = await supabase.from('profiles').select('xp, level').eq('id', userId).single();
  return data || { xp: 0, level: 1 };
}

export async function logXPEvent(userId, eventType, xp, metadata) {
  await supabase.from('xp_logs').insert({ user_id: userId, event_type: eventType, xp_earned: xp, metadata });
}
