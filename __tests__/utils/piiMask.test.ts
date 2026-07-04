// __tests__/utils/piiMask.test.js
// Testes do utilitário de mascaramento de PII

import {
  maskCPF,
  maskEmail,
  maskPhone,
  maskName,
  maskCreditCard,
  maskPIX,
  maskAddress,
  autoMaskPII,
} from '../../src/utils/piiMask';

describe('piiMask', () => {
  describe('maskCPF', () => {
    it('deve mascarar CPF válido', () => {
      expect(maskCPF('12345678900')).toBe('123.***.***-00');
      expect(maskCPF('123.456.789-00')).toBe('123.***.***-00');
    });

    it('deve retornar original se inválido', () => {
      expect(maskCPF('123')).toBe('123');
      expect(maskCPF('')).toBe('');
      expect(maskCPF('1234567890')).toBe('1234567890');
    });
  });

  describe('maskEmail', () => {
    it('deve mascarar email', () => {
      expect(maskEmail('joao@exemplo.com')).toBe('j***@exemplo.com');
      expect(maskEmail('ab@exemplo.com')).toBe('a***@exemplo.com');
    });

    it('deve retornar original se inválido', () => {
      expect(maskEmail('invalido')).toBe('invalido');
      expect(maskEmail('')).toBe('');
    });
  });

  describe('maskPhone', () => {
    it('deve mascarar telefone com 11 dígitos', () => {
      expect(maskPhone('(11) 99999-9999')).toBe('(11) 9****-9999');
      expect(maskPhone('11999999999')).toBe('(11) 9****-9999');
    });

    it('deve mascarar telefone com 10 dígitos', () => {
      expect(maskPhone('(11) 3333-4444')).toBe('(11) 3333-4444');
    });

    it('deve retornar original se muito curto', () => {
      expect(maskPhone('123')).toBe('123');
    });
  });

  describe('maskName', () => {
    it('deve mascarar nome completo', () => {
      expect(maskName('João Silva')).toBe('João S.');
      expect(maskName('Maria Santos Costa')).toBe('Maria C.');
    });

    it('deve retornar original se nome único', () => {
      expect(maskName('João')).toBe('João');
    });

    it('deve retornar original se vazio', () => {
      expect(maskName('')).toBe('');
    });
  });

  describe('maskCreditCard', () => {
    it('deve mascarar cartão de crédito', () => {
      expect(maskCreditCard('4111111111111111')).toBe('**** **** **** 1111');
      expect(maskCreditCard('4111 1111 1111 1111')).toBe('**** **** **** 1111');
    });

    it('deve retornar original se muito curto', () => {
      expect(maskCreditCard('4111')).toBe('4111');
    });
  });

  describe('maskPIX', () => {
    it('deve mascarar chave PIX longa', () => {
      expect(maskPIX('12345678900')).toBe('1234...8900');
    });

    it('deve retornar **** se muito curto', () => {
      expect(maskPIX('123')).toBe('****');
    });
  });

  describe('maskAddress', () => {
    it('deve mascarar endereço com mais de 6 chars', () => {
      const result = maskAddress('Rua Exemplo, 123');
      expect(result).toContain('***');
    });

    it('deve mascarar endereço sem número', () => {
      const result = maskAddress('Rua Exemplo');
      expect(result).toContain('***');
    });
  });

  describe('autoMaskPII', () => {
    it('deve detectar e mascarar CPF', () => {
      expect(autoMaskPII('12345678900')).toBe('123.***.***-00');
    });

    it('deve detectar e mascarar email', () => {
      expect(autoMaskPII('joao@exemplo.com')).toBe('j***@exemplo.com');
    });

    it('deve usar tipo especificado', () => {
      expect(autoMaskPII('12345678900', 'cpf')).toBe('123.***.***-00');
      expect(autoMaskPII('joao@exemplo.com', 'email')).toBe('j***@exemplo.com');
    });

    it('deve retornar original se não detectar PII', () => {
      expect(autoMaskPII('Texto normal')).toBe('Texto normal');
    });
  });
});