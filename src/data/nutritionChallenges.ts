import { COLORS } from '../constants/colors';

export const ICON_MAP: Record<string, string> = { Hidratação: 'water', Proteína: 'flash', Geral: 'fitness', Carboidratos: 'leaf', Sono: 'moon' };
export const COLOR_MAP: Record<string, string> = { Hidratação: COLORS.info, Proteína: COLORS.success, Geral: COLORS.primary, Carboidratos: COLORS.attention, Sono: COLORS.info };
export const DIFF_COLOR: Record<string, string> = { 'Fácil': COLORS.success, 'Médio': COLORS.attention, 'Difícil': COLORS.error };

export interface NutritionChallenge {
  id: string;
  title: string;
  desc: string;
  duration: string;
  xp: number;
  reward: number;
  difficulty: string;
  category: string;
}

export const FALLBACK_CHALLENGES: NutritionChallenge[] = [
  { id: 'hydration', title: 'Hidratação Total', desc: 'Beba 2.5L de água por 7 dias', duration: '7 dias', xp: 50, reward: 50, difficulty: 'Fácil', category: 'Hidratação' },
  { id: 'protein', title: 'Proteína No Alvo', desc: 'Atinja meta de proteína por 5 dias', duration: '5 dias', xp: 75, reward: 75, difficulty: 'Médio', category: 'Proteína' },
  { id: 'nosugar', title: 'Sem Açúcar', desc: 'Elimine açúcar refinado por 3 dias', duration: '3 dias', xp: 100, reward: 100, difficulty: 'Difícil', category: 'Geral' },
  { id: 'mealprep', title: 'Meal Prep Master', desc: 'Prepare todas as refeições no domingo', duration: '1 dia', xp: 80, reward: 80, difficulty: 'Médio', category: 'Geral' },
  { id: 'greens', title: 'Verde é Vida', desc: '3 porções de legumes por dia por 5 dias', duration: '5 dias', xp: 60, reward: 60, difficulty: 'Fácil', category: 'Carboidratos' },
  { id: 'lightdinner', title: 'Jantar Leve', desc: 'Jante antes das 19h por 7 dias', duration: '7 dias', xp: 70, reward: 70, difficulty: 'Médio', category: 'Geral' },
];
