// src/components/admin/ErrorRow.js
// Linha de erro reutilizável no dashboard de monitoramento

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const SEVERITY_COLORS = {
  low: COLORS.info,
  warning: COLORS.attention,
  error: COLORS.error,
  fatal: COLORS.error,
};

export default function ErrorRow({ error }) {
  const color = SEVERITY_COLORS[error.severity] || COLORS.textMuted;

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.badgeText, { color }]}>
          {error.severity?.toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.message} numberOfLines={1}>
          {error.message}
        </Text>
        <Text style={styles.time}>
          {new Date(error.timestamp).toLocaleTimeString('pt-BR')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  info: { flex: 1 },
  message: { color: COLORS.textTitle, fontSize: 14 },
  time: { color: COLORS.textMuted, fontSize: 12, marginTop: SPACING.xs },
});
