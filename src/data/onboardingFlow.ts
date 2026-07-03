// src/data/onboardingFlow.ts
// Fluxo do onboarding — simplificado (5 etapas)

import { GOAL_STEP, YOU_STEP, BODY_STEP, ROUTINE_STEP, NOTIFICATIONS_STEP, SUMMARY_STEP } from './onboardingSteps';

interface OnboardingStep {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  nextStep?: string | ((data: Record<string, unknown>) => string);
  phase: number;
  [key: string]: unknown;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  GOAL_STEP,
  YOU_STEP,
  BODY_STEP,
  ROUTINE_STEP,
  NOTIFICATIONS_STEP,
  SUMMARY_STEP,
];

export function getStep(stepId: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(s => s.id === stepId);
}

export function getNextStep(currentStepId: string, data: Record<string, unknown>): string | null {
  const current = getStep(currentStepId);
  if (!current) return null;
  if (typeof current.nextStep === 'function') return current.nextStep(data);
  return (current.nextStep as string) || null;
}

export function getProgress(currentStepId: string) {
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStepId);
  return {
    current: currentIndex + 1,
    total: ONBOARDING_STEPS.length,
    percentage: Math.round(((currentIndex + 1) / ONBOARDING_STEPS.length) * 100),
    phase: ONBOARDING_STEPS[currentIndex]?.phase || 1,
  };
}

export function getCurrentPhase(currentStepId: string): number {
  const step = getStep(currentStepId);
  return step?.phase || 1;
}
