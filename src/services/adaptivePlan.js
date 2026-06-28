// src/services/adaptivePlan.js
// Gerador de plano adaptativo - DATA DRIVEN

import { LEVEL_CONFIG, GOAL_ADJUSTMENTS, AGE_ADJUSTMENTS } from '../data/planConfig';
import { calculateWater } from './waterCalculator';

export async function generateAdaptivePlan(userId, assessmentData, userProfile) {
  const { pushups = 0, squat = 0, plank = 0, run = 0, flexibility = 0, abs = 0, balance = 0 } = assessmentData;
  
  const totalScore = pushups + squat + plank + run + flexibility + abs + balance;
  const maxScore = 4 * 7;
  const percentage = (totalScore / maxScore) * 100;

  const level = getLevel(percentage);
  const config = LEVEL_CONFIG[level];
  const goalAdj = GOAL_ADJUSTMENTS[userProfile?.goal] || {};
  const ageAdj = AGE_ADJUSTMENTS[userProfile?.ageRange] || {};

  const workoutConfig = {
    ...config,
    setsRange: [config.setsRange[0] + (goalAdj.setsBonus || 0), config.setsRange[1] + (goalAdj.setsBonus || 0)],
    repsRange: goalAdj.repsRange || config.repsRange,
    restBetweenSets: config.restBetweenSets + (goalAdj.restIncrease || 0) - (goalAdj.restReduction || 0),
    cardioPerSession: goalAdj.cardioPerSession || 0,
  };

  if (ageAdj.volumeReduction > 0) {
    workoutConfig.sessionDuration = Math.round(workoutConfig.sessionDuration * (1 - ageAdj.volumeReduction));
    workoutConfig.exercisesPerSession = Math.max(3, Math.round(workoutConfig.exercisesPerSession * (1 - ageAdj.volumeReduction)));
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

function getLevel(percentage) {
  if (percentage <= 25) return 'iniciante';
  if (percentage <= 50) return 'basico';
  if (percentage <= 75) return 'intermediario';
  return 'avançado';
}

export function getPlanSummary(plan) {
  return {
    workout: `${plan.workout.daysPerWeek}x/semana, ${plan.workout.sessionDuration}min`,
    rest: `${plan.rest.restDays} dia(s) de descanso, ${plan.rest.minSleep}h sono`,
    water: `${plan.water.dailyML}ml/dia, ${plan.water.glassesPerDay} copos`,
  };
}
