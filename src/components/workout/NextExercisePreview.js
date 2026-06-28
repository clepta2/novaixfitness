import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function NextExercisePreview({ exercise, currentSet, totalSets }) {
  if (!exercise) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="arrow-forward-circle" size={16} color={COLORS.primary} />
        <Text style={styles.label}>PRÓXIMO</Text>
      </View>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.meta}>
        {exercise.sets || 4}x{exercise.reps || 10} • {exercise.muscle || 'Geral'}
      </Text>
      {currentSet && totalSets && (
        <Text style={styles.setInfo}>Série {currentSet} de {totalSets}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1 },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  setInfo: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
});
