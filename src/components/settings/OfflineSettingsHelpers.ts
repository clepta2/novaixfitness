import { Alert } from 'react-native';
import { clearAllCache, clearWorkoutCache } from '../../services/cache';
import { forceSyncNow } from '../../services/autoSync';
import pt from '../../i18n/pt.json';

const t = (key: string, params?: Record<string, any>) => {
  const keys = key.split('.');
  let value: any = pt;
  for (const k of keys) value = value?.[k];
  if (typeof value !== 'string') return key;
  return value.replace(/\{(\w+)\}/g, (_, param) => params?.[param] ?? `{${param}}`);
};

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function handleForceSync(isOnline, setSyncing, loadInfo) {
  if (!isOnline) {
    Alert.alert(t('offline.offlineTitle'), t('offline.offlineMessage'));
    return;
  }
  setSyncing(true);
  try {
    const result = await forceSyncNow();
    Alert.alert(t('offline.syncTitle'), t('offline.syncMessage', { synced: result.synced, failed: result.failed }));
    await loadInfo();
  } catch {
    Alert.alert(t('common.error'), t('offline.syncError'));
  } finally {
    setSyncing(false);
  }
}

export function promptClearWorkouts(loadInfo) {
  Alert.alert(t('offline.clearWorkoutsTitle'), t('offline.clearWorkoutsMessage'), [
    { text: t('offline.cancel'), style: 'cancel' },
    { text: t('offline.clear'), style: 'destructive', onPress: async () => { await clearWorkoutCache(); loadInfo(); } },
  ]);
}

export function promptClearAll(loadInfo) {
  Alert.alert(t('offline.clearAllTitle'), t('offline.clearAllMessage'), [
    { text: t('offline.cancel'), style: 'cancel' },
    { text: t('offline.clearAllButton'), style: 'destructive', onPress: async () => { await clearAllCache(); loadInfo(); } },
  ]);
}
