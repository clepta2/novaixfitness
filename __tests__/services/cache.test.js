import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCacheSize,
  getCacheInfo,
  clearAllCache,
  clearWorkoutCache,
} from '../../src/services/cache';
import {
  cacheWorkouts,
  cacheWorkoutDetail,
  getCachedWorkouts,
  getCachedWorkoutDetail,
  cacheFavorites,
  getCachedFavorites,
  cacheProfile,
  getCachedProfile,
} from '../../src/services/offline';

beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('Cache Service', () => {
  describe('getCacheSize', () => {
    it('returns 0 when cache is empty', async () => {
      const size = await getCacheSize();
      expect(size).toBe(0);
    });

    it('returns size of cached data', async () => {
      await cacheWorkouts([{ id: '1', name: 'Test' }]);
      const size = await getCacheSize();
      expect(size).toBeGreaterThan(0);
    });
  });

  describe('getCacheInfo', () => {
    it('returns empty info when cache is empty', async () => {
      const info = await getCacheInfo();
      expect(info.totalSize).toBe(0);
      expect(info.keyCount).toBe(0);
      expect(info.withinLimit).toBe(true);
    });

    it('returns breakdown by key', async () => {
      await cacheWorkouts([{ id: '1' }]);
      await cacheFavorites([{ id: '1' }]);
      const info = await getCacheInfo();
      expect(info.breakdown).toHaveProperty('workouts');
      expect(info.breakdown).toHaveProperty('favorites');
      expect(info.keyCount).toBe(2);
    });

    it('detects when over limit', async () => {
      const bigData = { data: 'x'.repeat(30 * 1024 * 1024), timestamp: Date.now() };
      await AsyncStorage.setItem('@novaix:workouts', JSON.stringify(bigData));
      const info = await getCacheInfo();
      expect(info.totalSize).toBeGreaterThan(50 * 1024 * 1024);
      expect(info.withinLimit).toBe(false);
    });
  });

  describe('clearWorkoutCache', () => {
    it('clears only workout-related cache', async () => {
      await cacheWorkouts([{ id: '1' }]);
      await cacheWorkoutDetail({ id: 'w1', name: 'Detail' });
      await cacheFavorites([{ id: '1' }]);
      await cacheProfile({ id: '1' });

      await clearWorkoutCache();

      expect(await getCachedWorkouts()).toBeNull();
      expect(await getCachedWorkoutDetail('w1')).toBeNull();
      expect(await getCachedFavorites()).toEqual([{ id: '1' }]);
      expect(await getCachedProfile()).toEqual({ id: '1' });
    });
  });

  describe('clearAllCache', () => {
    it('clears everything', async () => {
      await cacheWorkouts([{ id: '1' }]);
      await cacheFavorites([{ id: '1' }]);
      await cacheProfile({ id: '1' });

      await clearAllCache();

      expect(await getCachedWorkouts()).toBeNull();
      expect(await getCachedFavorites()).toBeNull();
      expect(await getCachedProfile()).toBeNull();
    });
  });
});
