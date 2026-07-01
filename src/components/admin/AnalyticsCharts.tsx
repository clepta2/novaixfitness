// src/components/admin/AnalyticsCharts.js
// Graficos de analytics - re-export dos componentes individuais

export { default as BarChart } from './ChartBar';
export { default as LineChart } from './ChartLine';
export { DonutChart, ProgressRing } from './ChartDonut';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export function Sparkline({ data, width = 100, height = 30, color = COLORS.primary }) {
  if (data.length < 2) return null;

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;

  return (
    <View style={[styles.container, { width, height }]}>
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - minVal) / range) * height;
        return (
          <View
            key={index}
            style={[styles.point, { left: x, top: y, backgroundColor: color }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  point: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: -2,
    marginTop: -2,
  },
});
