// src/components/ui/CategoryChip.tsx
// Chip de categoria reutilizavel - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface CategoryChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  icon?: string;
}

export default function CategoryChip({ label, isSelected, onPress, icon }: CategoryChipProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipActive, { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: isSelected ? colors.primary : colors.border }]}
      onPress={onPress}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, isSelected && styles.labelActive, { color: isSelected ? '#0A0E14' : colors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1,
  },
  chipActive: {},
  icon: {
    fontSize: 12,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 11,
  },
  labelActive: {},
});
