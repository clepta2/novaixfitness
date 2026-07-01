// src/services/wearablesHeartRate.ts
// Leituras de frequencia cardiaca

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'wearablesHeartRate' });

export async function getHeartRate(userId: string): Promise<{ bpm: number | null; recorded_at: string | null }> {
  const { data } = await supabase    .from(TABLES.HEART_RATE_READINGS)
    .select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1).single();
  return data || { bpm: null, recorded_at: null };
}

export async function getHeartRateHistory(userId: string, hours: number = 24): Promise<Record<string, unknown>[]> {
  const since = new Date(Date.now() - hours * 3600000).toISOString();
  const { data } = await supabase    .from(TABLES.HEART_RATE_READINGS)
    .select('*').eq('user_id', userId).gte('recorded_at', since).order('recorded_at', { ascending: true });
  return data || [];
}

export async function logHeartRate(userId: string, bpm: number, source: string = 'manual'): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase    .from(TABLES.HEART_RATE_READINGS)
      .insert({ user_id: userId, bpm, source, recorded_at: new Date().toISOString() });
    if (error) throw error;
  });
}
