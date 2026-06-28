// src/components/onboarding/CepStep.js
// Step de CEP com auto-preenchimento
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function CepStep({ step, data, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const handleCepChange = async (text) => {
    const clean = text.replace(/\D/g, '').slice(0, 8);
    const formatted = clean.length <= 5 ? clean : clean.slice(0, 5) + '-' + clean.slice(5);
    onUpdate('cep', formatted);
    if (clean.length === 8) {
      setLoading(true);
      try {
        const res = await fetch('https://viacep.com.br/ws/' + clean + '/json/');
        const result = await res.json();
        if (!result.erro) {
          onUpdate('state', result.uf);
          onUpdate('city', result.localidade);
        }
      } catch (e) {}
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
      {step.fields.map((field) => (
        <View key={field.id} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{field.label}</Text>
          <View style={styles.inputWrap}>
            <TextInput style={styles.textInput} value={data[field.field] || ''} onChangeText={field.type === 'cep_input' ? handleCepChange : (t) => onUpdate(field.field, t)} editable={!field.autoFilled || !data[field.field]} placeholder={field.type === 'cep_input' ? '00000-000' : ''} placeholderTextColor={COLORS.textMuted} />
            {loading && field.type === 'cep_input' && <Ionicons name="sync" size={16} color={COLORS.primary} style={styles.loader} />}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  inputGroup: { marginBottom: SPACING.lg },
  inputLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  textInput: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  loader: { marginLeft: SPACING.sm },
});
