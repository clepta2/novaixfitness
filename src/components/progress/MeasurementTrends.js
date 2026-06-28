import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TRENDS = [
  { key: 'chest', label: 'Peito', unit: 'cm', icon: 'resize' },
  { key: 'waist', label: 'Cintura', unit: 'cm', icon: 'resize' },
  { key: 'hips', label: 'Quadril', unit: 'cm', icon: 'body' },
  { key: 'arms', label: 'Braços', unit: 'cm', icon: 'barbell' },
  { key: 'thighs', label: 'Coxas', unit: 'cm', icon: 'walk' },
];

function MiniBar({ value, maxValue }) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${pct}%` }]} />
    </View>
  );
}

function TrendItem({ label, unit, value, change, maxValue }) {
  const isImproved = change != null && (
    (label === 'Cintura' && change < 0) || (label !== 'Cintura' && change > 0) || change === 0
  );
  const changeColor = change == null ? COLORS.textMuted : isImproved ? COLORS.success : COLORS.secondary;

  return (
    <View style={styles.trendItem}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendLabel}>{label}</Text>
        <Text style={styles.trendValue}>{value != null ? `${value}${unit}` : '--'}</Text>
      </View>
      <MiniBar value={value || 0} maxValue={maxValue} />
      {change != null && (
        <View style={styles.changeRow}>
          <Ionicons
            name={change < 0 ? 'trending-down' : change > 0 ? 'trending-up' : 'remove'}
            size={12}
            color={changeColor}
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}{unit}
          </Text>
        </View>
      )}
    </View>
  );
}

function MeasurementTrends({ latest, previous }) {
  const router = useRouter();
  const maxVal = Math.max(...TRENDS.map(t => latest?.[t.key] || 0), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TENDÊNCIAS</Text>
        <TouchableOpacity onPress={() => router.push('/body-measures')} accessibilityLabel="Ver todas as medições">
          <Text style={styles.seeAll}>Ver mais</Text>
        </TouchableOpacity>
      </View>
      {TRENDS.map((t) => (
        <TrendItem
          key={t.key}
          label={t.label}
          unit={t.unit}
          value={latest?.[t.key]}
          change={latest?.[t.key] != null && previous?.[t.key] != null ? latest[t.key] - previous[t.key] : null}
          maxValue={maxVal}
        />
      ))}
    </View>
  );
}

export default memo(MeasurementTrends);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  seeAll: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
  trendItem: { marginBottom: SPACING.md },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  trendLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textDescription },
  trendValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  barBg: { height: 4, backgroundColor: COLORS.surfaceOverlay, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  changeText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
});
