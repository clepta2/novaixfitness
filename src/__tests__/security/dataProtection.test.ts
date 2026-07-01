// src/__tests__/security/dataProtection.test.ts
// Testes de data protection — sanitizacao e query segura

import { sanitizeResponse, safeQuery } from '../../security/dataProtection';

jest.mock('../../security/encryptionField', () => ({
  encryptField: jest.fn(async (text: string) => `encrypted:${text}`),
  decryptField: jest.fn(async (text: string) => text.replace('encrypted:', '')),
  getSensitiveFields: jest.fn(() => ['email', 'phone']),
}));

describe('dataProtection', () => {
  describe('sanitizeResponse', () => {
    it('deve remover campos internos', () => {
      const data = {
        name: 'Joao',
        password_hash: 'abc123',
        mfa_secret: 'secret',
        backup_codes: ['1', '2'],
        internal_id: 'int-1',
      };
      const sanitized = sanitizeResponse(data);

      expect(sanitized.name).toBe('Joao');
      expect(sanitized.password_hash).toBeUndefined();
      expect(sanitized.mfa_secret).toBeUndefined();
      expect(sanitized.backup_codes).toBeUndefined();
      expect(sanitized.internal_id).toBeUndefined();
    });

    it('deve manter campos publicos', () => {
      const data = { name: 'Joao', email: 'joao@test.com', level: 5 };
      const sanitized = sanitizeResponse(data);

      expect(sanitized.name).toBe('Joao');
      expect(sanitized.email).toBe('joao@test.com');
      expect(sanitized.level).toBe(5);
    });
  });

  describe('safeQuery', () => {
    it('deve permitir tabelas na whitelist', () => {
      const mockSupabase = { from: jest.fn().mockReturnValue({}) };
      safeQuery(mockSupabase, 'profiles');
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    });

    it('deve bloquear tabelas fora da whitelist', () => {
      const mockSupabase = { from: jest.fn() };
      expect(() => safeQuery(mockSupabase, 'DROP_TABLE_users')).toThrow('nao permitida');
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });
});
