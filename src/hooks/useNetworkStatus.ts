// src/hooks/useNetworkStatus.ts
// Hook para detectar status de rede - NOVAIX FITNESS

import { useState, useEffect, useCallback, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const lastConnectedRef = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? false;

      if (connected && !lastConnectedRef.current) {
        setWasOffline(true);
      } else if (!connected) {
        setWasOffline(false);
      }

      lastConnectedRef.current = connected;
      setIsConnected(connected);
      setIsInternetReachable(reachable);
    });

    return () => unsubscribe();
  }, []);

  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  }, []);

  return {
    isConnected,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable,
    isOffline: !isConnected || !isInternetReachable,
    wasOffline,
    checkConnection,
  };
}

export default useNetworkStatus;
