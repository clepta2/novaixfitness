// src/services/analytics-helpers.ts
// Funções auxiliares puras de analytics - NOVAIX FITNESS

import { calcStreak, calculateStreakData } from '../../helpers/streaks';

// ─── Períodos e datas ──────────────────────────────────────
export function getPeriodStart(period: string): string {
  const days = { week: 7, month: 30, quarter: 90, year: 365 };
  return new Date(Date.now() - (days[period] || 30) * 86400000).toISOString();
}

export function getPeriodDateBounds(period: string) {
  const now = new Date();
  let startDate: Date;
  let prevStartDate: Date;
  let prevEndDate: Date;

  const setMonths = (d: Date, months: number) => {
    const r = new Date(d);
    r.setMonth(r.getMonth() - months);
    return r;
  };

  switch (period) {
    case 'day':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 1);
      prevEndDate = new Date(startDate);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
      prevEndDate = new Date(startDate);
      break;
    case 'quarter':
      startDate = setMonths(now, 3);
      prevStartDate = setMonths(startDate, 3);
      prevEndDate = startDate;
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      prevStartDate = new Date(startDate);
      prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
      prevEndDate = new Date(startDate);
      break;
    default: // month
      startDate = setMonths(now, 1);
      prevStartDate = setMonths(startDate, 1);
      prevEndDate = startDate;
  }

  return { startDate, prevStartDate, prevEndDate };
}

// ─── Streak ────────────────────────────────────────────────
export function calculateCurrentStreak(workouts: any[]): number {
  return calcStreak(workouts);
}

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const items = dates.map(d => ({ completed: true, completed_at: d }));
  return calculateStreakData(items).current;
}

// ─── Agrupamento ───────────────────────────────────────────
export function groupByWeek(workouts: any[]) {
  const weeks: Record<string, number> = {};
  workouts.forEach(w => {
    const d = new Date(w.completed_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weeks[key] = (weeks[key] || 0) + 1;
  });
  return Object.entries(weeks).map(([date, count]) => ({ date, count }));
}

export function groupByMonth(workouts: any[]) {
  const months: Record<string, number> = {};
  workouts.forEach(w => {
    const d = new Date(w.completed_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + 1;
  });
  return Object.entries(months).map(([date, count]) => ({ date, count }));
}

export function groupByDay(items: Record<string, unknown>[], dateField: string) {
  const byDay: Record<string, number> = {};
  for (const item of items) {
    const day = new Date(item[dateField] as string).toISOString().split('T')[0];
    byDay[day] = (byDay[day] || 0) + 1;
  }
  return byDay;
}

// ─── Utilitários ───────────────────────────────────────────
export function sumField(items: Record<string, unknown>[], field: string) {
  return items.reduce((sum, item) => sum + ((item[field] as number) || 0), 0);
}

// ─── Processamento de analytics ────────────────────────────
export function processWorkoutAnalytics(workouts: any[], prevWorkouts: any[]) {
  if (!workouts.length && !prevWorkouts.length) {
    return {
      totalWorkouts: 0, totalMinutes: 0, avgDuration: 0, streak: 0,
      byCategory: {}, byWeek: [], byMonth: [], byDayOfWeek: [], byHour: [],
      comparison: { workouts: 0, minutes: 0, pctChange: 0 },
      bestDay: null, bestHour: null,
    };
  }

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  const prevTotal = prevWorkouts.length;
  const prevMinutes = prevWorkouts.reduce((s, w) => s + (w.duration || 0), 0);
  const pctChange = prevTotal > 0 ? Math.round(((totalWorkouts - prevTotal) / prevTotal) * 100) : 0;

  const byCategory: Record<string, number> = {};
  workouts.forEach(w => {
    const cat = w.workouts?.category || 'Outro';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  const byDayOfWeek: Record<string, number> = {};
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  workouts.forEach(w => {
    const day = dayNames[new Date(w.completed_at).getDay()];
    byDayOfWeek[day] = (byDayOfWeek[day] || 0) + 1;
  });

  const byHour: Record<string, number> = {};
  workouts.forEach(w => {
    const hour = new Date(w.completed_at).getHours();
    const h = `${hour.toString().padStart(2, '0')}:00`;
    byHour[h] = (byHour[h] || 0) + 1;
  });

  const bestDay = Object.entries(byDayOfWeek).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const bestHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalWorkouts, totalMinutes, avgDuration,
    streak: calcStreak(workouts),
    byCategory,
    byWeek: groupByWeek(workouts),
    byMonth: groupByMonth(workouts),
    byDayOfWeek: Object.entries(byDayOfWeek).map(([day, count]) => ({ day, count })),
    byHour: Object.entries(byHour).map(([hour, count]) => ({ hour, count })),
    comparison: { workouts: totalWorkouts - prevTotal, minutes: totalMinutes - prevMinutes, pctChange },
    bestDay, bestHour,
  };
}

// ─── Balanceamento muscular ────────────────────────────────
const CATEGORY_TO_MUSCLE: Record<string, string> = {
  'Peito': 'chest', 'Chest': 'chest', 'Push': 'chest',
  'Costas': 'back', 'Back': 'back', 'Pull': 'back',
  'Pernas': 'legs', 'Legs': 'legs', 'Lower Body': 'legs', 'Glúteos': 'legs',
  'Ombros': 'shoulders', 'Shoulders': 'shoulders',
  'Braços': 'arms', 'Arms': 'arms', 'Bíceps': 'arms', 'Tríceps': 'arms',
  'Abdômen': 'core', 'Core': 'core', 'Abdomen': 'core',
};

export function calculateMuscleBalance(workouts: any[]) {
  const counts: Record<string, number> = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
  workouts.forEach(w => {
    const category = w.workouts?.category || '';
    const muscle = CATEGORY_TO_MUSCLE[category];
    if (muscle) counts[muscle]++;
  });
  const max = Math.max(...Object.values(counts), 1);
  Object.keys(counts).forEach(k => { counts[k] = Math.round((counts[k] / max) * 100); });
  return counts;
}
