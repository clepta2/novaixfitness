// src/components/ui/EmptyState.tsx
// Componente de estado vazio - NOVAIX FITNESS

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
  iconColor?: string;
}

export default function EmptyState({
  icon = 'folder-open-outline',
  title,
  description,
  message,
  actionLabel,
  onAction,
  size = 'md',
  iconColor = COLORS.textMuted,
}: EmptyStateProps) {
  const iconSize = { sm: 36, md: 52, lg: 72 }[size];
  const titleSize = { sm: 14, md: 16, lg: 18 }[size];
  const body = description || message;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={iconSize} color={iconColor} />
      </View>
      <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
      {body && <Text style={styles.message}>{body}</Text>}
      {actionLabel && onAction && (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
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
  button: {
    marginTop: SPACING.lg, backgroundColor: COLORS.primary, paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.md,
  },
  buttonText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.background, textAlign: 'center' },
});
