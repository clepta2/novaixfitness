// src/services/friendChallenges.js
// Desafios entre amigos: criar, aceitar, progresso, consultas

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'friendChallenges' });

export { updateProgress, autoUpdateProgress } from './challengeProgress';
export { getUserChallenges, getActiveChallenges, getChallengeProgress, getChallengeHistory, getWinRate } from './challengeQueries';

export async function createChallenge(challengerId, { challengedId, challengeType, title, description, targetValue, stakeCoins }) {
  const result = await guard.guard(async () => {
    const endDate = new Date();
    if (challengeType === 'streak_30') endDate.setDate(endDate.getDate() + 30);
    else if (challengeType === 'workout_count') endDate.setDate(endDate.getDate() + 14);
    else endDate.setDate(endDate.getDate() + 7);

    const { data, error } = await supabase.from(TABLES.FRIEND_CHALLENGES).insert({
      challenger_id: challengerId, challenged_id: challengedId, challenge_type: challengeType,
      title, description, target_value: targetValue,
      end_date: endDate.toISOString().split('T')[0], stake_coins: stakeCoins || 0, status: 'pending',
    }).select().single();

    if (error) throw error;

    await supabase.from(TABLES.CHALLENGE_PROGRESS).insert([
      { challenge_id: data.id, user_id: challengerId, current_value: 0 },
      { challenge_id: data.id, user_id: challengedId, current_value: 0 },
    ]);

    await supabase.from(TABLES.NOTIFICATIONS).insert({
      user_id: challengedId, type: 'challenge_invite', title: 'Desafio de Treino!',
      body: `Voce foi desafiado: ${title}`, data: { challenge_id: data.id },
    });

    return data;
  });
  return result.ok ? result.data : null;
}

export async function acceptChallenge(challengeId) {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.FRIEND_CHALLENGES)
      .update({ status: 'active', start_date: new Date().toISOString().split('T')[0] })
      .eq('id', challengeId);
    if (error) throw error;
  });
}

export async function cancelChallenge(challengeId) {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.FRIEND_CHALLENGES)
      .update({ status: 'cancelled' }).eq('id', challengeId);
    if (error) throw error;
  });
}
