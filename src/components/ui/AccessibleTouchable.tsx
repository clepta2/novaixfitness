// src/components/ui/AccessibleTouchable.js
// Componente touchable com acessibilidade garantida - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SHADOWS } from '../../constants/shadows';
import { MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface AccessibleTouchableProps {
  children?: any;
  onPress?: any;
  onLongPress?: any;
  accessibilityLabel?: any;
  accessibilityHint?: any;
  accessibilityRole?: string;
  accessibilityState?: any;
  disabled?: boolean;
  style?: any;
  hitSlop?: any;
  [key: string]: any;
}

export default function AccessibleTouchable({
  children,
  onPress,
  onLongPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState = {},
  disabled = false,
  style,
  hitSlop = 8,
  ...props
}: AccessibleTouchableProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole as any}
      accessibilityState={{
        ...accessibilityState,
        disabled,
      }}
      disabled={disabled}
      activeOpacity={0.7}
      hitSlop={hitSlop}
      style={[styles.touchable, style]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

// Wrapper for elements that need minimum touch target
export function TouchTarget({ children, style, ...props }: AccessibleTouchableProps) {
  return (
    <AccessibleTouchable style={[styles.touchTarget, style]} {...props}>
      {children}
    </AccessibleTouchable>
  );
}

// IconButton with proper accessibility
export function IconButton({
  icon: Icon,
  iconName,
  iconSize = 24,
  iconColor,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  style,
  ...props
}: any) {
  return (
    <TouchTarget
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      style={style}
      {...props}
    >
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </TouchTarget>
  );
}

// Switch with proper accessibility
export function AccessibleSwitch({
  value,
  onValueChange,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  style,
}: any) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange?.(!value)}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.switch, value && styles.switchActive, style]}
    >
      <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchTarget: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceOverlay,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: COLORS.primary,
  },
  switchThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: COLORS.textTitle,
    ...SHADOWS.sm,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
});
