// app/body-measures.js
// Tela de Medidas Corporais - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import {
  saveMeasurement, getMeasurements, getLatestMeasurement,
  getMeasurementHistory, deleteMeasurement,
  calculateBMI, getBMICategory, calculateProgress, MEASUREMENT_TYPES,
} from '../src/services/body-measurements';
import { layout, typography } from '../src/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BodyMeasuresScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedChart, setSelectedChart] = useState('weight');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '',
  });

  const [physicalData, setPhysicalData] = useState({});

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      try {
        const [lat, hist, profile] = await Promise.all([
          getLatestMeasurement(user.id),
          getMeasurements(user.id),
          supabase.from('profiles').select('physical_data, onboarding').eq('id', user.id).single(),
        ]);
        setLatest(lat);
        setHistory(hist);
        setPhysicalData(profile.data?.physical_data || profile.data?.onboarding || {});
      } catch (err) {
        console.error('Erro ao carregar:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  useEffect(() => {
    async function loadChart() {
      if (!user?.id) return;
      const data = await getMeasurementHistory(user.id, selectedChart);
      setChartData(data);
    }
    loadChart();
  }, [user?.id, selectedChart]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const measurement = {};
      Object.entries(form).forEach(([key, val]) => {
        if (val && key !== 'notes') {
          measurement[key] = parseFloat(val.replace(',', '.'));
        }
      });
      measurement.notes = form.notes;

      if (Object.keys(measurement).filter(k => k !== 'notes').length === 0) {
        Alert.alert('Erro', 'Preencha pelo menos uma medida.');
        return;
      }

      await saveMeasurement(user.id, measurement);
      Alert.alert('Sucesso', 'Medidas salvas!');
      setShowForm(false);
      setForm({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });

      const [lat, hist] = await Promise.all([
        getLatestMeasurement(user.id),
        getMeasurements(user.id),
      ]);
      setLatest(lat);
      setHistory(hist);
    } catch (err) {
      Alert.alert('Erro', 'Nao foi possivel salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Deletar', 'Remover esta medição?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar', style: 'destructive',
        onPress: async () => {
          await deleteMeasurement(id, user.id);
          const hist = await getMeasurements(user.id);
          setHistory(hist);
        },
      },
    ]);
  };

  const bmi = calculateBMI(latest?.weight, physicalData?.height);
  const bmiCategory = getBMICategory(bmi);

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
    labelColor: () => COLORS.textMuted,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Medidas Corporais</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)}>
            <Ionicons name={showForm ? 'close' : 'add'} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {showForm ? (
          <View style={styles.formCard}>
            <Text style={typography.h5}>NOVA MEDIÇÃO</Text>
            {MEASUREMENT_TYPES.map((m) => (
              <View key={m.key} style={styles.formRow}>
                <Text style={styles.formLabel}>{m.label} ({m.unit})</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  value={form[m.key]}
                  onChangeText={(v) => setForm({ ...form, [m.key]: v })}
                />
              </View>
            ))}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Notas</Text>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                placeholder="Observações..."
                placeholderTextColor={COLORS.textMuted}
                value={form.notes}
                onChangeText={(v) => setForm({ ...form, notes: v })}
                multiline
              />
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              <Text style={typography.button}>{saving ? 'Salvando...' : 'SALVAR MEDIÇÕES'}</Text>
            </TouchableOpacity>
          </View>
        ) : latest ? (
          <>
            <View style={styles.bmiCard}>
              <View style={styles.bmiInfo}>
                <Text style={typography.label}>IMC</Text>
                <Text style={[styles.bmiValue, { color: bmiCategory.color }]}>{bmi}</Text>
                <Text style={[styles.bmiCategory, { color: bmiCategory.color }]}>{bmiCategory.label}</Text>
              </View>
              <View style={styles.bmiDetails}>
                {MEASUREMENT_TYPES.slice(0, 4).map((m) => {
                  const val = latest[m.key];
                  return val ? (
                    <View key={m.key} style={styles.bmiDetailRow}>
                      <Text style={typography.caption}>{m.label}</Text>
                      <Text style={typography.h5}>{val} {m.unit}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </View>

            <View style={styles.chartSelector}>
              {MEASUREMENT_TYPES.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.chartBtn, selectedChart === m.key && styles.chartBtnActive]}
                  onPress={() => setSelectedChart(m.key)}
                >
                  <Text style={[typography.caption, selectedChart === m.key && styles.chartBtnText]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {chartData.length > 1 && (
              <View style={styles.chartCard}>
                <LineChart
                  data={{
                    labels: chartData.map(d => d.date),
                    datasets: [{ data: chartData.map(d => d.value) }],
                  }}
                  width={SCREEN_WIDTH - 80}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  fromZero
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="body-outline" size={48} color={COLORS.textMuted} />
            <Text style={typography.h5}>Nenhuma medida registrada</Text>
            <Text style={typography.bodyMuted}>Adicione suas primeiras medidas</Text>
          </View>
        )}

        <View style={styles.historySection}>
          <Text style={typography.label}>HISTÓRICO</Text>
          {history.slice(0, 10).map((m) => (
            <View key={m.id} style={styles.historyItem}>
              <View style={styles.historyDate}>
                <Ionicons name="calendar" size={16} color={COLORS.textMuted} />
                <Text style={typography.caption}>{new Date(m.recorded_at).toLocaleDateString('pt-BR')}</Text>
              </View>
              <View style={styles.historyValues}>
                {m.weight && <Text style={styles.historyValue}>{m.weight} kg</Text>}
                {m.waist && <Text style={styles.historyValue}>{m.waist} cm</Text>}
                {m.chest && <Text style={styles.historyValue}>{m.chest} cm</Text>}
              </View>
              <TouchableOpacity onPress={() => handleDelete(m.id)}>
                <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  formCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  formRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  formLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, width: 120 },
  formInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: 8, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, borderWidth: 1, borderColor: COLORS.border, marginLeft: SPACING.md },
  formInputMultiline: { height: 60, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  bmiCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  bmiInfo: { alignItems: 'center', paddingRight: SPACING.xl, borderRightWidth: 1, borderRightColor: COLORS.border },
  bmiValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32 },
  bmiCategory: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  bmiDetails: { flex: 1, paddingLeft: SPACING.lg, gap: SPACING.sm },
  bmiDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chartSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.xl },
  chartBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  chartBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chartBtnText: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  emptyCard: { alignItems: 'center', paddingVertical: SPACING.massive, gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  historySection: { gap: SPACING.sm },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  historyDate: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 100 },
  historyValues: { flex: 1, flexDirection: 'row', gap: SPACING.md },
  historyValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.primary },
});
