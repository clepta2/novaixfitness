import { COLORS } from '../constants/colors';

export const MEAL_ICONS = { cafe: 'sunny', almoco: 'restaurant', jantar: 'moon', lanche: 'cafe', outro: 'nutrition' };
export const MEAL_COLORS = { cafe: COLORS.attention, almoco: COLORS.primary, jantar: COLORS.info, lanche: COLORS.success, outro: COLORS.textMuted };

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatMealTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
