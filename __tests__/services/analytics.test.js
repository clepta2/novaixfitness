import { getWorkoutAnalytics, getWeightHistory, getWorkoutFrequency, getMonthlyComparison } from '../../src/services/analytics';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

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
});

describe('Analytics Service', () => {
  describe('getWorkoutAnalytics', () => {
    it('returns null for null userId', async () => {
      const result = await getWorkoutAnalytics(null);
      expect(result).toBeNull();
    });

    it('returns empty analytics when no workouts', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.totalWorkouts).toBe(0);
      expect(result.totalMinutes).toBe(0);
      expect(result.byCategory).toEqual({});
    });

    it('calculates analytics for period week', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Musculação', level: 'Intermediário' } },
        { completed: true, duration: 45, completed_at: new Date().toISOString(), workouts: { category: 'Cardio', level: 'Iniciante' } },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1', 'week');
      expect(result.totalWorkouts).toBe(2);
      expect(result.totalMinutes).toBe(75);
    });

    it('calculates analytics for period month', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'month');
      expect(result).toHaveProperty('totalWorkouts');
      expect(result).toHaveProperty('byCategory');
      expect(result).toHaveProperty('comparison');
    });

    it('calculates analytics for period quarter', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'quarter');
      expect(result).toHaveProperty('totalWorkouts');
    });

    it('calculates analytics for period year', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'year');
      expect(result).toHaveProperty('totalWorkouts');
    });

    it('handles default period', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutAnalytics('user-1', 'invalid');
      expect(result).toHaveProperty('totalWorkouts');
    });

    it('groups workouts by category', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Musculação' } },
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Musculação' } },
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: { category: 'Cardio' } },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.byCategory['Musculação']).toBe(2);
      expect(result.byCategory['Cardio']).toBe(1);
    });

    it('handles workouts without category', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: null },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.byCategory['Outro']).toBe(1);
    });

    it('groups workouts by day of week', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: {} },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.byDayOfWeek).toBeDefined();
      expect(Array.isArray(result.byDayOfWeek)).toBe(true);
    });

    it('groups workouts by hour', async () => {
      const workouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: {} },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.byHour).toBeDefined();
      expect(Array.isArray(result.byHour)).toBe(true);
    });

    it('calculates comparison with previous period', async () => {
      const currentWorkouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString(), workouts: {} },
      ];
      const prevWorkouts = [
        { completed: true, duration: 30, completed_at: new Date().toISOString() },
        { completed: true, duration: 30, completed_at: new Date().toISOString() },
      ];
      supabase.from
        .mockReturnValueOnce(mockChain(currentWorkouts))
        .mockReturnValueOnce(mockChain(prevWorkouts));
      const result = await getWorkoutAnalytics('user-1');
      expect(result.comparison).toHaveProperty('workouts');
      expect(result.comparison).toHaveProperty('minutes');
      expect(result.comparison).toHaveProperty('pctChange');
    });
  });

  describe('getWeightHistory', () => {
    it('returns empty array for null userId', async () => {
      const result = await getWeightHistory(null);
      expect(result).toEqual([]);
    });

    it('returns weight history', async () => {
      const weightLogs = [
        { weight: 80, recorded_at: '2024-01-01T00:00:00Z' },
        { weight: 79, recorded_at: '2024-01-08T00:00:00Z' },
      ];
      supabase.from.mockReturnValue(mockChain(weightLogs));
      const result = await getWeightHistory('user-1');
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('weight', 80);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('fullDate');
    });

    it('returns empty array when no weight logs', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWeightHistory('user-1');
      expect(result).toEqual([]);
    });
  });

  describe('getWorkoutFrequency', () => {
    it('returns empty array for null userId', async () => {
      const result = await getWorkoutFrequency(null);
      expect(result).toEqual([]);
    });

    it('returns workout frequency by week', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getWorkoutFrequency('user-1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);
      expect(result[0]).toHaveProperty('week');
      expect(result[0]).toHaveProperty('count');
    });

    it('counts workouts per week', async () => {
      const now = new Date();
      const workouts = [
        { completed_at: now.toISOString() },
        { completed_at: now.toISOString() },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getWorkoutFrequency('user-1');
      expect(result.some(w => w.count > 0)).toBe(true);
    });
  });

  describe('getMonthlyComparison', () => {
    it('returns empty array for null userId', async () => {
      const result = await getMonthlyComparison(null);
      expect(result).toEqual([]);
    });

    it('returns monthly comparison', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await getMonthlyComparison('user-1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(6);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('workouts');
      expect(result[0]).toHaveProperty('minutes');
    });

    it('counts workouts per month', async () => {
      const now = new Date();
      const workouts = [
        { duration: 30, completed_at: now.toISOString() },
        { duration: 45, completed_at: now.toISOString() },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await getMonthlyComparison('user-1');
      expect(result.some(m => m.workouts > 0)).toBe(true);
    });
  });
});
