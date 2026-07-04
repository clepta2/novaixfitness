// src/utils/atomicUpdates.ts
// Atomic profile field increments — eliminates read-modify-write race conditions

import { supabase } from '../config/supabase';

/**
 * Atomically increment `total_xp` for a user.
 * Uses Supabase RPC (`increment_xp`) which runs a single SQL UPDATE
 * with a row-level lock — no race condition possible.
 *
 * If the RPC function doesn't exist yet (migration not deployed),
 * falls back to read-modify-write as a temporary measure.
 */
export async function incrementXP(userId: string, amount: number): Promise<void> {
  if (!userId || amount <= 0) return;

  const { error } = await supabase.rpc('increment_xp', {
    p_user_id: userId,
    p_amount: amount,
  });

  // Fallback: if the RPC doesn't exist, use read-modify-write
  // This is still racy but better than crashing — the RPC migration fixes it
  if (error?.message?.includes('function') && error?.message?.includes('does not exist')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();
    const currentXP = profile?.total_xp ?? 0;
    await supabase
      .from('profiles')
      .update({ total_xp: currentXP + amount })
      .eq('id', userId);
    return;
  }

  if (error) throw error;
}

/**
 * Atomically increment multiple profile stats in a single row lock.
 * Used by workoutSaver to update total_workouts, total_minutes, and total_xp together.
 */
export async function incrementProfileStats(
  userId: string,
  stats: { workouts?: number; minutes?: number; xp?: number }
): Promise<void> {
  if (!userId) return;

  const { error } = await supabase.rpc('increment_profile_stats', {
    p_user_id: userId,
    p_workouts: stats.workouts ?? 0,
    p_minutes: stats.minutes ?? 0,
    p_xp: stats.xp ?? 0,
  });

  if (error?.message?.includes('function') && error?.message?.includes('does not exist')) {
    // Fallback: individual read-modify-write (racy but functional)
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp, total_workouts, total_minutes')
      .eq('id', userId)
      .single();
    if (!profile) return;
    await supabase
      .from('profiles')
      .update({
        total_xp: (profile.total_xp ?? 0) + (stats.xp ?? 0),
        total_workouts: (profile.total_workouts ?? 0) + (stats.workouts ?? 0),
        total_minutes: (profile.total_minutes ?? 0) + (stats.minutes ?? 0),
      })
      .eq('id', userId);
    return;
  }

  if (error) throw error;
}
