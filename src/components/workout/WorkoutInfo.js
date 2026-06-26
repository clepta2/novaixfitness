// src/components/workout/WorkoutInfo.js
// Info do treino (stats + equipamentos) - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function WorkoutInfo({ workout, totalSets, calories }) {
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Stat icon="time-outline" value={`${workout.duration} min`} />
        <Stat icon="barbell-outline" value={`${workout.exercises.length} exercícios`} />
        <Stat icon="repeat-outline" value={`${totalSets} séries`} />
        <Stat icon="flame-outline" value={`~${calories} kcal`} />
      </View>

      {workout.equipment.length > 0 && (
        <View style={styles.equipment}>
          <Text style={styles.equipTitle}>EQUIPAMENTOS</Text>
          <View style={styles.equipRow}>
            {workout.equipment.map((eq, i) => (
              <View key={i} style={styles.equipChip}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
                <Text style={styles.equipText}>{eq}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function Stat({ icon, value }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xxl },
  stats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  statItem: { alignItems: 'center', gap: SPACING.xs },
  statValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  equipment: { marginTop: SPACING.xxl },
  equipTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  equipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  equipChip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  equipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle },
});
