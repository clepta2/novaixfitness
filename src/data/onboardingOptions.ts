// src/data/onboardingOptions.ts
// Opções de onboarding - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

export interface WeekDayOption {
  id: number;
  label: string;
  sub: string;
}

export interface LocationOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  desc?: string;
}

export interface GymTypeOption {
  id: string;
  label: string;
  icon: string;
  color?: string;
  description?: string;
}

export interface LevelOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface BodyModelOption {
  id: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
}

export interface TimeOption {
  id: number;
  label: string;
}

export const WEEK_DAYS: WeekDayOption[] = [
  { id: 2, label: '2x', sub: '2 dias' },
  { id: 3, label: '3x', sub: '3 dias' },
  { id: 4, label: '4x', sub: '4 dias' },
  { id: 5, label: '5x', sub: '5 dias' },
];

export const LOCATIONS: LocationOption[] = [
  { id: 'gym', label: 'Academia', icon: 'barbell-outline', color: COLORS.primary },
  { id: 'home', label: 'Casa', icon: 'home-outline', color: COLORS.cyan },
  { id: 'park', label: 'Parque', icon: 'leaf-outline', color: COLORS.success },
];

export const GYM_TYPES: GymTypeOption[] = [
  { id: 'smart_fit', label: 'Smart Fit', icon: 'business-outline' },
  { id: 'bio_ritmo', label: 'Bio Ritmo', icon: 'diamond-outline' },
  { id: 'bluefit', label: 'Bluefit', icon: 'fitness-outline' },
  { id: 'bodytech', label: 'Bodytech', icon: 'flame-outline' },
  { id: 'outro', label: 'Outra', icon: 'layers-outline' },
  { id: 'individual', label: 'Bairro', icon: 'home-outline' },
  { id: 'nao_tenho', label: 'Sem academia', icon: 'close-circle-outline' },
];

export const LEVELS: LevelOption[] = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf', color: COLORS.success },
  { id: 'intermediate', label: 'Intermediário', icon: 'flash', color: COLORS.attention },
  { id: 'advanced', label: 'Avançado', icon: 'flame', color: COLORS.secondary },
];

export const BODY_MODELS: BodyModelOption[] = [
  { id: 'young_boy', label: 'Jovem Homem', sub: '14-20 anos', icon: 'person-outline', color: COLORS.purple },
  { id: 'thin_man', label: 'Homem Magro', sub: 'Adulto, 20+', icon: 'man-outline', color: COLORS.purple },
  { id: 'heavy_man', label: 'Homem Sobrepeso', sub: 'Adulto, 20+', icon: 'man', color: COLORS.amber },
  { id: 'young_girl', label: 'Jovem Mulher', sub: '14-20 anos', icon: 'person', color: COLORS.pink },
  { id: 'thin_woman', label: 'Mulher Magra', sub: 'Adulta, 20+', icon: 'woman-outline', color: COLORS.pink },
  { id: 'heavy_woman', label: 'Mulher Sobrepeso', sub: 'Adulta, 20+', icon: 'woman', color: COLORS.amber },
];

export const WEEK_DAYS_LONG: WeekDayOption[] = [
  { id: 2, label: '2x', sub: '2 dias/sem' },
  { id: 3, label: '3x', sub: '3 dias/sem' },
  { id: 4, label: '4x', sub: '4 dias/sem' },
  { id: 5, label: '5x', sub: '5 dias/sem' },
  { id: 6, label: '6x', sub: '6 dias/sem' },
];

export const LOCATIONS_EXTENDED: LocationOption[] = [
  { id: 'gym', label: 'Academia', icon: 'barbell-outline', color: COLORS.primary, desc: 'Equipamentos completos' },
  { id: 'home', label: 'Casa', icon: 'home-outline', color: COLORS.cyan, desc: 'Peso corporal' },
  { id: 'park', label: 'Parque', icon: 'leaf-outline', color: COLORS.success, desc: 'Ao ar livre' },
];

export const ACADEMIA_TYPES: GymTypeOption[] = [
  { id: 'smart_fit', label: 'Smart Fit', icon: 'business-outline', color: COLORS.primary, description: 'Rede low-cost nacional' },
  { id: 'bio_ritmo', label: 'Bio Ritmo', icon: 'diamond-outline', color: COLORS.cyan, description: 'Rede premium boutique' },
  { id: 'bluefit', label: 'Bluefit', icon: 'fitness-outline', color: COLORS.success, description: 'Rede popular 24h' },
  { id: 'bodytech', label: 'Bodytech', icon: 'flame-outline', color: COLORS.secondary, description: 'Rede premium clube' },
  { id: 'outro_chain', label: 'Outra rede', icon: 'layers-outline', color: COLORS.attention, description: 'Franquias ou regionais' },
  { id: 'individual', label: 'Individual', icon: 'home-outline', color: COLORS.info, description: 'Pequena/media academia de bairro' },
  { id: 'nao_tenho', label: 'Não tenho', icon: 'close-circle-outline', color: COLORS.textMuted, description: 'Treino livre/sem aparelhos' },
];

export const TIME_OPTIONS: TimeOption[] = [
  { id: 30, label: 'Até 30 min' },
  { id: 45, label: '30-45 min' },
  { id: 60, label: '45-60 min' },
  { id: 90, label: 'Mais de 1h' },
];
