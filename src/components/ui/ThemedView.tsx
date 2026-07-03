// src/components/ui/ThemedView.tsx
// View que usa cores reativas do tema

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColors } from '../../context/ThemeContext';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'elevated' | 'card';
}

export function ThemedView({ variant = 'default', style, children, ...props }: ThemedViewProps) {
  const colors = useColors();

  const variantStyles = {
    default: { backgroundColor: colors.background },
    surface: { backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: colors.border },
    elevated: { backgroundColor: colors.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: colors.border },
    card: { backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: colors.border },
  };

  return (
    <View style={[variantStyles[variant], style]} {...props}>
      {children}
    </View>
  );
}
