// src/components/ui/EmptyState.tsx
// Componente de estado vazio - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  iconColor?: string;
}

export default function EmptyState({
  icon = 'folder-open-outline',
  title,
  message,
  size = 'md',
  iconColor = COLORS.textMuted,
}: EmptyStateProps) {
  const iconSize = { sm: 36, md: 52, lg: 72 }[size];
  const titleSize = { sm: 14, md: 16, lg: 18 }[size];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={iconSize} color={iconColor} />
      </View>
      <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxxl, paddingHorizontal: SPACING.xl },
  iconContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg,
  },
  title: { fontFamily: 'Montserrat_600SemiBold', color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.xs },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center', lineHeight: 22 },
});
