// src/services/autoSync.js
// Sincronização automática ao reconectar - NOVAIX FITNESS

import NetInfo from '@react-native-community/netinfo';
import { syncPendingActions, getPendingActionsCount } from './sync';
import { updateLastSync } from './offline';

let unsubscribe = null;
let lastConnected = true;
let syncTimeout = null;

const DEBOUNCE_MS = 300;

async function handleNetworkChange(state) {
  const isNowOnline = state.isConnected && state.isInternetReachable;

  if (isNowOnline && !lastConnected) {
    if (syncTimeout) clearTimeout(syncTimeout);

    syncTimeout = setTimeout(async () => {
      const pendingCount = await getPendingActionsCount();
      if (pendingCount > 0) {
        console.log(`[AutoSync] Reconectado. Sincronizando ${pendingCount} ações...`);
        try {
          const result = await syncPendingActions();
          console.log(`[AutoSync] Sincronizado: ${result.synced}, Falhou: ${result.failed}`);
          await updateLastSync();
        } catch (err) {
          console.error('[AutoSync] Erro na sincronização:', err);
        }
      }
    }, DEBOUNCE_MS);
  }

  lastConnected = isNowOnline;
}

export function startAutoSync() {
  if (unsubscribe) return;
  unsubscribe = NetInfo.addEventListener(handleNetworkChange);
  console.log('[AutoSync] Iniciado');
}

export function stopAutoSync() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
    console.log('[AutoSync] Parado');
  }
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
}

export async function forceSyncNow() {
  const pendingCount = await getPendingActionsCount();
  if (pendingCount === 0) return { synced: 0, failed: 0 };

  console.log(`[AutoSync] Forçando sync de ${pendingCount} ações...`);
  const result = await syncPendingActions();
  await updateLastSync();
  return result;
}
