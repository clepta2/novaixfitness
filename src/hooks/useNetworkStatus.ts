// src/hooks/useNetworkStatus.ts
// Hook para detectar status de rede - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [lastConnected, setLastConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? false;

      if (connected && !lastConnected) {
        setLastConnected(true);
      } else if (!connected) {
        setLastConnected(false);
      }

      setIsConnected(connected);
      setIsInternetReachable(reachable);
    });

    return () => unsubscribe();
  }, [lastConnected]);

  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  }, []);

  return {
    isConnected,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable,
    isOffline: !isConnected || !isInternetReachable,
    wasOffline: !lastConnected,
    checkConnection,
  };
}

export default useNetworkStatus;
