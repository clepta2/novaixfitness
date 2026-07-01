// src/components/admin/ChartDonut.js
// Gráfico donut reutilizável

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export function DonutChart({ data, size = 120, strokeWidth = 20 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  return (
    <View style={[styles.donutContainer, { width: size, height: size }]}>
      <View style={[styles.donutCenter, {
        width: size - strokeWidth * 2,
        height: size - strokeWidth * 2,
      }]}>
        <Text style={styles.donutTotal}>{total}</Text>
      </View>
    </View>
  );
}

export function ProgressRing({ value, max, size = 80, strokeWidth = 8, color = COLORS.primary }) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      <View style={[styles.ringBg, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: COLORS.surface,
      }]} />
      <View style={[styles.ringCenter, {
        width: size - strokeWidth * 2,
        height: size - strokeWidth * 2,
      }]}>
        <Text style={styles.ringValue}>{Math.round(pct)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  donutContainer: { justifyContent: 'center', alignItems: 'center' },
  donutCenter: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutTotal: { fontSize: 16, fontWeight: '700', color: COLORS.textTitle },
  ringContainer: { justifyContent: 'center', alignItems: 'center' },
  ringBg: { position: 'absolute' },
  ringCenter: {
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringValue: { fontSize: 14, fontWeight: '700', color: COLORS.textTitle },
});
