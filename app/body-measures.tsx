// app/body-measures.tsx
// Medidas corporais com graficos animados - NOVAIX FITNESS

import { useState, useEffect, useMemo , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { saveMeasurement, getMeasurements, getLatestMeasurement, getMeasurementHistory } from '../src/services/body-measurements';
import { layout, typography } from '../src/styles';
import { MeasurementForm, ErrorBoundary, Loading, EmptyState } from '../src/components';
import BmiCard from '../src/components/body-measures/BmiCard';
import LatestMeasurements from '../src/components/body-measures/LatestMeasurements';
import MeasurementHistory from '../src/components/body-measures/MeasurementHistory';
import { useI18n } from '../src/i18n';
import { useResponsive } from '../src/hooks/useResponsive';

export default function BodyMeasuresScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [latest, setLatest] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedChart, setSelectedChart] = useState('weight');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      try {
        const [lat, hist] = await Promise.all([getLatestMeasurement(user.id), getMeasurements(user.id)]);
        setLatest(lat); setHistory(hist);
      } catch (err) { if (__DEV__) console.error('Erro ao carregar:', err); }
      finally { setLoading(false); }
    }
    load();
  }, [user?.id]);

  useEffect(() => {
    async function loadChart() {
      if (!user?.id) return;
      setChartData(await getMeasurementHistory(user.id, selectedChart));
    }
    loadChart();
  }, [user?.id, selectedChart]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const measurement: Record<string, any> = {};
      Object.entries(form).forEach(([key, val]) => {
        if (val && key !== 'notes') measurement[key] = parseFloat(val.replace(',', '.'));
      });
      measurement.notes = form.notes;
      if (Object.keys(measurement).filter(k => k !== 'notes').length === 0) {
        Alert.alert(t('common.error'), t('bodyMeasures.fillAtLeastOne')); return;
      }
      await saveMeasurement(user.id, measurement);
      Alert.alert(t('common.success'), t('bodyMeasures.saved'));
      setShowForm(false);
      setForm({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
      const [lat, hist] = await Promise.all([getLatestMeasurement(user.id), getMeasurements(user.id)]);
      setLatest(lat); setHistory(hist);
    } catch { Alert.alert(t('common.error'), t('bodyMeasures.saveError')); }
    finally { setSaving(false); }
  };

  if (loading) return <View style={layout.screen}><View style={styles.loadingContainer}><Loading variant="pulse" /></View></View>;

  const bmi = latest?.weight && latest?.height ? (latest.weight / ((latest.height / 100) ** 2)).toFixed(1) : null;
  const chartKeys = [
    { key: 'weight', label: 'Peso' }, { key: 'chest', label: 'Peito' },
    { key: 'waist', label: 'Cintura' }, { key: 'hips', label: 'Quadril' },
  ];

  return (
    <ErrorBoundary screenName="BodyMeasures">
      <ScrollView style={layout.screen} contentContainerStyle={layout.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.textTitle} /></TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 20 : 24 }]}>Medidas Corporais</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addBtn}><Ionicons name="add" size={20} color={COLORS.background} /></TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {bmi && <BmiCard bmi={bmi} />}
          {latest && <LatestMeasurements data={latest} />}

          <View style={styles.chartSelector}>
            {chartKeys.map((c) => (
              <TouchableOpacity key={c.key} style={[styles.chartBtn, selectedChart === c.key && styles.chartBtnActive]} onPress={() => setSelectedChart(c.key)}>
                <Text style={[styles.chartBtnText, selectedChart === c.key && styles.chartBtnTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {history.length > 0 ? (
            <MeasurementHistory items={history} />
          ) : (
            <EmptyState icon="body-outline" title="Nenhuma medida" message="Adicione sua primeira medida corporal." />
          )}
        </Animated.View>
      </ScrollView>

      {showForm && <MeasurementForm form={form} onChangeForm={setForm} onSave={handleSave} saving={saving} />}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chartSelector: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  chartBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chartBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chartBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  chartBtnTextActive: { color: COLORS.background },
});
