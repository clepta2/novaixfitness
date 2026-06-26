import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

const PERIODS = [
  { key: 'week', label: '7 dias' },
  { key: 'month', label: '1 mes' },
  { key: 'quarter', label: '3 meses' },
  { key: 'year', label: '1 ano' },
];

export default function PeriodSelector({ selected, onSelect }) {
  return (
    <View style={styles.periodSelector}>
      {PERIODS.map((p) => (
        <TouchableOpacity key={p.key} style={[styles.periodBtn, selected === p.key && styles.periodActive]} onPress={() => onSelect(p.key)}>
          <Text style={[typography.bodySmall, selected === p.key && styles.periodTextActive]}>{p.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  periodSelector: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  periodBtn: { flex: 1, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  periodActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
});
