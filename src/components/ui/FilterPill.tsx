// src/components/ui/FilterPill.tsx
// Pill selecionavel para filtros - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface FilterPillProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  icon?: string;
}

export default function FilterPill({ label, isSelected, onPress, icon }: FilterPillProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.pill, isSelected && styles.pillActive, { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: isSelected ? colors.primary : colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, isSelected && styles.labelActive, { color: isSelected ? '#0A0E14' : colors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1,
  },
  pillActive: {},
  icon: {
    fontSize: 12,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 11,
  },
  labelActive: {},
});
