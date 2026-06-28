// src/components/nutrition/NutritionCalculator.js
// Calculadora interativa de metas nutricionais - NOVAIX FITNESS

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const GOALS = [
  { key: 'emagrecer', label: 'Emagrecer', icon: 'trending-down', color: COLORS.info },
  { key: 'manter', label: 'Manter', icon: 'remove', color: COLORS.success },
  { key: 'ganhar', label: 'Ganhar Massa', icon: 'trending-up', color: COLORS.primary },
];

function calculateGoals(weight, height, age, gender, goal) {
  let bmr;
  if (gender === 'M') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  const activityMultiplier = 1.55;
  let tdee = bmr * activityMultiplier;

  const multipliers = { emagrecer: 0.8, manter: 1, ganhar: 1.2 };
  const proteinPerKg = { emagrecer: 2.2, manter: 1.8, ganhar: 2.0 };

  const calories = Math.round(tdee * (multipliers[goal] || 1));
  const protein = Math.round(weight * (proteinPerKg[goal] || 1.8));
  const fat = Math.round(calories * 0.25 / 9);
  const carbs = Math.max(0, Math.round((calories - (protein * 4) - (fat * 9)) / 4));

  return { calories, protein, carbs, fat, bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

export default function NutritionCalculator({ onApply }) {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('M');
  const [goal, setGoal] = useState('manter');

  const goals = useMemo(() => {
    const w = parseFloat(weight) || 70;
    const h = parseFloat(height) || 170;
    const a = parseInt(age) || 25;
    return calculateGoals(w, h, a, gender, goal);
  }, [weight, height, age, gender, goal]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CALCULADORA DE METAS</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PESO (KG)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ALTURA (CM)</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IDADE</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.genderRow}>
        <TouchableOpacity style={[styles.genderBtn, gender === 'M' && styles.genderActive]} onPress={() => setGender('M')}>
          <Ionicons name="male" size={20} color={gender === 'M' ? COLORS.background : COLORS.textMuted} />
          <Text style={[styles.genderText, gender === 'M' && styles.genderTextActive]}>Homem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genderBtn, gender === 'F' && styles.genderActive]} onPress={() => setGender('F')}>
          <Ionicons name="female" size={20} color={gender === 'F' ? COLORS.background : COLORS.textMuted} />
          <Text style={[styles.genderText, gender === 'F' && styles.genderTextActive]}>Mulher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalRow}>
        {GOALS.map(g => (
          <TouchableOpacity key={g.key} style={[styles.goalBtn, goal === g.key && { backgroundColor: g.color }]} onPress={() => setGoal(g.key)}>
            <Ionicons name={g.icon} size={18} color={goal === g.key ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.goalText, goal === g.key && styles.goalTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.results}>
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{goals.calories}</Text>
            <Text style={styles.resultLabel}>kcal/dia</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={[styles.resultValue, { color: COLORS.success }]}>{goals.protein}g</Text>
            <Text style={styles.resultLabel}>Proteína</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={[styles.resultValue, { color: COLORS.primary }]}>{goals.carbs}g</Text>
            <Text style={styles.resultLabel}>Carbos</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={[styles.resultValue, { color: COLORS.secondary }]}>{goals.fat}g</Text>
            <Text style={styles.resultLabel}>Gordura</Text>
          </View>
        </View>

        {onApply && (
          <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(goals)}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.background} />
            <Text style={styles.applyText}>APLICAR METAS</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.lg },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  inputGroup: { flex: 1 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.xs },
  input: { height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, textAlign: 'center' },
  genderRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  genderActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  genderText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  genderTextActive: { color: COLORS.background },
  goalRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  goalBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  goalText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  goalTextActive: { color: COLORS.background },
  results: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg },
  resultRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.md },
  resultItem: { alignItems: 'center' },
  resultValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.primary },
  resultLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  applyText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
