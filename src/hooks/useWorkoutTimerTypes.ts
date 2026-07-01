// src/hooks/useWorkoutTimerTypes.ts
// Tipos do hook de timer de treino

import type { Exercise } from '../types';

export type TimerPhase = 'idle' | 'exercising' | 'resting' | 'paused' | 'completed';

export interface SetLog {
  exerciseIndex?: number;
  exercise?: Exercise;
  setNumber?: number;
  timestamp?: number;
  exerciseId?: string;
  exerciseName?: string;
  set?: number;
  reps?: string | number;
  weight?: string | number;
  [key: string]: unknown;
}

export interface ProgressResult {
  exerciseProgress: number;
  setProgress: number;
  timerProgress: number;
}

export interface SetCompleteResult {
  isDone: boolean;
  nextSet?: number;
  nextIndex?: number;
  restTime?: number;
}

export interface SkipResult {
  isDone: boolean;
  nextIndex?: number;
  restTime?: number;
}

export interface UseWorkoutTimerReturn {
  phase: TimerPhase;
  currentExercise?: Exercise;
  currentExerciseIndex: number;
  currentSet: number;
  totalSets: number;
  totalExercises: number;
  timeRemaining: number;
  totalTime: number;
  elapsed: number;
  logs: SetLog[];
  exerciseProgress: number;
  setProgress: number;
  timerProgress: number;
  totalXP: number;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  markSetComplete: (setLog: SetLog) => void;
  skipRest: () => void;
  skipExercise: () => void;
  completeWorkout: () => void | Promise<void>;
  stopWorkout: () => void;
}
