import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ForumFilters({ categories, selected, onSelect, search, onSearchChange }) {
  return (
    <>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar discussões..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={onSearchChange}
          accessibilityLabel="Buscar posts"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <TouchableOpacity
          style={[styles.chip, selected === 'all' && styles.chipActive]}
          onPress={() => onSelect('all')}
          accessibilityLabel="Todos"
          accessibilityRole="button"
        >
          <Text style={[styles.chipText, selected === 'all' && styles.chipTextActive]}>Todos</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selected === cat.id && styles.chipActive]}
            onPress={() => onSelect(cat.id)}
            accessibilityLabel={cat.label}
            accessibilityRole="button"
          >
            <Text style={[styles.chipText, selected === cat.id && styles.chipTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg, marginBottom: SPACING.md, height: 44,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, marginLeft: SPACING.sm },
  scroll: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface,
    marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textDescription },
  chipTextActive: { color: COLORS.background },
});
