// src/components/common/EmptyState.js
// Componente de Estado Vazio — NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { Button } from '../ui/Button';
import { useFadeInUp } from '../../utils/animations';

/**
 * Componente de empty state visual
 * @param {string} icon - nome do ícone Ionicons
 * @param {string} title - título principal
 * @param {string} description - descrição secundária
 * @param {string} actionLabel - texto do botão de ação
 * @param {function} onAction - callback do botão
 * @param {string} iconColor - cor do ícone (default: textMuted)
 */
function EmptyState({ icon = 'search-outline', title, description, actionLabel, onAction, iconColor }) {
  const { opacity, translateY } = useFadeInUp(100);

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.iconCircle, iconColor && { backgroundColor: iconColor + '15' }]}>
        <Ionicons
          name={icon}
          size={ICON_SIZES.xl}
          color={iconColor || COLORS.textMuted}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="secondary"
            style={styles.actionBtn}
          />
        </View>
      )}
    </Animated.View>
  );
}

export default memo(EmptyState);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.massive,
    paddingHorizontal: SPACING.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.textTitle,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textDescription,
    textAlign: 'center',
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: SPACING.xxl,
    width: '100%',
    maxWidth: 200,
  },
  actionBtn: {
    height: 44,
  },
});
