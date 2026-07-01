interface Workout {
  completed?: boolean;
  completed_at?: string;
}

export function calcStreak(workouts: Workout[]): number {
  const dates = [...new Set(
    workouts
      .filter(w => w.completed && w.completed_at)
      .map(w => new Date(w.completed_at!).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = dates.length ? 1 : 0;
  for (let i = 1; i < dates.length; i++) {
    if ((new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}
