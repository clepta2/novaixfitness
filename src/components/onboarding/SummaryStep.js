// src/components/onboarding/SummaryStep.js
// Step de resumo
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function SummaryStep({ step, data }) {
  const sections = [
    { label: 'Objetivo', value: data.goal },
    { label: 'Idade', value: data.age_range },
    { label: 'Gênero', value: data.gender },
    { label: 'Peso', value: data.weight ? data.weight + 'kg' : null },
    { label: 'Altura', value: data.height ? data.height + 'cm' : null },
    { label: 'Cidade', value: data.city },
    { label: 'Tipo de Treino', value: data.workoutType },
    { label: 'Lesões', value: data.injuries?.map(i => i.bodyPart).join(', ') || 'Nenhuma' },
    { label: 'Horário', value: data.preferred_time },
  ].filter(s => s.value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
      <View style={styles.summaryCard}>
        {sections.map((section, i) => (
          <View key={i} style={[styles.summaryRow, i < sections.length - 1 && styles.summaryRowBorder]}>
            <Text style={styles.summaryLabel}>{section.label}</Text>
            <Text style={styles.summaryValue}>{section.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  summaryCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  summaryValue: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
});
