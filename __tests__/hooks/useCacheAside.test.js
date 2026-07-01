// __tests__/hooks/useCacheAside.test.js
// Testes do hook useCacheAside

import { renderHook, act } from '@testing-library/react-hooks';
import { useCacheAside, useStaticCache } from '../../src/hooks/useCacheAside';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('useCacheAside', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useCacheAside());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar dados do fetcher quando não há cache', async () => {
    const { result } = renderHook(() => useCacheAside());
    const mockData = { name: 'Teste' };
    const fetcher = jest.fn().mockResolvedValue(mockData);

    await act(async () => {
      const data = await result.current.get('test-key', fetcher);
      expect(data).toEqual(mockData);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
  });

  it('deve retornar dados do cache em chamadas subsequentes', async () => {
    const { result } = renderHook(() => useCacheAside());
    const mockData = { name: 'Teste' };
    const fetcher = jest.fn().mockResolvedValue(mockData);

    // Primeira chamada
    await act(async () => {
      await result.current.get('test-key', fetcher);
    });

    // Segunda chamada
    await act(async () => {
      const data = await result.current.get('test-key', fetcher);
      expect(data).toEqual(mockData);
    });

    // fetcher deve ser chamado apenas uma vez
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('deve invalidar cache específico', async () => {
    const { result } = renderHook(() => useCacheAside());
    const mockData = { name: 'Teste' };
    const fetcher = jest.fn().mockResolvedValue(mockData);

    // Popular cache
    await act(async () => {
      await result.current.get('test-key', fetcher);
    });

    // Invalidar
    act(() => {
      result.current.invalidate('test-key');
    });

    // Próxima chamada deve buscar novamente
    await act(async () => {
      await result.current.get('test-key', fetcher);
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('deve limpar todo o cache', async () => {
    const { result } = renderHook(() => useCacheAside());
    const mockData = { name: 'Teste' };
    const fetcher = jest.fn().mockResolvedValue(mockData);

    // Popular cache
    await act(async () => {
      await result.current.get('test-key', fetcher);
    });

    // Limpar tudo
    act(() => {
      result.current.clear();
    });

    expect(result.current.data).toBeNull();
  });

  it('deve tratar erros do fetcher', async () => {
    const { result } = renderHook(() => useCacheAside());
    const fetcher = jest.fn().mockRejectedValue(new Error('Erro de rede'));

    await act(async () => {
      try {
        await result.current.get('test-key', fetcher);
      } catch (e) {
        expect(e.message).toBe('Erro de rede');
      }
    });

    expect(result.current.error).toBe('Erro de rede');
  });
});

describe('useStaticCache', () => {
  it('deve buscar dados com TTL maior', async () => {
    const { result } = renderHook(() =>
      useStaticCache('static-key', async () => ({ data: 'static' }))
    );

    expect(result.current.data).toBeNull();

    await act(async () => {
      await result.current.load();
    });

    expect(result.current.data).toEqual({ data: 'static' });
  });
});