import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function MuscleLegend({ values, maxVal, minVal, getTrend }) {
  return (
    <View style={styles.legend}>
      {values.map(v => {
        const trend = getTrend(v.current, v.previous);
        const isMax = v.current === maxVal && v.current > 0;
        const isMin = v.current === minVal && v.current > 0;
        return (
          <View key={v.key} style={[styles.item, isMax && styles.itemMax, isMin && styles.itemMin]}>
            <View style={[styles.dot, { backgroundColor: isMax ? COLORS.success : isMin ? COLORS.attention : COLORS.primary }]} />
            <Text style={styles.label}>{v.label}</Text>
            <Text style={[styles.value, isMax && { color: COLORS.success }, isMin && { color: COLORS.attention }]}>{v.current}%</Text>
            {trend && <Text style={[styles.trend, { color: trend.color }]}>{trend.icon}</Text>}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  itemMax: { backgroundColor: COLORS.success + '15' },
  itemMin: { backgroundColor: COLORS.attention + '15' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textDescription },
  value: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textTitle },
  trend: { fontFamily: 'Montserrat_700Bold', fontSize: 10 },
});
