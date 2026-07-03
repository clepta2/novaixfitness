// src/components/ui/ScreenLoader.tsx
// Loading state padronizado para todas as telas

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface ScreenLoaderProps {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
}

export default function ScreenLoader({ message, color, size = 'large' }: ScreenLoaderProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, backgroundColor: '#0A0E14',
  },
  message: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: '#8892A0',
  },
});
