// src/components/common/SearchBar.js
// Barra de busca padronizada - NOVAIX FITNESS

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...', onSubmit, loading = false }) {
  const [focused, setFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: focused ? 1.01 : 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }, focused && styles.containerFocused]}>
      <Ionicons name="search" size={18} color={focused ? COLORS.primary : COLORS.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        accessibilityLabel="Buscar"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn} accessibilityLabel="Limpar busca" accessibilityRole="button">
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
      {loading && (
        <ActivityIndicator size="small" color={COLORS.primary} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, height: 48 },
  containerFocused: { borderColor: COLORS.primary },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  clearBtn: { padding: SPACING.xs },
});
