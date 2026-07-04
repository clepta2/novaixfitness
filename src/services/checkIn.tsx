// src/services/checkIn.ts
// Serviço de check-in diário

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import type { DailyCheckIn } from '../types';

interface CheckInResult {
  alreadyCheckedIn?: boolean;
  xp?: number;
  streakDay?: number;
  isNew?: boolean;
}

export async function getTodayCheckIn(userId: string): Promise<DailyCheckIn | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from(TABLES.DAILY_CHECK_INS)
    .select('*')
    .eq('user_id', userId)
    .eq('check_in_date', today)
    .maybeSingle();

  if (error) throw error;
  return data as DailyCheckIn | null;
}

export async function performCheckIn(userId: string): Promise<CheckInResult> {
  const today = new Date().toISOString().split('T')[0];

  try {
    const existing = await getTodayCheckIn(userId);
    if (existing) return { alreadyCheckedIn: true, xp: existing.xp_awarded };

    const { data: lastCheckIn } = await supabase
      .from(TABLES.DAILY_CHECK_INS)
      .select('check_in_date, streak_day')
      .eq('user_id', userId)
      .order('check_in_date', { ascending: false })
      .limit(1)
      .single();

    let streakDay = 1;
    if (lastCheckIn) {
      const lastDate = new Date(lastCheckIn.check_in_date);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
      streakDay = diffDays === 1 ? (lastCheckIn.streak_day || 0) + 1 : 1;
    }

    const dayIndex = ((streakDay - 1) % 7);
    const rewards = [10, 15, 20, 25, 30, 40, 100];
    const xp = rewards[dayIndex];

    const { error: insertError } = await supabase.from(TABLES.DAILY_CHECK_INS).insert({
      user_id: userId,
      check_in_date: today,
      xp_awarded: xp,
      streak_day: streakDay,
    });
    if (insertError) throw insertError;

    const { data: profile } = await supabase
      .from(TABLES.PROFILES)
      .select('total_xp')
      .eq('id', userId)
      .single();

    await supabase
      .from(TABLES.PROFILES)
      .update({ total_xp: (profile?.total_xp || 0) + xp })
      .eq('id', userId);

    return { streakDay, xp, isNew: true };
  } catch (err) {
    if (__DEV__) console.error('Erro no check-in:', err);
    return { alreadyCheckedIn: false, streakDay: 0, xp: 0, isNew: false };
  }
}

export async function getCheckInStreak(userId: string): Promise<number> {
  const { data } = await supabase
    .from(TABLES.DAILY_CHECK_INS)
    .select('check_in_date, streak_day')
    .eq('user_id', userId)
    .order('check_in_date', { ascending: false })
    .limit(1)
    .single();

  return data?.streak_day || 0;
}
