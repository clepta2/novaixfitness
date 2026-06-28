import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function MuscleStep({ muscles, selectedMuscles, onToggle }) {
  return (
    <>
      <Text style={styles.title}>QUE MÚSCULOS VOCÊ QUER TREINAR?</Text>
      <Text style={styles.subtitle}>Selecione todos que quiser</Text>
      <View style={styles.grid}>
        {muscles.map((muscle) => {
          const active = selectedMuscles.includes(muscle.id);
          return (
            <TouchableOpacity
              key={muscle.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onToggle(muscle.id)}
            >
              <Ionicons name={muscle.icon} size={24} color={active ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.label, active && styles.labelActive]}>{muscle.label}</Text>
              {active && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.hint}>Selecionou {selectedMuscles.length} grupo(s)</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, marginTop: SPACING.lg, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  card: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  label: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  labelActive: { color: COLORS.primary },
});
