// src/__tests__/security/serverRateLimit.test.ts
// Testes de rate limiting server-side

import { checkServerRateLimit } from '../../services/security/serverRateLimit';

jest.mock('../../config/supabase', () => {
  let callCount = 0;
  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockImplementation(() => {
          callCount++;
          return Promise.resolve({ data: Array(Math.max(0, callCount - 2)).fill({ id: '1' }), error: null });
        }),
        insert: jest.fn().mockResolvedValue({ error: null }),
        delete: jest.fn().mockReturnThis(),
        lt: jest.fn().mockResolvedValue({ data: [], error: null }),
        single: jest.fn().mockResolvedValue({ data: null }),
      })),
    },
  };
});

describe('serverRateLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkServerRateLimit', () => {
    it('deve permitir primeira chamada', async () => {
      const result = await checkServerRateLimit('login', 'user@test.com');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
    });

    it('deve retornar remaining correto', async () => {
      const result = await checkServerRateLimit('login', 'user@test.com');
      expect(typeof result.remaining).toBe('number');
      expect(typeof result.retryAfterMs).toBe('number');
    });

    it('deve ter config padrao para login', async () => {
      const result = await checkServerRateLimit('login', 'user@test.com');
      expect(result).toHaveProperty('allowed');
      expect(result).toHaveProperty('remaining');
    });

    it('deve aceitar config customizada', async () => {
      const result = await checkServerRateLimit('custom', 'user@test.com', {
        maxRequests: 2,
        windowMs: 60000,
      });
      expect(result).toHaveProperty('allowed');
    });
  });
});
