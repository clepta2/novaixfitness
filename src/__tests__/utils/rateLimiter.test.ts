// src/__tests__/utils/rateLimiter.test.ts

import { isAllowed, recordAttempt, resetLimiter, resetAllLimiters, LIMITS } from '../../utils/rateLimiter';

describe('rateLimiter', () => {
  beforeEach(() => resetAllLimiters());

  describe('isAllowed', () => {
    it('deve permitir primeira tentativa', () => {
      const r = isAllowed('test', { maxAttempts: 3, windowMs: 60000 });
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(2);
    });

    it('deve bloquear apos exceder limite', () => {
      isAllowed('test', { maxAttempts: 2, windowMs: 60000 });
      isAllowed('test', { maxAttempts: 2, windowMs: 60000 });
      const r = isAllowed('test', { maxAttempts: 2, windowMs: 60000 });
      expect(r.allowed).toBe(false);
      expect(r.remaining).toBe(0);
    });

    it('deve manter chaves separadas', () => {
      isAllowed('a', { maxAttempts: 1, windowMs: 60000 });
      const r = isAllowed('b', { maxAttempts: 1, windowMs: 60000 });
      expect(r.allowed).toBe(true);
    });
  });

  describe('LIMITS', () => {
    it('deve ter limites para login', () => {
      expect(LIMITS.login.maxAttempts).toBe(5);
      expect(LIMITS.login.windowMs).toBeGreaterThan(0);
    });

    it('deve ter limites para register', () => {
      expect(LIMITS.register.maxAttempts).toBe(3);
    });

    it('deve ter limites para payment', () => {
      expect(LIMITS.payment.maxAttempts).toBe(5);
    });
  });

  describe('resetLimiter', () => {
    it('deve resetar e permitir novamente', () => {
      isAllowed('test', { maxAttempts: 1, windowMs: 60000 });
      const r1 = isAllowed('test', { maxAttempts: 1, windowMs: 60000 });
      expect(r1.allowed).toBe(false);
      resetLimiter('test');
      const r2 = isAllowed('test', { maxAttempts: 1, windowMs: 60000 });
      expect(r2.allowed).toBe(true);
    });
  });
});
