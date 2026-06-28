import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function NutritionProgress({ streak, nextBadge }) {
  if (!nextBadge) return null;
  const progress = (streak / nextBadge.days) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Próximo: {nextBadge.label} ({nextBadge.days} dias)</Text>
      <View style={styles.progressBar}>
        <View style={[styles.fill, { width: `${Math.min(100, progress)}%` }]} />
      </View>
      <Text style={styles.text}>{streak}/{nextBadge.days} dias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.xs },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  text: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, textAlign: 'right' },
});
