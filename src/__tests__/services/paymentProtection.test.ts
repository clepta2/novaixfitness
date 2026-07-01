// src/__tests__/services/paymentProtection.test.ts

import {
  canProcessPayment, recordPayment, validatePaymentAmount,
  validateCpf, validateCardNumber, getPaymentProtectionStatus,
} from '../../services/security/paymentProtection';
import { resetAllLimiters } from '../../utils/rateLimiter';

describe('paymentProtection', () => {
  beforeEach(() => resetAllLimiters());

  describe('canProcessPayment', () => {
    it('deve permitir primeiro pagamento', () => {
      const r = canProcessPayment('user1');
      expect(r.allowed).toBe(true);
    });

    it('deve bloquear pagamento duplicado rapido', () => {
      recordPayment('user2', 'basic', 49.90);
      const r = canProcessPayment('user2');
      expect(r.allowed).toBe(false);
      expect(r.reason).toContain('recente');
    });

    it('deve bloquear apos muitas tentativas', () => {
      for (let i = 0; i < 5; i++) canProcessPayment('user3');
      const r = canProcessPayment('user3');
      expect(r.allowed).toBe(false);
    });
  });

  describe('validatePaymentAmount', () => {
    it('aceita valor correto para plano basico', () => {
      const r = validatePaymentAmount('basic', 49.90);
      expect(r.valid).toBe(true);
    });

    it('aceita valor anual para basico', () => {
      const r = validatePaymentAmount('basic', 39.90);
      expect(r.valid).toBe(true);
    });

    it('rejeita valor invalido', () => {
      const r = validatePaymentAmount('basic', 999);
      expect(r.valid).toBe(false);
    });

    it('rejeita plano invalido', () => {
      const r = validatePaymentAmount('invalid', 49.90);
      expect(r.valid).toBe(false);
    });
  });

  describe('validateCpf', () => {
    it('aceita cpf valido', () => {
      expect(validateCpf('529.982.247-25')).toBe(true);
    });

    it('rejeita cpf com todos digitos iguais', () => {
      expect(validateCpf('111.111.111-11')).toBe(false);
    });

    it('rejeita cpf curto', () => {
      expect(validateCpf('12345')).toBe(false);
    });
  });

  describe('validateCardNumber', () => {
    it('aceita numero valido (Luhn)', () => {
      expect(validateCardNumber('4539578763621486')).toBe(true);
    });

    it('rejeita numero invalido', () => {
      expect(validateCardNumber('1234567890123')).toBe(false);
    });

    it('rejeita numero muito curto', () => {
      expect(validateCardNumber('1234')).toBe(false);
    });
  });

  describe('getPaymentProtectionStatus', () => {
    it('retorna status correto sem pagamento', () => {
      const r = getPaymentProtectionStatus('user');
      expect(r.recentPayment).toBe(false);
    });
  });
});
