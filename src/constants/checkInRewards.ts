// src/constants/checkInRewards.ts
// Recompensas do check-in diário

export interface CheckInReward {
  day: number;
  xp: number;
  label: string;
}

export const CHECK_IN_REWARDS: CheckInReward[] = [
  { day: 1, xp: 10, label: 'Bem-vindo de volta!' },
  { day: 2, xp: 15, label: 'Continue assim!' },
  { day: 3, xp: 20, label: 'Três dias seguidos!' },
  { day: 4, xp: 25, label: 'Quase lá!' },
  { day: 5, xp: 30, label: 'Cinco dias!' },
  { day: 6, xp: 40, label: 'Incrível consistência!' },
  { day: 7, xp: 100, label: 'Semana completa! 🎉' },
];

export function getCheckInReward(streakDay: number): CheckInReward {
  const dayIndex = ((streakDay - 1) % 7);
  return CHECK_IN_REWARDS[dayIndex];
}

export function getCheckInMessage(streakDay: number): string {
  const reward = getCheckInReward(streakDay);
  return reward?.label || 'Bom treino!';
}
