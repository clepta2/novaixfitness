import { saveCompleteWorkout, savePartialWorkout } from '../../src/services/workoutSaver';
import { recordWorkoutCompletion } from '../../src/services/gamification';
import { sendWorkoutCompletedNotification } from '../../src/services/notifications';

jest.mock('../../src/config/supabase', () => {
  const makeChain = (resolveWith) => {
    const chain = {
      select: jest.fn(() => chain),
      eq: jest.fn(() => chain),
      single: jest.fn(() => Promise.resolve(resolveWith)),
      insert: jest.fn(() => chain),
      update: jest.fn(() => chain),
    };
    return chain;
  };

  let callCount = 0;
  const mockFrom = jest.fn(() => {
    callCount++;
    if (callCount === 1) {
      return makeChain({ data: { id: 'uw1' }, error: null });
    }
    if (callCount === 2) {
      return makeChain({ data: { total_workouts: 5, total_minutes: 200 } });
    }
    return makeChain({ error: null });
  });

  return {
    supabase: {
      from: mockFrom,
      __mocks: { mockFrom },
    },
  };
});

jest.mock('../../src/services/gamification', () => ({
  recordWorkoutCompletion: jest.fn().mockResolvedValue({ xpGained: 50, newAchievements: [], streak: 3 }),
}));

jest.mock('../../src/services/notifications', () => ({
  sendWorkoutCompletedNotification: jest.fn().mockResolvedValue({}),
}));

beforeEach(() => {
  jest.clearAllMocks();
  const { mockFrom } = require('../../src/config/supabase').supabase.__mocks;
  let count = 0;
  mockFrom.mockImplementation(() => {
    count++;
    const chain = {
      select: jest.fn(() => chain),
      eq: jest.fn(() => chain),
      single: jest.fn(),
      insert: jest.fn(() => chain),
      update: jest.fn(() => chain),
    };
    if (count === 1) chain.single.mockResolvedValue({ data: { id: 'uw1' }, error: null });
    else if (count === 2) chain.single.mockResolvedValue({ data: { total_workouts: 5, total_minutes: 200 } });
    else chain.single.mockResolvedValue({ data: null, error: null });
    return chain;
  });
});

describe('Workout Saver', () => {
  describe('saveCompleteWorkout', () => {
    it('returns null when no userId', async () => {
      const result = await saveCompleteWorkout(null, { id: 'w1' }, [], 30);
      expect(result).toBeNull();
    });

    it('saves completed workout and returns gamification data', async () => {
      const result = await saveCompleteWorkout('u1', { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Treino A' }, [{ exercise: 'Agachamento' }], 45);

      expect(result).not.toBeNull();
      expect(result.xpGained).toBe(50);
      expect(result.streak).toBe(3);
      expect(recordWorkoutCompletion).toHaveBeenCalled();
      expect(sendWorkoutCompletedNotification).toHaveBeenCalledWith('Treino A', 50, 'u1');
    });

    it('sends notification only when xpGained > 0', async () => {
      recordWorkoutCompletion.mockResolvedValueOnce({ xpGained: 0, newAchievements: [], streak: 1 });
      await saveCompleteWorkout('u1', { id: 'w1', name: 'T' }, [], 30);
      expect(sendWorkoutCompletedNotification).not.toHaveBeenCalled();
    });
  });

  describe('savePartialWorkout', () => {
    it('returns null when no userId', async () => {
      const result = await savePartialWorkout(null, { id: 'w1' }, [], 15);
      expect(result).toBeNull();
    });

    it('saves partial workout', async () => {
      const result = await savePartialWorkout('u1', { id: 'w1' }, [{ exercise: 'Supino' }], 20);
      expect(result).not.toBeNull();
    });
  });
});
