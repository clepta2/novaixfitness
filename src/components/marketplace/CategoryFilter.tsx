// src/components/marketplace/CategoryFilter.tsx
// Filtro horizontal de categorias - NOVAIX FITNESS

import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Category {
  slug: string;
  label: string;
  icon: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>Todos</Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.slug}
          style={[styles.chip, selected === cat.slug && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
          onPress={() => onSelect(selected === cat.slug ? null : cat.slug)}
          activeOpacity={0.7}
        >
          <Ionicons name={cat.icon as any} size={14} color={selected === cat.slug ? cat.color : COLORS.textMuted} />
          <Text style={[styles.chipText, selected === cat.slug && { color: cat.color }]}>{cat.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, paddingVertical: SPACING.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.primary },
});
