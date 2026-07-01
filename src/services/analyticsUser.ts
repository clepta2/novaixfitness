// src/services/analyticsUser.js
// Analytics por usuario: treino, nutricao, progresso, engajamento

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';
import { getPeriodStart, calculateStreak, sumField } from './analytics-helpers';

const guard = createServiceGuard({ serviceName: 'analyticsUser' });

export async function getWorkoutAnalytics(userId: string, period = 'month') {
  const result = await guard.guard(async () => {
    const startDate = getPeriodStart(period);
    const { data, error } = await supabase
      .from(TABLES.USER_WORKOUTS)
      .select('completed_at, duration, workout_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('completed_at', startDate)
      .order('completed_at', { ascending: true });

    if (error) throw error;
    const workouts = data || [];
    const totalWorkouts = workouts.length;
    const totalMinutes = sumField(workouts, 'duration');
    const byDay: Record<string, number> = {};
    for (const w of workouts) {
      const day = new Date(w.completed_at).toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    }

    return {
      totalWorkouts,
      totalMinutes,
      avgDuration: totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0,
      daysActive: Object.keys(byDay).length,
      streak: calculateStreak(Object.keys(byDay)),
      byDay,
    };
  });
  return result.ok ? result.data : { totalWorkouts: 0, totalMinutes: 0, avgDuration: 0, daysActive: 0, streak: 0, byDay: {} };
}

export async function getNutritionAnalytics(userId: string, period = 'month') {
  const startDate = getPeriodStart(period);
  const { data: meals, error: mealsErr } = await supabase
    .from(TABLES.MEAL_LOGS)
    .select('logged_at, calories, protein, carbs, fat')
    .eq('user_id', userId)
    .gte('logged_at', startDate);

  const { data: water, error: waterErr } = await supabase
    .from(TABLES.WATER_LOGS)
    .select('amount_ml, logged_at')
    .eq('user_id', userId)
    .gte('logged_at', startDate);

  if (mealsErr || waterErr) throw mealsErr || waterErr;

  const daysLogged = new Set(
    (meals || []).map(m => new Date(m.logged_at).toDateString())
  ).size;

  return {
    totalMeals: meals?.length || 0,
    totalCalories: sumField(meals, 'calories'),
    totalProtein: sumField(meals, 'protein'),
    totalCarbs: sumField(meals, 'carbs'),
    totalFat: sumField(meals, 'fat'),
    totalWater: sumField(water, 'amount_ml'),
    daysLogged,
    avgCaloriesPerDay: daysLogged > 0 ? Math.round(sumField(meals, 'calories') / daysLogged) : 0,
    avgWaterPerDay: daysLogged > 0 ? Math.round(sumField(water, 'amount_ml') / daysLogged) : 0,
  };
}

export async function getProgressAnalytics(userId: string) {
  const { data: weight, error: wErr } = await supabase
    .from(TABLES.WEIGHT_LOGS)
    .select('weight, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: true });

  const { data: workouts, error: woErr } = await supabase
    .from(TABLES.USER_WORKOUTS)
    .select('completed_at')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: true });

  if (wErr || woErr) throw wErr || woErr;

  const weightData = weight || [];
  const workoutData = workouts || [];
  const weightChange = weightData.length >= 2
    ? weightData[weightData.length - 1].weight - weightData[0].weight : 0;
  const totalWorkouts = workoutData.length;
  const weeks = Math.max(1, Math.ceil(
    (Date.now() - new Date(workoutData[0]?.completed_at || Date.now()).getTime()) / (7 * 86400000)
  ));

  return {
    weightData: weightData.map(w => ({ weight: w.weight, date: w.recorded_at })),
    weightChange: Math.round(weightChange * 10) / 10,
    currentWeight: weightData.length > 0 ? weightData[weightData.length - 1].weight : null,
    totalWorkouts,
    workoutsPerWeek: totalWorkouts > 0 ? Math.round(totalWorkouts / weeks * 10) / 10 : 0,
  };
}

export async function getEngagementMetrics(userId: string) {
  const result = await guard.guard(async () => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { data: events, error } = await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select('event_name, timestamp, properties')
      .eq('user_id', userId)
      .gte('timestamp', since);

    if (error) throw error;
    const list = events || [];
    const daysActive = new Set(list.map(e => new Date(e.timestamp).toDateString())).size;

    return {
      totalEvents: list.length,
      screenViews: list.filter(e => e.event_name === 'screen_viewed').length,
      featuresUsed: new Set(list.filter(e => e.event_name === 'feature_used').map(e => e.properties?.feature)).size,
      daysActive,
      engagementRate: (daysActive / 30) * 100,
      avgEventsPerDay: daysActive > 0 ? Math.round(list.length / daysActive) : 0,
    };
  });
  return result.ok ? result.data : { totalEvents: 0, screenViews: 0, featuresUsed: 0, daysActive: 0, engagementRate: 0, avgEventsPerDay: 0 };
}

export async function generateAnalyticsReport(userId: string, period = 'month') {
  const [workout, nutrition, progress, engagement] = await Promise.all([
    getWorkoutAnalytics(userId, period),
    getNutritionAnalytics(userId, period),
    getProgressAnalytics(userId),
    getEngagementMetrics(userId),
  ]);
  return {
    period,
    generatedAt: new Date().toISOString(),
    workout, nutrition, progress, engagement,
    summary: {
      totalWorkouts: workout.totalWorkouts,
      totalMinutes: workout.totalMinutes,
      weightChange: progress.weightChange,
      engagementRate: engagement.engagementRate,
    },
  };
}
