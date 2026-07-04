// src/hooks/useWorkoutTimer.ts
// Hook de maquina de estados do timer de treino - NOVAIX FITNESS

import { useState, useEffect, useRef, useCallback } from 'react';
import { countdownTick, phaseChange, workoutComplete } from '../services/hapticService';
import { playCountdownTick, playPhaseEnd, playWorkoutComplete } from '../services/audioService';
import { speakWelcome, speakNextExercise, speakRestStart, speakHalfway, speakWorkoutComplete, stopSpeaking } from '../services/voiceCoach';
import { Workout } from '../types';

interface WorkoutLog {
  exerciseIndex: number;
  exerciseName: string;
  set: number;
  reps: number;
  weight: number;
  timestamp: number;
}

export default function useWorkoutTimer(workout: Workout | null) {
  const [phase, setPhase] = useState('idle');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(phase);
  const exerciseRef = useRef(currentExerciseIndex);
  const setRef = useRef(currentSet);

  const exercises = workout?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const totalSets = currentExercise?.sets || 4;

  useEffect(() => {
    phaseRef.current = phase;
    exerciseRef.current = currentExerciseIndex;
    setRef.current = currentSet;
  }, [phase, currentExerciseIndex, currentSet]);

  const completeWorkout = useCallback(async () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    await playWorkoutComplete();
    await workoutComplete();
    speakWorkoutComplete(workout?.name);
    setPhase('completed');
  }, [workout]);

  const startExercise = useCallback(() => {
    const idx = exerciseRef.current;
    const exercises = workout?.exercises || [];
    const exercise = exercises[idx];
    if (!exercise) { completeWorkout(); return; }
    const exerciseTime = 45;
    setTimeRemaining(exerciseTime);
    setTotalTime(exerciseTime);
    setPhase('exercising');
    speakNextExercise(exercise.name, exercise.reps, exercise.weight, idx + 1, exercises.length);
  }, [workout, completeWorkout]);

  const handlePhaseComplete = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (phaseRef.current === 'resting') {
      playPhaseEnd();
      phaseChange();
      startExercise();
    } else if (phaseRef.current === 'exercising') {
      playPhaseEnd();
      phaseChange();
    }
  }, [startExercise]);

  const startWorkout = useCallback(() => {
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setElapsed(0);
    setLogs([]);
    speakWelcome(workout?.name);
    startExercise();
  }, [workout, startExercise]);

  const pauseWorkout = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setPhase('paused');
  }, []);

  const resumeWorkout = useCallback(() => {
    setPhase(phaseRef.current === 'paused' ? 'exercising' : phaseRef.current);
  }, []);

  const markSetComplete = useCallback((setLog: { reps?: number; weight?: number }) => {
    const exercise = exercises[exerciseRef.current];
    const log: WorkoutLog = {
      exerciseIndex: exerciseRef.current,
      exerciseName: exercise?.name || '',
      set: setRef.current,
      reps: setLog?.reps ?? 0,
      weight: setLog?.weight ?? 0,
      timestamp: Date.now(),
    };
    setLogs((prev) => [...prev, log]);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    const totalSets = exercise?.sets || 4;
    if (setRef.current < totalSets) {
      setCurrentSet((prev) => prev + 1);
      const restTime = exercise?.rest || 60;
      setTimeRemaining(restTime);
      setTotalTime(restTime);
      setPhase('resting');
    } else {
      const nextIndex = exerciseRef.current + 1;
      if (nextIndex < exercises.length) {
        if (nextIndex === Math.floor(exercises.length / 2)) {
          speakHalfway();
        }
        setCurrentExerciseIndex(nextIndex);
        setCurrentSet(1);
        const nextExercise = exercises[nextIndex];
        const restTime = nextExercise?.rest || 60;
        setTimeRemaining(restTime);
        setTotalTime(restTime);
        setPhase('resting');
      } else {
        completeWorkout();
      }
    }
  }, [workout, exercises, completeWorkout]);

  const skipRest = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    startExercise();
  }, [startExercise]);

  const skipExercise = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    const nextIndex = exerciseRef.current + 1;
    if (nextIndex < exercises.length) {
      setCurrentExerciseIndex(nextIndex);
      setCurrentSet(1);
      const nextExercise = exercises[nextIndex];
      const restTime = nextExercise?.rest || 60;
      setTimeRemaining(restTime);
      setTotalTime(restTime);
      setPhase('resting');
    } else {
      completeWorkout();
    }
  }, [workout, exercises, completeWorkout]);

  const stopWorkout = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    stopSpeaking();
    setPhase('idle');
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTimeRemaining(0);
    setTotalTime(0);
  }, []);

  useEffect(() => {
    if (phase === 'exercising' || phase === 'resting') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { return 0; }
          if (phaseRef.current === 'resting' && prev <= 4 && prev > 1) {
            countdownTick(prev - 1);
            playCountdownTick();
          }
          return prev - 1;
        });
        if (phaseRef.current === 'exercising') {
          setElapsed((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [phase, handlePhaseComplete]);

  useEffect(() => {
    if (timeRemaining === 0 && (phase === 'exercising' || phase === 'resting')) {
      handlePhaseComplete();
    }
  }, [timeRemaining, phase, handlePhaseComplete]);

  const exerciseProgress = totalExercises > 0 ? (currentExerciseIndex / totalExercises) * 100 : 0;
  const setProgress = totalSets > 0 ? ((currentSet - 1) / totalSets) * 100 : 0;
  const timerProgress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  const totalXP = logs.length * 5 + currentExerciseIndex * 10 + Math.floor(elapsed / 60) * 2;

  return {
    phase, currentExercise, currentExerciseIndex, currentSet, totalSets, totalExercises,
    timeRemaining, totalTime, elapsed, logs, exerciseProgress, setProgress, timerProgress, totalXP,
    startWorkout, pauseWorkout, resumeWorkout, markSetComplete, skipRest, skipExercise, stopWorkout, completeWorkout,
  };
}
