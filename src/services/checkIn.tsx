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
  const { data } = await supabase
    .from(TABLES.DAILY_CHECK_INS)
    .select('*')
    .eq('user_id', userId)
    .eq('check_in_date', today)
    .single();

  return data as DailyCheckIn | null;
}

export async function performCheckIn(userId: string): Promise<CheckInResult> {
  const today = new Date().toISOString().split('T')[0];

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

  await supabase.from('daily_check_ins').insert({
    user_id: userId,
    check_in_date: today,
    xp_awarded: xp,
    streak_day: streakDay,
  });

  const { data: profile } = await supabase
    .from(TABLES.PROFILES)
    .select('xp')
    .eq('id', userId)
    .single();

  await supabase
    .from(TABLES.PROFILES)
    .update({ xp: (profile?.xp || 0) + xp })
    .eq('id', userId);

  return { streakDay, xp, isNew: true };
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
