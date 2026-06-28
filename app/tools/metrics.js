// app/tools/metrics.js
// Calculadora de medidas corporais

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';

export default function MetricsScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [gender, setGender] = useState('male');
  const [hasTape, setHasTape] = useState(null);

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const imc = w && h ? (w / ((h / 100) ** 2)).toFixed(1) : null;
  const imcClass = imc ? getIMCClass(parseFloat(imc)) : null;
  const bodyFat = waist && neck && height ? calculateBodyFat(parseFloat(waist), parseFloat(neck), h, gender) : null;
  const whr = waist && hip ? (parseFloat(waist) / parseFloat(hip)).toFixed(2) : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>CALCULADORA DE MEDIDAS</Text>

      <Text style={styles.section}>DADOS BÁSICOS</Text>
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>PESO (kg)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="70" placeholderTextColor={COLORS.textMuted} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>ALTURA (cm)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="175" placeholderTextColor={COLORS.textMuted} />
        </View>
      </View>

      <View style={styles.genderRow}>
        {[{ id: 'male', label: 'Masc' }, { id: 'female', label: 'Fem' }].map(g => (
          <TouchableOpacity key={g.id} style={[styles.genderBtn, gender === g.id && styles.genderActive]} onPress={() => setGender(g.id)}>
            <Text style={[styles.genderText, gender === g.id && styles.genderTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {imc && <ResultCard title="IMC" value={imc} label={imcClass.label} color={imcClass.color} />}

      <Text style={styles.section}>TEM FITA MÉTRICA?</Text>
      <View style={styles.genderRow}>
        {[{ id: true, label: 'Sim' }, { id: false, label: 'Não' }].map(o => (
          <TouchableOpacity key={String(o.id)} style={[styles.genderBtn, hasTape === o.id && styles.genderActive]} onPress={() => setHasTape(o.id)}>
            <Text style={[styles.genderText, hasTape === o.id && styles.genderTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {hasTape && (
        <>
          <Text style={styles.section}>MEDIDAS</Text>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>PESCOÇO</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={neck} onChangeText={setNeck} placeholder="38cm" placeholderTextColor={COLORS.textMuted} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>CINTURA</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={waist} onChangeText={setWaist} placeholder="80cm" placeholderTextColor={COLORS.textMuted} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>QUADRIL</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={hip} onChangeText={setHip} placeholder="95cm" placeholderTextColor={COLORS.textMuted} />
            </View>
            <View style={styles.field} />
          </View>
          {bodyFat && <ResultCard title="GORDURA CORPORAL" value={bodyFat + '%'} label={getBodyFatClass(bodyFat, gender)} color={COLORS.primary} />}
          {whr && <ResultCard title="RATIO CINTURA/QUADRIL" value={whr} label={getWHRClass(whr, gender)} color={parseFloat(whr) > (gender === 'male' ? 0.9 : 0.8) ? COLORS.warning : COLORS.success} />}
        </>
      )}
    </ScrollView>
  );
}

function ResultCard({ title, value, label, color }) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>{title}</Text>
      <Text style={[styles.resultValue, { color }]}>{value}</Text>
      <Text style={styles.resultLabel}>{label}</Text>
    </View>
  );
}

function getIMCClass(imc) {
  if (imc < 18.5) return { label: 'Abaixo do peso', color: '#3B82F6' };
  if (imc < 25) return { label: 'Normal', color: '#00E676' };
  if (imc < 30) return { label: 'Sobrepeso', color: '#FF9800' };
  return { label: 'Obesidade', color: '#FF5722' };
}

function calculateBodyFat(waist, neck, height, gender) {
  if (gender === 'male') return (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1);
  return (495 / (1.29579 - 0.35004 * Math.log10(waist + (waist * 1.1) - neck) + 0.22100 * Math.log10(height)) - 450).toFixed(1);
}

function getBodyFatClass(bf, gender) {
  if (gender === 'male') { if (bf < 6) return 'Essencial'; if (bf < 14) return 'Atleta'; if (bf < 18) return 'Fitness'; if (bf < 25) return 'Normal'; return 'Acima'; }
  if (bf < 14) return 'Essencial'; if (bf < 21) return 'Atleta'; if (bf < 25) return 'Fitness'; if (bf < 32) return 'Normal'; return 'Acima';
}

function getWHRClass(whr, gender) {
  if (gender === 'male') return whr < 0.9 ? 'Saudável' : 'Risco';
  return whr < 0.8 ? 'Saudável' : 'Risco';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.xl },
  section: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: SPACING.xl, marginBottom: SPACING.md },
  row: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  field: { flex: 1 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.xs },
  input: { height: 44, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_500Medium', fontSize: 14 },
  genderRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  genderBtn: { flex: 1, height: 44, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  genderActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  genderText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  genderTextActive: { color: COLORS.primary },
  resultCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginTop: SPACING.md, alignItems: 'center' },
  resultTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase' },
  resultValue: { fontFamily: 'Montserrat_700Bold', fontSize: 32, marginTop: SPACING.sm },
  resultLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
});
