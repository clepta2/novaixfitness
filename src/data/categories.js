import { COLORS } from '../constants/colors';

export const HOME_CATEGORIES = [
  { key: 'inferiores', label: 'INFERIORES', icon: 'footsteps', bg: COLORS.primary, color: '#000', category: 'inferiores' },
  { key: 'superiores', label: 'SUPERIORES', icon: 'fitness', bg: '#FFFFFF', color: '#000', category: 'superiores' },
  { key: 'cardio', label: 'CARDIO', icon: 'heart', bg: '#00E676', color: '#000', category: 'cardio' },
];

export const ALL_CATEGORIES = [
  { id: 'musculacao', label: 'MUSCULAÇÃO', icon: 'barbell-outline', description: 'Hipertrofia e força', color: '#6366F1' },
  { id: 'calistenia', label: 'CALISTENIA', icon: 'body-outline', description: 'Peso corporal', color: '#00E676' },
  { id: 'cardio', label: 'CARDIO', icon: 'heart-outline', description: 'HIIT, Tabata, LISS', color: '#FF6B35' },
  { id: 'flexibilidade', label: 'FLEXIBILIDADE', icon: 'leaf-outline', description: 'Alongamento e mobilidade', color: '#8B5CF6' },
  { id: 'inferiores', label: 'INFERIORES', icon: 'footsteps-outline', description: 'Pernas e glúteos', color: '#F59E0B' },
  { id: 'superiores', label: 'SUPERIORES', icon: 'fitness-outline', description: 'Peito, costas e braços', color: '#3B82F6' },
];
