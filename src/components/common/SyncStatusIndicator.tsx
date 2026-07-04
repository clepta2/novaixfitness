// src/components/common/SyncStatusIndicator.tsx
// Indicador de status de sincronização offline/online
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { useColors } from '../../context/ThemeContext';

interface Props {
  pendingCount?: number;
}

export default function SyncStatusIndicator({ pendingCount = 0 }: Props) {
  const { isOnline } = useNetworkStatus();
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 200, useNativeDriver: true
    }).start();
  }, [isOnline, fadeAnim]);

  const isSyncing = !isOnline && pendingCount > 0;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }, !isOnline && styles.offline]}>
      <Ionicons
        name={isOnline ? 'cloud-done' : isSyncing ? 'cloud-upload' : 'cloud-offline'}
        size={14}
        color={isOnline ? colors.success : colors.warning}
      />
      <Text style={[styles.text, !isOnline && styles.textOffline]}>
        {isOnline ? 'Sincronizado' : isSyncing ? `${pendingCount} pendente(s)` : 'Offline'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.success + '15',
  },
  offline: { backgroundColor: COLORS.warning + '15' },
  text: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.success },
  textOffline: { color: COLORS.warning },
});
