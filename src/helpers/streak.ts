// src/helpers/streak.ts
// Cálculo de streak — usado por gamificação e analytics

export function calculateStreak(workouts: { completed: boolean; completed_at?: string }[]): number {
  if (!workouts.length) return 0;

  const dates = [...new Set(
    workouts
      .filter(w => w.completed && w.completed_at)
      .map(w => new Date(w.completed_at!).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (!dates.length) return 0;

  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}
