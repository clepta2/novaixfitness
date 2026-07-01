// src/__tests__/security/jwtBlocklist.test.ts
// Testes de JWT blocklist — revogacao de tokens

import { revokeToken, isTokenRevoked, revokeAllUserTokens, areAllUserTokensRevoked } from '../../services/security/jwtBlocklist';

jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null }),
      delete: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('JWT Blocklist', () => {
  describe('revokeToken', () => {
    it('deve adicionar token a blocklist', async () => {
      const expiresAt = Date.now() + 900000; // 15min
      await expect(revokeToken('token-123', expiresAt)).resolves.not.toThrow();
    });

    it('nao deve adicionar token ja expirado', async () => {
      const expiresAt = Date.now() - 1000; // ja expirado
      await expect(revokeToken('token-old', expiresAt)).resolves.not.toThrow();
    });
  });

  describe('isTokenRevoked', () => {
    it('deve retornar false quando nao esta na blocklist', async () => {
      const result = await isTokenRevoked('token-123');
      expect(result).toBe(false);
    });
  });

  describe('revokeAllUserTokens', () => {
    it('deve revogar todos tokens de um usuario', async () => {
      await expect(revokeAllUserTokens('user-1')).resolves.not.toThrow();
    });
  });

  describe('areAllUserTokensRevoked', () => {
    it('deve retornar false quando nao ha revogacao geral', async () => {
      const result = await areAllUserTokensRevoked('user-1');
      expect(result).toBe(false);
    });
  });
});
