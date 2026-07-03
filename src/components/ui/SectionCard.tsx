// src/components/ui/SectionCard.tsx
// Card de seção reutilizável - padrão mais usado no app (58+ ocorrências)

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface SectionCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  padding?: number;
  marginBottom?: number;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function SectionCard({
  children,
  variant = 'default',
  padding = SPACING.lg,
  marginBottom = 0,
  style,
  onPress,
  accessibilityLabel,
}: SectionCardProps) {
  const variantStyles = {
    default: {
      backgroundColor: COLORS.surface,
      borderColor: COLORS.border,
    },
    primary: {
      backgroundColor: COLORS.primary + '10',
      borderColor: COLORS.primary + '30',
    },
    success: {
      backgroundColor: COLORS.success + '10',
      borderColor: COLORS.success + '30',
    },
    warning: {
      backgroundColor: COLORS.attention + '10',
      borderColor: COLORS.attention + '30',
    },
    error: {
      backgroundColor: COLORS.error + '10',
      borderColor: COLORS.error + '30',
    },
  };

  const cardStyle = [
    styles.card,
    variantStyles[variant],
    { padding, marginBottom },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
});
