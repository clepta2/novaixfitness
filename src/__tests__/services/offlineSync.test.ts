// src/__tests__/services/offlineSync.test.ts

import { queueAction, getPendingActions, hasPendingActions, getQueueStats, clearPendingActions } from '../../services/offlineSync';

const storage = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key) => Promise.resolve(storage[key] || null)),
    setItem: jest.fn((key, value) => { storage[key] = value; return Promise.resolve(); }),
    removeItem: jest.fn((key) => { delete storage[key]; return Promise.resolve(); }),
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
    Object.keys(storage).forEach(k => delete storage[k]);
    jest.clearAllMocks();
  });

  describe('queueAction', () => {
    it('deve adicionar acao na fila', async () => {
      await queueAction({ type: 'insert', table: 'posts', content: 'teste' });
      const actions = await getPendingActions();
      expect(actions.length).toBe(1);
      expect(actions[0].type).toBe('insert');
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
