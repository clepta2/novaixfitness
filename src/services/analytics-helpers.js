// src/services/analytics-helpers.js
// Funcoes auxiliares consolidadas para analytics - NOVAIX FITNESS

export function groupByWeek(workouts) {
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

export function groupByMonth(workouts) {
  const months = {};
  workouts.forEach(w => {
    const d = new Date(w.completed_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + 1;
  });
  return Object.entries(months).map(([date, count]) => ({ date, count }));
}

export function calculateCurrentStreak(workouts) {
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

export function getPeriodDateBounds(period) {
  const now = new Date();
  let startDate;
  let prevStartDate;
  let prevEndDate;

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

  return { startDate, prevStartDate, prevEndDate };
}

export function processWorkoutAnalytics(workouts, prevWorkouts) {
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

const CATEGORY_TO_MUSCLE = {
  'Peito': 'chest', 'Chest': 'chest', 'Push': 'chest',
  'Costas': 'back', 'Back': 'back', 'Pull': 'back',
  'Pernas': 'legs', 'Legs': 'legs', 'Lower Body': 'legs', 'Glúteos': 'legs',
  'Ombros': 'shoulders', 'Shoulders': 'shoulders',
  'Braços': 'arms', 'Arms': 'arms', 'Bíceps': 'arms', 'Tríceps': 'arms',
  'Abdômen': 'core', 'Core': 'core', 'Abdomen': 'core',
};

export function calculateMuscleBalance(workouts) {
  const counts = { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
  workouts.forEach(w => {
    const category = w.workouts?.category || '';
    const muscle = CATEGORY_TO_MUSCLE[category];
    if (muscle) counts[muscle]++;
  });
  const max = Math.max(...Object.values(counts), 1);
  Object.keys(counts).forEach(k => { counts[k] = Math.round((counts[k] / max) * 100); });
  return counts;
}

// Funcoes auxiliares adicionais (consolidadas de analyticsHelpers.ts)
export function getPeriodStart(period) {
  const days = { week: 7, month: 30, quarter: 90, year: 365 };
  return new Date(Date.now() - (days[period] || 30) * 86400000).toISOString();
}

export function calculateStreak(dates) {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function groupByDay(items, dateField) {
  const byDay = {};
  for (const item of items) {
    const day = new Date(item[dateField]).toISOString().split('T')[0];
    byDay[day] = (byDay[day] || 0) + 1;
  }
  return byDay;
}

export function sumField(items, field) {
  return items.reduce((sum, item) => sum + ((item[field]) || 0), 0);
}
