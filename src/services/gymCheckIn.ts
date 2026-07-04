// src/services/gymCheckIn.js
// Serviço de check-in na academia

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'gymCheckIn' });

export async function checkIn(userId, gymName) {
  const { data, error } = await supabase.from(TABLES.GYM_CHECK_INS).insert({
    user_id: userId,
    gym_name: gymName,
    checked_in_at: new Date().toISOString(),
  }).select().single();

  if (error) throw error;

  const xpGain = 5;
  const { data: profile } = await supabase.from(TABLES.PROFILES).select('total_xp').eq('id', userId).single();
  await supabase.from(TABLES.PROFILES).update({ total_xp: (profile?.total_xp || 0) + xpGain }).eq('id', userId);

  return data;
}

export async function checkOut(checkInId) {
  const { error } = await supabase
    .from(TABLES.GYM_CHECK_INS)
    .update({ checked_out_at: new Date().toISOString() })
    .eq('id', checkInId);

  if (error) throw error;
}

export async function getRecentCheckIns(limit = 10) {
  const { data } = await supabase
    .from(TABLES.GYM_CHECK_INS)
    .select('id, gym_name, checked_in_at, profiles:user_id(name, avatar_url)')
    .is('checked_out_at', null)
    .order('checked_in_at', { ascending: false })
    .limit(limit);

  return (data || []).map(c => {
    const profile = Array.isArray(c.profiles) ? c.profiles[0] : (c.profiles as any);
    return {
      id: c.id,
      gymName: c.gym_name,
      name: profile?.name || 'User',
      avatar: profile?.avatar_url,
      checkedInAt: c.checked_in_at,
    };
  });
}

export async function getUserCheckInHistory(userId, limit = 30) {
  const { data } = await supabase
    .from(TABLES.GYM_CHECK_INS)
    .select('*')
    .eq('user_id', userId)
    .order('checked_in_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getCheckInCount(userId) {
  const { count } = await supabase
    .from(TABLES.GYM_CHECK_INS)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  return count || 0;
}
