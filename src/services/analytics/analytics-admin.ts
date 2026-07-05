// src/services/analytics/analytics-admin.ts
// Analytics administrativos — métricas de usuário e workouts

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';
import { tryIf } from '../../utils/tryIf';
import { EVENTS } from './analytics-tracker';
import { getPeriodStart } from './analytics-helpers';

// Re-exports de cohort/retention/segmentation
export { getCohortAnalysis, getUserRetention, getCohortRetention, getFunnelConversion, getConversionFunnel, getUserSegmentation, getChurnRiskUsers } from './analytics-cohort';

const guard = createServiceGuard({ serviceName: 'analyticsAdmin' });

export interface UserMetrics {
  totalEvents: number;
  workouts: number;
  screenViews: number;
  features: number;
}

export interface PopularWorkout {
  id: string;
  count: number;
}

export async function getUserMetrics(userId: string, days: number = 30): Promise<UserMetrics> {
  const result = await guard.guard(async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    return {
      totalEvents: data.length,
      workouts: data.filter(e => e.event_name === EVENTS.WORKOUT_COMPLETE).length,
      screenViews: data.filter(e => e.event_name === EVENTS.SCREEN_VIEW).length,
      features: data.filter(e => e.event_name === EVENTS.FEATURE_USED).length,
    };
  });
  return result.ok ? result.data : { totalEvents: 0, workouts: 0, screenViews: 0, features: 0 };
}

export async function getPopularWorkouts(limit: number = 10): Promise<PopularWorkout[]> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select('properties->>workout_id')
      .eq('event_name', EVENTS.WORKOUT_COMPLETE)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    const counts: Record<string, number> = {};
    data.forEach(row => {
      const id = (row as Record<string, unknown>).properties as Record<string, unknown> | null;
      const workoutId = id?.workout_id as string | undefined;
      if (workoutId) counts[workoutId] = (counts[workoutId] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  });
  return result.ok ? result.data : [];
}

export async function getWorkoutFrequency(userId: string, days: number = 30): Promise<Record<string, number>> {
  const result = await guard.guard(async () => {
    const startDate = new Date(Date.now() - days * 86400000).toISOString();
    const { data, error } = await supabase
      .from(TABLES.USER_WORKOUTS)
      .select('completed_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('completed_at', startDate);

    if (error) throw error;
    const frequency: Record<string, number> = {};
    (data || []).forEach(w => {
      const day = new Date(w.completed_at).toISOString().split('T')[0];
      frequency[day] = (frequency[day] || 0) + 1;
    });
    return frequency;
  });
  return result.ok ? result.data : {};
}

export async function getMonthlyComparison(userId: string): Promise<Record<string, unknown>> {
  const result = await tryIf(async () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [thisMonthData, lastMonthData] = await Promise.all([
      supabase.from(TABLES.USER_WORKOUTS).select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('completed', true).gte('completed_at', thisMonth.toISOString()),
      supabase.from(TABLES.USER_WORKOUTS).select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('completed', true).gte('completed_at', lastMonth.toISOString()).lt('completed_at', thisMonth.toISOString()),
    ]);

    return {
      thisMonth: thisMonthData.count || 0,
      lastMonth: lastMonthData.count || 0,
      change: ((thisMonthData.count || 0) - (lastMonthData.count || 0)),
    };
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data! : { thisMonth: 0, lastMonth: 0, change: 0 };
}

export async function getWeeklyConsistencyScore(userId: string): Promise<{ score: number; completedCount: number; targetCount: number }> {
  if (!userId) return { score: 0, completedCount: 0, targetCount: 0 };
  const result = await tryIf(async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const [workouts, obv2] = await Promise.all([
      supabase.from(TABLES.USER_WORKOUTS).select('id').eq('user_id', userId).eq('completed', true).gte('completed_at', monday.toISOString()),
      supabase.from(TABLES.ONBOARDING_V2).select('days_per_week').eq('user_id', userId).maybeSingle(),
    ]);

    const completedCount = workouts.data?.length || 0;
    const targetDays = (obv2.data?.days_per_week as number[] | undefined) || [1, 3, 5];
    const targetCount = targetDays.length;
    const score = targetCount > 0 ? Math.min(100, Math.round((completedCount / targetCount) * 100)) : 0;

    return { score, completedCount, targetCount };
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data! : { score: 0, completedCount: 0, targetCount: 0 };
}

export async function getCalorieBurnSummary(userId: string, period: string = 'month'): Promise<{ totalCalories: number; avgCaloriesPerWorkout: number; history: Array<{ date: string; calories: number }> }> {
  if (!userId) return { totalCalories: 0, avgCaloriesPerWorkout: 0, history: [] };
  const result = await tryIf(async () => {
    const startDate = getPeriodStart(period);
    const { data, error } = await supabase
      .from(TABLES.USER_WORKOUTS)
      .select('completed_at, duration_minutes, calories_burned')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('completed_at', startDate)
      .order('completed_at', { ascending: true });

    if (error) throw error;

    const list = data || [];
    let totalCalories = 0;
    const history = list.map(w => {
      let kcal = (w.calories_burned as number) || 0;
      if (kcal === 0 && w.duration_minutes) kcal = Math.round((w.duration_minutes as number) * 7.5);
      totalCalories += kcal;
      return { date: new Date(w.completed_at as string).toISOString().split('T')[0], calories: kcal };
    });

    return { totalCalories, avgCaloriesPerWorkout: list.length > 0 ? Math.round(totalCalories / list.length) : 0, history };
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data! : { totalCalories: 0, avgCaloriesPerWorkout: 0, history: [] };
}
