// src/components/ui/IconButton.tsx
// Botao circular com icone - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  size?: number;
  variant?: 'default' | 'primary' | 'danger';
}

export default function IconButton({
  icon, onPress, color, backgroundColor, size = 40, variant = 'default',
}: IconButtonProps) {
  const colors = useColors();

  const variantStyles = {
    default: { bg: colors.surface, iconColor: colors.textTitle },
    primary: { bg: colors.primary, iconColor: colors.background },
    danger: { bg: colors.error, iconColor: colors.background },
  };

  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[styles.btn, { width: size, height: size, borderRadius: size / 2, backgroundColor: backgroundColor || v.bg }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Ionicons name={icon as any} size={size * 0.5} color={color || v.iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
