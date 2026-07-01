// src/__tests__/useResponsive.test.ts
// Testes para o utilitario de responsividade

import { scale } from '../utils/responsive';

describe('responsive utils', () => {
  it('deve retornar um numero para scale()', () => {
    const result = scale(16);
    expect(typeof result).toBe('number');
  });

  it('deve retornar valor proximo ao input', () => {
    const result = scale(100);
    expect(result).toBeGreaterThanOrEqual(80);
    expect(result).toBeLessThanOrEqual(120);
  });

  it('deve retornar inteiro', () => {
    const result = scale(16);
    expect(Number.isInteger(result)).toBe(true);
  });
});
