import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function DayDetails({ byDay }) {
  const activeDays = byDay?.filter(d => d.count > 0) || [];
  if (activeDays.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={typography.label}>DETALHES POR DIA</Text>
      {activeDays.map((day, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={typography.h5}>{day.fullDay}</Text>
            <Text style={typography.caption}>{day.count} treinos • {day.minutes} min</Text>
          </View>
          {day.workouts.map((w, j) => (
            <View key={j} style={styles.row}>
              <Ionicons name="barbell" size={14} color={COLORS.primary} />
              <Text style={styles.name}>{w.name}</Text>
              <Text style={styles.duration}>{w.duration}min</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: SPACING.sm, marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xs },
  name: { flex: 1, ...typography.bodySmall, color: COLORS.textDescription, fontSize: 13 },
  duration: { ...typography.h5, fontSize: 12, color: COLORS.textMuted },
});
