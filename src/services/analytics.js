// src/services/analytics.js
// Servico de analytics e graficos - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { getPeriodDateBounds, processWorkoutAnalytics, calculateMuscleBalance } from './analytics-helpers';

export { calculateMuscleBalance };

export async function getWorkoutAnalytics(userId, period = 'month') {
  if (!userId) return null;

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

  const workouts = currentData.data || [];
  const prevWorkouts = prevData.data || [];

  return processWorkoutAnalytics(workouts, prevWorkouts);
}

export async function getWeightHistory(userId) {
  if (!userId) return [];

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
}

export async function getWorkoutFrequency(userId) {
  if (!userId) return [];

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

  return weeks.map(week => {
    const count = (workouts || []).filter(w => {
      const d = new Date(w.completed_at);
      return d >= new Date(week.start) && d <= new Date(week.end);
    }).length;
    return { week: week.label, count };
  });
}

export async function getMonthlyComparison(userId) {
  if (!userId) return [];

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
}
