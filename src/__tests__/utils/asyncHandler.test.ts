// src/__tests__/utils/asyncHandler.test.ts
// Testes para asyncHandler

import { safeAsync, retryAsync, assertDefined, formatError, protectedCallback, debounce } from '../../utils/asyncHandler';

describe('asyncHandler', () => {
  describe('safeAsync', () => {
    it('deve retornar success com dados', async () => {
      const result = await safeAsync(async () => 42);
      expect(result).toEqual({ success: true, data: 42 });
    });

    it('deve retornar error em caso de falha', async () => {
      const result = await safeAsync(async () => { throw new Error('Erro teste'); });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Erro teste');
    });

    it('deve lidar com erros nao-Error', async () => {
      const result = await safeAsync(async () => { throw 'string error'; });
      expect(result.success).toBe(false);
    });
  });

  describe('retryAsync', () => {
    it('deve funcionar na primeira tentativa', async () => {
      const result = await retryAsync(async () => 42);
      expect(result).toEqual({ success: true, data: 42 });
    });

    it('deve retry em caso de falha', async () => {
      let attempts = 0;
      const result = await retryAsync(async () => {
        attempts++;
        if (attempts < 3) throw new Error('Falha');
        return 'sucesso';
      }, 3, 10);
      expect(result).toEqual({ success: true, data: 'sucesso' });
    });
  });

  describe('assertDefined', () => {
    it('nao deve lancar erro para valor definido', () => {
      expect(() => assertDefined(42, 'teste')).not.toThrow();
    });

    it('deve lancar erro para null', () => {
      expect(() => assertDefined(null, 'campo')).toThrow('campo e obrigatorio');
    });

    it('deve lancar erro para undefined', () => {
      expect(() => assertDefined(undefined, 'campo')).toThrow('campo e obrigatorio');
    });
  });

  describe('formatError', () => {
    it('deve formatar Error', () => {
      expect(formatError(new Error('msg'))).toBe('msg');
    });

    it('deve formatar string', () => {
      expect(formatError('erro')).toBe('erro');
    });

    it('deve formatar tipo desconhecido', () => {
      expect(formatError(42)).toBe('Ocorreu um erro inesperado');
    });
  });

  describe('protectedCallback', () => {
    it('deve retornar resultado quando nao ha erro', () => {
      expect(protectedCallback(() => 42, 0)).toBe(42);
    });

    it('deve retornar fallback quando ha erro', () => {
      expect(protectedCallback(() => { throw new Error(); }, 0)).toBe(0);
    });
  });
});
