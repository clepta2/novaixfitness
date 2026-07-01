import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
  onClear: () => void;
}

function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (!searches.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.bodyMuted}>Buscas recentes</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chips}>
        {searches.map((s, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => onSelect(s)}>
            <Text style={styles.chipText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default memo(RecentSearches);

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  clearText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { paddingHorizontal: SPACING.sm, paddingVertical: 4, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription },
});
