import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cacheWorkouts,
  getCachedWorkouts,
  cacheFavorites,
  getCachedFavorites,
  cacheProfile,
  getCachedProfile,
  addPendingAction,
  getPendingActions,
  clearPendingAction,
  clearAllPendingActions,
  updateLastSync,
  getLastSync,
} from '../../src/services/offline';
import { clearAllCache } from '../../src/services/cache';

beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('Offline Service', () => {
  describe('cacheWorkouts / getCachedWorkouts', () => {
    it('caches and retrieves workouts', async () => {
      const workouts = [{ id: '1', name: 'Treino A' }, { id: '2', name: 'Treino B' }];
      await cacheWorkouts(workouts);
      const result = await getCachedWorkouts();
      expect(result).toEqual(workouts);
    });

    it('returns null when no cache exists', async () => {
      const result = await getCachedWorkouts();
      expect(result).toBeNull();
    });

    it('returns null when cache is expired', async () => {
      const workouts = [{ id: '1', name: 'Treino A' }];
      const expired = { workouts, timestamp: Date.now() - 25 * 60 * 60 * 1000 };
      await AsyncStorage.setItem('@novaix:workouts', JSON.stringify(expired));
      const result = await getCachedWorkouts();
      expect(result).toBeNull();
    });

    it('returns workouts when cache is fresh', async () => {
      const workouts = [{ id: '1', name: 'Treino A' }];
      const fresh = { data: workouts, timestamp: Date.now() - 1000 };
      await AsyncStorage.setItem('@novaix:workouts', JSON.stringify(fresh));
      const result = await getCachedWorkouts();
      expect(result).toEqual(workouts);
    });
  });

  describe('cacheFavorites / getCachedFavorites', () => {
    it('caches and retrieves favorites', async () => {
      const favorites = [{ workout_id: '1', workouts: { name: 'Treino A' } }];
      await cacheFavorites(favorites);
      const result = await getCachedFavorites();
      expect(result).toEqual(favorites);
    });

    it('returns null when no cache exists', async () => {
      const result = await getCachedFavorites();
      expect(result).toBeNull();
    });
  });

  describe('cacheProfile / getCachedProfile', () => {
    it('caches and retrieves profile', async () => {
      const profile = { id: 'user-1', name: 'Atleta', email: 'test@test.com' };
      await cacheProfile(profile);
      const result = await getCachedProfile();
      expect(result).toEqual(profile);
    });

    it('returns null when no cache exists', async () => {
      const result = await getCachedProfile();
      expect(result).toBeNull();
    });
  });

  describe('addPendingAction / getPendingActions', () => {
    it('adds a pending action', async () => {
      await addPendingAction({ type: 'ADD_FAVORITE', workoutId: 'w1' });
      const actions = await getPendingActions();
      expect(actions).toHaveLength(1);
      expect(actions[0].type).toBe('ADD_FAVORITE');
      expect(actions[0].workoutId).toBe('w1');
      expect(actions[0].id).toBeDefined();
      expect(actions[0].timestamp).toBeDefined();
    });

    it('adds multiple pending actions', async () => {
      await addPendingAction({ type: 'ADD_FAVORITE', workoutId: 'w1' });
      await addPendingAction({ type: 'REMOVE_FAVORITE', workoutId: 'w2' });
      await addPendingAction({ type: 'COMPLETE_WORKOUT', workoutId: 'w3' });
      const actions = await getPendingActions();
      expect(actions).toHaveLength(3);
    });

    it('returns empty array when no actions exist', async () => {
      const actions = await getPendingActions();
      expect(actions).toEqual([]);
    });
  });

  describe('clearPendingAction', () => {
    it('removes a specific action by id', async () => {
      await addPendingAction({ type: 'ADD_FAVORITE', workoutId: 'w1' });
      await new Promise(r => setTimeout(r, 5));
      await addPendingAction({ type: 'REMOVE_FAVORITE', workoutId: 'w2' });
      const actions = await getPendingActions();
      const idToRemove = actions.find(a => a.workoutId === 'w1').id;
      await clearPendingAction(idToRemove);
      const remaining = await getPendingActions();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].workoutId).toBe('w2');
    });
  });

  describe('clearAllPendingActions', () => {
    it('removes all pending actions', async () => {
      await addPendingAction({ type: 'ADD_FAVORITE', workoutId: 'w1' });
      await addPendingAction({ type: 'REMOVE_FAVORITE', workoutId: 'w2' });
      await clearAllPendingActions();
      const actions = await getPendingActions();
      expect(actions).toEqual([]);
    });
  });

  describe('updateLastSync / getLastSync', () => {
    it('updates and retrieves last sync time', async () => {
      await updateLastSync();
      const lastSync = await getLastSync();
      expect(lastSync).toBeGreaterThan(0);
      expect(Date.now() - lastSync).toBeLessThan(1000);
    });

    it('returns null when no sync has occurred', async () => {
      const lastSync = await getLastSync();
      expect(lastSync).toBeNull();
    });
  });

  describe('clearAllCache', () => {
    it('clears all cached data', async () => {
      await cacheWorkouts([{ id: '1' }]);
      await cacheFavorites([{ id: '1' }]);
      await cacheProfile({ id: '1' });
      await addPendingAction({ type: 'TEST' });
      await updateLastSync();

      await clearAllCache();

      expect(await getCachedWorkouts()).toBeNull();
      expect(await getCachedFavorites()).toBeNull();
      expect(await getCachedProfile()).toBeNull();
      expect(await getPendingActions()).toEqual([]);
      expect(await getLastSync()).toBeNull();
    });
  });
});
