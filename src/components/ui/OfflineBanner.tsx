import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color={COLORS.background} />
      <Text style={styles.text}>Sem conexão</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.attention,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  text: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
});
