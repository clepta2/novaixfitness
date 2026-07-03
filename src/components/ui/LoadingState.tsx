// src/components/ui/LoadingState.tsx
// Estado de carregamento reutilizavel

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export default function LoadingState({ message, fullScreen = false, size = 'large', style }: LoadingStateProps) {
  const colors = useColors();

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, style]}>
        <ActivityIndicator size={size} color={colors.primary} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1, backgroundColor: '#0A0E14', justifyContent: 'center', alignItems: 'center', gap: SPACING.md,
  },
  container: {
    padding: SPACING.xl, justifyContent: 'center', alignItems: 'center', gap: SPACING.sm,
  },
  message: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: '#8892A0', textAlign: 'center',
  },
});
