import NetInfo from '@react-native-community/netinfo';
import { syncPendingActions, getPendingActionsCount } from './sync';
import { updateLastSync } from './offline';

let unsubscribe = null;
let lastConnected = true;
let syncTimeout = null;
let onSyncStateChange = null;

const DEBOUNCE_MS = 300;

async function handleNetworkChange(state) {
  const isNowOnline = state.isConnected && state.isInternetReachable;

  if (isNowOnline && !lastConnected) {
    onSyncStateChange?.('syncing');

    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
      const pendingCount = await getPendingActionsCount();
      if (pendingCount > 0) {
        try {
          await syncPendingActions();
          await updateLastSync();
          onSyncStateChange?.('synced');
        } catch (err) {
          onSyncStateChange?.('error');
        }
      } else {
        onSyncStateChange?.('idle');
      }
    }, DEBOUNCE_MS);
  }

  lastConnected = isNowOnline;
}

export function startAutoSync(stateCallback) {
  onSyncStateChange = stateCallback || null;
  if (unsubscribe) return;
  unsubscribe = NetInfo.addEventListener(handleNetworkChange);
}

export function stopAutoSync() {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  if (syncTimeout) { clearTimeout(syncTimeout); syncTimeout = null; }
  onSyncStateChange = null;
}

export async function forceSyncNow() {
  const pendingCount = await getPendingActionsCount();
  if (pendingCount === 0) return { synced: 0, failed: 0 };

  onSyncStateChange?.('syncing');
  const result = await syncPendingActions();
  await updateLastSync();
  onSyncStateChange?.(result.failed > 0 ? 'error' : 'synced');
  return result;
}
