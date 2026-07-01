// src/data/onboardingTypes.ts
// Tipos do onboarding

export interface OnboardingOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface AgeRange {
  id: string;
  label: string;
  description: string;
}

export interface GenderOption {
  id: string;
  label: string;
  icon: string;
}

export interface BodyModel {
  id: string;
  label: string;
  description: string;
  icon: string;
  ageRange: string;
}

export interface LevelOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface DayOption {
  id: number;
  label: string;
  description: string;
}

export interface LocationOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface TimeOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface StressSleepOption {
  id: string;
  label: string;
  color: string;
}

export interface MuscleOption {
  id: string;
  label: string;
}

export interface DietaryOption {
  id: string;
  label: string;
}

export interface BodyTypeOption {
  id: string;
  label: string;
  description: string;
}

export interface NotificationChannel {
  id: string;
  label: string;
  icon: string;
  defaultOn: boolean;
}

export interface NotificationType {
  id: string;
  label: string;
  icon: string;
  defaultOn: boolean;
}

export interface ReferralSource {
  id: string;
  label: string;
  icon: string;
}
