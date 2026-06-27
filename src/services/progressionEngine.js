// src/services/progressionEngine.js
// Motor de progressão multimodal - NOVAIX FITNESS

import { supabase } from '../config/supabase';

const MODALITY_CONFIG = {
  gym: {
    name: 'Academia',
    metrics: ['weight', 'reps', 'sets', 'rest'],
    progression: 'load',
    deloadFactor: 0.6,
    incrementStep: 2.5,
    maxSets: 6,
    minSets: 2,
  },
  calisthenics: {
    name: 'Calistenia',
    metrics: ['variation', 'timeUnderTension', 'sets', 'rest'],
    progression: 'variation',
    variations: [
      { level: 1, name: 'Flexão Joelhos', difficulty: 1 },
      { level: 2, name: 'Flexão Standard', difficulty: 2 },
      { level: 3, name: 'Flexão Declinada', difficulty: 3 },
      { level: 4, name: 'Flexão com Palma', difficulty: 4 },
      { level: 5, name: 'Flexão One Arm', difficulty: 5 },
    ],
  },
  cardio: {
    name: 'Cardio',
    metrics: ['distance', 'duration', 'pace', 'heartRate'],
    progression: 'endurance',
    incrementPercent: 0.05,
    maxHeartRateZones: ['fat_burn', 'cardio', 'peak'],
  },
  dance: {
    name: 'Dança',
    metrics: ['complexity', 'duration', 'rhythm', 'coordination'],
    progression: 'complexity',
    levels: ['Básico', 'Intermediário', 'Avançado', 'Coreógrafia'],
  },
  yoga: {
    name: 'Yoga',
    metrics: ['poseDifficulty', 'holdTime', 'flexibility', 'balance'],
    progression: 'flexibility',
    holdTimeIncrement: 5,
    maxHoldTime: 120,
  },
  hiit: {
    name: 'HIIT',
    metrics: ['intensity', 'workRatio', 'restRatio', 'exercises'],
    progression: 'intensity',
    intensityLevels: ['Moderado', 'Intenso', 'Máximo'],
  },
};

export function getModalityConfig(modality) {
  return MODALITY_CONFIG[modality] || MODALITY_CONFIG.gym;
}

export function analyzeProgression(workoutType, exerciseLogs, historicalData = []) {
  const config = getModalityConfig(workoutType);

  switch (config.progression) {
    case 'load':
      return analyzeLoadProgression(exerciseLogs, historicalData);
    case 'variation':
      return analyzeVariationProgression(exerciseLogs);
    case 'endurance':
      return analyzeEnduranceProgression(exerciseLogs);
    case 'complexity':
      return analyzeComplexityProgression(exerciseLogs);
    case 'flexibility':
      return analyzeFlexibilityProgression(exerciseLogs);
    case 'intensity':
      return analyzeIntensityProgression(exerciseLogs);
    default:
      return { type: 'maintain', reason: 'Modalidade desconhecida' };
  }
}

function analyzeLoadProgression(logs, historical) {
  if (!logs?.length) return { type: 'start', reason: 'Primeira vez' };

  const recent = logs.slice(0, 10);
  const avgWeight = recent.reduce((s, l) => s + (l.weight_kg || 0), 0) / recent.length;
  const avgReps = recent.reduce((s, l) => s + (l.reps_done || 0), 0) / recent.length;
  const completionRate = recent.filter(l => l.completed).length / recent.length;

  if (completionRate > 0.9 && avgReps >= 12) return { type: 'progress', reason: 'Alta performance', weight: avgWeight + 2.5 };
  if (completionRate < 0.5) return { type: 'regress', reason: 'Dificuldade', weight: Math.max(0, avgWeight - 2.5) };
  return { type: 'maintain', reason: 'Performance estável' };
}

