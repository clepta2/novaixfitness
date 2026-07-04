// src/components/ui/ScreenHeader.tsx
// Header unificado de tela - NOVAIX FITNESS
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  rightLabel?: string;
  rightIcon2?: string;
  onRightPress2?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightIcon,
  onRightPress,
  rightLabel,
  rightIcon2,
  onRightPress2,
}: ScreenHeaderProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: colors.surface }]} accessibilityLabel="Voltar" accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color={colors.textTitle} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.textTitle }]} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>
      <View style={styles.rightActions}>
        {rightIcon2 && onRightPress2 && (
          <TouchableOpacity onPress={onRightPress2} style={[styles.iconBtn, { backgroundColor: colors.surface }]} accessibilityLabel="Mais opções" accessibilityRole="button">
            <Ionicons name={rightIcon2 as any} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
        {rightIcon && onRightPress ? (
          <TouchableOpacity onPress={onRightPress} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name={rightIcon as any} size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : rightLabel && onRightPress ? (
          <TouchableOpacity onPress={onRightPress} style={styles.actionBtn}>
            <Text style={[styles.actionText, { color: colors.primary }]}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </View>
  );
}

export const Header = ScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  spacer: { width: 40 },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, letterSpacing: 1, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  rightActions: { flexDirection: 'row', gap: SPACING.xs },
  iconBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  actionBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  actionText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13 },
});
