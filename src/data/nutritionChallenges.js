import { COLORS } from '../constants/colors';

export const ICON_MAP = { Hidratação: 'water', Proteína: 'flash', Geral: 'fitness', Carboidratos: 'leaf', Sono: 'moon' };
export const COLOR_MAP = { Hidratação: COLORS.info, Proteína: COLORS.success, Geral: COLORS.primary, Carboidratos: COLORS.attention, Sono: COLORS.info };
export const DIFF_COLOR = { 'Fácil': COLORS.success, 'Médio': COLORS.attention, 'Difícil': COLORS.error };

export const FALLBACK_CHALLENGES = [
  { title: 'Hidratação Total', desc: 'Beba 2.5L de água por 7 dias', duration: '7 dias', reward: 50, difficulty: 'Fácil', category: 'Hidratação' },
  { title: 'Proteína No Alvo', desc: 'Atinja meta de proteína por 5 dias', duration: '5 dias', reward: 75, difficulty: 'Médio', category: 'Proteína' },
  { title: 'Sem Açúcar', desc: 'Elimine açúcar refinado por 3 dias', duration: '3 dias', reward: 100, difficulty: 'Difícil', category: 'Geral' },
  { title: 'Meal Prep Master', desc: 'Prepare todas as refeições no domingo', duration: '1 dia', reward: 80, difficulty: 'Médio', category: 'Geral' },
  { title: 'Verde é Vida', desc: '3 porções de legumes por dia por 5 dias', duration: '5 dias', reward: 60, difficulty: 'Fácil', category: 'Carboidratos' },
  { title: 'Jantar Leve', desc: 'Jante antes das 19h por 7 dias', duration: '7 dias', reward: 70, difficulty: 'Médio', category: 'Geral' },
];
