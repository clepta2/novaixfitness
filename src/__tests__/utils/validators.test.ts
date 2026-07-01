// src/__tests__/utils/validators.test.ts

import { validate, Rules, validateFields } from '../../utils/validators';

describe('validators', () => {
  describe('validate', () => {
    it('deve retornar valid para valor ok', () => {
      const r = validate('abc', [Rules.required('Campo')]);
      expect(r.valid).toBe(true);
      expect(r.errors).toHaveLength(0);
    });

    it('deve retornar erro para valor vazio', () => {
      const r = validate('', [Rules.required('Campo')]);
      expect(r.valid).toBe(false);
      expect(r.errors[0]).toContain('Campo');
    });
  });

  describe('Rules', () => {
    it('required: falha para null', () => {
      const r = validate(null, [Rules.required('Nome')]);
      expect(r.valid).toBe(false);
    });

    it('minLength: falha para string curta', () => {
      const r = validate('ab', [Rules.minLength(3, 'Nome')]);
      expect(r.valid).toBe(false);
    });

    it('minLength: ok para string longa', () => {
      const r = validate('abcd', [Rules.minLength(3, 'Nome')]);
      expect(r.valid).toBe(true);
    });

    it('email: aceita email valido', () => {
      const r = validate('a@b.com', [Rules.email()]);
      expect(r.valid).toBe(true);
    });

    it('email: rejeita email invalido', () => {
      const r = validate('abc', [Rules.email()]);
      expect(r.valid).toBe(false);
    });

    it('range: ok dentro do intervalo', () => {
      const r = validate(50, [Rules.range(0, 100, 'Valor')]);
      expect(r.valid).toBe(true);
    });

    it('range: falha fora do intervalo', () => {
      const r = validate(150, [Rules.range(0, 100, 'Valor')]);
      expect(r.valid).toBe(false);
    });

    it('cpf: aceita cpf valido', () => {
      const r = validate('12345678901', [Rules.cpf()]);
      expect(r.valid).toBe(true);
    });

    it('cpf: rejeita cpf invalido', () => {
      const r = validate('123', [Rules.cpf()]);
      expect(r.valid).toBe(false);
    });
  });

  describe('validateFields', () => {
    it('deve validar multiplos campos', () => {
      const r = validateFields({
        name: { value: '', rules: [Rules.required('Nome')] },
        email: { value: 'bad', rules: [Rules.email()] },
      });
      expect(r.valid).toBe(false);
      expect(r.errors.length).toBe(2);
    });

    it('deve retornar ok quando todos validos', () => {
      const r = validateFields({
        name: { value: 'Joao', rules: [Rules.required('Nome')] },
        email: { value: 'a@b.com', rules: [Rules.email()] },
      });
      expect(r.valid).toBe(true);
    });
  });
});
