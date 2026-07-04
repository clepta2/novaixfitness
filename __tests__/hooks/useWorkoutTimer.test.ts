jest.mock('../../src/services/hapticService', () => ({
  countdownTick: jest.fn(),
  phaseChange: jest.fn(),
  workoutComplete: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/services/audioService', () => ({
  playCountdownTick: jest.fn().mockResolvedValue(undefined),
  playPhaseEnd: jest.fn().mockResolvedValue(undefined),
  playWorkoutComplete: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/services/voiceCoach', () => ({
  speakWelcome: jest.fn(),
  speakNextExercise: jest.fn(),
  speakRestStart: jest.fn(),
  speakHalfway: jest.fn(),
  speakWorkoutComplete: jest.fn(),
  stopSpeaking: jest.fn(),
}));

import { renderHook, act } from '@testing-library/react-hooks';
import useWorkoutTimer from '../../src/hooks/useWorkoutTimer';
import { countdownTick, phaseChange, workoutComplete } from '../../src/services/hapticService';
import { playCountdownTick, playPhaseEnd, playWorkoutComplete } from '../../src/services/audioService';
import { speakWelcome, speakNextExercise, speakHalfway, speakWorkoutComplete, stopSpeaking } from '../../src/services/voiceCoach';

const mockWorkout = {
  name: 'Treino Teste',
  exercises: [
    { name: 'Supino', sets: 2, reps: 10, rest: 60 },
    { name: 'Agachamento', sets: 2, reps: 12, rest: 90 },
  ],
};

describe('useWorkoutTimer Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve inicializar com estado idle', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    expect(result.current.phase).toBe('idle');
    expect(result.current.currentExerciseIndex).toBe(0);
    expect(result.current.currentSet).toBe(1);
  });

  it('deve retornar propriedades corretas', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    expect(result.current.totalExercises).toBe(2);
    expect(result.current.totalSets).toBe(2);
    expect(result.current.currentExerciseIndex).toBe(0);
    expect(result.current.currentSet).toBe(1);
  });

  it('deve retornar funções do timer', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    expect(typeof result.current.startWorkout).toBe('function');
    expect(typeof result.current.pauseWorkout).toBe('function');
    expect(typeof result.current.resumeWorkout).toBe('function');
    expect(typeof result.current.stopWorkout).toBe('function');
    expect(typeof result.current.markSetComplete).toBe('function');
    expect(typeof result.current.skipRest).toBe('function');
    expect(typeof result.current.skipExercise).toBe('function');
  });

  it('deve iniciar treino', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    expect(result.current.phase).toBe('exercising');
    expect(result.current.currentExerciseIndex).toBe(0);
    expect(speakWelcome).toHaveBeenCalledWith('Treino Teste');
  });

  it('deve pausar treino', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.pauseWorkout());
    expect(result.current.phase).toBe('paused');
  });

  it('deve retomar treino', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.pauseWorkout());
    act(() => result.current.resumeWorkout());
    expect(result.current.phase).toBe('exercising');
  });

  it('deve parar treino', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.stopWorkout());
    expect(result.current.phase).toBe('idle');
    expect(stopSpeaking).toHaveBeenCalled();
  });

  it('deve marcar set completo', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    expect(result.current.phase).toBe('resting');
    expect(result.current.currentSet).toBe(2);
    expect(result.current.logs).toHaveLength(1);
  });

  it('deve avançar exercício após último set', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    expect(result.current.currentExerciseIndex).toBe(1);
    expect(result.current.currentSet).toBe(1);
  });

  it('deve pular descanso', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    act(() => result.current.skipRest());
    expect(result.current.phase).toBe('exercising');
  });

  it('deve pular exercício', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.skipExercise());
    expect(result.current.currentExerciseIndex).toBe(1);
  });

  it('deve completar treino no último exercício', async () => {
    jest.useRealTimers();
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    act(() => result.current.startWorkout());
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    act(() => result.current.markSetComplete({ reps: 12, weight: 80 }));
    act(() => result.current.markSetComplete({ reps: 12, weight: 80 }));
    await act(async () => { await new Promise(r => setTimeout(r, 10)); });
    expect(result.current.phase).toBe('completed');
    expect(playWorkoutComplete).toHaveBeenCalled();
  });

  it('deve calcular exerciseProgress', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    expect(result.current.exerciseProgress).toBe(0);
    act(() => result.current.startWorkout());
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    act(() => result.current.markSetComplete({ reps: 10, weight: 60 }));
    expect(result.current.exerciseProgress).toBe(50);
  });

  it('deve ter logs como array', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    expect(result.current.logs).toBeDefined();
  });

  it('deve calcular totalXP', () => {
    const { result } = renderHook(() => useWorkoutTimer(mockWorkout));
    expect(typeof result.current.totalXP).toBe('number');
  });
});
