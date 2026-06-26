// src/components/ui/Card.js
// Componente de Card NOVAIX FITNESS

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

export function Card({ children, onPress, variant = 'default', style }) {
  const variants = {
    default: styles.default,
    surface: styles.surface,
    primary: styles.primary,
    active: styles.active,
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.base, variants[variant], style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  default: {
    backgroundColor: COLORS.surface,
  },
  surface: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  active: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
