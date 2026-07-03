// src/components/ui/Divider.tsx
// Divisor reutilizavel - NOVAIX FITNESS

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface DividerProps {
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number;
  marginVertical?: number;
  style?: ViewStyle;
}

export default function Divider({ variant = 'solid', color, thickness = 1, marginVertical = SPACING.md, style }: DividerProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.divider,
        {
          borderBottomWidth: thickness,
          borderBottomColor: color || colors.border,
          marginVertical,
          borderStyle: variant,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