function analyzeVariationProgression(logs) {
  if (!logs?.length) return { type: 'start', variationLevel: 1 };
  const lastExercise = logs[0];
  const currentLevel = lastExercise.variation_level || 1;
  const completionRate = logs.filter(l => l.completed).length / logs.length;

  if (completionRate > 0.85 && currentLevel < 5) return { type: 'progress', variationLevel: currentLevel + 1 };
  if (completionRate < 0.4 && currentLevel > 1) return { type: 'regress', variationLevel: currentLevel - 1 };
  return { type: 'maintain', variationLevel: currentLevel };
}

function analyzeEnduranceProgression(logs) {
  if (!logs?.length) return { type: 'start' };
  const recent = logs.slice(0, 5);
  const avgDuration = recent.reduce((s, l) => s + (l.duration_min || 0), 0) / recent.length;
  const avgPace = recent.reduce((s, l) => s + (l.pace || 0), 0) / recent.length;

  if (avgPace < 6) return { type: 'progress', reason: 'Ritmo melhorou', duration: avgDuration + 5 };
  return { type: 'maintain', reason: 'Manter ritmo atual' };
}

function analyzeComplexityProgression(logs) {
  if (!logs?.length) return { type: 'start', level: 0 };
  const avgComplexity = logs.reduce((s, l) => s + (l.complexity_score || 0), 0) / logs.length;
  const accuracy = logs.reduce((s, l) => s + (l.rhythm_accuracy || 0), 0) / logs.length;

  if (accuracy > 0.8 && avgComplexity < 4) return { type: 'progress', level: Math.min(4, Math.floor(avgComplexity) + 1) };
  return { type: 'maintain', level: Math.floor(avgComplexity) };
}

function analyzeFlexibilityProgression(logs) {
  if (!logs?.length) return { type: 'start' };
  const recent = logs.slice(0, 5);
  const avgHold = recent.reduce((s, l) => s + (l.hold_time || 0), 0) / recent.length;
  const flexibility = recent.reduce((s, l) => s + (l.flexibility_score || 0), 0) / recent.length;

  if (flexibility > 70 && avgHold < 90) return { type: 'progress', holdTime: avgHold + 5 };
  return { type: 'maintain' };
}

function analyzeIntensityProgression(logs) {
  if (!logs?.length) return { type: 'start', intensity: 0 };
  const recent = logs.slice(0, 5);
  const avgIntensity = recent.reduce((s, l) => s + (l.intensity_score || 0), 0) / recent.length;
  const avgHR = recent.reduce((s, l) => s + (l.avg_heart_rate || 0), 0) / recent.length;

  if (avgIntensity < 7 && avgHR < 150) return { type: 'progress', intensity: Math.min(10, avgIntensity + 1) };
  return { type: 'maintain' };
}

export function applyProgression(workout, progression) {
  if (!workout?.exercises) return workout;

  const adapted = { ...workout };

  switch (progression.type) {
    case 'progress':
      adapted.exercises = workout.exercises.map(ex => ({
        ...ex,
        weight: progression.weight || ex.weight,
        sets: progression.sets || ex.sets,
        reps: progression.reps || ex.reps,
        variation_level: progression.variationLevel || ex.variation_level,
        hold_time: progression.holdTime || ex.hold_time,
        intensity: progression.intensity || ex.intensity,
      }));
      break;
    case 'regress':
      adapted.exercises = workout.exercises.map(ex => ({
        ...ex,
        weight: progression.weight || ex.weight,
        sets: Math.max(2, (ex.sets || 3) - 1),
        variation_level: progression.variationLevel || ex.variation_level,
      }));
      break;
  }

  return adapted;
}

export function getProgressionSummary(progression) {
  const messages = {
    start: 'Iniciando novo exercício. Foque na forma correta.',
    progress: 'Progressão detectada! Aumentando desafio.',
    regress: 'Reduzindo carga para garantir execução correta.',
    maintain: 'Mantendo nível atual. Consistência é chave!',
  };
  return messages[progression.type] || 'Continuando treino.';
}
