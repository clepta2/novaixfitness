// src/services/challengeProgress.js
// Progresso e completacao de desafios entre amigos

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'challengeProgress' });

export async function updateProgress(challengeId: string, userId: string, value: number) {
  const { error } = await supabase
    .from(TABLES.CHALLENGE_PROGRESS)
    .upsert({ challenge_id: challengeId, user_id: userId, current_value: value, last_updated: new Date().toISOString() },
      { onConflict: 'challenge_id,user_id' });
  if (error) throw error;

  const { data: challenge } = await supabase
    .from(TABLES.FRIEND_CHALLENGES)
    .select('target_value, stake_coins, challenger_id, challenged_id')
    .eq('id', challengeId).single();

  if (challenge && value >= challenge.target_value) {
    await completeChallenge(challengeId, userId);
  }
}

export async function autoUpdateProgress(challengeId: string) {
  const { data: challenge } = await supabase
    .from(TABLES.FRIEND_CHALLENGES).select('*').eq('id', challengeId).single();
  if (!challenge || challenge.status !== 'active') return;

  const { data: progress } = await supabase
    .from(TABLES.CHALLENGE_PROGRESS).select('user_id, current_value').eq('challenge_id', challengeId);

  for (const p of progress || []) {
    let newValue = p.current_value;
    if (challenge.challenge_type === 'streak_30') {
      const { data: profile } = await supabase.from(TABLES.PROFILES).select('streak').eq('id', p.user_id).single();
      newValue = profile?.streak || 0;
    } else if (challenge.challenge_type === 'workout_count') {
      const { count } = await supabase.from(TABLES.USER_WORKOUTS).select('id', { count: 'exact', head: true })
        .eq('user_id', p.user_id).gte('completed_at', challenge.start_date);
      newValue = count || 0;
    } else if (challenge.challenge_type === 'minutes') {
      const { data: workouts } = await supabase.from(TABLES.USER_WORKOUTS).select('duration_minutes')
        .eq('user_id', p.user_id).gte('completed_at', challenge.start_date);
      newValue = (workouts || []).reduce((sum, w) => sum + (w.duration_minutes || 0), 0);
    }
    await updateProgress(challengeId, p.user_id, newValue);
  }
}

async function completeChallenge(challengeId: string, winnerId: string) {
  const { data: challenge } = await supabase.from(TABLES.FRIEND_CHALLENGES).select('*').eq('id', challengeId).single();
  if (!challenge) return;

  const loserId = challenge.challenger_id === winnerId ? challenge.challenged_id : challenge.challenger_id;

  await supabase.from(TABLES.FRIEND_CHALLENGES).update({ status: 'completed', winner_id: winnerId }).eq('id', challengeId);

  if (challenge.stake_coins > 0) {
    await supabase.rpc('send_gift', { p_sender_id: loserId, p_receiver_id: winnerId, p_gift_id: null, p_message: 'Aposta de desafio' });
  }

  await supabase.from(TABLES.CHALLENGE_HISTORY).insert({
    challenge_id: challengeId, winner_id: winnerId, loser_id: loserId, stake_coins: challenge.stake_coins,
  });

  await supabase.from(TABLES.NOTIFICATIONS).insert([
    { user_id: winnerId, type: 'challenge_won', title: 'Desafio Ganho!', body: `Parabens! Voce venceu o desafio "${challenge.title}"!` },
    { user_id: loserId, type: 'challenge_lost', title: 'Desafio Perdido', body: `Voce perdeu o desafio "${challenge.title}". Tente novamente!` },
  ]);
}
