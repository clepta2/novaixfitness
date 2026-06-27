import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPendingAction, getPendingActions } from '../../src/services/offline';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

const { syncPendingActions } = require('../../src/services/sync');

beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('Sync Service', () => {
  describe('syncPendingActions', () => {
    it('returns 0 when no pending actions', async () => {
      const result = await syncPendingActions();
      expect(result).toEqual({ synced: 0, failed: 0 });
    });

    it('syncs ADD_FAVORITE action', async () => {
      await addPendingAction({ type: 'ADD_FAVORITE', workoutId: 'w1' });
      const result = await syncPendingActions();
      expect(result.synced).toBe(1);
      expect(result.failed).toBe(0);
      const remaining = await getPendingActions();
      expect(remaining).toHaveLength(0);
    });

    it('syncs REMOVE_FAVORITE action', async () => {
      await addPendingAction({ type: 'REMOVE_FAVORITE', workoutId: 'w1' });
      const result = await syncPendingActions();
      expect(result.synced).toBe(1);
    });

    it('syncs COMPLETE_WORKOUT action', async () => {
      await addPendingAction({
        type: 'COMPLETE_WORKOUT',
        userId: 'u1',
        workoutId: 'w1',
        completedAt: new Date().toISOString(),
        duration: 30,
      });
      const result = await syncPendingActions();
      expect(result.synced).toBe(1);
    });

    it('syncs UPDATE_WEIGHT action', async () => {
      await addPendingAction({
        type: 'UPDATE_WEIGHT',
        userId: 'u1',
        weight: 75.5,
        recordedAt: new Date().toISOString(),
      });
      const result = await syncPendingActions();
      expect(result.synced).toBe(1);
    });

    it('syncs multiple actions', async () => {
      await addPendingAction({ type: 'ADD_FAVORITE', workoutId: 'w1' });
      await new Promise(r => setTimeout(r, 5));
      await addPendingAction({ type: 'REMOVE_FAVORITE', workoutId: 'w2' });
      await new Promise(r => setTimeout(r, 5));
      await addPendingAction({ type: 'UPDATE_WEIGHT', userId: 'u1', weight: 80, recordedAt: new Date().toISOString() });
      const result = await syncPendingActions();
      expect(result.synced).toBe(3);
      expect(result.failed).toBe(0);
    });

    it('handles unknown action type gracefully', async () => {
      await addPendingAction({ type: 'UNKNOWN_TYPE', data: 'test' });
      const result = await syncPendingActions();
      expect(result.synced).toBe(1);
    });
  });
});
