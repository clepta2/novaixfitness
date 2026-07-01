import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

interface WeekData {
  totalWorkouts?: number;
  totalMinutes?: number;
  activeDays?: number;
  totalDays?: number;
  totalXP?: number;
}

interface WeekSummaryProps {
  data?: WeekData;
}

export default memo(function WeekSummary({ data }: WeekSummaryProps): React.JSX.Element {
  const items = [
    { value: data?.totalWorkouts || 0, label: 'Treinos' },
    { value: data?.totalMinutes || 0, label: 'Minutos' },
    { value: `${data?.activeDays || 0}/${data?.totalDays || 7}`, label: 'Dias Ativos' },
    { value: data?.totalXP || 0, label: 'XP Total' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={20} color={COLORS.primary} />
        <Text style={typography.h5}>RESUMO DA SEMANA</Text>
      </View>
      <View style={styles.grid}>
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            {i > 0 && <View style={styles.divider} />}
            <View style={styles.itemContent}>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  grid: { flexDirection: 'row', justifyContent: 'space-around' },
  item: { flexDirection: 'row', alignItems: 'center' },
  itemContent: { alignItems: 'center' },
  value: typography.stat,
  label: { ...typography.labelSmall, marginTop: 2 },
  divider: { width: 1, height: 40, backgroundColor: COLORS.border, marginHorizontal: SPACING.sm },
});
