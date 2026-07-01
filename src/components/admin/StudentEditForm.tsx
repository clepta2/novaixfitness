import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const PLANS = [
  { value: 'basic', label: 'Básico', price: 'R$ 49,90' },
  { value: 'intermediate', label: 'Intermediário', price: 'R$ 79,90' },
  { value: 'premium', label: 'Premium', price: 'R$ 119,90' },
  { value: 'ultra', label: 'Ultra', price: 'R$ 199,90' },
];

export const STATUSES = [
  { value: 'active', label: 'Ativo', color: COLORS.success },
  { value: 'inactive', label: 'Inativo', color: COLORS.error },
  { value: 'trial', label: 'Trial', color: COLORS.info },
];

export const STEPS = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'pagamento', label: 'Pagamento' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'home', label: 'Completo' },
];

export default function StudentEditForm({ form, setForm, saving, onSave, onClose }) {
  const lbl = (text) => <Text style={s.label}>{text}</Text>;
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <>
      {lbl('NOME')}
      <TextInput style={s.input} value={form.name} onChangeText={(t) => set('name', t)} placeholder="Nome do aluno" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Nome do aluno" />
      {lbl('E-MAIL')}
      <TextInput style={[s.input, s.disabled]} value={form.email} editable={false} placeholderTextColor={COLORS.textMuted} />
      {lbl('ETAPA DE CADASTRO')}
      <View style={s.row}>{STEPS.map((o) => (
        <TouchableOpacity key={o.value} style={[s.step, form.current_step === o.value && s.stepActive]} onPress={() => set('current_step', o.value)} accessibilityLabel={`Etapa: ${o.label}`} accessibilityRole="button">
          <Text style={[s.stepT, form.current_step === o.value && s.stepTActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}</View>
      {lbl('PLANO')}
      <View style={s.row}>{PLANS.map((p) => (
        <TouchableOpacity key={p.value} style={[s.opt, form.subscription_plan === p.value && s.optActive]} onPress={() => set('subscription_plan', p.value)} accessibilityLabel={`Plano ${p.label}`} accessibilityRole="button">
          <Text style={[s.optL, form.subscription_plan === p.value && s.optLActive]}>{p.label}</Text>
          <Text style={[s.optP, form.subscription_plan === p.value && s.optPActive]}>{p.price}</Text>
        </TouchableOpacity>
      ))}</View>
      {lbl('STATUS')}
      <View style={s.row}>{STATUSES.map((st) => (
        <TouchableOpacity key={st.value} style={[s.status, form.subscription_status === st.value && { backgroundColor: st.color + '20', borderColor: st.color }]} onPress={() => set('subscription_status', st.value)} accessibilityLabel={`Status: ${st.label}`} accessibilityRole="button">
          <Text style={[s.statusT, form.subscription_status === st.value && { color: st.color }]}>{st.label}</Text>
        </TouchableOpacity>
      ))}</View>
      <View style={s.actions}>
        <TouchableOpacity style={s.cancel} onPress={onClose}><Text style={s.cancelT}>Cancelar</Text></TouchableOpacity>
        <TouchableOpacity style={[s.save, saving && s.saveDisabled]} onPress={onSave} disabled={saving}><Text style={s.saveT}>{saving ? 'Salvando...' : 'Salvar'}</Text></TouchableOpacity>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  opt: { flex: 1, minWidth: '22%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  optActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  optL: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  optLActive: { color: COLORS.primary },
  optP: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, marginTop: 2 },
  optPActive: { color: COLORS.primary },
  statusT: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  status: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  step: { flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, paddingVertical: 10, borderRadius: BORDER_RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stepActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  stepT: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  stepTActive: { color: COLORS.primary },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xl },
  cancel: { flex: 1, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  cancelT: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  save: { flex: 1, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveDisabled: { opacity: 0.6 },
  saveT: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
