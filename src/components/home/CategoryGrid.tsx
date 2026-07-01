import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';
import { scale } from '../../utils/responsive';

interface Category {
  key: string;
  icon: string;
  color: string;
  label: string;
  bg: string;
  category: string;
}

interface CategoryGridProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  onPress: (category: Category) => void;
}

function CategoryGrid({ categories, categoryCounts, onPress }: CategoryGridProps): React.JSX.Element {
  return (
    <View>
      <Text style={[typography.label, { marginTop: SPACING.xl, marginBottom: SPACING.md }]}>CATEGORIAS DE TREINO</Text>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.key} style={[styles.card, { backgroundColor: cat.bg }]} onPress={() => onPress(cat)} activeOpacity={0.8}>
            <View style={styles.iconWrap}>
              <Ionicons name={cat.icon as any} size={scale(28)} color={cat.color} />
            </View>
            <Text style={[styles.label, { color: cat.color }]}>{cat.label}</Text>
            <Text style={[styles.count, { color: cat.color }]}>{categoryCounts[cat.category] || 0} TREINOS</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default memo(CategoryGrid);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: { width: '47%', borderRadius: 16, padding: SPACING.lg, alignItems: 'center', gap: SPACING.xs },
  iconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, textAlign: 'center' },
  count: { fontFamily: 'Inter_400Regular', fontSize: 10, letterSpacing: 0.5 },
});
