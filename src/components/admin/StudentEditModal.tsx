import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert, ScrollView, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { typography } from '../../styles';

const PLAN_OPTIONS = [
  { value: 'basic', label: 'Básico', price: 'R$ 49,90' },
  { value: 'intermediate', label: 'Intermediário', price: 'R$ 79,90' },
  { value: 'premium', label: 'Premium', price: 'R$ 119,90' },
  { value: 'ultra', label: 'Ultra', price: 'R$ 199,90' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo', color: COLORS.success },
  { value: 'inactive', label: 'Inativo', color: COLORS.error },
  { value: 'trial', label: 'Trial', color: COLORS.info },
];

const STEP_OPTIONS = [
  { value: 'onboarding', label: 'Onboarding 📝' },
  { value: 'pagamento', label: 'Pagamento 💳' },
  { value: 'tutorial', label: 'Tutorial 🎓' },
  { value: 'home', label: 'Completo ✅' },
];

export default function StudentEditModal({ visible, student, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subscription_plan: 'basic',
    subscription_status: 'inactive',
    current_step: 'onboarding',
  });
  const [saving, setSaving] = useState(false);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || '',
        email: student.email || '',
        subscription_plan: student.subscription_plan || 'basic',
        subscription_status: student.subscription_status || 'inactive',
        current_step: student.current_step || 'onboarding',
      });
    }
  }, [student]);

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert('Erro', 'Nome é obrigatório');
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          subscription_plan: form.subscription_plan,
          subscription_status: form.subscription_status,
          current_step: form.current_step,
        })
        .eq('id', student?.id);
      if (error) throw error;
      onSave?.();
      onClose();
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, isWeb && styles.contentWeb]}>
              <View style={styles.header}>
                <Text style={typography.h4}>Editar Aluno</Text>
                <TouchableOpacity onPress={onClose} accessibilityLabel="Fechar modal" accessibilityRole="button">
                  <Ionicons name="close" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>NOME</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nome do aluno" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Nome do aluno" />

                <Text style={styles.label}>E-MAIL</Text>
                <TextInput style={[styles.input, styles.inputDisabled]} value={form.email} editable={false} placeholderTextColor={COLORS.textMuted} />

                <Text style={styles.label}>ETAPA DE CADASTRO</Text>
                <View style={styles.optionsRow}>
                  {STEP_OPTIONS.map((step) => (
                    <TouchableOpacity key={step.value} style={[styles.stepBtn, form.current_step === step.value && styles.stepBtnActive]} onPress={() => setForm({ ...form, current_step: step.value })} accessibilityLabel={`Etapa: ${step.label}`} accessibilityRole="button" accessibilityState={{ selected: form.current_step === step.value }}>
                      <Text style={[styles.stepText, form.current_step === step.value && styles.stepTextActive]}>{step.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>PLANO</Text>
                <View style={styles.optionsRow}>
                  {PLAN_OPTIONS.map((plan) => (
                    <TouchableOpacity key={plan.value} style={[styles.optionBtn, form.subscription_plan === plan.value && styles.optionActive]} onPress={() => setForm({ ...form, subscription_plan: plan.value })} accessibilityLabel={`Plano ${plan.label}, ${plan.price}`} accessibilityRole="button" accessibilityState={{ selected: form.subscription_plan === plan.value }}>
                      <Text style={[styles.optionLabel, form.subscription_plan === plan.value && styles.optionLabelActive]}>{plan.label}</Text>
                      <Text style={[styles.optionPrice, form.subscription_plan === plan.value && styles.optionPriceActive]}>{plan.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>STATUS</Text>
                <View style={styles.optionsRow}>
                  {STATUS_OPTIONS.map((status) => (
                    <TouchableOpacity key={status.value} style={[styles.statusBtn, form.subscription_status === status.value && { backgroundColor: status.color + '20', borderColor: status.color }]} onPress={() => setForm({ ...form, subscription_status: status.value })} accessibilityLabel={`Status: ${status.label}`} accessibilityRole="button" accessibilityState={{ selected: form.subscription_status === status.value }}>
                      <Text style={[styles.statusLabel, form.subscription_status === status.value && { color: status.color }]}>{status.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose} accessibilityLabel="Cancelar edição">
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving} accessibilityLabel="Salvar alterações">
                    <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end', alignItems: Platform.OS === 'web' ? 'center' : 'stretch' },
  content: { backgroundColor: COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.xl, maxHeight: '80%' },
  contentWeb: { width: 480, borderRadius: 20, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  inputDisabled: { opacity: 0.5 },
  optionsRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  optionBtn: { flex: 1, minWidth: '22%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  optionActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  optionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  optionLabelActive: { color: COLORS.primary },
  optionPrice: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, marginTop: 2 },
  optionPriceActive: { color: COLORS.primary },
  statusBtn: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  statusLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  stepBtn: { flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, paddingVertical: 10, borderRadius: BORDER_RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stepBtnActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  stepTextActive: { color: COLORS.primary },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xl },
  cancelBtn: { flex: 1, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  cancelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  saveBtn: { flex: 1, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});