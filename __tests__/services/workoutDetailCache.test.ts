import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cacheWorkoutDetail,
  getCachedWorkoutDetail,
  isWorkoutCached,
} from '../../src/services/offline';

beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('Workout Detail Cache', () => {
  const workout = { id: 'w1', name: 'Treino A', exercises: [{ id: 'e1', name: 'Agachamento' }] };

  describe('cacheWorkoutDetail / getCachedWorkoutDetail', () => {
    it('caches and retrieves workout detail', async () => {
      await cacheWorkoutDetail(workout);
      const result = await getCachedWorkoutDetail('w1');
      expect(result).toEqual(workout);
    });

    it('returns null for non-existent workout', async () => {
      const result = await getCachedWorkoutDetail('nonexistent');
      expect(result).toBeNull();
    });

    it('returns null when cache is expired', async () => {
      const expired = { w1: { workout, timestamp: Date.now() - 25 * 60 * 60 * 1000 } };
      await AsyncStorage.setItem('@novaix:workout_details', JSON.stringify(expired));
      const result = await getCachedWorkoutDetail('w1');
      expect(result).toBeNull();
    });

    it('limits cached details to 30', async () => {
      for (let i = 1; i <= 35; i++) {
        await cacheWorkoutDetail({ id: `w${i}`, name: `Treino ${i}` });
        await new Promise(r => setTimeout(r, 2));
      }
      const raw = await AsyncStorage.getItem('@novaix:workout_details');
      const cache = JSON.parse(raw);
      expect(Object.keys(cache).length).toBeLessThanOrEqual(30);
    });
  });

  describe('isWorkoutCached', () => {
    it('returns false when not cached', async () => {
      expect(await isWorkoutCached('w1')).toBe(false);
    });

    it('returns true when cached', async () => {
      await cacheWorkoutDetail(workout);
      expect(await isWorkoutCached('w1')).toBe(true);
    });

    it('returns false when expired', async () => {
      const expired = { w1: { workout, timestamp: Date.now() - 25 * 60 * 60 * 1000 } };
      await AsyncStorage.setItem('@novaix:workout_details', JSON.stringify(expired));
      expect(await isWorkoutCached('w1')).toBe(false);
    });
  });
});
