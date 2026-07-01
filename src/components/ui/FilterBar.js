// src/components/ui/FilterBar.js
// Barra de filtros de período reutilizável - NOVAIX FITNESS

import { memo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

export const PERIOD_FILTERS = [
  { key: 'day', label: 'Hoje', days: 1 },
  { key: 'week', label: '7 dias', days: 7 },
  { key: 'month', label: '1 mês', days: 30 },
  { key: 'quarter', label: '3 meses', days: 90 },
  { key: 'year', label: '1 ano', days: 365 },
];

export function getDateRange(periodKey) {
  const filter = PERIOD_FILTERS.find(p => p.key === periodKey) || PERIOD_FILTERS[1];
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(end.getDate() - filter.days + 1);
  start.setHours(0, 0, 0, 0);
  return { start: start.toISOString(), end: end.toISOString() };
}

function FilterBar({ selected, onSelect, filters = PERIOD_FILTERS, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={styles.row}
    >
      {filters.map((f) => {
        const active = selected === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(f.key)}
            activeOpacity={0.75}
            accessibilityLabel={`Filtrar por ${f.label}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{f.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default memo(FilterBar);

const styles = StyleSheet.create({
  row: { gap: SPACING.sm, paddingBottom: SPACING.xs },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: scale(12),
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: COLORS.background,
  },
});
