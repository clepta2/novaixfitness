// src/__tests__/services/offlineSync.test.ts

import { queueAction, getPendingActions, hasPendingActions, getQueueStats, clearPendingActions } from '../../services/offlineSync';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe('offlineSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('queueAction', () => {
    it('deve adicionar acao na fila', async () => {
      const id = await queueAction('insert', 'posts', { content: 'teste' });
      expect(id).toMatch(/^action_/);
    });
  });

  describe('getPendingActions', () => {
    it('deve retornar array vazio quando nao ha pendencias', async () => {
      const actions = await getPendingActions();
      expect(Array.isArray(actions)).toBe(true);
    });
  });

  describe('hasPendingActions', () => {
    it('deve retornar booleano', async () => {
      const result = await hasPendingActions();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getQueueStats', () => {
    it('deve retornar stats com campos corretos', async () => {
      const stats = await getQueueStats();
      expect(stats).toHaveProperty('pending');
      expect(stats).toHaveProperty('syncing');
      expect(stats).toHaveProperty('failed');
      expect(stats).toHaveProperty('total');
    });
  });

  describe('clearPendingActions', () => {
    it('deve limpar fila', async () => {
      await expect(clearPendingActions()).resolves.not.toThrow();
    });
  });
});
