// src/__tests__/performance.test.ts
// Testes para o utilitario de performance

import { throttle, debounce, performanceMonitor, measureSync } from '../utils/performance';

// Limpar cache entre testes
beforeEach(() => {
  jest.clearAllMocks();
  performanceMonitor.clear();
});

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve executar funcao imediatamente na primeira chamada', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('deve limitar chamadas dentro do intervalo', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('deve permitir chamada apos intervalo', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    throttled();
    jest.advanceTimersByTime(1000);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve atrasar execucao', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 1000);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('deve cancelar chamadas anteriores', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 1000);
    debounced();
    debounced();
    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('performanceMonitor', () => {
  it('deve marcar e medir tempo', () => {
    performanceMonitor.mark('start');
    const result = measureSync('test', () => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) sum += i;
      return sum;
    });
    expect(result).toBe(499500);
  });

  it('deve retornar entradas', () => {
    performanceMonitor.mark('start');
    performanceMonitor.measure('test', 'start');
    const entries = performanceMonitor.getEntries();
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  it('deve limpar entradas', () => {
    performanceMonitor.mark('start');
    performanceMonitor.measure('test', 'start');
    performanceMonitor.clear();
    expect(performanceMonitor.getEntries()).toHaveLength(0);
  });
});
