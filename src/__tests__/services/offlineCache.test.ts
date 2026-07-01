// src/__tests__/services/offlineCache.test.ts

import { cacheData, getCachedData, removeCachedData, getCacheStats } from '../../services/offlineCache';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store.get(key) || null)),
      setItem: jest.fn((key, val) => { store.set(key, val); return Promise.resolve(); }),
      removeItem: jest.fn((key) => { store.delete(key); return Promise.resolve(); }),
      getAllKeys: jest.fn(() => Promise.resolve([...store.keys()])),
      multiRemove: jest.fn((keys) => { keys.forEach(k => store.delete(k)); return Promise.resolve(); }),
    },
  };
});

describe('offlineCache', () => {
  describe('cacheData / getCachedData', () => {
    it('deve cachear e recuperar dados', async () => {
      await cacheData('workouts:list', [{ id: 1 }]);
      const data = await getCachedData('workouts:list');
      expect(data).toEqual([{ id: 1 }]);
    });

    it('deve retornar null para chave inexistente', async () => {
      const data = await getCachedData('nonexistent');
      expect(data).toBeNull();
    });
  });

  describe('removeCachedData', () => {
    it('deve remover item do cache', async () => {
      await cacheData('test:remove', 'value');
      await removeCachedData('test:remove');
      const data = await getCachedData('test:remove');
      expect(data).toBeNull();
    });
  });

  describe('getCacheStats', () => {
    it('deve retornar stats', async () => {
      await cacheData('workouts:test', { a: 1 });
      const stats = await getCacheStats();
      expect(stats).toHaveProperty('itemCount');
      expect(stats).toHaveProperty('totalSizeKB');
    });
  });
});
