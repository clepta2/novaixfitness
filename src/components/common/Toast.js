// src/components/common/Toast.js
// Sistema de notificações toast - NOVAIX FITNESS

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ToastContext = createContext(null);

const TOAST_CONFIG = {
  success: { icon: 'checkmark-circle', color: COLORS.success },
  error: { icon: 'close-circle', color: COLORS.error },
  warning: { icon: 'warning', color: COLORS.attention },
  info: { icon: 'information-circle', color: COLORS.info },
};

function ToastItem({ toast, onDismiss }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -100, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => onDismiss(toast.id));
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.indicator, { backgroundColor: config.color }]} />
      <Ionicons name={config.icon} size={20} color={config.color} />
      <Text style={styles.message} numberOfLines={2}>{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev.slice(-2), { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  }, [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <View style={styles.container}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 50, left: SPACING.lg, right: SPACING.lg, zIndex: 9999 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  indicator: { width: 3, height: '80%', borderRadius: 2, position: 'absolute', left: 0 },
  message: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, flex: 1, marginLeft: SPACING.sm },
});
