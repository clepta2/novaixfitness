// src/__tests__/services/authProtection.test.ts

import {
  canAttemptLogin, recordFailedLogin, recordSuccessfulLogin,
  canRegister, canResetPassword, validatePasswordStrength,
  validateEmailFormat, isLockedOut, getFailedAttempts, getBackoffDelay,
} from '../../services/security/authProtection';
import { resetAllLimiters } from '../../utils/rateLimiter';

describe('authProtection', () => {
  beforeEach(() => resetAllLimiters());

  describe('canAttemptLogin', () => {
    it('deve permitir primeira tentativa', () => {
      const r = canAttemptLogin('test@test.com');
      expect(r.allowed).toBe(true);
    });

    it('deve bloquear apos muitas falhas', () => {
      for (let i = 0; i < 10; i++) canAttemptLogin('user@test.com');
      const r = canAttemptLogin('user@test.com');
      expect(r.allowed).toBe(false);
    });
  });

  describe('recordFailedLogin', () => {
    it('deve incrementar tentativas', () => {
      const r1 = recordFailedLogin('user1');
      expect(r1.attempts).toBe(1);
      expect(r1.locked).toBe(false);
    });

    it('deve bloquear apos 5 falhas', () => {
      let r;
      for (let i = 0; i < 5; i++) r = recordFailedLogin('user2');
      expect(r!.locked).toBe(true);
    });

    it('deve detectar lockout', () => {
      for (let i = 0; i < 5; i++) recordFailedLogin('user3');
      expect(isLockedOut('user3')).toBe(true);
    });
  });

  describe('recordSuccessfulLogin', () => {
    it('deve limpar contadores', () => {
      recordFailedLogin('user4');
      recordFailedLogin('user4');
      recordSuccessfulLogin('user4');
      expect(getFailedAttempts('user4')).toBe(0);
      expect(isLockedOut('user4')).toBe(false);
    });
  });

  describe('canRegister', () => {
    it('deve permitir registro', () => {
      expect(canRegister('new@email.com').allowed).toBe(true);
    });

    it('deve bloquear apos muitas tentativas', () => {
      for (let i = 0; i < 4; i++) canRegister('spam@email.com');
      const r = canRegister('spam@email.com');
      expect(r.allowed).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('deve aceitar senha forte', () => {
      const r = validatePasswordStrength('MinhaSenh@123');
      expect(r.valid).toBe(true);
      expect(r.score).toBeGreaterThanOrEqual(4);
    });

    it('deve rejeitar senha fraca', () => {
      const r = validatePasswordStrength('123');
      expect(r.valid).toBe(false);
    });

    it('deve rejeitar senha comum', () => {
      const r = validatePasswordStrength('password123');
      expect(r.score).toBeLessThan(4);
    });
  });

  describe('validateEmailFormat', () => {
    it('aceita email valido', () => expect(validateEmailFormat('a@b.com')).toBe(true));
    it('rejeita email invalido', () => expect(validateEmailFormat('abc')).toBe(false));
    it('rejeita email vazio', () => expect(validateEmailFormat('')).toBe(false));
  });

  describe('getBackoffDelay', () => {
    it('retorna delay crescente', () => {
      expect(getBackoffDelay(0)).toBe(1000);
      expect(getBackoffDelay(1)).toBe(2000);
      expect(getBackoffDelay(2)).toBe(4000);
    });

    it('tem maximo de 60s', () => {
      expect(getBackoffDelay(10)).toBe(60000);
    });
  });
});
