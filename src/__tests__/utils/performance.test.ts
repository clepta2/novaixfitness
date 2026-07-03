// src/__tests__/utils/performance.test.ts
// Testes para performance - NOVAIX FITNESS

import {
  performanceMonitor,
  measureAsync,
  measureSync,
  debounce,
  throttle,
} from '../../utils/performance';

describe('performance', () => {
  beforeEach(() => {
    performanceMonitor.clear();
  });

  describe('performanceMonitor', () => {
    it('should mark and measure', () => {
      performanceMonitor.mark('start');
      
      // Simular trabalho
      const arr = [];
      for (let i = 0; i < 1000; i++) arr.push(i);
      
      const duration = performanceMonitor.measure('test', 'start');
      
      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should return entries', () => {
      performanceMonitor.mark('start1');
      performanceMonitor.measure('test1', 'start1');
      
      performanceMonitor.mark('start2');
      performanceMonitor.measure('test2', 'start2');
      
      const entries = performanceMonitor.getEntries();
      
      expect(entries).toHaveLength(2);
    });

    it('should return entries by name', () => {
      performanceMonitor.mark('start');
      performanceMonitor.measure('test', 'start');
      
      const entries = performanceMonitor.getEntries('test');
      
      expect(entries).toHaveLength(1);
      expect(entries[0].name).toBe('test');
    });

    it('should calculate average duration', () => {
      performanceMonitor.mark('start1');
      performanceMonitor.measure('test', 'start1');
      
      performanceMonitor.mark('start2');
      performanceMonitor.measure('test', 'start2');
      
      const avg = performanceMonitor.getAverageDuration('test');
      
      expect(typeof avg).toBe('number');
      expect(avg).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 for non-existent name', () => {
      const avg = performanceMonitor.getAverageDuration('nonexistent');
      
      expect(avg).toBe(0);
    });

    it('should clear entries', () => {
      performanceMonitor.mark('start');
      performanceMonitor.measure('test', 'start');
      
      expect(performanceMonitor.getEntries()).toHaveLength(1);
      
      performanceMonitor.clear();
      
      expect(performanceMonitor.getEntries()).toHaveLength(0);
    });
  });

  describe('measureAsync', () => {
    it('should measure async function', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };
      
      const result = await measureAsync('asyncTest', fn);
      
      expect(result).toBe('result');
    });

    it('should handle errors', async () => {
      const fn = async () => {
        throw new Error('test error');
      };
      
      await expect(measureAsync('errorTest', fn)).rejects.toThrow('test error');
    });
  });

  describe('measureSync', () => {
    it('should measure sync function', () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) sum += i;
        return sum;
      };
      
      const result = measureSync('syncTest', fn);
      
      expect(result).toBe(499500);
    });

    it('should handle errors', () => {
      const fn = () => {
        throw new Error('test error');
      };
      
      expect(() => measureSync('errorTest', fn)).toThrow('test error');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2');
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      
      // After throttle period, last call should be executed
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to throttled function', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn('arg1', 'arg2');
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });
});
