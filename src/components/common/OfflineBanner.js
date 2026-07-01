// src/components/common/OfflineBanner.js
// Banner de aviso offline - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { getPendingActions } from '../../services/offline';
import { forceSyncNow } from '../../services/autoSync';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function OfflineBanner({ visible: forceVisible, pendingCount: propPendingCount, onSync: onSyncProp }) {
  const { isOffline } = useNetworkStatus();
  const [internalPendingCount, setInternalPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const pendingCount = propPendingCount !== undefined ? propPendingCount : internalPendingCount;
  const shouldShow = forceVisible !== undefined ? forceVisible : isOffline;

  useEffect(() => {
    if (propPendingCount === undefined) {
      loadPending();
    }
  }, [isOffline, propPendingCount]);

  const loadPending = async () => {
    const actions = await getPendingActions();
    setInternalPendingCount(actions.length);
  };

  const handleSync = async () => {
    if (onSyncProp) {
      onSyncProp();
      return;
    }
    setSyncing(true);
    try {
      await forceSyncNow();
      await loadPending();
    } finally {
      setSyncing(false);
    }
  };

  if (!shouldShow) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <View style={styles.content}>
        <Ionicons name="cloud-offline" size={18} color={COLORS.attention} />
        <Text style={styles.text}>Modo offline</Text>
        {pendingCount > 0 && (
          <Text style={styles.pending}>{pendingCount} pendente(s)</Text>
        )}
      </View>
      {pendingCount > 0 && (
        <TouchableOpacity style={styles.syncBtn} onPress={handleSync} disabled={syncing} accessibilityLabel="Sincronizar pendências" accessibilityRole="button">
          <Ionicons name={syncing ? 'sync' : 'refresh'} size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.attention + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.attention + '40',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  text: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.attention,
  },
  pending: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  syncBtn: {
    padding: SPACING.xs,
  },
});
