// __tests__/services/activityTracker.test.ts

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

jest.mock('../../src/config/tables', () => ({
  TABLES: { ACTIVITIES: 'activities' },
}));

const { supabase } = require('../../src/config/supabase');
const {
  startActivity, finishActivity, pauseActivity, resumeActivity,
  getActivityHistory, getActivityStats, cancelActivity, getActiveActivityId,
} = require('../../src/services/activityTracker');

beforeEach(() => {
  jest.clearAllMocks();
  supabase._reset();
});

describe('Activity Tracker', () => {
  describe('startActivity', () => {
    it('creates activity and returns id', async () => {
      supabase._setData({ id: 'act-123' });
      const id = await startActivity('user-1', { type: 'running' });
      expect(id).toBe('act-123');
    });

    it('returns null when no userId', async () => {
      const id = await startActivity('', { type: 'running' });
      expect(id).toBeNull();
    });
  });

  describe('finishActivity', () => {
    it('finishes activity with data', async () => {
      supabase._setData({ id: 'act-123', duration_seconds: 1800, distance_meters: 5000 });
      const result = await finishActivity('act-123', { distance_meters: 5000, calories: 300 });
      expect(result).not.toBeNull();
    });

    it('returns null when no activityId', async () => {
      const result = await finishActivity('', {});
      expect(result).toBeNull();
    });
  });

  describe('getActivityHistory', () => {
    it('returns activity list', async () => {
      supabase._setData([{ id: 'act-1', type: 'running' }]);
      const history = await getActivityHistory('user-1');
      expect(history.length).toBe(1);
    });

    it('returns empty when no userId', async () => {
      const history = await getActivityHistory('');
      expect(history.length).toBe(0);
    });
  });

  describe('getActivityStats', () => {
    it('returns aggregated stats', async () => {
      supabase._setData([
        { type: 'running', duration_seconds: 1800, distance_meters: 5000, calories: 300 },
        { type: 'cycling', duration_seconds: 3600, distance_meters: 15000, calories: 500 },
      ]);
      const stats = await getActivityStats('user-1');
      expect(stats).toHaveProperty('totalActivities');
      expect(stats).toHaveProperty('totalDistance');
      expect(stats).toHaveProperty('byType');
    });
  });

  describe('cancelActivity', () => {
    it('deletes activity', async () => {
      supabase._setData(null);
      const result = await cancelActivity('act-123');
      expect(result).toBe(true);
    });
  });
});
