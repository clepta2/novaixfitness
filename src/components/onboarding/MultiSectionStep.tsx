// src/components/onboarding/MultiSectionStep.tsx
// Step multi-seção - DATA DRIVEN com validação e guias

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import MeasurementGuide from './MeasurementGuide';

interface Validation {
  min?: number;
  max?: number;
  required?: boolean;
  message?: string;
}

interface SectionOption {
  id: string;
  icon?: string;
  label: string;
}

interface Section {
  id: string;
  field: string;
  label: string;
  subtitle?: string;
  type: string;
  options?: SectionOption[];
  validation?: Validation;
  conditional?: string;
  showGuide?: boolean;
  unit?: string;
  defaultValue?: number;
}

interface Step {
  title: string;
  subtitle?: string;
  sections: Section[];
}

interface MultiSectionStepProps {
  step: Step;
  data: { [key: string]: any };
  onUpdate: (field: string, value: any) => void;
}

export default function MultiSectionStep({ step, data, onUpdate }: MultiSectionStepProps): React.JSX.Element {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (section: Section, value: any): string => {
    if (!section.validation) return '';
    const { min, max, required, message } = section.validation;
    if (required && (!value && value !== 0)) return message || 'Obrigatório';
    if (min !== undefined && value < min) return message || `Mínimo ${min}`;
    if (max !== undefined && value > max) return message || `Máximo ${max}`;
    return '';
  };

  const handleUpdate = (field: string, value: any, section: Section): void => {
    const error = validate(section, value);
    setErrors({ ...errors, [field]: error });
    onUpdate(field, value);
  };

  const renderSection = (section: Section): React.JSX.Element | null => {
    if (section.conditional) {
      const [field, value] = section.conditional.split('===').map((s: string) => s.trim().replace(/'/g, ''));
      if (data[field] !== value) return null;
    }

    const error = errors[section.field];
    const showGuide = section.showGuide && data[section.field] === 'yes';

    return (
      <View key={section.id} style={styles.section}>
        <Text style={styles.sectionLabel}>{section.label}</Text>
        {section.subtitle && <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>}
        {section.type === 'single_select' && (
          <View style={styles.pillsRow}>
            {section.options?.map((option) => (
              <TouchableOpacity key={option.id} style={[styles.pill, data[section.field] === option.id && styles.pillActive]} onPress={() => handleUpdate(section.field, option.id, section)}>
                {option.icon && <Text style={styles.pillIcon}>{option.icon === 'sunny' ? '☀️' : option.icon === 'partly-sunny' ? '⛅' : option.icon === 'moon' ? '🌙' : option.icon === 'male' ? '👨' : option.icon === 'female' ? '👩' : '•'}</Text>}
                <Text style={[styles.pillText, data[section.field] === option.id && styles.pillTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {showGuide && <MeasurementGuide bodyPart={section.id} />}
        {section.type === 'multi_select_pills' && (
          <View style={styles.pillsRow}>
            {section.options?.map((option) => {
              const selected = data[section.field]?.includes(option.id);
              return (
                <TouchableOpacity key={option.id} style={[styles.pill, selected && styles.pillActive]} onPress={() => {
                  const current = data[section.field] || [];
                  const newValue = selected ? current.filter((v: string) => v !== option.id) : [...current, option.id];
                  handleUpdate(section.field, newValue, section);
                }}>
                  <Text style={[styles.pillText, selected && styles.pillTextActive]}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {section.type === 'number_input' && (
          <View>
            <View style={[styles.inputRow, error && styles.inputError]}>
              <TextInput style={styles.numberInput} keyboardType="numeric" value={data[section.field]?.toString() || ''} onChangeText={(t: string) => handleUpdate(section.field, parseInt(t) || 0, section)} placeholder={section.defaultValue?.toString()} placeholderTextColor={COLORS.textMuted} />
              {section.unit && <Text style={styles.unit}>{section.unit}</Text>}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      {step.subtitle && <Text style={styles.subtitle}>{step.subtitle}</Text>}
      {step.sections.map(renderSection)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.xl },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  sectionSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  pill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  pillActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  pillIcon: { fontSize: 14 },
  pillText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  pillTextActive: { color: COLORS.primary },
  inputRow: { flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  inputError: { borderColor: COLORS.error },
  numberInput: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  unit: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginLeft: SPACING.sm },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.error, marginTop: SPACING.xs },
});
