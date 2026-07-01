// src/__tests__/integration/authFlow.test.ts
// Testes de integracao: fluxo completo de autenticacao - NOVAIX FITNESS

import { canAttemptLogin, recordFailedLogin, recordSuccessfulLogin, isLockedOut, getFailedAttempts } from '../../services/security/authProtection';
import { canRegister, validatePasswordStrength, validateEmailFormat } from '../../services/security/authProtection';
import { isAllowed, resetAllLimiters } from '../../utils/rateLimiter';
import { sanitizeInput, detectSuspiciousPatterns } from '../../services/security/sanitization';

describe('Auth Flow Integration', () => {
  beforeEach(() => resetAllLimiters());

  describe('login flow completo', () => {
    it('deve permitir 5 tentativas e bloquear na 6a', () => {
      const email = 'user@test.com';

      for (let i = 0; i < 5; i++) {
        expect(canAttemptLogin(email).allowed).toBe(true);
        recordFailedLogin(email);
      }

      expect(canAttemptLogin(email).allowed).toBe(false);
      expect(isLockedOut(email)).toBe(true);
    });

    it('deve limpar bloqueio apos login bem-sucedido', () => {
      const email = 'user2@test.com';
      recordFailedLogin(email);
      recordFailedLogin(email);

      recordSuccessfulLogin(email);
      expect(getFailedAttempts(email)).toBe(0);
      expect(isLockedOut(email)).toBe(false);
      expect(canAttemptLogin(email).allowed).toBe(true);
    });

    it('deve ter bloqueios independentes por usuario', () => {
      const user1 = 'a@test.com';
      const user2 = 'b@test.com';

      for (let i = 0; i < 5; i++) recordFailedLogin(user1);

      expect(isLockedOut(user1)).toBe(true);
      expect(isLockedOut(user2)).toBe(false);
      expect(canAttemptLogin(user2).allowed).toBe(true);
    });
  });

  describe('registro flow completo', () => {
    it('deve validar email antes de permitir registro', () => {
      expect(validateEmailFormat('valid@email.com')).toBe(true);
      expect(validateEmailFormat('invalid')).toBe(false);
      expect(validateEmailFormat('')).toBe(false);
    });

    it('deve validar senha forte', () => {
      const fraca = validatePasswordStrength('123');
      expect(fraca.valid).toBe(false);

      const forte = validatePasswordStrength('MinhaSenh@123');
      expect(forte.valid).toBe(true);
      expect(forte.score).toBeGreaterThanOrEqual(4);
    });

    it('deve bloquear registro apos 3 tentativas', () => {
      const email = 'new@test.com';
      canRegister(email);
      canRegister(email);
      canRegister(email);

      const r = canRegister(email);
      expect(r.allowed).toBe(false);
    });
  });

  describe('protecao contra injection no login', () => {
    it('deve sanitizar input de login', () => {
      const malicious = '<script>alert("xss")</script>';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('</script>');
    });

    it('deve detectar padroes suspeitos', () => {
      const r = detectSuspiciousPatterns('1; DROP TABLE users');
      expect(r.suspicious).toBe(true);
      expect(r.patterns.length).toBeGreaterThan(0);
    });
  });
});
