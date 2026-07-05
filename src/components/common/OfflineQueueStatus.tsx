// src/components/common/OfflineQueueStatus.tsx
// Indicador de ações pendentes na fila offline

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext'
import { getPendingActions } from '../../services/offline';
import { tryIf } from '../../utils/tryIf';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function OfflineQueueStatus() {
  const colors = useColors();
  const styles = useMemo(() => StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.full, alignSelf: 'center' },
    offline: { backgroundColor: COLORS.warning + '15' },
    text: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
    textOffline: { color: COLORS.warning },
  }), [colors]);

  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadPending();
    const interval = setInterval(loadPending, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const loadPending = async () => {
    const result = await tryIf(async () => {
      const actions = await getPendingActions();
      return actions.length;
    }, { retries: 1, baseDelay: 500 });
    setPendingCount(result.ok ? (result.data ?? 0) : 0);
  };

  if (pendingCount === 0) return null;

  return (
    <View style={[styles.container, !isOnline && styles.offline]}>
      <Ionicons name="cloud-upload-outline" size={14} color={isOnline ? colors.primary : colors.warning} />
      <Text style={[styles.text, !isOnline && styles.textOffline]}>
        {isOnline ? `Sincronizando ${pendingCount}...` : `${pendingCount} ação(ões) pendente(s)`}
      </Text>
    </View>
  );
}
