// src/components/admin/ChartLine.js
// Gráfico de linhas reutilizável

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ChartLine({ data, height = 150, color = COLORS.primary }) {
  if (data.length < 2) return null;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.lineArea}>
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = ((item.value - minVal) / range) * (height - 40);
          return (
            <View
              key={index}
              style={[styles.point, { left: `${x}%`, bottom: y + 20, backgroundColor: color }]}
            />
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
  lineArea: { flex: 1, position: 'relative' },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
  },
});
