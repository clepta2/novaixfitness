import { COLORS } from '../constants/colors';

export const MEAL_ICONS: Record<string, string> = { cafe: 'sunny', almoco: 'restaurant', jantar: 'moon', lanche: 'cafe', outro: 'nutrition' };
export const MEAL_COLORS: Record<string, string> = { cafe: COLORS.attention, almoco: COLORS.primary, jantar: COLORS.info, lanche: COLORS.success, outro: COLORS.textMuted };

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatMealTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
