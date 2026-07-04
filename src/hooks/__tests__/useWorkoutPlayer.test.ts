// src/hooks/__tests__/useWorkoutPlayer.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import useWorkoutPlayer from '../useWorkoutPlayer';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'test-workout-id' }),
}));

jest.mock('../../config/supabase', () => {
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.maybeSingle = jest.fn().mockResolvedValue({
    data: { id: 'w1', title: 'Test', duration_minutes: 30, exercises: [] }, error: null,
  });
  chain.then = (resolve) => Promise.resolve({ data: null, error: null }).then(resolve);
  return { supabase: chain };
});

jest.mock('../../services/workoutSaver', () => ({ saveCompleteWorkout: jest.fn() }));
jest.mock('../../services/gamification', () => ({ awardActionXP: jest.fn() }));
jest.mock('../../services/audioService', () => ({ loadSounds: jest.fn(), unloadSounds: jest.fn() }));
jest.mock('../../services/voiceCoach', () => ({ isVoiceCoachEnabled: jest.fn(() => true), setVoiceCoachEnabled: jest.fn() }));
jest.mock('../../services/offlineManager', () => ({ queueWorkoutCompletion: jest.fn() }));
jest.mock('expo-keep-awake', () => ({ activateKeepAwakeAsync: jest.fn(), deactivateKeepAwakeAsync: jest.fn(), deactivateKeepAwake: jest.fn() }));
jest.mock('../useWorkoutTimer', () => ({ __esModule: true, default: () => ({ phase: 'idle', elapsed: 0, logs: [], startWorkout: jest.fn(), stopWorkout: jest.fn(), pauseWorkout: jest.fn(), resumeWorkout: jest.fn() }) }));
jest.mock('../useTutorial', () => ({ useTutorial: () => ({ visible: false, steps: [], handleComplete: jest.fn(), handleSkip: jest.fn() }) }));
jest.mock('../useNetworkStatus', () => ({ __esModule: true, default: () => ({ isOnline: true, isConnected: true }) }));
jest.mock('../../services/share', () => ({ shareWorkout: jest.fn() }));
jest.mock('../../data/workouts', () => ({ DEMO_WORKOUT: { id: 'demo-1', name: 'Demo', duration: 30, videoId: 'test', exercises: [] } }));

describe('useWorkoutPlayer', () => {
  it('should render without crashing', () => {
    const { result } = renderHook(() => useWorkoutPlayer());
    expect(result.current).toBeDefined();
    expect(typeof result.current.toggleVoiceCoach).toBe('function');
    expect(typeof result.current.dismissRating).toBe('function');
  });

  it('should start with workout or loading', () => {
    const { result } = renderHook(() => useWorkoutPlayer());
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('should toggle voice coach', () => {
    const { result } = renderHook(() => useWorkoutPlayer());
    const initial = result.current.voiceEnabled;
    act(() => { result.current.toggleVoiceCoach(); });
    expect(result.current.voiceEnabled).toBe(!initial);
  });

  it('should have expected methods', () => {
    const { result } = renderHook(() => useWorkoutPlayer());
    expect(typeof result.current.handleWorkoutComplete).toBe('function');
    expect(typeof result.current.handleRatingSubmit).toBe('function');
    expect(typeof result.current.handleFinish).toBe('function');
  });
});
