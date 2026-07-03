// src/components/ui/InlineBadge.tsx
// Badge inline reutilizavel - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface InlineBadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md';
}

export default function InlineBadge({ label, color, backgroundColor, size = 'sm' }: InlineBadgeProps) {
  const colors = useColors();
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: backgroundColor || colors.primary + '15' }, isSmall && styles.sm]}>
      <Text style={[styles.text, { color: color || colors.primary }, isSmall && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.full, alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: SPACING.xs, paddingVertical: 2,
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 11, letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  },
});
