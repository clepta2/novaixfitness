// src/services/wearables.ts
// Wearables - heart rate, activity, platform checks

import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const hrGuard = createServiceGuard({ serviceName: 'wearablesHeartRate' });
const actGuard = createServiceGuard({ serviceName: 'wearablesActivity' });

// --- Platform checks ---

export function getPlatform() { return Platform.OS; }
export function isIOS() { return Platform.OS === 'ios'; }
export function isAndroid() { return Platform.OS === 'android'; }

export async function checkAppleWatch() {
  if (!isIOS()) return { available: false, platform: 'android' };
  return { available: true, platform: 'ios' };
}

export async function connectAppleWatch() {
  const check = await checkAppleWatch();
  if (!check.available) return { connected: false, reason: 'not_available' };
  return { connected: true, platform: 'apple_watch' };
}

export async function checkGoogleFit() {
  if (!isAndroid()) return { available: false, platform: 'ios' };
  return { available: true, platform: 'android' };
}

export async function connectGoogleFit() {
  const check = await checkGoogleFit();
  if (!check.available) return { connected: false, reason: 'not_available' };
  return { connected: true, platform: 'google_fit' };
}

// --- Heart Rate ---

export async function getHeartRate(userId: string): Promise<{ bpm: number | null; recorded_at: string | null }> {
  const { data } = await supabase.from(TABLES.HEART_RATE_READINGS)
    .select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1).single();
  return data || { bpm: null, recorded_at: null };
}

export async function getHeartRateHistory(userId: string, hours: number = 24): Promise<Record<string, unknown>[]> {
  const since = new Date(Date.now() - hours * 3600000).toISOString();
  const { data } = await supabase.from(TABLES.HEART_RATE_READINGS)
    .select('*').eq('user_id', userId).gte('recorded_at', since).order('recorded_at', { ascending: true });
  return data || [];
}

export async function logHeartRate(userId: string, bpm: number, source: string = 'manual'): Promise<void> {
  await hrGuard.guard(async () => {
    const { error } = await supabase.from(TABLES.HEART_RATE_READINGS)
      .insert({ user_id: userId, bpm, source, recorded_at: new Date().toISOString() });
    if (error) throw error;
  });
}

// --- Activity ---

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
  const { data } = await supabase.from(TABLES.DAILY_STEPS)
    .select('steps').eq('user_id', userId).eq('date', targetDate).single();
  return data?.steps || 0;
}

export async function logSteps(userId: string, steps: number, date: string | null = null): Promise<void> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  await actGuard.guard(async () => {
    const { error } = await supabase.from(TABLES.DAILY_STEPS)
      .upsert({ user_id: userId, date: targetDate, steps }, { onConflict: 'user_id,date' });
    if (error) throw error;
  });
}

export async function getSleepData(userId: string, date: string | null = null): Promise<{ hours: number; quality: string | null }> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const { data } = await supabase.from(TABLES.SLEEP_DATA)
    .select('*').eq('user_id', userId).eq('date', targetDate).single();
  return data || { hours: 0, quality: null };
}

export async function logSleep(userId: string, hours: number, quality: string, date: string | null = null): Promise<void> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  await actGuard.guard(async () => {
    const { error } = await supabase.from(TABLES.SLEEP_DATA)
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
