// src/components/ui/Modal.tsx
// Modal reutilizavel com animacao e glassmorphism - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showClose?: boolean;
  showHandle?: boolean;
  animationType?: 'slide' | 'fade';
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  showHandle = true,
  animationType = 'slide',
}: ModalProps) {
  const opacity = useRef(Animated.Value(0)).current;
  const translateY = useRef(Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 8, tension: 65, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const sizeMap = { sm: '40%', md: '70%', lg: '85%', full: '95%' };
  const maxHeight = sizeMap[size];

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.content, { transform: [{ translateY }], maxHeight: maxHeight as any }]}>
        {showHandle && <View style={styles.handle} />}
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {showClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.body}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
}

// Modal para confirmacao
interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  visible, onClose, onConfirm, title, message,
  confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'primary',
}: ConfirmModalProps) {
  const opacity = useRef(Animated.Value(0)).current;
  const scale = useRef(Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.confirmCard, { transform: [{ scale }] }]}>
        <Text style={styles.confirmTitle}>{title}</Text>
        <Text style={styles.confirmMessage}>{message}</Text>
        <View style={styles.confirmActions}>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { onConfirm(); onClose(); }}
            style={[styles.confirmBtn, variant === 'danger' && styles.dangerBtn]}
          >
            <Text style={[styles.confirmBtnText, variant === 'danger' && styles.dangerBtnText]}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 1000 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: COLORS.overlayDark },
  content: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl, paddingBottom: 40, ...SHADOWS.lg,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, flex: 1 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  body: { paddingHorizontal: SPACING.xl },
  confirmCard: {
    position: 'absolute', top: '50%', left: '10%', right: '10%', marginTop: -120,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, ...SHADOWS.lg,
  },
  confirmTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.sm },
  confirmMessage: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  confirmActions: { flexDirection: 'row', gap: SPACING.md },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surfaceElevated, alignItems: 'center' },
  cancelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textDescription },
  confirmBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
  confirmBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  dangerBtn: { backgroundColor: COLORS.error },
  dangerBtnText: { color: COLORS.background },
});
