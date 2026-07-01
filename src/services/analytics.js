// src/services/analytics.js
// Servico consolidado de analytics - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { getPeriodDateBounds, processWorkoutAnalytics, calculateMuscleBalance } from './analytics-helpers';

export { calculateMuscleBalance };

export async function getWorkoutAnalytics(userId, period = 'month') {
  if (!userId) return null;

  try {
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
  } catch (err) {
    console.error('Erro ao buscar analytics:', err);
    return null;
  }
}

export async function getWeightHistory(userId) {
  if (!userId) return [];

  try {
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
  } catch (err) {
    console.error('Erro ao buscar histórico de peso:', err);
    return [];
  }
}

export async function getWorkoutFrequency(userId) {
  if (!userId) return [];

  try {
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
  } catch (err) {
    console.error('Erro ao buscar frequência:', err);
    return [];
  }
}

export async function getMonthlyComparison(userId) {
  if (!userId) return [];

  try {
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
  } catch (err) {
    console.error('Erro ao buscar comparação mensal:', err);
    return [];
  }
}
