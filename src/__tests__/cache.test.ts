// src/__tests__/cache.test.ts
// Testes para o utilitario de cache

import { setCache, getCache, removeCache, clearAllCache } from '../utils/cache';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getAllKeys: jest.fn().mockResolvedValue([]),
  },
}));

describe('cache', () => {
  beforeEach(() => {
    clearAllCache();
  });

  it('deve armazenar e recuperar dados do cache', async () => {
    await setCache('test-key', { name: 'teste' });
    const result = await getCache('test-key');
    expect(result).toEqual({ name: 'teste' });
  });

  it('deve retornar null para chave inexistente', async () => {
    const result = await getCache('nonexistent');
    expect(result).toBeNull();
  });

  it('deve remover cache por chave', async () => {
    await setCache('test-key', { name: 'teste' });
    await removeCache('test-key');
    const result = await getCache('test-key');
    expect(result).toBeNull();
  });

  it('deve limpar todo o cache', async () => {
    await setCache('key1', { name: 'teste1' });
    await setCache('key2', { name: 'teste2' });
    await clearAllCache();
    expect(await getCache('key1')).toBeNull();
    expect(await getCache('key2')).toBeNull();
  });
});
