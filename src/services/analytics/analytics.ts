// src/services/analytics/analytics.ts
// Analytics de treino e engagement

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';
import { tryIf } from '../../utils/tryIf';
import { getPeriodDateBounds, getPeriodStart, processWorkoutAnalytics, calculateStreak, sumField } from './analytics-helpers';

export { calculateMuscleBalance, sumField } from './analytics-helpers';
export { getNutritionAnalytics, getProgressAnalytics } from './analytics-nutrition';

const guard = createServiceGuard({ serviceName: 'analytics' });

export async function getWorkoutAnalytics(userId: string, period = 'month') {
  if (!userId) return null;

  const result = await tryIf(async () => {
    const { startDate, prevStartDate, prevEndDate } = getPeriodDateBounds(period);

    const [currentData, prevData] = await Promise.all([
      supabase
        .from('user_workouts')
        .select('completed, duration, completed_at, workouts(category, level)')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true }),
      supabase
        .from('user_workouts')
        .select('completed, duration, completed_at')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('completed_at', prevStartDate.toISOString())
        .lt('completed_at', prevEndDate.toISOString()),
    ]);

    return processWorkoutAnalytics(currentData.data || [], prevData.data || []);
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : null;
}

export async function getWeightHistory(userId: string) {
  if (!userId) return [];

  const result = await tryIf(async () => {
    const { data } = await supabase
      .from('weight_logs')
      .select('weight, recorded_at')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: true })
      .limit(52);

    return (data || []).map(w => ({
      weight: w.weight,
      date: new Date(w.recorded_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      fullDate: w.recorded_at,
    }));
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : [];
}

export async function getWorkoutFrequency(userId: string) {
  if (!userId) return [];

  const result = await tryIf(async () => {
    const now = new Date();
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      weeks.push({
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
        label: weekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
      });
    }

    const { data: workouts } = await supabase
      .from('user_workouts')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('completed', true);

    return weeks.map(week => ({
      week: week.label,
      count: (workouts || []).filter(w => {
        const d = new Date(w.completed_at);
        return d >= new Date(week.start) && d <= new Date(week.end);
      }).length,
    }));
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : [];
}

export async function getMonthlyComparison(userId: string) {
  if (!userId) return [];

  const result = await tryIf(async () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
      });
    }

    const { data: workouts } = await supabase
      .from('user_workouts')
      .select('duration, completed_at')
      .eq('user_id', userId)
      .eq('completed', true);

    return months.map(m => {
      const monthWorkouts = (workouts || []).filter(w => {
        const d = new Date(w.completed_at);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === m.key;
      });
      return {
        month: m.label,
        workouts: monthWorkouts.length,
        minutes: monthWorkouts.reduce((s, w) => s + (w.duration || 0), 0),
      };
    });
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : [];
}

export async function getUserWorkoutAnalytics(userId: string, period = 'month') {
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
      totalWorkouts, totalMinutes,
      avgDuration: totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0,
      daysActive: Object.keys(byDay).length,
      streak: calculateStreak(Object.keys(byDay)),
      byDay,
    };
  });
  return result.ok ? result.data : { totalWorkouts: 0, totalMinutes: 0, avgDuration: 0, daysActive: 0, streak: 0, byDay: {} };
}

export async function getEngagementMetrics(userId: string) {
  const result = await guard.guard(async () => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { data: events } = await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select('event_name, timestamp, properties')
      .eq('user_id', userId)
      .gte('timestamp', since);

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
  const { getNutritionAnalytics, getProgressAnalytics } = await import('./analytics-nutrition');
  const [workout, nutrition, progress, engagement] = await Promise.all([
    getUserWorkoutAnalytics(userId, period),
    getNutritionAnalytics(userId, period),
    getProgressAnalytics(userId),
    getEngagementMetrics(userId),
  ]);
  return {
    period, generatedAt: new Date().toISOString(),
    workout, nutrition, progress, engagement,
    summary: {
      totalWorkouts: workout.totalWorkouts,
      totalMinutes: workout.totalMinutes,
      weightChange: progress.weightChange,
      engagementRate: engagement.engagementRate,
    },
  };
}
