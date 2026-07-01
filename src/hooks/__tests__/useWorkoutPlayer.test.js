// src/hooks/__tests__/useWorkoutPlayer.test.js
// Testes unitários para o hook do player de treino - NOVAIX FITNESS

import { renderHook, act } from '@testing-library/react-hooks';
import useWorkoutPlayer from '../useWorkoutPlayer';

// Mock do AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}));

// Mock do Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: 'test-workout-id' }),
}));

// Mock do Supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

// Mock dos serviços
jest.mock('../../services/workoutSaver', () => ({
  saveCompleteWorkout: jest.fn(),
}));

jest.mock('../../services/gamification', () => ({
  awardActionXP: jest.fn(),
}));

jest.mock('../../services/audioService', () => ({
  loadSounds: jest.fn(),
  unloadSounds: jest.fn(),
}));

jest.mock('../../services/voiceCoach', () => ({
  isVoiceCoachEnabled: jest.fn(() => true),
  setVoiceCoachEnabled: jest.fn(),
}));

jest.mock('../../services/offlineManager', () => ({
  queueWorkoutCompletion: jest.fn(),
}));

// Mock do KeepAwake
jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwake: jest.fn(),
}));

// Mock do useWorkoutTimer
jest.mock('../useWorkoutTimer', () => ({
  __esModule: true,
  default: () => ({
    phase: 'idle',
    elapsed: 0,
    logs: [],
    startWorkout: jest.fn(),
    stopWorkout: jest.fn(),
    pauseWorkout: jest.fn(),
    resumeWorkout: jest.fn(),
  }),
}));

// Mock do useTutorial
jest.mock('../useTutorial', () => ({
  useTutorial: () => ({
    visible: false,
    steps: [],
    handleComplete: jest.fn(),
    handleSkip: jest.fn(),
  }),
}));

// Mock do useNetworkStatus
jest.mock('../useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ isOnline: true, isConnected: true }),
}));

// Mock do share
jest.mock('../../services/share', () => ({
  shareWorkout: jest.fn(),
}));

// Mock do data/workouts
jest.mock('../../data/workouts', () => ({
  DEMO_WORKOUT: {
    id: 'demo-1',
    name: 'Demo Workout',
    duration: 30,
    videoId: 'test',
    exercises: [],
  },
}));

describe('useWorkoutPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useWorkoutPlayer());

    expect(result.current.loading).toBe(true);
    expect(result.current.workout).toBeNull();
  });

  it('should toggle voice coach', () => {
    const { result } = renderHook(() => useWorkoutPlayer());

    act(() => {
      result.current.toggleVoiceCoach();
    });

    expect(result.current.voiceEnabled).toBe(false);
  });

  it('should dismiss rating', async () => {
    const { result } = renderHook(() => useWorkoutPlayer());

    await act(async () => {
      await result.current.handleWorkoutComplete();
    });

    expect(result.current.showRating).toBe(true);

    act(() => {
      result.current.dismissRating();
    });

    expect(result.current.showRating).toBe(false);
  });

  it('should handle workout completion', async () => {
    const { result } = renderHook(() => useWorkoutPlayer());

    await act(async () => {
      await result.current.handleWorkoutComplete();
    });

    expect(result.current.showRating).toBe(true);
  });
});
