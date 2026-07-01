// src/data/injuryDetailsTypes.ts
// Tipos de detalhes de lesões

export interface InjuryDetail {
  label: string;
  icon: string;
  description: string;
  bodyRegion: string;
  limitations: string[];
  safeAlternatives: string[];
  followUpQuestions: string[];
}

export interface SeverityLevel {
  label: string;
  description: string;
  estimatedRecovery: string;
  canTrain: boolean;
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface MoodAdjustment {
  volumeChange: number;
  intensityChange: number;
  message: string;
}
