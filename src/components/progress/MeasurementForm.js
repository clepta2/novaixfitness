import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { MEASUREMENT_TYPES } from '../../services/body-measurements';

export default function MeasurementForm({ form, onChangeForm, onSave, saving }) {
  return (
    <View style={styles.card}>
      <Text style={typography.h5}>NOVA MEDIÇÃO</Text>
      {MEASUREMENT_TYPES.map((m) => (
        <View key={m.key} style={styles.row}>
          <Text style={styles.label}>{m.label} ({m.unit})</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
            value={form[m.key]}
            onChangeText={(v) => onChangeForm({ ...form, [m.key]: v })}
          />
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.label}>Notas</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Observações..."
          placeholderTextColor={COLORS.textMuted}
          value={form.notes}
          onChangeText={(v) => onChangeForm({ ...form, notes: v })}
          multiline
        />
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving}>
        <Text style={typography.button}>{saving ? 'Salvando...' : 'SALVAR MEDIÇÕES'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  label: { ...typography.bodySmall, width: 120 },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.textTitle, ...typography.bodySmall, borderWidth: 1, borderColor: COLORS.border, marginLeft: SPACING.md },
  inputMultiline: { height: 60, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
});
