// src/services/analytics.js
// Servico de analytics e graficos - NOVAIX FITNESS

import { supabase } from '../config/supabase';

export async function getWorkoutAnalytics(userId, period = 'month') {
  if (!userId) return null;

  const now = new Date();
  let startDate;
  let prevStartDate;
  let prevEndDate;

  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
      prevEndDate = new Date(startDate);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      prevStartDate = new Date(startDate);
      prevStartDate.setMonth(prevStartDate.getMonth() - 1);
      prevEndDate = new Date(startDate);
      break;
    case 'quarter':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      prevStartDate = new Date(startDate);
      prevStartDate.setMonth(prevStartDate.getMonth() - 3);
      prevEndDate = new Date(startDate);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      prevStartDate = new Date(startDate);
      prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
      prevEndDate = new Date(startDate);
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      prevStartDate = new Date(startDate);
      prevStartDate.setMonth(prevStartDate.getMonth() - 1);
      prevEndDate = new Date(startDate);
  }

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

  if (!workouts.length && !prevWorkouts.length) {
    return {
      totalWorkouts: 0,
      totalMinutes: 0,
      avgDuration: 0,
      streak: 0,
      byCategory: {},
      byWeek: [],
      byMonth: [],
      byDayOfWeek: [],
      byHour: [],
      comparison: { workouts: 0, minutes: 0, pctChange: 0 },
      bestDay: null,
      bestHour: null,
    };
  }

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  const prevTotal = prevWorkouts.length;
  const prevMinutes = prevWorkouts.reduce((s, w) => s + (w.duration || 0), 0);
  const pctChange = prevTotal > 0 ? Math.round(((totalWorkouts - prevTotal) / prevTotal) * 100) : 0;

  const byCategory = {};
  workouts.forEach(w => {
    const cat = w.workouts?.category || 'Outro';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  const byDayOfWeek = {};
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  workouts.forEach(w => {
    const day = dayNames[new Date(w.completed_at).getDay()];
    byDayOfWeek[day] = (byDayOfWeek[day] || 0) + 1;
  });

  const byHour = {};
  workouts.forEach(w => {
    const hour = new Date(w.completed_at).getHours();
    const h = `${hour.toString().padStart(2, '0')}:00`;
    byHour[h] = (byHour[h] || 0) + 1;
  });

  const bestDay = Object.entries(byDayOfWeek).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const bestHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalWorkouts,
    totalMinutes,
    avgDuration,
    streak: calculateCurrentStreak(workouts),
    byCategory,
    byWeek: groupByWeek(workouts),
    byMonth: groupByMonth(workouts),
    byDayOfWeek: Object.entries(byDayOfWeek).map(([day, count]) => ({ day, count })),
    byHour: Object.entries(byHour).map(([hour, count]) => ({ hour, count })),
    comparison: {
      workouts: totalWorkouts - prevTotal,
      minutes: totalMinutes - prevMinutes,
      pctChange,
    },
    bestDay,
    bestHour,
  };
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

function groupByWeek(workouts) {
  const weeks = {};
  workouts.forEach(w => {
    const d = new Date(w.completed_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weeks[key] = (weeks[key] || 0) + 1;
  });
  return Object.entries(weeks).map(([date, count]) => ({ date, count }));
}

function groupByMonth(workouts) {
  const months = {};
  workouts.forEach(w => {
    const d = new Date(w.completed_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + 1;
  });
  return Object.entries(months).map(([date, count]) => ({ date, count }));
}

function calculateCurrentStreak(workouts) {
  const dates = [...new Set(
    workouts
      .filter(w => w.completed_at)
      .map(w => new Date(w.completed_at).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a));

  if (!dates.length) return 0;

  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}
