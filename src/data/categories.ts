import { COLORS } from '../constants/colors';

interface HomeCategory {
  key: string;
  label: string;
  icon: string;
  bg: string;
  color: string;
  category: string;
}

interface AllCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const HOME_CATEGORIES: HomeCategory[] = [
  { key: 'inferiores', label: 'INFERIORES', icon: 'footsteps', bg: COLORS.primary, color: COLORS.background, category: 'inferiores' },
  { key: 'superiores', label: 'SUPERIORES', icon: 'fitness', bg: COLORS.surfaceElevated, color: COLORS.textTitle, category: 'superiores' },
  { key: 'cardio', label: 'CARDIO', icon: 'heart', bg: '#00C853', color: COLORS.background, category: 'cardio' },
];

export const ALL_CATEGORIES: AllCategory[] = [
  { id: 'musculacao', label: 'MUSCULAÇÃO', icon: 'barbell-outline', description: 'Hipertrofia e força', color: '#6366F1' },
  { id: 'calistenia', label: 'CALISTENIA', icon: 'body-outline', description: 'Peso corporal', color: '#00E676' },
  { id: 'cardio', label: 'CARDIO', icon: 'heart-outline', description: 'HIIT, Tabata, LISS', color: '#FF6B35' },
  { id: 'flexibilidade', label: 'FLEXIBILIDADE', icon: 'leaf-outline', description: 'Alongamento e mobilidade', color: '#8B5CF6' },
  { id: 'inferiores', label: 'INFERIORES', icon: 'footsteps-outline', description: 'Pernas e glúteos', color: '#F59E0B' },
  { id: 'superiores', label: 'SUPERIORES', icon: 'fitness-outline', description: 'Peito, costas e braços', color: '#3B82F6' },
];
