// src/components/nutrition/BodyComposition.js
// Calculadora de composição corporal - NOVAIX FITNESS

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const bmi = weight / ((height / 100) ** 2);
  let category, color;
  if (bmi < 18.5) { category = 'Abaixo do peso'; color = COLORS.info; }
  else if (bmi < 25) { category = 'Peso normal'; color = COLORS.success; }
  else if (bmi < 30) { category = 'Sobrepeso'; color = COLORS.attention; }
  else { category = 'Obesidade'; color = COLORS.error; }
  return { value: bmi.toFixed(1), category, color };
}

function calculateBodyFat(weight, height, age, gender, waist, neck, hip) {
  if (!weight || !height || !age || !waist || !neck) return null;
  const h = height / 100;

  if (gender === 'M') {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    return { value: Math.max(3, Math.min(40, bf)).toFixed(1), formula: 'US Navy' };
  } else {
    if (!hip) return null;
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    return { value: Math.max(10, Math.min(50, bf)).toFixed(1), formula: 'US Navy' };
  }
}

function calculateTDEE(weight, height, age, gender, activity) {
  let bmr;
  if (gender === 'M') bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  else bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  const multipliers = { sedentario: 1.2, leve: 1.375, moderado: 1.55, intenso: 1.725, muito_intenso: 1.9 };
  return Math.round(bmr * (multipliers[activity] || 1.55));
}

function ResultCard({ icon, label, value, unit, color, subtitle }) {
  return (
    <View style={styles.resultCard}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={[styles.resultValue, { color }]}>{value}<Text style={styles.resultUnit}>{unit}</Text></Text>
      {subtitle && <Text style={styles.resultSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export default function BodyComposition() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [activity, setActivity] = useState('moderado');

  const bmi = useMemo(() => calculateBMI(parseFloat(weight), parseFloat(height)), [weight, height]);
  const bodyFat = useMemo(() => calculateBodyFat(parseFloat(weight), parseFloat(height), parseInt(age), gender, parseFloat(waist), parseFloat(neck), parseFloat(hip)), [weight, height, age, gender, waist, neck, hip]);
  const tdee = useMemo(() => calculateTDEE(parseFloat(weight), parseFloat(height), parseInt(age), gender, activity), [weight, height, age, gender, activity]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calculator" size={18} color={COLORS.primary} />
        <Text style={styles.title}>COMPOSIÇÃO CORPORAL</Text>
      </View>

      <View style={styles.inputGrid}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PESO (KG)</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="70" placeholderTextColor={COLORS.textMuted} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ALTURA (CM)</Text>
            <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="170" placeholderTextColor={COLORS.textMuted} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IDADE</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="25" placeholderTextColor={COLORS.textMuted} />
          </View>
        </View>

        <View style={styles.genderRow}>
          <TouchableOpacity style={[styles.genderBtn, gender === 'M' && styles.genderActive]} onPress={() => setGender('M')}>
            <Ionicons name="male" size={18} color={gender === 'M' ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.genderText, gender === 'M' && styles.genderTextActive]}>Homem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.genderBtn, gender === 'F' && styles.genderActive]} onPress={() => setGender('F')}>
            <Ionicons name="female" size={18} color={gender === 'F' ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.genderText, gender === 'F' && styles.genderTextActive]}>Mulher</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>MEDIDAS PARA GORDURA CORPORAL (Opcional)</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CINTURA (CM)</Text>
            <TextInput style={styles.input} value={waist} onChangeText={setWaist} keyboardType="numeric" placeholder="80" placeholderTextColor={COLORS.textMuted} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PESCOÇO (CM)</Text>
            <TextInput style={styles.input} value={neck} onChangeText={setNeck} keyboardType="numeric" placeholder="38" placeholderTextColor={COLORS.textMuted} />
          </View>
          {gender === 'F' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>QUADRIL (CM)</Text>
              <TextInput style={styles.input} value={hip} onChangeText={setHip} keyboardType="numeric" placeholder="95" placeholderTextColor={COLORS.textMuted} />
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>NÍVEL DE ATIVIDADE</Text>
        <View style={styles.activityRow}>
          {[
            { key: 'sedentario', label: 'Sedentário' },
            { key: 'leve', label: 'Leve' },
            { key: 'moderado', label: 'Moderado' },
            { key: 'intenso', label: 'Intenso' },
          ].map(a => (
            <TouchableOpacity key={a.key} style={[styles.activityBtn, activity === a.key && styles.activityActive]} onPress={() => setActivity(a.key)}>
              <Text style={[styles.activityText, activity === a.key && styles.activityTextActive]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {(bmi || bodyFat || tdee) && (
        <View style={styles.resultsGrid}>
          {bmi && <ResultCard icon="body" label="IMC" value={bmi.value} unit="" color={bmi.color} subtitle={bmi.category} />}
          {bodyFat && <ResultCard icon="water" label="Gordura" value={bodyFat.value} unit="%" color={COLORS.secondary} subtitle={bodyFat.formula} />}
          {tdee && <ResultCard icon="flame" label="TDEE" value={tdee} unit=" kcal" color={COLORS.primary} subtitle="Calorias/dia" />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  inputGrid: { gap: SPACING.md, marginBottom: SPACING.lg },
  inputRow: { flexDirection: 'row', gap: SPACING.sm },
  inputGroup: { flex: 1 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.xs },
  input: { height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, textAlign: 'center' },
  genderRow: { flexDirection: 'row', gap: SPACING.sm },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  genderActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  genderText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  genderTextActive: { color: COLORS.background },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },
  activityRow: { flexDirection: 'row', gap: SPACING.xs },
  activityBtn: { flex: 1, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  activityActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  activityText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  activityTextActive: { color: COLORS.background },
  resultsGrid: { flexDirection: 'row', gap: SPACING.sm },
  resultCard: { flex: 1, alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, gap: SPACING.xs },
  resultLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  resultValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20 },
  resultUnit: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  resultSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
