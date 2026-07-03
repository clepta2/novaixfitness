import { COLORS } from '../constants/colors';

interface RatingItem {
  stars: number;
  label: string;
  icon: string;
  color: string;
}

export const RATING_CONFIG: RatingItem[] = [
  { stars: 1, label: 'Ruim', icon: 'thumbs-down', color: COLORS.error },
  { stars: 2, label: 'Ok', icon: 'remove', color: COLORS.secondary },
  { stars: 3, label: 'Bom', icon: 'checkmark', color: COLORS.attention },
  { stars: 4, label: 'Muito Bom', icon: 'thumbs-up', color: COLORS.success },
  { stars: 5, label: 'Perfeito!', icon: 'trophy', color: COLORS.primary },
];

export const QUICK_TAGS: string[] = ['Fácil', 'Difícil', 'Divertido', 'Monótono', 'Bem planejado', 'Exaustivo'];
