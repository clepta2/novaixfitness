import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

interface CategoryBarsProps {
  categories: { [key: string]: number };
  total: number;
}

export default memo(function CategoryBars({ categories, total }: CategoryBarsProps): React.JSX.Element | null {
  if (!categories || Object.keys(categories).length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={typography.label}>CATEGORIAS</Text>
      {Object.entries(categories).map(([cat, count]: [string, number]) => (
        <View key={cat} style={styles.row}>
          <Text style={styles.name}>{cat}</Text>
          <View style={styles.bar}>
            <View style={[styles.fill, { width: `${(count / total) * 100}%` }]} />
          </View>
          <Text style={styles.count}>{count}</Text>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md },
  name: { ...typography.bodySmall, fontSize: 13, width: 80 },
  bar: { flex: 1, height: 8, backgroundColor: COLORS.background, borderRadius: SPACING.xs, overflow: 'hidden', marginHorizontal: SPACING.sm },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: SPACING.xs },
  count: { ...typography.h5, color: COLORS.primary, fontSize: 13, width: 30, textAlign: 'right' },
});
