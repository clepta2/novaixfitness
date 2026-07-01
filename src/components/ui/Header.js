// src/components/ui/Header.js
// Componente de Header premium - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export function Header({ title, subtitle, showBack, rightIcon, onRightPress, rightIcon2, onRightPress2 }) {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Voltar" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
      ) : <View style={styles.iconBtn} />}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.rightActions}>
        {rightIcon2 && (
          <TouchableOpacity onPress={onRightPress2} style={styles.iconBtn} accessibilityLabel="Mais opções" accessibilityRole="button">
            <Ionicons name={rightIcon2} size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} accessibilityLabel="Ação principal" accessibilityRole="button">
            <Ionicons name={rightIcon} size={22} color={COLORS.primary} />
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  rightActions: { flexDirection: 'row', gap: SPACING.xs },
});
