// src/components/ui/Card.js
// Componente de Card premium - NOVAIX FITNESS

import React, { useRef, useEffect, ReactNode, ComponentProps } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const VARIANTS = {
  default: { bg: COLORS.surface, border: COLORS.border },
  surface: { bg: COLORS.surface, border: COLORS.border },
  primary: { bg: COLORS.primary, border: COLORS.primary },
  active: { bg: COLORS.primary + '15', border: COLORS.primary },
  success: { bg: COLORS.success + '10', border: COLORS.success },
  error: { bg: COLORS.error + '10', border: COLORS.error },
};

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: keyof typeof VARIANTS;
  icon?: ComponentProps<typeof Ionicons>['name'];
  title?: string;
  subtitle?: string;
  badge?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export function Card({ children, onPress, variant = 'default', icon, title, subtitle, badge, style, animated = false }: CardProps) {
  const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, []);

  const handlePressIn = () => {
    if (onPress) Animated.spring(scaleAnim, { toValue: 0.97, tension: 50, friction: 3, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (onPress) Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }).start();
  };

  const variantConfig = VARIANTS[variant] || VARIANTS.default;
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
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
            {icon && <Ionicons name={icon} size={18} color={COLORS.primary} />}
            {title && <Text style={styles.title}>{title}</Text>}
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
}

const styles = StyleSheet.create({
  base: { borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  badge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  badgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary },
});
