// src/data/onboardingFlow.js
// Fluxo do onboarding - Completo

import { WELCOME_STEP, GOAL_STEP, PERSONAL_STEP, EXPERIENCE_STEP, MOTIVATION_STEP, DEVICES_STEP, BODY_STEP, INJURIES_STEP, LIFESTYLE_STEP, WORKOUT_STEP, NOTIFICATIONS_STEP, SUMMARY_STEP } from './onboardingSteps';

export const ONBOARDING_STEPS = [
  WELCOME_STEP,
  GOAL_STEP,
  PERSONAL_STEP,
  EXPERIENCE_STEP,
  MOTIVATION_STEP,
  DEVICES_STEP,
  BODY_STEP,
  INJURIES_STEP,
  LIFESTYLE_STEP,
  WORKOUT_STEP,
  NOTIFICATIONS_STEP,
  SUMMARY_STEP,
];

export function getStep(stepId) {
  return ONBOARDING_STEPS.find(s => s.id === stepId);
}

export function getNextStep(currentStepId, data) {
  const current = getStep(currentStepId);
  if (!current) return null;
  if (typeof current.nextStep === 'function') return current.nextStep(data);
  return current.nextStep;
}

export function getProgress(currentStepId) {
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStepId);
  return {
    current: currentIndex + 1,
    total: ONBOARDING_STEPS.length,
    percentage: Math.round(((currentIndex + 1) / ONBOARDING_STEPS.length) * 100),
    phase: ONBOARDING_STEPS[currentIndex]?.phase || 1,
  };
}

export function getCurrentPhase(currentStepId) {
  const step = getStep(currentStepId);
  return step?.phase || 1;
}
