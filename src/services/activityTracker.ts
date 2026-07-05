// src/services/activityTracker.ts
// API própria de rastreamento de atividades — substitui Strava

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { tryIf } from '../utils/tryIf';

type ActivityType = 'running' | 'cycling' | 'walking' | 'hiking' | 'swimming' | 'other';

interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number;
  distance_meters: number;
  calories: number;
  heart_rate_avg: number | null;
  route_data: Record<string, unknown> | null;
  notes: string;
  synced_to_health: boolean;
}

interface StartActivityParams {
  type: ActivityType;
  notes?: string;
}

interface FinishActivityParams {
  distance_meters?: number;
  calories?: number;
  heart_rate_avg?: number;
  route_data?: Record<string, unknown>;
  notes?: string;
}

let activeActivityId: string | null = null;
let activityStartTime: number | null = null;

// Iniciar uma atividade
export async function startActivity(userId: string, params: StartActivityParams): Promise<string | null> {
  if (!userId) return null;

  const result = await tryIf(async () => {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        type: params.type,
        started_at: new Date().toISOString(),
        duration_seconds: 0,
        distance_meters: 0,
        calories: 0,
        notes: params.notes || '',
        synced_to_health: false,
      })
      .select('id')
      .single();

    if (error) throw error;
    activeActivityId = data.id;
    activityStartTime = Date.now();
    return data.id;
  }, { retries: 2, baseDelay: 500 });

  return result.ok ? result.data : null;
}

// Pausar atividade
export async function pauseActivity(activityId: string): Promise<boolean> {
  if (!activityId) return false;

  const result = await tryIf(async () => {
    const elapsed = activityStartTime ? Math.floor((Date.now() - activityStartTime) / 1000) : 0;
    const { error } = await supabase
      .from('activities')
      .update({ duration_seconds: elapsed })
      .eq('id', activityId);
    if (error) throw error;
    return true;
  }, { retries: 1, baseDelay: 500 });

  return result.ok;
}

// Retomar atividade
export async function resumeActivity(activityId: string): Promise<boolean> {
  if (!activityId) return false;
  activityStartTime = Date.now();
  activeActivityId = activityId;
  return true;
}

// Finalizar atividade
export async function finishActivity(activityId: string, data: FinishActivityParams): Promise<Activity | null> {
  if (!activityId) return null;

  const result = await tryIf(async () => {
    const elapsed = activityStartTime ? Math.floor((Date.now() - activityStartTime) / 1000) : 0;
    const { data: activity, error } = await supabase
      .from('activities')
      .update({
        finished_at: new Date().toISOString(),
        duration_seconds: elapsed,
        distance_meters: data.distance_meters || 0,
        calories: data.calories || 0,
        heart_rate_avg: data.heart_rate_avg || null,
        route_data: data.route_data || null,
        notes: data.notes || '',
      })
      .eq('id', activityId)
      .select('*')
      .single();

    if (error) throw error;
    activeActivityId = null;
    activityStartTime = null;
    return activity;
  }, { retries: 2, baseDelay: 1000 });

  return result.ok ? result.data : null;
}

// Obter histórico de atividades
export async function getActivityHistory(userId: string, limit: number = 20): Promise<Activity[]> {
  if (!userId) return [];

  const result = await tryIf(async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }, { retries: 1, baseDelay: 500 });

  return result.ok ? (result.data ?? []) : [];
}

// Obter estatísticas agregadas
export async function getActivityStats(userId: string, period: string = 'month'): Promise<{
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  byType: Record<string, number>;
}> {
  if (!userId) return { totalActivities: 0, totalDistance: 0, totalDuration: 0, totalCalories: 0, byType: {} };

  const result = await tryIf(async () => {
    const startDate = new Date();
    switch (period) {
      case 'week': startDate.setDate(startDate.getDate() - 7); break;
      case 'month': startDate.setMonth(startDate.getMonth() - 1); break;
      case 'year': startDate.setFullYear(startDate.getFullYear() - 1); break;
    }

    const { data, error } = await supabase
      .from('activities')
      .select('type, duration_seconds, distance_meters, calories')
      .eq('user_id', userId)
      .gte('started_at', startDate.toISOString())
      .not('finished_at', 'is', null);
    if (error) throw error;

    const activities = data || [];
    const byType: Record<string, number> = {};
    let totalDistance = 0;
    let totalDuration = 0;
    let totalCalories = 0;

    for (const a of activities) {
      byType[a.type] = (byType[a.type] || 0) + 1;
      totalDistance += a.distance_meters || 0;
      totalDuration += a.duration_seconds || 0;
      totalCalories += a.calories || 0;
    }

    return {
      totalActivities: activities.length,
      totalDistance,
      totalDuration,
      totalCalories,
      byType,
    };
  }, { retries: 1, baseDelay: 500 });

  return result.ok ? (result.data ?? { totalActivities: 0, totalDistance: 0, totalDuration: 0, totalCalories: 0, byType: {} }) : { totalActivities: 0, totalDistance: 0, totalDuration: 0, totalCalories: 0, byType: {} };
}

// Obter atividade ativa
export function getActiveActivityId(): string | null {
  return activeActivityId;
}

// Cancelar atividade
export async function cancelActivity(activityId: string): Promise<boolean> {
  if (!activityId) return false;

  const result = await tryIf(async () => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId);
    if (error) throw error;
    activeActivityId = null;
    activityStartTime = null;
    return true;
  }, { retries: 1, baseDelay: 500 });

  return result.ok;
}
