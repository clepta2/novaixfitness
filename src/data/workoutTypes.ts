// src/data/workoutTypes.ts
// Tipos de treinos

export interface ExerciseStep {
  step: number;
  text: string;
  image: string;
}

export interface ExerciseAlternative {
  name: string;
  level: string;
  reason: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  muscle: string;
  equipment?: string;
  steps: ExerciseStep[];
  tips: string[];
  mistakes: string[];
  alternatives: ExerciseAlternative[];
}

export interface Workout {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: number;
  description: string;
  videoId: string;
  equipment: string[];
  exercises: Exercise[];
}

export interface WorkoutCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export interface FallbackWorkout {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: number;
  description: string;
  video_id: string;
  equipment: string[];
  exercises: { id: string; name: string; sets: number; reps: number; rest: number; muscle: string }[];
}

export interface DemoExercise {
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

export interface DemoWorkout {
  id: string;
  name: string;
  duration: number;
  videoId: string;
  exercises: DemoExercise[];
}
