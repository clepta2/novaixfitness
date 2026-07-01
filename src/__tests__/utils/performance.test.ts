// src/__tests__/utils/performance.test.ts

import { memoizeWithTTL, throttleWithTrailing, dedupeAsync, measureSync } from '../../utils/perfOptimizations';

describe('performance utils', () => {
  describe('memoizeWithTTL', () => {
    it('deve cachear resultado', () => {
      let calls = 0;
      const result1 = memoizeWithTTL('test1', () => ++calls, 60000);
      const result2 = memoizeWithTTL('test1', () => ++calls, 60000);
      expect(result1).toBe(1);
      expect(result2).toBe(1);
      expect(calls).toBe(1);
    });

    it('deve reexecutar apos TTL', () => {
      jest.useFakeTimers();
      let calls = 0;
      memoizeWithTTL('test2', () => ++calls, 1000);
      expect(calls).toBe(1);
      jest.advanceTimersByTime(1001);
      const r = memoizeWithTTL('test2', () => ++calls, 1000);
      expect(r).toBe(2);
      jest.useRealTimers();
    });
  });

  describe('throttleWithTrailing', () => {
    it('deve limitar chamadas', () => {
      let count = 0;
      const fn = throttleWithTrailing(() => { count++; }, 100);
      fn(); fn(); fn();
      expect(count).toBe(1);
    });

    it('deve cancelar', () => {
      let count = 0;
      const fn = throttleWithTrailing(() => { count++; }, 100);
      fn();
      fn.cancel();
      expect(count).toBe(1);
    });
  });

  describe('dedupeAsync', () => {
    it('deve deduplicar chamadas', async () => {
      let calls = 0;
      const fn = () => new Promise<number>(r => { calls++; r(42); });
      const [r1, r2] = await Promise.all([dedupeAsync('k', fn), dedupeAsync('k', fn)]);
      expect(calls).toBe(1);
      expect(r1).toBe(42);
      expect(r2).toBe(42);
    });
  });

  describe('measureSync', () => {
    it('deve retornar resultado', () => {
      expect(measureSync('test', () => 42)).toBe(42);
    });
  });
});
