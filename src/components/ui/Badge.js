// src/components/ui/Badge.js
// Componente de Badge NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/spacing';

const variants = {
  default: { bg: COLORS.surface, text: COLORS.textTitle },
  primary: { bg: COLORS.primary, text: COLORS.background },
  success: { bg: COLORS.success, text: COLORS.background },
  error: { bg: COLORS.error, text: COLORS.textTitle },
  attention: { bg: COLORS.attention, text: COLORS.background },
};

const sizes = {
  sm: { paddingH: 8, paddingV: 4, fontSize: 10 },
  md: { paddingH: 12, paddingV: 6, fontSize: 12 },
};

function Badge({ value, variant = 'default', size = 'sm', style }) {
  if (!value && value !== 0) return null;

  const current = variants[variant];
  const currentSize = sizes[size];

  return (
    <View
      style={[styles.badge, { backgroundColor: current.bg, paddingHorizontal: currentSize.paddingH, paddingVertical: currentSize.paddingV }, style]}
      accessibilityLabel={`${value}`}
      accessibilityRole="text"
    >
      <Text style={[styles.text, { color: current.text, fontSize: currentSize.fontSize }]}>{value}</Text>
    </View>
  );
}

export default memo(Badge);

const styles = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
  },
});
