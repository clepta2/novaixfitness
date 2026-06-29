import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { MeasurementForm, BMICard, MeasurementChart, MeasurementHistory } from '../index';
import { saveMeasurement, getMeasurements, getLatestMeasurement, getMeasurementHistory, deleteMeasurement, calculateBMI, getBMICategory } from '../../services/body-measurements';
import { supabase } from '../../config/supabase';

export default function ProgressMeasurements({ userId }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedChart, setSelectedChart] = useState('weight');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
  const [physicalData, setPhysicalData] = useState({});

  useEffect(() => {
    async function load() {
      if (!userId) return;
      try {
        const [lat, hist, profile] = await Promise.all([
          getLatestMeasurement(userId),
          getMeasurements(userId),
          supabase.from('profiles').select('physical_data, onboarding').eq('id', userId).single(),
        ]);
        setLatest(lat);
        setHistory(hist);
        setPhysicalData(profile.data?.physical_data || profile.data?.onboarding || {});
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  useEffect(() => {
    async function loadChart() {
      if (!userId) return;
      const data = await getMeasurementHistory(userId, selectedChart);
      setChartData(data);
    }
    loadChart();
  }, [userId, selectedChart]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const measurement = {};
      Object.entries(form).forEach(([key, val]) => {
        if (val && key !== 'notes') measurement[key] = parseFloat(val.replace(',', '.'));
      });
      measurement.notes = form.notes;
      if (Object.keys(measurement).filter(k => k !== 'notes').length === 0) {
        Alert.alert('Erro', 'Preencha pelo menos uma medida.'); return;
      }
      await saveMeasurement(userId, measurement);
      Alert.alert('Sucesso', 'Medidas salvas!');
      setShowForm(false);
      setForm({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
      const [lat, hist] = await Promise.all([getLatestMeasurement(userId), getMeasurements(userId)]);
      setLatest(lat); setHistory(hist);
    } catch { Alert.alert('Erro', 'Nao foi possivel salvar.'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Deletar', 'Remover esta medição?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: async () => {
        await deleteMeasurement(id, userId);
        setHistory(await getMeasurements(userId));
      }},
    ]);
  };

  const bmi = calculateBMI(latest?.weight, physicalData?.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <View>
      <View style={styles.header}>
        <Text style={typography.label}>MEDIDAS CORPORAIS</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Ionicons name={showForm ? 'close' : 'add'} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {showForm ? (
        <MeasurementForm form={form} onChangeForm={setForm} onSave={handleSave} saving={saving} />
      ) : latest ? (
        <>
          <BMICard bmi={bmi} bmiCategory={bmiCategory} latest={latest} />
          <MeasurementChart selectedChart={selectedChart} onSelectChart={setSelectedChart} chartData={chartData} />
        </>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="body-outline" size={48} color={COLORS.textMuted} />
          <Text style={typography.h5}>Nenhuma medida registrada</Text>
          <Text style={typography.bodyMuted}>Adicione suas primeiras medidas</Text>
        </View>
      )}

      <MeasurementHistory history={history} onDelete={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  emptyCard: { alignItems: 'center', paddingVertical: SPACING.xl * 2, gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
});
