// src/components/social/PhotoFilterPicker.js
// Seletor de filtros para fotos de post

import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const FILTERS = [
  { id: 'none', label: 'Original' },
  { id: 'warm', label: 'Quente' },
  { id: 'cool', label: 'Frio' },
  { id: 'bw', label: 'P&B' },
  { id: 'contrast', label: 'Contraste' },
  { id: 'vibrant', label: 'Vibrante' },
];

export default function PhotoFilterPicker({ selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {FILTERS.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={[styles.chip, selected === filter.id && styles.chipActive]}
          onPress={() => onSelect(filter.id)}
        >
          <Text style={[styles.label, selected === filter.id && styles.labelActive]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 0, marginBottom: SPACING.md },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  labelActive: { color: COLORS.background },
});
