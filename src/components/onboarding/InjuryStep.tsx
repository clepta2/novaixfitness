// src/components/onboarding/InjuryStep.tsx
// Step de lesões
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const INJURY_OPTIONS = [
  { id: 'knee', label: 'Joelho' },
  { id: 'back', label: 'Coluna' },
  { id: 'shoulder', label: 'Ombro' },
  { id: 'hip', label: 'Quadril' },
  { id: 'wrist', label: 'Punho' },
  { id: 'ankle', label: 'Tornozelo' },
  { id: 'neck', label: 'Pescoço' },
  { id: 'none', label: 'Nenhuma' },
];

interface Injury {
  bodyPart: string;
  description: string;
}

interface SectionOption {
  id: string;
  label: string;
}

interface Section {
  id: string;
  label: string;
  subtitle: string;
  type: string;
  field?: string;
  options?: SectionOption[];
}

interface Step {
  title: string;
  sections: Section[];
}

interface InjuryStepProps {
  step: Step;
  data: { injuries?: Injury[]; [key: string]: any };
  onUpdate: (field: string, value: any) => void;
}

export default function InjuryStep({ step, data, onUpdate }: InjuryStepProps): React.JSX.Element {
  const injuries = data.injuries || [];
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentInjury, setCurrentInjury] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      {step.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionLabel}>{section.label}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
          {section.type === 'injury_selector' && (
            <>
              <View style={styles.injuryGrid}>
                {INJURY_OPTIONS.map((injury) => (
                  <TouchableOpacity key={injury.id} style={[styles.injuryChip, injuries.some((i: Injury) => i.bodyPart === injury.id) && styles.injuryChipActive]} onPress={() => {
                    if (injury.id === 'none') { onUpdate('injuries', []); }
                    else { setCurrentInjury(injury.id); setShowForm(true); }
                  }}>
                    <Text style={[styles.injuryChipText, injuries.some((i: Injury) => i.bodyPart === injury.id) && styles.injuryChipTextActive]}>{injury.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {showForm && (
                <View style={styles.injuryForm}>
                  <Text style={styles.formTitle}>Descreva sua condição</Text>
                  <TextInput style={styles.textArea} multiline placeholder="Ex: Machuquei essa semana jogando futebol" placeholderTextColor={COLORS.textMuted} value={injuries.find((i: Injury) => i.bodyPart === currentInjury)?.description || ''} onChangeText={(t: string) => {
                    const updated = injuries.filter((i: Injury) => i.bodyPart !== currentInjury);
                    updated.push({ bodyPart: currentInjury, description: t });
                    onUpdate('injuries', updated);
                  }} />
                  <TouchableOpacity style={styles.closeForm} onPress={() => setShowForm(false)}>
                    <Text style={styles.closeFormText}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          {section.type === 'single_select' && (
            <View style={styles.optionsRow}>
              {section.options?.map((option) => (
                <TouchableOpacity key={option.id} style={[styles.optionPill, data[section.field || ''] === option.id && styles.optionPillActive]} onPress={() => onUpdate(section.field || '', option.id)}>
                  <Text style={[styles.optionPillText, data[section.field || ''] === option.id && styles.optionPillTextActive]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  section: { marginBottom: SPACING.xl },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  sectionSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
  injuryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  injuryChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  injuryChipActive: { backgroundColor: COLORS.error + '15', borderColor: COLORS.error },
  injuryChipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  injuryChipTextActive: { color: COLORS.error },
  injuryForm: { marginTop: SPACING.lg, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  formTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  textArea: { height: 100, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', textAlignVertical: 'top' },
  closeForm: { marginTop: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  closeFormText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  optionPill: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  optionPillActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  optionPillText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  optionPillTextActive: { color: COLORS.primary },
});
