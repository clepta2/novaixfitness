// src/components/admin/MetricRow.js
// Linha de métrica reutilizável no dashboard de monitoramento

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function MetricRow({ label, value, isWarning = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, isWarning && styles.warning]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: { color: COLORS.textDescription },
  value: { color: COLORS.textTitle, fontWeight: '600' },
  warning: { color: COLORS.attention },
});
