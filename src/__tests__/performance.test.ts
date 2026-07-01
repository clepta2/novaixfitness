// src/__tests__/performance.test.ts
// Testes para o utilitario de performance

import { throttle, debounce, prefetchImages, preloadScreen } from '../utils/performance';

// Limpar cache entre testes
beforeEach(() => {
  jest.clearAllMocks();
});

describe('throttle', () => {
  jest.useFakeTimers();

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
  jest.useFakeTimers();

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

describe('prefetchImages', () => {
  it('deve ser uma funcao', () => {
    expect(typeof prefetchImages).toBe('function');
  });
});

describe('preloadScreen', () => {
  it('deve ser uma funcao', () => {
    expect(typeof preloadScreen).toBe('function');
  });
});
