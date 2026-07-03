import { COLORS } from '../../constants/colors';

export const STREAK_BADGES = [
  { days: 3, label: 'Iniciante', icon: 'flame', color: COLORS.attention },
  { days: 7, label: 'Consistente', icon: 'flame', color: COLORS.secondary },
  { days: 14, label: 'Dedicado', icon: 'flame', color: COLORS.primary },
  { days: 30, label: 'Mestre', icon: 'trophy', color: COLORS.success },
  { days: 60, label: 'Lenda', icon: 'star', color: COLORS.primary },
];

export function calculateCurrentStreak(uniqueDays: string[]): number {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    if (uniqueDays.includes(checkDate.toDateString())) {
      streak++;
    } else if (i > 0) break;
  }
  return streak;
}

export function calculateBestStreak(uniqueDays: string[]): number {
  let best = 0;
  let current = 0;
  for (let i = uniqueDays.length - 1; i >= 0; i--) {
    if (i === uniqueDays.length - 1) {
      current = 1;
    } else {
      const curr = new Date(uniqueDays[i]);
      const prev = new Date(uniqueDays[i + 1]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) {
        current++;
      } else {
        best = Math.max(best, current);
        current = 1;
      }
    }
  }
  return Math.max(best, current);
}

export function generateWeekDots(uniqueDays: string[]): Array<{ day: string; active: boolean; isToday: boolean }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7.push({
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      active: uniqueDays.includes(d.toDateString()),
      isToday: i === 0,
    });
  }
  return last7;
}
