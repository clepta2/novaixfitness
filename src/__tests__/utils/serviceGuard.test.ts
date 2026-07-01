// src/__tests__/utils/serviceGuard.test.ts
// Testes para serviceGuard

import { createServiceGuard } from '../../utils/serviceGuard';

describe('serviceGuard', () => {
  const guard = createServiceGuard({ serviceName: 'test' });

  describe('guard', () => {
    it('deve retornar ok com dados', async () => {
      const result = await guard.guard(async () => 42);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data).toBe(42);
    });

    it('deve retornar erro quando funcao falha', async () => {
      const result = await guard.guard(async () => { throw new Error('fail'); });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('fail');
    });

    it('deve tratar erros nao-Error', async () => {
      const result = await guard.guard(async () => { throw 'string error'; });
      expect(result.ok).toBe(false);
    });
  });

  describe('guardWithRetry', () => {
    it('deve funcionar na primeira tentativa', async () => {
      const result = await guard.guardWithRetry(async () => 'ok');
      expect(result.ok).toBe(true);
    });

    it('deve retry e retornar erro apos falhas', async () => {
      let attempts = 0;
      const result = await guard.guardWithRetry(async () => {
        attempts++;
        throw new Error('fail');
      }, 2, 10);
      expect(result.ok).toBe(false);
      expect(attempts).toBe(3);
    });

    it('deve ter codigo OFFLINE quando offline', async () => {
      const orig = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      const result = await guard.guardWithRetry(async () => 'ok');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.code).toBe('OFFLINE');
      Object.defineProperty(navigator, 'onLine', { value: orig, configurable: true });
    });
  });

  describe('guardSupabase', () => {
    it('deve retornar dados com sucesso', async () => {
      const result = await guard.guardSupabase(async () => ({
        data: { name: 'teste' },
        error: null,
      }));
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data).toEqual({ name: 'teste' });
    });

    it('deve retornar erro do Supabase', async () => {
      const result = await guard.guardSupabase(async () => ({
        data: null,
        error: { message: 'not found' },
      }));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('not found');
    });

    it('deve retornar NOT_FOUND quando data null', async () => {
      const result = await guard.guardSupabase(async () => ({
        data: null,
        error: null,
      }));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.code).toBe('NOT_FOUND');
    });

    it('deve tratar exceptions', async () => {
      const result = await guard.guardSupabase(async () => {
        throw new Error('crash');
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('crash');
    });
  });
});
