// src/helpers/streaks.ts
// Streak calculation — canonical implementation is calculateStreak from ./streak
// This file re-exports for backward compatibility

export { calculateStreak as calcStreak } from './streak';

// calculateStreakData — detailed breakdown used by StreakCalculator component
export interface StreakResult {
  current: number;
  longest: number;
  totalDays: number;
  lastWorkoutDate: string | null;
  isActiveToday: boolean;
}

export function calculateStreakData(workouts: { completed: boolean; completed_at?: string }[]): StreakResult {
  if (!workouts?.length) {
    return { current: 0, longest: 0, totalDays: 0, lastWorkoutDate: null, isActiveToday: false };
  }

  const dates = [...new Set(
    workouts
      .filter(w => w.completed && w.completed_at)
      .map(w => new Date(w.completed_at!).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (!dates.length) {
    return { current: 0, longest: 0, totalDays: 0, lastWorkoutDate: null, isActiveToday: false };
  }

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Current streak (must reach today or yesterday)
  let current = 0;
  if (dates[0] === today || dates[0] === yesterday) {
    current = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / 86400000;
      if (diff === 1) current++;
      else break;
    }
  }

  // Longest streak (any consecutive chain)
  let longest = 1;
  let chain = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / 86400000;
    if (diff === 1) {
      chain++;
      longest = Math.max(longest, chain);
    } else {
      chain = 1;
    }
  }

  return {
    current,
    longest: Math.max(longest, current),
    totalDays: dates.length,
    lastWorkoutDate: dates[0],
    isActiveToday: current > 0,
  };
}
