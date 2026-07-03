// src/data/breathingExercises.ts
// Exercicios de respiracao - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface BreathingPhase {
  name: string;
  duration: number;
  color: string;
}

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
  cycles: number;
  totalDuration: number;
  icon: string;
  color: string;
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: '478',
    name: '4-7-8 Relaxamento',
    description: 'Inspire 4s, segure 7s, expire 8s. Ideal para dormir.',
    phases: [
      { name: 'Inspire', duration: 4, color: '#CCFF00' },
      { name: 'Segure', duration: 7, color: '#FF6B35' },
      { name: 'Expire', duration: 8, color: '#00E676' },
    ],
    cycles: 4,
    totalDuration: 76,
    icon: 'bed',
    color: COLORS.primary,
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4s inspire, 4s segure, 4s expire, 4s segure. Para foco.',
    phases: [
      { name: 'Inspire', duration: 4, color: '#CCFF00' },
      { name: 'Segure', duration: 4, color: '#FF6B35' },
      { name: 'Expire', duration: 4, color: '#00E676' },
      { name: 'Segure', duration: 4, color: '#3B82F6' },
    ],
    cycles: 5,
    totalDuration: 80,
    icon: 'stopwatch',
    color: COLORS.info,
  },
  {
    id: 'coherent',
    name: 'Respiracao Coerente',
    description: '5s inspire, 5s expire. Equilibra sistema nervoso.',
    phases: [
      { name: 'Inspire', duration: 5, color: '#CCFF00' },
      { name: 'Expire', duration: 5, color: '#00E676' },
    ],
    cycles: 6,
    totalDuration: 60,
    icon: 'pulse',
    color: COLORS.success,
  },
  {
    id: 'energize',
    name: 'Respiracao Energizante',
    description: 'Inspire rapido e forte. Ativa o corpo.',
    phases: [
      { name: 'Inspire', duration: 2, color: '#CCFF00' },
      { name: 'Expire', duration: 2, color: '#00E676' },
    ],
    cycles: 10,
    totalDuration: 40,
    icon: 'flash',
    color: COLORS.secondary,
  },
];
