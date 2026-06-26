import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function ComparisonCard({ comparison }) {
  if (!comparison) return null;

  return (
    <View style={[styles.card, comparison.pctChange >= 0 ? styles.positiveCard : styles.negativeCard]}>
      <View style={styles.row}>
        <View>
          <Text style={typography.caption}>Vs. periodo anterior</Text>
          <Text style={[styles.value, { color: comparison.pctChange >= 0 ? COLORS.success : COLORS.error }]}>
            {comparison.pctChange >= 0 ? '+' : ''}{comparison.pctChange}%
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={typography.bodySmall}>{comparison.workouts >= 0 ? '+' : ''}{comparison.workouts} treinos</Text>
          <Text style={typography.bodySmall}>{comparison.minutes >= 0 ? '+' : ''}{comparison.minutes} min</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32 },
  details: { alignItems: 'flex-end' },
  positiveCard: { borderColor: COLORS.success + '40' },
  negativeCard: { borderColor: COLORS.error + '40' },
});
