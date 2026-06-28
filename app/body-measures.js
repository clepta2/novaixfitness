import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import {
  saveMeasurement, getMeasurements, getLatestMeasurement,
  getMeasurementHistory, deleteMeasurement,
  calculateBMI, getBMICategory,
} from '../src/services/body-measurements';
import { layout, typography } from '../src/styles';
import { MeasurementForm, BMICard, MeasurementChart, MeasurementHistory } from '../src/components';

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
  const [form, setForm] = useState({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
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
        if (__DEV__) console.error('Erro ao carregar:', err);
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
        if (val && key !== 'notes') measurement[key] = parseFloat(val.replace(',', '.'));
      });
      measurement.notes = form.notes;
      if (Object.keys(measurement).filter(k => k !== 'notes').length === 0) {
        Alert.alert('Erro', 'Preencha pelo menos uma medida.'); return;
      }
      await saveMeasurement(user.id, measurement);
      Alert.alert('Sucesso', 'Medidas salvas!');
      setShowForm(false);
      setForm({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
      const [lat, hist] = await Promise.all([getLatestMeasurement(user.id), getMeasurements(user.id)]);
      setLatest(lat); setHistory(hist);
    } catch { Alert.alert('Erro', 'Nao foi possivel salvar.'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Deletar', 'Remover esta medição?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: async () => {
        await deleteMeasurement(id, user.id);
        setHistory(await getMeasurements(user.id));
      }},
    ]);
  };

  const bmi = calculateBMI(latest?.weight, physicalData?.height);
  const bmiCategory = getBMICategory(bmi);

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  emptyCard: { alignItems: 'center', paddingVertical: SPACING.massive, gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
});
