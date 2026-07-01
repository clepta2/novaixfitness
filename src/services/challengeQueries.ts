// src/services/challengeQueries.js
// Consultas de desafios entre amigos

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';

const CHALLENGE_SELECT = '*, profiles:challenger_id(name, avatar_url), profiles:challenged_id(name, avatar_url)';

export async function getUserChallenges(userId: string) {
  const { data } = await supabase.from(TABLES.FRIEND_CHALLENGES)
    .select(CHALLENGE_SELECT)
    .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getActiveChallenges(userId: string) {
  const { data } = await supabase.from(TABLES.FRIEND_CHALLENGES)
    .select(CHALLENGE_SELECT)
    .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
    .eq('status', 'active')
    .order('end_date', { ascending: true });
  return data || [];
}

export async function getChallengeProgress(challengeId: string) {
  const { data } = await supabase.from(TABLES.CHALLENGE_PROGRESS)
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('challenge_id', challengeId);
  return data || [];
}

export async function getChallengeHistory(userId: string) {
  const { data } = await supabase.from(TABLES.CHALLENGE_HISTORY)
    .select('*, profiles:winner_id(name), profiles:loser_id(name)')
    .or(`winner_id.eq.${userId},loser_id.eq.${userId}`)
    .order('completed_at', { ascending: false });
  return data || [];
}

export async function getWinRate(userId: string) {
  const { count: wins } = await supabase.from(TABLES.CHALLENGE_HISTORY)
    .select('id', { count: 'exact', head: true }).eq('winner_id', userId);
  const { count: losses } = await supabase.from(TABLES.CHALLENGE_HISTORY)
    .select('id', { count: 'exact', head: true }).eq('loser_id', userId);

  const total = (wins || 0) + (losses || 0);
  return { wins: wins || 0, losses: losses || 0, total, winRate: total > 0 ? Math.round((wins || 0) / total * 100) : 0 };
}
