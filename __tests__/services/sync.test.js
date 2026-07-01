import AsyncStorage from '@react-native-async-storage/async-storage';
import { queueAction, syncPendingActions, getPendingActions, hasPendingActions } from '../../src/services/offlineSync';

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  mockSupabase._reset();
});

describe('Sync Service', () => {
  describe('syncPendingActions', () => {
    it('returns empty when no pending actions', async () => {
      const result = await syncPendingActions();
      expect(result.synced).toBe(0);
      expect(result.failed).toBe(0);
    });

    it('has no pending actions initially', async () => {
      const pending = await hasPendingActions();
      expect(pending).toBe(false);
    });

    it('queues and syncs an action', async () => {
      await queueAction('favorite', 'favorites', { workout_id: 'w1' });
      const pending = await hasPendingActions();
      expect(pending).toBe(true);
      const result = await syncPendingActions();
      expect(result.synced + result.failed).toBeGreaterThanOrEqual(1);
    });
  });
});
