// src/components/ui/PlaceholderState.tsx
// Estado vazio/placeholder centralizado - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface PlaceholderStateProps {
  icon: string;
  title: string;
  message?: string;
  iconSize?: number;
  iconColor?: string;
}

export default function PlaceholderState({ icon, title, message, iconSize = 48, iconColor }: PlaceholderStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={iconSize} color={iconColor || colors.primary} />
      <Text style={[styles.title, { color: colors.textTitle }]}>{title}</Text>
      {message && <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md,
  },
  title: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14, textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', maxWidth: 250,
  },
});
