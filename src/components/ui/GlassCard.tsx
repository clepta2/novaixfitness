// src/components/ui/GlassCard.tsx
// Card com efeito glassmorphism - NOVAIX FITNESS

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  bordered?: boolean;
  padding?: keyof typeof SPACING;
}

export default function GlassCard({
  children,
  style,
  intensity = 40,
  tint = 'dark',
  bordered = true,
  padding = 'lg',
}: GlassCardProps) {
  return (
    <View style={[styles.container, bordered && styles.bordered, style]}>
      <BlurView intensity={intensity} tint={tint} style={styles.blur}>
        <View style={[styles.content, { padding: SPACING[padding] }]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  bordered: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  blur: {
    flex: 1,
  },
  content: {
    backgroundColor: COLORS.surface + '99',
  },
});
