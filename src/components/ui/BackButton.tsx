// src/components/ui/BackButton.tsx
// Botao voltar reutilizavel - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  size?: number;
  style?: object;
}

export default function BackButton({ onPress, color, size = 24, style }: BackButtonProps) {
  const colors = useColors();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress || (() => router.back())}
      style={[styles.btn, style]}
      accessibilityLabel="Voltar"
      accessibilityRole="button"
    >
      <Ionicons name="arrow-back" size={size} color={color || colors.textTitle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40, height: 40, borderRadius: BORDER_RADIUS.full, backgroundColor: '#1A2030', justifyContent: 'center', alignItems: 'center',
  },
});
