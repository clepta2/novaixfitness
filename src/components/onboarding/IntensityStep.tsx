import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface IntensityOption {
  id: string;
  icon: string;
  label: string;
  description: string;
}

interface IntensityStepProps {
  options: IntensityOption[];
  selectedIntensity: string | null;
  onSelect: (id: string) => void;
}

export default function IntensityStep({ options, selectedIntensity, onSelect }: IntensityStepProps): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>QUE INTENSIDADE VOCÊ QUER?</Text>
      <Text style={styles.subtitle}>Isso define série, repetição e descanso</Text>
      <View style={styles.grid}>
        {options.map((option) => {
          const active = selectedIntensity === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(option.id)}
            >
              <Ionicons name={option.icon as any} size={32} color={active ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
              <Text style={styles.description}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>COMO FUNCIONA:</Text>
        <Text style={styles.infoText}>• Leve: 3 séries, 12-15 reps, 60s descanso</Text>
        <Text style={styles.infoText}>• Moderado: 4 séries, 10-12 reps, 90s descanso</Text>
        <Text style={styles.infoText}>• Intenso: 4-5 séries, 8-10 reps, 45-60s descanso</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  grid: { gap: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  label: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  labelActive: { color: COLORS.primary },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  infoBox: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  infoTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginBottom: SPACING.xs },
});
