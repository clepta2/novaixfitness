// src/components/ui/GradientButton.tsx
// Botao com gradiente animado - NOVAIX FITNESS

import React, { useRef, useEffect, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  icon?: any;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline';
}

export default function GradientButton({
  title,
  onPress,
  gradient = [COLORS.primary, COLORS.primaryDark],
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'filled',
}: GradientButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'filled') {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [variant]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, friction: 5, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  const sizeStyles = {
    sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg, minHeight: 38 },
    md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, minHeight: 48 },
    lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl, minHeight: 56 },
  }[size];

  const textStyles = {
    sm: { fontSize: 12 },
    md: { fontSize: 14 },
    lg: { fontSize: 16 },
  }[size];

  if (variant === 'outline') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.8}
          style={[
            styles.outlineButton,
            sizeStyles,
            disabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <Ionicons name={icon as any} size={18} color={COLORS.primary} style={styles.iconLeft} />
              )}
              <Text style={[styles.outlineText, textStyles]}>{title}</Text>
              {icon && iconPosition === 'right' && (
                <Ionicons name={icon as any} size={18} color={COLORS.primary} style={styles.iconRight} />
              )}
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], ...SHADOWS.md }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={(disabled ? [COLORS.surfaceOverlay, COLORS.surfaceOverlay] : gradient) as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientButton, sizeStyles, disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <Ionicons name={icon as any} size={18} color={COLORS.background} style={styles.iconLeft} />
              )}
              <Text style={[styles.gradientText, textStyles, disabled && styles.disabledText]}>{title}</Text>
              {icon && iconPosition === 'right' && (
                <Ionicons name={icon as any} size={18} color={COLORS.background} style={styles.iconRight} />
              )}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  gradientText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  outlineText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  iconLeft: { marginRight: SPACING.sm },
  iconRight: { marginLeft: SPACING.sm },
  disabled: { opacity: 0.5 },
  disabledText: { color: COLORS.textMuted },
});
