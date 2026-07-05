// src/services/adaptivePlan.ts
// Gerador de plano adaptativo - DATA DRIVEN

import { LEVEL_CONFIG, GOAL_ADJUSTMENTS, AGE_ADJUSTMENTS } from '../data/planConfig';
import { calculateWater } from './waterCalculator';

interface AssessmentData {
  pushups?: number;
  squat?: number;
  plank?: number;
  run?: number;
  flexibility?: number;
  abs?: number;
  balance?: number;
}

interface UserProfile {
  goal?: string;
  ageRange?: string;
  weight?: number;
  height?: number;
  injuries?: string[];
}

interface WorkoutConfig {
  daysPerWeek: number;
  sessionDuration: number;
  exercisesPerSession: number;
  setsRange: number[];
  repsRange: string | [number, number];
  restBetweenSets: number;
  cardioPerSession: number;
}

interface AdaptivePlan {
  level: string;
  assessmentScore: number;
  assessmentPercentage: number;
  workout: WorkoutConfig;
  rest: { minSleep: number; restDays: number };
  water: any;
}

export async function generateAdaptivePlan(
  userId: string,
  assessmentData: AssessmentData,
  userProfile: UserProfile
): Promise<AdaptivePlan> {
  const { pushups = 0, squat = 0, plank = 0, run = 0, flexibility = 0, abs = 0, balance = 0 } = assessmentData;
  
  const totalScore = pushups + squat + plank + run + flexibility + abs + balance;
  const maxScore = 4 * 7;
  const percentage = (totalScore / maxScore) * 100;

  const level = getLevel(percentage);
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
  const goalAdj = GOAL_ADJUSTMENTS[userProfile?.goal as keyof typeof GOAL_ADJUSTMENTS] || {};
  const ageAdj = AGE_ADJUSTMENTS[userProfile?.ageRange as keyof typeof AGE_ADJUSTMENTS] || {};

  const workoutConfig: WorkoutConfig = {
    ...config,
    setsRange: [config.setsRange[0] + (goalAdj.setsBonus || 0), config.setsRange[1] + (goalAdj.setsBonus || 0)] as any,
    repsRange: goalAdj.repsRange || String(config.repsRange),
    restBetweenSets: config.restBetweenSets + (goalAdj.restIncrease || 0) - (goalAdj.restReduction || 0),
    cardioPerSession: goalAdj.cardioPerSession || 0,
  };

  if ((ageAdj as any).volumeReduction > 0) {
    workoutConfig.sessionDuration = Math.round(workoutConfig.sessionDuration * (1 - (ageAdj as any).volumeReduction));
    workoutConfig.exercisesPerSession = Math.max(3, Math.round(workoutConfig.exercisesPerSession * (1 - (ageAdj as any).volumeReduction)));
  }

  const waterConfig = calculateWater(userProfile?.weight || 70, userProfile?.height || 170, level, userProfile?.ageRange, userProfile?.injuries || []);

  return {
    level,
    assessmentScore: totalScore,
    assessmentPercentage: percentage,
    workout: workoutConfig,
    rest: { minSleep: config.sleepMin, restDays: config.restDays },
    water: waterConfig,
  };
}

function getLevel(percentage: number): string {
  if (percentage <= 25) return 'iniciante';
  if (percentage <= 50) return 'basico';
  if (percentage <= 75) return 'intermediario';
  return 'avançado';
}

export function getPlanSummary(plan: AdaptivePlan): { workout: string; rest: string; water: string } {
  return {
    workout: `${plan.workout.daysPerWeek}x/semana, ${plan.workout.sessionDuration}min`,
    rest: `${plan.rest.restDays} dia(s) de descanso, ${plan.rest.minSleep}h sono`,
    water: `${plan.water.dailyML}ml/dia, ${plan.water.glassesPerDay} copos`,
  };
}
