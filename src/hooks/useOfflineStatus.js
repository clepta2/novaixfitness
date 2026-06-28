import { useState, useEffect } from 'react';
import useNetworkStatus from './useNetworkStatus';

export default function useOfflineStatus() {
  const { isOnline, isOffline, wasOffline } = useNetworkStatus();
  const [syncing, setSyncing] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setJustReconnected(true);
      setSyncing(true);
      const t = setTimeout(() => { setSyncing(false); setJustReconnected(false); }, 3000);
      return () => clearTimeout(t);
    }
  }, [isOnline, wasOffline]);

  return { isOnline, isOffline, wasOffline, syncing, justReconnected };
}
