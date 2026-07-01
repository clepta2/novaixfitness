import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const STAT_ITEMS = [
  { key: 'weightChange', icon: 'scale', label: 'Peso', color: COLORS.primary, unit: 'kg' },
  { key: 'measurements', icon: 'body', label: 'Medidas', color: COLORS.info },
  { key: 'photos', icon: 'camera', label: 'Fotos', color: COLORS.success },
  { key: 'daysTracked', icon: 'calendar', label: 'Dias', color: COLORS.secondary },
];

interface ProgressStatsProps {
  weightChange?: number | null;
  measurementsCount?: number;
  photosCount?: number;
  daysTracked?: number;
}

function ProgressStats({ weightChange, measurementsCount, photosCount, daysTracked }: ProgressStatsProps): React.JSX.Element {
  const values: { [key: string]: string } = {
    weightChange: weightChange != null ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg` : '--',
    measurements: String(measurementsCount ?? 0),
    photos: String(photosCount ?? 0),
    daysTracked: String(daysTracked ?? 0),
  };

  return (
    <View style={styles.grid}>
      {STAT_ITEMS.map((item) => (
        <View key={item.key} style={styles.card} accessibilityLabel={`${item.label}: ${values[item.key]}`}>
          <Ionicons name={item.icon as any} size={18} color={item.color} />
          <Text style={styles.value}>{values[item.key]}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default memo(ProgressStats);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.xs },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
});
