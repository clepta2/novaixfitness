import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function InsightsRow({ bestDay, bestHour }) {
  if (!bestDay && !bestHour) return null;

  return (
    <View style={styles.row}>
      {bestDay && (
        <View style={styles.card}>
          <Ionicons name="calendar" size={18} color={COLORS.primary} />
          <Text style={styles.label}>Melhor dia</Text>
          <Text style={styles.value}>{bestDay}</Text>
        </View>
      )}
      {bestHour && (
        <View style={styles.card}>
          <Ionicons name="time" size={18} color={COLORS.primary} />
          <Text style={styles.label}>Melhor horario</Text>
          <Text style={styles.value}>{bestHour}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  card: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary },
});
