import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { WEEKLY_PLAN_TEMPLATES } from '../../data/workoutPlanOptions';

export default function DaysStep({ daysPerWeek, selectedDays, onSelect }) {
  return (
    <>
      <Text style={styles.title}>QUANTOS DIAS POR SEMANA?</Text>
      <Text style={styles.subtitle}>Escolha a frequência ideal pra você</Text>
      <View style={styles.grid}>
        {daysPerWeek.map((days) => {
          const active = selectedDays === days;
          return (
            <TouchableOpacity
              key={days}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(days)}
            >
              <Text style={[styles.number, active && styles.numberActive]}>{days}</Text>
              <Text style={[styles.label, active && styles.labelActive]}>dias</Text>
              <Text style={styles.description}>
                {days === 3 ? 'Bom equilíbrio' : days === 4 ? 'Ideal' : 'Intenso'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedDays && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>COMO FICA SUA SEMANA:</Text>
          {WEEKLY_PLAN_TEMPLATES[selectedDays + '_days']?.template.map((day, i) => (
            <View key={i} style={styles.previewRow}>
              <Text style={styles.previewDay}>{day.day}</Text>
              <View style={[styles.badge, day.type === 'workout' ? styles.badgeWorkout : styles.badgeRest]}>
                <Text style={[styles.badgeText, day.type === 'workout' ? styles.badgeWorkoutText : styles.badgeRestText]}>
                  {day.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  grid: { flexDirection: 'row', gap: SPACING.md },
  card: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  number: { fontFamily: 'Montserrat_700Bold', fontSize: 32, color: COLORS.textTitle },
  numberActive: { color: COLORS.primary },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  labelActive: { color: COLORS.primary },
  description: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  previewBox: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  previewTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.md },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  previewDay: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  badge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  badgeWorkout: { backgroundColor: COLORS.primary + '20' },
  badgeRest: { backgroundColor: COLORS.surface },
  badgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  badgeWorkoutText: { color: COLORS.primary },
  badgeRestText: { color: COLORS.textMuted },
});
