// src/components/ui/Button.js
// Componente de Botão NOVAIX FITNESS — responsividade e visual premium

import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { scale } from '../../utils/responsive';

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style }) {
  const variants = {
    primary: { container: styles.primary, text: styles.primaryText },
    secondary: { container: styles.secondary, text: styles.secondaryText },
    ghost: { container: styles.ghost, text: styles.ghostText },
    google: { container: styles.google, text: styles.googleText },
    apple: { container: styles.apple, text: styles.appleText },
  };

  const current = variants[variant] || variants.primary;

  return (
    <TouchableOpacity
      style={[styles.base, current.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.background : COLORS.primary} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={ICON_SIZES.sm} style={styles.icon} color={variant === 'primary' ? COLORS.background : COLORS.primary} />}
          <Text style={[styles.text, current.text]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: scale(54),
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: scale(14),
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  disabled: {
    opacity: 0.45,
  },
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  primaryText: {
    color: COLORS.background,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: COLORS.textDescription,
  },
  google: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  googleText: {
    color: '#000000',
  },
  apple: {
    backgroundColor: '#000000',
    ...SHADOWS.sm,
  },
  appleText: {
    color: '#FFFFFF',
  },
});
