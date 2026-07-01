// src/__tests__/memoize.test.ts
// Testes para o utilitario de memoize

import { deepCompare } from '../utils/memoize';
import { throttle, debounce } from '../utils/performance';

describe('deepCompare', () => {
  it('deve retornar true para objetos iguais', () => {
    expect(deepCompare({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('deve retornar false para objetos diferentes', () => {
    expect(deepCompare({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('deve retornar true para arrays iguais', () => {
    expect(deepCompare([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('deve retornar false para arrays diferentes', () => {
    expect(deepCompare([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('deve ignorar funcoes na comparacao', () => {
    const fn = () => {};
    expect(deepCompare({ a: fn }, { a: fn })).toBe(true);
  });
});

describe('throttle', () => {
  jest.useFakeTimers();

  it('deve limitar chamadas', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    
    throttled();
    throttled();
    throttled();
    
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  it('deve atrasar chamadas', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 1000);
    
    debounced();
    expect(fn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
