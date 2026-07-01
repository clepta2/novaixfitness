// src/components/ui/Button.tsx
// Componente de Botão NOVAIX FITNESS — responsividade e visual premium

import { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { scale } from '../../utils/responsive';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'back' | 'danger' | 'google' | 'apple';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  iconPosition?: IconPosition;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const SIZES = {
  sm: { height: scale(40), fontSize: scale(12), iconSize: 14 },
  md: { height: scale(50), fontSize: scale(13), iconSize: ICON_SIZES.sm },
  lg: { height: scale(58), fontSize: scale(15), iconSize: ICON_SIZES.md },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  size = 'md',
  loading,
  disabled,
  style,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const s = SIZES[size] || SIZES.md;

  const variants: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; iconColor: string }> = {
    primary: { container: styles.primary, text: styles.primaryText, iconColor: COLORS.background },
    secondary: { container: styles.secondary, text: styles.secondaryText, iconColor: COLORS.primary },
    ghost: { container: styles.ghost, text: styles.ghostText, iconColor: COLORS.textDescription },
    back: { container: styles.back, text: styles.backText, iconColor: COLORS.textTitle },
    danger: { container: styles.danger, text: styles.dangerText, iconColor: COLORS.textTitle },
    google: { container: styles.google, text: styles.googleText, iconColor: COLORS.textTitle },
    apple: { container: styles.apple, text: styles.appleText, iconColor: COLORS.textTitle },
  };

  const current = variants[variant] || variants.primary;

  const iconEl = icon ? (
    <Ionicons name={icon} size={s.iconSize} color={current.iconColor} style={iconPosition === 'right' ? { marginLeft: SPACING.xs } : { marginRight: SPACING.xs }} />
  ) : null;

  return (
    <TouchableOpacity
      style={[
        styles.base, { height: s.height },
        current.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? COLORS.background : COLORS.primary} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && iconEl}
          <Text style={[styles.text, current.text, { fontSize: s.fontSize }]}>{title}</Text>
          {icon && iconPosition === 'right' && iconEl}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.4 },
  primary: { backgroundColor: COLORS.primary, ...SHADOWS.md },
  primaryText: { color: COLORS.background },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.border },
  secondaryText: { color: COLORS.textTitle },
  ghost: { backgroundColor: 'transparent' },
  ghostText: { color: COLORS.textDescription },
  back: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  backText: { color: COLORS.textTitle },
  danger: { backgroundColor: COLORS.error, ...SHADOWS.md },
  dangerText: { color: COLORS.textTitle },
  google: { backgroundColor: COLORS.textTitle, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.sm },
  googleText: { color: COLORS.textTitle },
  apple: { backgroundColor: COLORS.textTitle, ...SHADOWS.sm },
  appleText: { color: COLORS.textTitle },
});
