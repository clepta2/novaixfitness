// src/components/admin/ChartBar.js
// Gráfico de barras reutilizável

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ChartBar({ data, maxValue, labels, height = 150 }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.bars}>
        {data.map((item, index) => {
          const barHeight = (item.value / max) * (height - 40);
          return (
            <View key={index} style={styles.wrapper}>
              <View style={[styles.bar, { height: barHeight, backgroundColor: item.color || COLORS.primary }]} />
              <Text style={styles.value}>{item.value}</Text>
              {labels && <Text style={styles.label}>{labels[index]}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
  },
  wrapper: { alignItems: 'center', flex: 1 },
  bar: { width: 20, borderRadius: BORDER_RADIUS.sm },
  value: { fontSize: 10, color: COLORS.textTitle, marginTop: SPACING.xs },
  label: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
});
