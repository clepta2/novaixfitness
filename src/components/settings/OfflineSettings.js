import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getCacheInfo, clearAllCache, clearWorkoutCache } from '../../services/cache';
import { getLastSync, getPendingActions } from '../../services/offline';
import { forceSyncNow } from '../../services/autoSync';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { OFFLINE } from '../../data/settingsTexts';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(timestamp) {
  if (!timestamp) return OFFLINE.never;
  const diff = Date.now() - timestamp;
  if (diff < 60000) return OFFLINE.justNow;
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} h`;
  return `${Math.floor(diff / 86400000)} dias`;
}

export default function OfflineSettings() {
  const { isOnline } = useNetworkStatus();
  const [info, setInfo] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const loadInfo = async () => {
    const [cacheData, syncTime, pending] = await Promise.all([
      getCacheInfo(),
      getLastSync(),
      getPendingActions(),
    ]);
    setInfo(cacheData);
    setLastSync(syncTime);
    setPendingCount(pending.length);
  };

  useEffect(() => { loadInfo(); }, []);

  const handleForceSync = async () => {
    if (!isOnline) {
      Alert.alert(OFFLINE.offlineTitle, OFFLINE.offlineMessage);
      return;
    }
    setSyncing(true);
    try {
      const result = await forceSyncNow();
      Alert.alert(OFFLINE.syncTitle, OFFLINE.syncMessage.replace('{synced}', result.synced).replace('{failed}', result.failed));
      await loadInfo();
    } catch {
      Alert.alert(OFFLINE.errorTitle, OFFLINE.syncError);
    } finally {
      setSyncing(false);
    }
  };

  const handleClearWorkouts = () => {
    Alert.alert(OFFLINE.clearWorkoutsTitle, OFFLINE.clearWorkoutsMessage, [
      { text: OFFLINE.cancel, style: 'cancel' },
      { text: OFFLINE.clear, style: 'destructive', onPress: async () => { await clearWorkoutCache(); loadInfo(); } },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(OFFLINE.clearAllTitle, OFFLINE.clearAllMessage, [
      { text: OFFLINE.cancel, style: 'cancel' },
      { text: OFFLINE.clearAllButton, style: 'destructive', onPress: async () => { await clearAllCache(); loadInfo(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cloud-offline-outline" size={18} color={COLORS.primary} />
        <Text style={styles.title}>{OFFLINE.title}</Text>
        <View style={[styles.statusDot, isOnline ? styles.online : styles.offline]} />
      </View>

      {info && (
        <>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{OFFLINE.cache}</Text>
              <Text style={[styles.statValue, !info.withinLimit && styles.warning]}>
                {formatSize(info.totalSize)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{OFFLINE.lastSync}</Text>
              <Text style={styles.statValue}>{formatTime(lastSync)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{OFFLINE.pending}</Text>
              <Text style={[styles.statValue, pendingCount > 0 && styles.warning]}>{pendingCount}</Text>
            </View>
          </View>

          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${Math.min((info.totalSize / (50 * 1024 * 1024)) * 100, 100)}%` }, !info.withinLimit && styles.barWarning]} />
          </View>

          {Object.entries(info.breakdown).map(([key, data]) => (
            <View key={key} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{key}</Text>
              <Text style={styles.itemValue}>{formatSize(data.size)}</Text>
            </View>
          ))}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSync, (!isOnline || syncing) && styles.btnDisabled]}
              onPress={handleForceSync}
              disabled={!isOnline || syncing}
            >
              <Ionicons name="sync" size={16} color={COLORS.primary} />
              <Text style={styles.btnTextSync}>{syncing ? OFFLINE.syncing : OFFLINE.sync}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleClearWorkouts}>
              <Ionicons name="fitness-outline" size={16} color={COLORS.attention} />
              <Text style={styles.btnText}>{OFFLINE.clearWorkouts}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleClearAll}>
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
              <Text style={[styles.btnText, styles.btnDangerText]}>{OFFLINE.clearAll}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  online: { backgroundColor: COLORS.success },
  offline: { backgroundColor: COLORS.error },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md, gap: SPACING.sm },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginBottom: 2 },
  statValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  warning: { color: COLORS.error },
  bar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: SPACING.md, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  barWarning: { backgroundColor: COLORS.error },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  itemValue: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md, flexWrap: 'wrap' },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.attention + '15', borderWidth: 1, borderColor: COLORS.attention + '30', minWidth: 100 },
  btnSync: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary + '30' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.attention },
  btnTextSync: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.primary },
  btnDanger: { backgroundColor: COLORS.error + '15', borderColor: COLORS.error + '30' },
  btnDangerText: { color: COLORS.error },
});
