import { COLORS } from '../constants/colors';

export const CYCLING_PLANS = [
  {
    id: '3plus1',
    name: '3+1',
    desc: '3 dias normais, 1 dia alto',
    days: [
      { type: 'high', label: 'Alto', multiplier: 1.3 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
    ],
  },
  {
    id: '2plus1',
    name: '2+1',
    desc: '2 dias baixos, 1 dia alto',
    days: [
      { type: 'low', label: 'Baixo', multiplier: 0.8 },
      { type: 'low', label: 'Baixo', multiplier: 0.8 },
      { type: 'high', label: 'Alto', multiplier: 1.2 },
    ],
  },
  {
    id: '5plus2',
    name: '5+2',
    desc: '5 dias normais, 2 dias baixos',
    days: [
      { type: 'low', label: 'Baixo', multiplier: 0.75 },
      { type: 'low', label: 'Baixo', multiplier: 0.75 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
      { type: 'normal', label: 'Normal', multiplier: 1.0 },
    ],
  },
];

export const TYPE_COLORS = { high: COLORS.primary, normal: COLORS.success, low: COLORS.info };
