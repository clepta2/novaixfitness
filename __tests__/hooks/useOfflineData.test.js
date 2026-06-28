import { renderHook } from '@testing-library/react-hooks';
import useOfflineData from '../../src/hooks/useOfflineData';
import useNetworkStatus from '../../src/hooks/useNetworkStatus';

jest.mock('../../src/hooks/useNetworkStatus');

describe('useOfflineData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNetworkStatus.mockReturnValue({ isOnline: true, isOffline: false });
  });

  it('deve retornar funções e estado', () => {
    const fetchFn = jest.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useOfflineData(fetchFn, 'key'));
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('isFromCache');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refresh');
    expect(result.current).toHaveProperty('isOffline');
  });

  it('deve ter refresh function', () => {
    const fetchFn = jest.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useOfflineData(fetchFn, 'key'));
    expect(typeof result.current.refresh).toBe('function');
  });

  it('deve aceitar opções', () => {
    const fetchFn = jest.fn().mockResolvedValue([]);
    const cacheFn = jest.fn();
    const { result } = renderHook(() => useOfflineData(fetchFn, 'key', { cacheFn, fallbackToCache: false }));
    expect(result.current).toHaveProperty('data');
  });
});
