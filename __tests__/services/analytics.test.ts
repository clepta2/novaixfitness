import { getWorkoutAnalytics, getWeightHistory, getWorkoutFrequency, getMonthlyComparison } from '../../src/services/analytics';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSupabase._reset();
});

describe('Analytics Service', () => {
  describe('getWorkoutAnalytics', () => {
    it('returns null for null userId', async () => {
      const result = await getWorkoutAnalytics(null);
      expect(result).toBeNull();
    });

    it('returns empty analytics when no workouts', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.totalWorkouts).toBe(0);
      expect(result.totalMinutes).toBe(0);
      expect(result).toHaveProperty('byCategory');
    });

    it('calculates analytics for period week', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Musculação', level: 'Intermediário' } },
        { completed: true, duration: 45, completed_at: new Date().toISOString(), workouts: { category: 'Cardio', level: 'Iniciante' } },
      ];
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1', 'week');
      expect(result.totalWorkouts).toBe(2);
      expect(result.totalMinutes).toBe(75);
    });

    it('calculates analytics for period month', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'month');
      expect(result).toHaveProperty('totalWorkouts');
      expect(result).toHaveProperty('totalMinutes');
    });

    it('calculates analytics for period quarter', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'quarter');
      expect(result).toHaveProperty('totalWorkouts');
    });

    it('calculates analytics for period year', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'year');
      expect(result).toHaveProperty('totalWorkouts');
    });

    it('handles default period', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'invalid');
      expect(result).toHaveProperty('totalWorkouts');
    });

    it('groups workouts by day', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Musculação' } },
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Musculação' } },
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Cardio' } },
      ];
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.totalWorkouts).toBe(3);
    });

    it('handles workouts without category', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: null },
      ];
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.totalWorkouts).toBe(1);
    });

    it('handles workouts with empty workouts object', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: {} },
      ];
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result).toHaveProperty('byCategory');
      expect(typeof result.byCategory).toBe('object');
    });

    it('returns byDayOfWeek in analytics', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: {} },
      ];
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result).toHaveProperty('byDayOfWeek');
    });

    it('calculates streak and totalMinutes', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: {} },
      ];
      const prevWorkouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString() },
        { completed: true, duration: 30, completed_at: new Date().toISOString() },
      ];
      mockSupabase.from
        .mockReturnValueOnce(mockChain(workouts))
        .mockReturnValueOnce(mockChain(prevWorkouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result).toHaveProperty('totalWorkouts');
      expect(result).toHaveProperty('totalMinutes');
      expect(result).toHaveProperty('streak');
    });
  });

  describe('getWeightHistory', () => {
    it('returns empty array for null userId', async () => {
      const result = await getWeightHistory(null);
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns weight history', async () => {
      const weightLogs = [
        { weight: 80, recorded_at: '2024-01-01T00:00:00Z' },
        { weight: 79, recorded_at: '2024-01-08T00:00:00Z' },
      ];
      mockSupabase.from.mockReturnValue(mockChain(weightLogs));
      const result = await getWeightHistory('user-1');
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('weight', 80);
      expect(result[0]).toHaveProperty('date');
    });

    it('returns empty array when no weight logs', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWeightHistory('user-1');
      expect(result).toEqual([]);
    });
  });

  describe('getWorkoutFrequency', () => {
    it('returns empty array for null userId', async () => {
      const result = await getWorkoutFrequency(null);
      expect(result).toEqual([]);
    });

    it('returns workout frequency by day', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutFrequency('user-1');
      expect(Array.isArray(result)).toBe(true);
    });

    it('counts workouts per day', async () => {
      const now = new Date();
      const workouts = [
        { completed_at: now.toISOString() },
        { completed_at: now.toISOString() },
      ];
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutFrequency('user-1');
      const counts = result.map(w => w.count);
      expect(counts.some(v => v > 0)).toBe(true);
    });
  });

  describe('getMonthlyComparison', () => {
    it('returns empty array for null userId', async () => {
      const result = await getMonthlyComparison(null);
      expect(result).toEqual([]);
    });

    it('returns monthly comparison as array', async () => {
      mockSupabase.from.mockReturnValue(mockChain([]));
      const result = await getMonthlyComparison('user-1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('workouts');
    });

    it('counts workouts per month', async () => {
      const now = new Date();
      const workouts = [];
      for (let i = 0; i < 5; i++) {
        workouts.push({ completed_at: now.toISOString(), duration: 30 });
      }
      mockSupabase.from.mockReturnValue(mockChain(workouts));
      const result = await getMonthlyComparison('user-1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
