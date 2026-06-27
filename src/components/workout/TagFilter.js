import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { TAG_CATEGORIES } from '../../constants/tags';

export default function TagFilter({ selectedTags, onToggleTag, onClearAll }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const activeCount = Object.values(selectedTags).flat().length;

  const toggleCategory = (catKey) => {
    setExpandedCategory(expandedCategory === catKey ? null : catKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="pricetags" size={16} color={COLORS.primary} />
          <Text style={typography.label}>FILTROS</Text>
          {activeCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{activeCount}</Text>
            </View>
          )}
        </View>
        {activeCount > 0 && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {Object.entries(TAG_CATEGORIES).map(([catKey, cat]) => {
          const catActiveCount = (selectedTags[catKey] || []).length;
          const isExpanded = expandedCategory === catKey;
          return (
            <View key={catKey}>
              <TouchableOpacity
                style={[styles.categoryBtn, isExpanded && styles.categoryBtnActive, catActiveCount > 0 && styles.categoryBtnSelected]}
                onPress={() => toggleCategory(catKey)}
              >
                <Ionicons name={cat.icon} size={14} color={isExpanded || catActiveCount > 0 ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.categoryLabel, (isExpanded || catActiveCount > 0) && styles.categoryLabelActive]}>
                  {cat.label}
                </Text>
                {catActiveCount > 0 && <View style={styles.dot} />}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {expandedCategory && (
        <View style={styles.tagsPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TAG_CATEGORIES[expandedCategory].tags.map((tag) => {
              const isActive = (selectedTags[expandedCategory] || []).includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.tagBtn, isActive && styles.tagBtnActive]}
                  onPress={() => onToggleTag(expandedCategory, tag.id)}
                >
                  <Ionicons name={tag.icon} size={12} color={isActive ? COLORS.background : COLORS.textMuted} />
                  <Text style={[styles.tagLabel, isActive && styles.tagLabelActive]}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  countBadge: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.full, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  countText: { ...typography.buttonSmall, color: COLORS.background, fontSize: 10 },
  categoriesScroll: { marginBottom: SPACING.sm },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  categoryBtnActive: { borderColor: COLORS.primary },
  categoryBtnSelected: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  categoryLabel: { ...typography.bodySmall, fontSize: 11, color: COLORS.textMuted },
  categoryLabelActive: { color: COLORS.primary },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  tagsPanel: { marginTop: SPACING.xs },
  tagBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  tagBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tagLabel: { ...typography.bodySmall, fontSize: 11, color: COLORS.textMuted },
  tagLabelActive: { color: COLORS.background },
});
