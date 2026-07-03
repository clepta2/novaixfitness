// src/__tests__/utils/storage.test.ts
// Testes para storage - NOVAIX FITNESS

// Mock simples do AsyncStorage
const mockStorage = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key: string) => Promise.resolve(mockStorage.get(key) || null)),
    setItem: jest.fn((key: string, value: string) => {
      mockStorage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      mockStorage.delete(key);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      mockStorage.clear();
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Array.from(mockStorage.keys()))),
    multiGet: jest.fn((keys: string[]) => 
      Promise.resolve(keys.map(k => [k, mockStorage.get(k) || null]))
    ),
    multiRemove: jest.fn((keys: string[]) => {
      keys.forEach(k => mockStorage.delete(k));
      return Promise.resolve();
    }),
  },
}));

import { storage } from '../../utils/storage';

describe('storage', () => {
  beforeEach(() => {
    mockStorage.clear();
    jest.clearAllMocks();
  });

  describe('set e get', () => {
    it('should store and retrieve data', async () => {
      await storage.set('test', { foo: 'bar' });
      const result = await storage.get('test');
      
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should return null for non-existent key', async () => {
      const result = await storage.get('nonexistent');
      
      expect(result).toBeNull();
    });

    it('should overwrite existing data', async () => {
      await storage.set('test', 'first');
      await storage.set('test', 'second');
      const result = await storage.get('test');
      
      expect(result).toBe('second');
    });

    it('should handle different data types', async () => {
      await storage.set('string', 'hello');
      await storage.set('number', 42);
      await storage.set('boolean', true);
      await storage.set('array', [1, 2, 3]);
      await storage.set('object', { a: 1, b: 2 });
      
      expect(await storage.get('string')).toBe('hello');
      expect(await storage.get('number')).toBe(42);
      expect(await storage.get('boolean')).toBe(true);
      expect(await storage.get('array')).toEqual([1, 2, 3]);
      expect(await storage.get('object')).toEqual({ a: 1, b: 2 });
    });
  });

  describe('expiry', () => {
    it('should expire data after expiry time', async () => {
      jest.useFakeTimers();
      
      await storage.set('test', 'value', { expiry: 1000 });
      
      // Before expiry
      expect(await storage.get('test')).toBe('value');
      
      // After expiry
      jest.advanceTimersByTime(1001);
      expect(await storage.get('test')).toBeNull();
      
      jest.useRealTimers();
    });

    it('should not expire data without expiry', async () => {
      jest.useFakeTimers();
      
      await storage.set('test', 'value');
      
      jest.advanceTimersByTime(1000000);
      expect(await storage.get('test')).toBe('value');
      
      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    it('should remove data', async () => {
      await storage.set('test', 'value');
      expect(await storage.get('test')).toBe('value');
      
      await storage.remove('test');
      expect(await storage.get('test')).toBeNull();
    });

    it('should not throw when removing non-existent key', async () => {
      await expect(storage.remove('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all data with prefix', async () => {
      await storage.set('test1', 'value1');
      await storage.set('test2', 'value2');
      
      await storage.clear();
      
      expect(await storage.get('test1')).toBeNull();
      expect(await storage.get('test2')).toBeNull();
    });
  });

  describe('getSize', () => {
    it('should return size', async () => {
      await storage.set('test', 'value');
      
      const size = await storage.getSize();
      
      expect(typeof size).toBe('number');
      expect(size).toBeGreaterThan(0);
    });

    it('should return 0 for empty storage', async () => {
      const size = await storage.getSize();
      
      expect(size).toBe(0);
    });
  });
});
