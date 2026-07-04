import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

type Props = {
  filters?: string[];
  selected?: string;
  onSelect?: (f: string) => void;
};

export default memo(function FeedFilters({ filters = [], selected = '', onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.container}>
        {filters.map((f) => (
          <TouchableOpacity key={f} style={[styles.chip, selected === f && styles.chipActive]} onPress={() => onSelect(f)} accessibilityLabel={f} accessibilityRole="button">
            <Text style={[typography.bodySmall, selected === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { marginLeft: -SPACING.xl, paddingLeft: SPACING.xl, marginBottom: SPACING.xl },
  container: { flexDirection: 'row', gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold', fontSize: 12 },
});
