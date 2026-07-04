import { renderHook } from '@testing-library/react-hooks';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import NetInfo from '@react-native-community/netinfo';

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn().mockResolvedValue({ isConnected: true, isInternetReachable: true }),
}));

describe('useNetworkStatus Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    NetInfo.addEventListener.mockReturnValue(jest.fn());
  });

  it('deve retornar funções e estado', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current).toHaveProperty('isConnected');
    expect(result.current).toHaveProperty('isInternetReachable');
    expect(result.current).toHaveProperty('isOnline');
    expect(result.current).toHaveProperty('isOffline');
    expect(result.current).toHaveProperty('wasOffline');
    expect(result.current).toHaveProperty('checkConnection');
  });

  it('deve retornar online por padrão', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isConnected).toBe(true);
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('deve ter checkConnection function', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(typeof result.current.checkConnection).toBe('function');
  });

  it('deve chamar NetInfo.addEventListener', () => {
    renderHook(() => useNetworkStatus());
    expect(NetInfo.addEventListener).toHaveBeenCalled();
  });

  it('deve registrar listener de limpeza', () => {
    const unsubscribe = jest.fn();
    NetInfo.addEventListener.mockReturnValue(unsubscribe);
    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
