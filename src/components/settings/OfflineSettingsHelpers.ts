import { Alert } from 'react-native';
import { clearAllCache, clearWorkoutCache } from '../../services/cache';
import { forceSyncNow } from '../../services/autoSync';

const t = (key: string, params?: Record<string, any>) => {
  const translations: Record<string, string> = {
    'offline.offlineTitle': 'Sem conexao',
    'offline.offlineMessage': 'Voce esta offline. Conecte-se para sincronizar.',
    'offline.syncTitle': 'Sincronizar',
    'offline.syncMessage': 'Sincronizado: {synced}, Falhou: {failed}',
    'common.error': 'Erro',
    'offline.syncError': 'Erro ao sincronizar',
    'offline.clearWorkoutsTitle': 'Limpar treinos',
    'offline.clearWorkoutsMessage': 'Remove todos os treinos salvos offline',
    'offline.cancel': 'Cancelar',
    'offline.clear': 'Limpar',
    'offline.clearAllTitle': 'Limpar tudo',
    'offline.clearAllMessage': 'Remove todos os dados offline',
    'offline.clearAllButton': 'Limpar tudo',
  };
  const value = translations[key] || key;
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
