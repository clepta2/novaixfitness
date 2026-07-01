// @ts-nocheck
// src/components/ui/Card.tsx
// Componente de Card premium com hover effects - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

const VARIANTS = {
  default: { bg: COLORS.surface, border: COLORS.border },
  surface: { bg: COLORS.surface, border: COLORS.border },
  primary: { bg: COLORS.primary, border: COLORS.primary },
  active: { bg: COLORS.primary + '15', border: COLORS.primary },
  success: { bg: COLORS.success + '10', border: COLORS.success },
  error: { bg: COLORS.error + '10', border: COLORS.error },
  glass: { bg: COLORS.surface + 'CC', border: COLORS.borderLight },
};

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: keyof typeof VARIANTS;
  icon?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  style?: any;
  animated?: boolean;
  elevation?: boolean;
}

export const Card = memo(function Card({
  children,
  onPress,
  variant = 'default',
  icon,
  title,
  subtitle,
  badge,
  style,
  animated = false,
  elevation = true,
}: CardProps) {
  const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, []);

  const handlePressIn = () => {
    if (onPress) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 0.98, tension: 50, friction: 3, useNativeDriver: true }),
        elevation && Animated.timing(shadowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }),
        elevation && Animated.timing(shadowAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
      ]).start();
    }
  };

  const variantConfig = VARIANTS[variant] || VARIANTS.default;
  const Container = onPress ? TouchableOpacity : View;

  const shadowStyle = elevation ? {
    shadowColor: '#000',
    shadowOffset: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [{ width: 0, height: 2 }, { width: 0, height: 6 }] }),
    shadowOpacity: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.2] }),
    shadowRadius: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 12] }),
    elevation: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 8] }),
  } : {};

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }, shadowStyle as any]}>
      <Container
        style={[styles.base, { backgroundColor: variantConfig.bg, borderColor: variantConfig.border }, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityLabel={title || undefined}
        accessibilityRole={onPress ? 'button' : 'none'}
      >
        {(title || icon) && (
          <View style={styles.header}>
            {icon && <Ionicons name={icon as any} size={18} color={COLORS.primary} />}
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
        )}
        {children}
      </Container>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    flex: 1,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  badge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: COLORS.primary,
  },
});

export default Card;
