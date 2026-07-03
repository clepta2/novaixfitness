// src/services/duels.js
// Serviço de duelos de treino

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';
import { tryIf } from '../../utils/tryIf';

const guard = createServiceGuard({ serviceName: 'duels' });

export async function getDuels(userId) {
  const result = await tryIf(async () => {
    const { data } = await supabase
      .from(TABLES.DUELS)
      .select('*, challenger:challenger_id(name, avatar_url), challenged:challenged_id(name, avatar_url)')
      .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    return data || [];
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : [];
}

export async function acceptDuel(duelId) {
  const result = await tryIf(async () => {
    const { error } = await supabase
      .from(TABLES.DUELS)
      .update({ status: 'active' })
      .eq('id', duelId);

    if (error) throw error;
  }, { retries: 3, baseDelay: 1000 });
  if (!result.ok) throw result.error;
}

export async function completeDuel(duelId, userId) {
  const result = await tryIf(async () => {
    const { data: duel } = await supabase
      .from(TABLES.DUELS)
      .select('*')
      .eq('id', duelId)
      .single();

    if (!duel) return;

    const isChallenger = duel.challenger_id === userId;
    const field = isChallenger ? 'challenger_completed' : 'challenged_completed';
    const completedField = isChallenger ? 'challenger_completed_at' : 'challenged_completed_at';

    await supabase.from(TABLES.DUELS).update({
      [field]: true,
      [completedField]: new Date().toISOString(),
    }).eq('id', duelId);

    const bothCompleted = (isChallenger && duel.challenged_completed) || (!isChallenger && duel.challenger_completed);
    if (bothCompleted) {
      const challengerTime = duel.challenger_completed_at;
      const challengedTime = duel.challenged_completed_at;
      let winner;
      if (!challengerTime && challengedTime) winner = duel.challenged_id;
      else if (challengerTime && !challengedTime) winner = duel.challenger_id;
      else if (challengerTime && challengedTime) winner = new Date(challengerTime) <= new Date(challengedTime) ? duel.challenger_id : duel.challenged_id;
      else winner = isChallenger ? duel.challenger_id : duel.challenged_id;

      await supabase.from(TABLES.DUELS).update({ status: 'completed', winner_id: winner }).eq('id', duelId);
    }
  }, { retries: 3, baseDelay: 1000 });
  return result.ok ? result.data : undefined;
}

export async function getActiveDuelsCount(userId) {
  const result = await tryIf(async () => {
    const { count } = await supabase
      .from(TABLES.DUELS)
      .select('id', { count: 'exact', head: true })
      .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
      .eq('status', 'active');

    return count || 0;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : 0;
}
