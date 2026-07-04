// src/components/ui/Alert.tsx
// Banner de alerta reutilizavel - NOVAIX FITNESS

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onPress?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
  autoHide?: boolean;
  duration?: number;
}

const ALERT_CONFIG: Record<AlertType, { icon: string; color: string; bg: string }> = {
  success: { icon: 'checkmark-circle', color: COLORS.success, bg: COLORS.successBg },
  error: { icon: 'alert-circle', color: COLORS.error, bg: COLORS.errorBg },
  warning: { icon: 'warning', color: COLORS.attention, bg: COLORS.attentionBg },
  info: { icon: 'information-circle', color: COLORS.info, bg: COLORS.infoBg },
};

export default function Alert({
  type = 'info',
  title,
  message,
  onPress,
  onDismiss,
  visible = true,
  autoHide = false,
  duration = 5000,
}: AlertProps) {
  const opacity = useRef(Animated.Value(0)).current;
  const slideY = useRef(Animated.Value(-20)).current;
  const config = ALERT_CONFIG[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideY, { toValue: 0, friction: 7, useNativeDriver: true }),
      ]).start();

      if (autoHide) {
        const timer = setTimeout(() => onDismiss?.(), duration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY: slideY }], backgroundColor: config.bg }]}>
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Ionicons name={config.icon as any} size={18} color={config.color} />
        </View>
        <View style={styles.textContainer}>
          {title && <Text style={[styles.title, { color: config.color }]}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
            <Ionicons name="close" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: BORDER_RADIUS.md, marginHorizontal: SPACING.lg, marginBottom: SPACING.md, overflow: 'hidden' },
  content: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  iconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1 },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, marginBottom: 2 },
  message: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 },
  dismissBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
});
