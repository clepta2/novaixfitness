import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { analyzeMealText, saveMealLog } from '../../services/mealAnalyzer';

const MEAL_TYPES = [
  { key: 'cafe', label: 'Café da Manhã', icon: 'sunny' },
  { key: 'almoco', label: 'Almoço', icon: 'restaurant' },
  { key: 'jantar', label: 'Jantar', icon: 'moon' },
  { key: 'lanche', label: 'Lanche', icon: 'cafe' },
];

export default function MealLogModal({ visible, onClose, userId, profileContext, onSaved }) {
  const [text, setText] = useState('');
  const [mealType, setMealType] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    try {
      const analysis = await analyzeMealText(text, profileContext);
      setResult(analysis);
      if (analysis && !mealType) setMealType(analysis.mealType);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await saveMealLog(userId, { ...result, mealType: mealType || result.mealType });
      setText('');
      setResult(null);
      setMealType('');
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.handle} />
          <Text style={styles.title}>REGISTRAR REFEIÇÃO</Text>
          <TextInput
            style={styles.input}
            placeholder="O que você comeu?"
            placeholderTextColor={COLORS.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            accessibilityLabel="Descrição da refeição"
          />
          <View style={styles.types}>
            {MEAL_TYPES.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.typeBtn, mealType === t.key && styles.typeBtnActive]}
                onPress={() => setMealType(t.key)}
                accessibilityLabel={t.label}
              >
                <Ionicons name={t.icon as any} size={18} color={mealType === t.key ? COLORS.background : COLORS.textDescription} />
                <Text style={[styles.typeLabel, mealType === t.key && styles.typeLabelActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!result && (
            <TouchableOpacity
              style={[styles.analyzeBtn, !text.trim() && styles.btnDisabled]}
              onPress={handleAnalyze}
              disabled={!text.trim() || analyzing}
              accessibilityLabel="Analisar refeição"
            >
              {analyzing ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.btnText}>ANALISAR</Text>}
            </TouchableOpacity>
          )}
          {result && (
            <View style={styles.result}>
              <Text style={styles.resultTitle}>{result.description}</Text>
              <View style={styles.resultMacros}>
                <Text style={[styles.resultMacro, { color: COLORS.primary }]}>{result.calories} kcal</Text>
                <Text style={[styles.resultMacro, { color: COLORS.success }]}>{result.protein}g P</Text>
                <Text style={[styles.resultMacro, { color: COLORS.primary }]}>{result.carbs}g C</Text>
                <Text style={[styles.resultMacro, { color: COLORS.secondary }]}>{result.fat}g G</Text>
              </View>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} accessibilityLabel="Salvar refeição">
                {saving ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.btnText}>SALVAR</Text>}
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Fechar">
            <Ionicons name="close" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modal: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, maxHeight: '80%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1, marginBottom: SPACING.lg },
  input: { backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 15, minHeight: 80, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  types: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg, flexWrap: 'wrap' },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  typeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textDescription },
  typeLabelActive: { color: COLORS.background },
  analyzeBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center' },
  saveBtn: { backgroundColor: COLORS.success, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.md },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  result: { backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  resultTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.sm },
  resultMacros: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.sm },
  resultMacro: { fontFamily: 'Montserrat_700Bold', fontSize: 13 },
  closeBtn: { alignSelf: 'center', marginTop: SPACING.lg, padding: SPACING.sm },
});
