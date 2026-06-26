import { addXP, getGamificationData, recordWorkoutCompletion } from '../../src/services/gamification';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Gamification Service', () => {
  describe('addXP', () => {
    it('returns 0 for null userId', async () => {
      const result = await addXP(null, 'WORKOUT_COMPLETED');
      expect(result).toBe(0);
    });

    it('returns 0 for 0 xpGain', async () => {
      const result = await addXP('user-1', 'UNKNOWN_TYPE', 0);
      expect(result).toBe(0);
    });

    it('adds XP to user profile', async () => {
      supabase.from.mockReturnValue(mockChain({ total_xp: 100 }));
      const result = await addXP('user-1', 'WORKOUT_COMPLETED');
      expect(result).toBe(150);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('adds custom amount', async () => {
      supabase.from.mockReturnValue(mockChain({ total_xp: 0 }));
      const result = await addXP('user-1', 'WORKOUT_COMPLETED', 500);
      expect(result).toBe(500);
    });

    it('handles missing profile gracefully', async () => {
      supabase.from.mockReturnValue(mockChain(null));
      const result = await addXP('user-1', 'WORKOUT_COMPLETED');
      expect(result).toBe(50);
    });
  });

  describe('getGamificationData', () => {
    it('returns null for null userId', async () => {
      const result = await getGamificationData(null);
      expect(result).toBeNull();
    });

    it('returns gamification data with profile and workouts', async () => {
      const profileData = { total_xp: 500, total_workouts: 5, total_minutes: 150, max_streak: 3 };
      const workoutsData = [
        { completed: true, completed_at: new Date().toISOString(), duration: 30 },
        { completed: false, completed_at: null, duration: 0 },
      ];

      supabase.from
        .mockReturnValueOnce(mockChain(profileData))
        .mockReturnValueOnce(mockChain(workoutsData));

      const result = await getGamificationData('user-1');
      expect(result).toHaveProperty('totalXP', 500);
      expect(result).toHaveProperty('totalWorkouts', 5);
      expect(result).toHaveProperty('levelData');
      expect(result).toHaveProperty('achievements');
    });
  });

  describe('recordWorkoutCompletion', () => {
    it('returns empty result for null userId', async () => {
      const result = await recordWorkoutCompletion(null, {});
      expect(result).toEqual({ xpGained: 0, newAchievements: [] });
    });

    it('records workout completion and gains XP', async () => {
      const profileData = { total_xp: 0, total_workouts: 0, total_minutes: 0, max_streak: 0 };
      const workoutsData = [];

      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') return mockChain(profileData);
        if (table === 'user_workouts') return mockChain(workoutsData);
        return mockChain(null);
      });

      const result = await recordWorkoutCompletion('user-1', { id: 'workout-1' });
      expect(result.xpGained).toBeGreaterThanOrEqual(0);
      expect(result).toHaveProperty('newAchievements');
    });
  });
});
