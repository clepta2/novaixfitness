// src/types/workout.ts - Tipos de treinos, exercicios e categorias

export type ExerciseStep = { step: number; text: string; image: string; title?: string };
export type ExerciseAlternative = { name: string; level: string; reason: string };

export type Exercise = {
  id: string; name: string; sets: number; reps: number; rest: number;
  muscle: string; equipment?: string; video_url?: string; video_id?: string;
  thumbnail_url?: string; weight?: number; steps?: ExerciseStep[];
  tips?: string[]; mistakes?: string[]; alternatives?: ExerciseAlternative[];
};

export type WorkoutLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type Workout = {
  id: string; name: string; category: string; level: WorkoutLevel;
  duration: number; duration_minutes?: number; description: string; videoId?: string; video_id?: string;
  equipment: string[]; exercises: Exercise[];
  intensity?: string;
};

export type Category = {
  id: string; label: string; icon: string; description: string;
  color: string; count?: number; bg?: string; key?: string;
};

export type TimerPhase = 'idle' | 'exercising' | 'resting' | 'paused' | 'completed';

export type SetLog = {
  exerciseIndex: number; exercise: Exercise; setNumber: number;
  timestamp: number; [key: string]: unknown;
};

export type TimerProgress = {
  exerciseProgress: number; setProgress: number; timerProgress: number;
};

export type ExerciseLog = {
  set_number: number; reps_done: number; weight_kg: number;
};
