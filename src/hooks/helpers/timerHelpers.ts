// src/hooks/helpers/timerHelpers.ts
// Pure computation helpers for workout timer

interface Exercise {
  name?: string;
  sets?: number;
  rest?: number;
  [key: string]: unknown;
}

interface SetLog {
  reps?: string | number;
  weight?: string | number;
}

interface ProgressResult {
  exerciseProgress: number;
  setProgress: number;
  timerProgress: number;
}

interface SetLogEntry {
  exerciseIndex: number;
  exerciseName: string;
  set: number;
  reps?: string | number;
  weight?: string | number;
  timestamp: number;
}

interface AfterSetResult {
  nextSet?: number;
  nextIndex?: number;
  restTime?: number;
  isDone: boolean;
}

interface AfterSkipResult {
  nextIndex?: number;
  restTime?: number;
  isDone: boolean;
}

export function computeProgress(
  exerciseIndex: number,
  totalExercises: number,
  currentSet: number,
  totalSets: number,
  totalTime: number,
  timeRemaining: number
): ProgressResult {
  return {
    exerciseProgress: totalExercises > 0 ? (exerciseIndex / totalExercises) * 100 : 0,
    setProgress: totalSets > 0 ? ((currentSet - 1) / totalSets) * 100 : 0,
    timerProgress: totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0,
  };
}

export function computeXP(logCount: number, exerciseIndex: number, elapsed: number): number {
  return logCount * 5 + exerciseIndex * 10 + Math.floor(elapsed / 60) * 2;
}

export function buildSetLog(
  exerciseIndex: number,
  exercise: Exercise | undefined,
  setNum: number,
  setLog?: SetLog
): SetLogEntry {
  return {
    exerciseIndex,
    exerciseName: exercise?.name || '',
    set: setNum,
    reps: setLog?.reps,
    weight: setLog?.weight,
    timestamp: Date.now(),
  };
}

export function resolveAfterSetComplete(
  currentSet: number,
  exerciseIndex: number,
  exercises: Exercise[]
): AfterSetResult {
  const exercise = exercises[exerciseIndex];
  const totalSets = exercise?.sets || 4;
  if (currentSet < totalSets) {
    return { nextSet: currentSet + 1, nextIndex: exerciseIndex, restTime: exercise?.rest || 60, isDone: false };
  }
  const nextIndex = exerciseIndex + 1;
  if (nextIndex < exercises.length) {
    return { nextSet: 1, nextIndex, restTime: exercises[nextIndex]?.rest || 60, isDone: false };
  }
  return { isDone: true };
}

export function resolveAfterSkip(exerciseIndex: number, exercises: Exercise[]): AfterSkipResult {
  const nextIndex = exerciseIndex + 1;
  if (nextIndex < exercises.length) {
    return { nextIndex, restTime: exercises[nextIndex]?.rest || 60, isDone: false };
  }
  return { isDone: true };
}
