// src/__tests__/integration/paymentFlow.test.ts
// Testes de integracao: fluxo completo de pagamento - NOVAIX FITNESS

import { canProcessPayment, recordPayment, validatePaymentAmount, validateCpf, validateCardNumber } from '../../services/security/paymentProtection';
import { isAllowed, resetAllLimiters } from '../../utils/rateLimiter';
import { sanitizeInput } from '../../services/security/sanitization';

describe('Payment Flow Integration', () => {
  beforeEach(() => resetAllLimiters());

  describe('fluxo de pagamento completo', () => {
    it('deve validar valor do plano antes de processar', () => {
      expect(validatePaymentAmount('basic', 49.90).valid).toBe(true);
      expect(validatePaymentAmount('basic', 39.90).valid).toBe(true);
      expect(validatePaymentAmount('intermediate', 79.90).valid).toBe(true);
      expect(validatePaymentAmount('premium', 119.90).valid).toBe(true);
      expect(validatePaymentAmount('ultra', 199.90).valid).toBe(true);
    });

    it('deve rejeitar valor incorreto', () => {
      expect(validatePaymentAmount('basic', 99.90).valid).toBe(false);
      expect(validatePaymentAmount('premium', 49.90).valid).toBe(false);
    });

    it('deve bloquear pagamento duplicado', () => {
      recordPayment('user1', 'basic', 49.90);
      const r = canProcessPayment('user1');
      expect(r.allowed).toBe(false);
      expect(r.reason).toContain('recente');
    });

    it('deve bloquear apos 5 tentativas', () => {
      for (let i = 0; i < 5; i++) canProcessPayment('user2');
      const r = canProcessPayment('user2');
      expect(r.allowed).toBe(false);
    });

    it('deve validar CPF no pagamento', () => {
      expect(validateCpf('529.982.247-25')).toBe(true);
      expect(validateCpf('111.111.111-11')).toBe(false);
      expect(validateCpf('123')).toBe(false);
    });

    it('deve validar numero de cartao (Luhn)', () => {
      expect(validateCardNumber('4539578763621486')).toBe(true);
      expect(validateCardNumber('1234567890123')).toBe(false);
    });
  });

  describe('sanitizacao de dados de pagamento', () => {
    it('deve sanitizar nome no formulario', () => {
      expect(sanitizeInput('João Silva')).toBe('João Silva');
      expect(sanitizeInput('<script>evil</script>')).not.toContain('<script>');
    });
  });
});
