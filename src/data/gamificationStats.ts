import { COLORS } from '../constants/colors';

export interface GamificationStat {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export const STATS: GamificationStat[] = [
  { key: 'totalXP', label: 'XP Total', icon: 'flash', color: COLORS.primary },
  { key: 'achievements', label: 'Conquistas', icon: 'trophy', color: COLORS.attention },
  { key: 'streak', label: 'Sequencia', icon: 'flame', color: COLORS.secondary },
  { key: 'totalWorkouts', label: 'Treinos', icon: 'barbell', color: COLORS.success },
];
