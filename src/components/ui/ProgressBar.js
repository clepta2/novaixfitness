// src/components/ui/ProgressBar.js
// Componente de Barra de Progresso NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const variants = {
  default: COLORS.primary,
  success: COLORS.success,
  attention: COLORS.attention,
};

function ProgressBar({ value, max = 100, label, showValue, variant = 'default', style }) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = variants[variant] || variants.default;

  return (
    <View style={[styles.container, style]}>
      {(label || showValue) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && <Text style={styles.value}>{Math.round(percentage)}%</Text>}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default memo(ProgressBar);

const styles = StyleSheet.create({
  container: { width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textTransform: 'uppercase' },
  value: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  track: { height: 8, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: BORDER_RADIUS.sm },
});
