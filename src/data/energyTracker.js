import { COLORS } from '../constants/colors';

export const ENERGY_LEVELS = [
  { level: 1, label: 'Muito Baixa', icon: 'battery-dead', color: COLORS.error },
  { level: 2, label: 'Baixa', icon: 'battery-low', color: COLORS.secondary },
  { level: 3, label: 'Normal', icon: 'battery-half', color: COLORS.attention },
  { level: 4, label: 'Alta', icon: 'battery-charging', color: COLORS.success },
  { level: 5, label: 'Muito Alta', icon: 'battery-full', color: COLORS.primary },
];

export const TIME_SLOTS = [
  { id: 'morning', label: 'Manhã', time: '06-09h', icon: 'sunny' },
  { id: 'mid_morning', label: 'Meio-Manhã', time: '09-12h', icon: 'partly-sunny' },
  { id: 'afternoon', label: 'Tarde', time: '12-15h', icon: 'sunny' },
  { id: 'evening', label: 'Tarde', time: '15-18h', icon: 'partly-sunny' },
  { id: 'night', label: 'Noite', time: '18-21h', icon: 'moon' },
  { id: 'late_night', label: 'Noite', time: '21h+', icon: 'moon' },
];
