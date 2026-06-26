// src/components/workout/CategoryCard.js
// Card de categoria - NOVAIX FITNESS

import React, { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width } = Dimensions.get('window');

function CategoryCard({ category, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.active]}
      onPress={() => onPress?.(category)}
      activeOpacity={0.8}
    >
      <View style={[styles.icon, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon} size={28} color={category.color} />
      </View>
      <Text style={styles.label}>{category.label}</Text>
      <Text style={styles.description}>{category.description}</Text>
      <Text style={styles.count}>{category.count} treinos</Text>
    </TouchableOpacity>
  );
}

export default memo(CategoryCard);

const styles = StyleSheet.create({
  card: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  active: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  count: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
});
