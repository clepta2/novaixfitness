// src/services/wearablesActivity.ts
// Calorias, passos, sono e resumo diario

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';
import { getHeartRate } from './wearablesHeartRate';

const guard = createServiceGuard({ serviceName: 'wearablesActivity' });

export async function getCaloriesBurned(userId: string, date: string | null = null): Promise<number> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const nextDay = new Date(new Date(targetDate).getTime() + 86400000).toISOString();
  const { data: workouts } = await supabase.from(TABLES.USER_WORKOUTS)
    .select('calories_burned').eq('user_id', userId)
    .gte('completed_at', targetDate).lt('completed_at', nextDay);
  return (workouts || []).reduce((sum: number, w: Record<string, unknown>) => sum + ((w.calories_burned as number) || 0), 0);
}

export async function getSteps(userId: string, date: string | null = null): Promise<number> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const { data } = await supabase    .from(TABLES.DAILY_STEPS)
    .select('steps').eq('user_id', userId).eq('date', targetDate).single();
  return data?.steps || 0;
}

export async function logSteps(userId: string, steps: number, date: string | null = null): Promise<void> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  await guard.guard(async () => {
    const { error } = await supabase    .from(TABLES.DAILY_STEPS)
      .upsert({ user_id: userId, date: targetDate, steps }, { onConflict: 'user_id,date' });
    if (error) throw error;
  });
}

export async function getSleepData(userId: string, date: string | null = null): Promise<{ hours: number; quality: string | null }> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const { data } = await supabase    .from(TABLES.SLEEP_DATA)
    .select('*').eq('user_id', userId).eq('date', targetDate).single();
  return data || { hours: 0, quality: null };
}

export async function logSleep(userId: string, hours: number, quality: string, date: string | null = null): Promise<void> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  await guard.guard(async () => {
    const { error } = await supabase    .from(TABLES.SLEEP_DATA)
      .upsert({ user_id: userId, date: targetDate, hours, quality }, { onConflict: 'user_id,date' });
    if (error) throw error;
  });
}

export async function getDailySummary(userId: string, date: string | null = null): Promise<Record<string, unknown>> {
  const [heartRate, calories, steps, sleep] = await Promise.all([
    getHeartRate(userId), getCaloriesBurned(userId, date), getSteps(userId, date), getSleepData(userId, date),
  ]);
  return { heartRate: heartRate.bpm, calories, steps, sleepHours: sleep.hours, sleepQuality: sleep.quality };
}

export async function syncDeviceData(userId: string): Promise<Record<string, unknown>> {
  const summary = await getDailySummary(userId);
  return { synced: true, timestamp: new Date().toISOString(), data: summary };
}
