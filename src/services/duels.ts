// src/services/duels.js
// Serviço de duelos de treino

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'duels' });

export async function getDuels(userId) {
  const { data } = await supabase
    .from(TABLES.DUELS)
    .select('*, challenger:challenger_id(name, avatar_url), challenged:challenged_id(name, avatar_url)')
    .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function acceptDuel(duelId) {
  const { error } = await supabase
    .from(TABLES.DUELS)
    .update({ status: 'active' })
    .eq('id', duelId);

  if (error) throw error;
}

export async function completeDuel(duelId, userId) {
  const { data: duel } = await supabase
    .from(TABLES.DUELS)
    .select('*')
    .eq('id', duelId)
    .single();

  if (!duel) return;

  const isChallenger = duel.challenger_id === userId;
  const field = isChallenger ? 'challenger_completed' : 'challenged_completed';

  await supabase.from(TABLES.DUELS).update({ [field]: true }).eq('id', duelId);

  const bothCompleted = (isChallenger && duel.challenged_completed) || (!isChallenger && duel.challenger_completed);
  if (bothCompleted) {
    const winner = duel.challenger_completed ? duel.challenger_id : duel.challenged_id;
    await supabase.from(TABLES.DUELS).update({ status: 'completed', winner_id: winner }).eq('id', duelId);
  }
}

export async function getActiveDuelsCount(userId) {
  const { count } = await supabase
    .from(TABLES.DUELS)
    .select('id', { count: 'exact', head: true })
    .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
    .eq('status', 'active');

  return count || 0;
}
