
// app/body-measures.tsx
// Medidas corporais com graficos animados - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import {
  saveMeasurement, getMeasurements, getLatestMeasurement,
  getMeasurementHistory, deleteMeasurement,
} from '../src/services/body-measurements';
import { layout, typography } from '../src/styles';
import { MeasurementForm, ErrorBoundary, Loading, EmptyState, ProgressRing } from '../src/components';
import { useI18n } from '../src/i18n';
import { useResponsive } from '../src/hooks/useResponsive';

export default function BodyMeasuresScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedChart, setSelectedChart] = useState('weight');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

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
        const [lat, hist] = await Promise.all([
          getLatestMeasurement(user.id),
          getMeasurements(user.id),
        ]);
        setLatest(lat);
        setHistory(hist);
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
      const measurement: Record<string, any> = {};
      Object.entries(form).forEach(([key, val]) => {
        if (val && key !== 'notes') measurement[key] = parseFloat(val.replace(',', '.'));
      });
      measurement.notes = form.notes;
      if (Object.keys(measurement).filter(k => k !== 'notes').length === 0) {
        Alert.alert(t('common.error'), t('bodyMeasures.fillAtLeastOne'));
        return;
      }
      await saveMeasurement(user.id, measurement);
      Alert.alert(t('common.success'), t('bodyMeasures.saved'));
      setShowForm(false);
      setForm({ weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '', body_fat: '', notes: '' });
      const [lat, hist] = await Promise.all([getLatestMeasurement(user.id), getMeasurements(user.id)]);
      setLatest(lat);
      setHistory(hist);
    } catch {
      Alert.alert(t('common.error'), t('bodyMeasures.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={layout.screen}>
        <View style={styles.loadingContainer}>
          <Loading variant="pulse" />
        </View>
      </View>
    );
  }

  const bmi = latest?.weight && latest?.height ? (latest.weight / ((latest.height / 100) ** 2)).toFixed(1) : null;

  return (
    <ErrorBoundary screenName="BodyMeasures">
      <ScrollView style={layout.screen} contentContainerStyle={layout.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 20 : 24 }]}>Medidas Corporais</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addBtn}>
            <Ionicons name="add" size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* BMI Card */}
          {bmi && (
            <View style={styles.bmiCard}>
              <View style={styles.bmiHeader}>
                <Text style={styles.bmiTitle}>IMC</Text>
                <Text style={[styles.bmiValue, { color: bmi < 18.5 ? COLORS.info : bmi < 25 ? COLORS.success : bmi < 30 ? COLORS.attention : COLORS.error }]}>
                  {bmi}
                </Text>
              </View>
              <View style={styles.bmiBar}>
                <View style={[styles.bmiFill, { width: `${Math.min(100, (bmi / 40) * 100)}%`, backgroundColor: bmi < 18.5 ? COLORS.info : bmi < 25 ? COLORS.success : bmi < 30 ? COLORS.attention : COLORS.error }]} />
              </View>
            </View>
          )}

          {/* Latest measurements */}
          {latest && (
            <View style={styles.latestCard}>
              <Text style={styles.latestTitle}>Ultima Medicao</Text>
              <View style={styles.latestGrid}>
                {latest.weight && (
                  <View style={styles.latestItem}>
                    <Ionicons name="scale" size={20} color={COLORS.primary} />
                    <Text style={styles.latestValue}>{latest.weight} kg</Text>
                    <Text style={styles.latestLabel}>Peso</Text>
                  </View>
                )}
                {latest.chest && (
                  <View style={styles.latestItem}>
                    <Ionicons name="body" size={20} color={COLORS.success} />
                    <Text style={styles.latestValue}>{latest.chest} cm</Text>
                    <Text style={styles.latestLabel}>Peito</Text>
                  </View>
                )}
                {latest.waist && (
                  <View style={styles.latestItem}>
                    <Ionicons name="resize" size={20} color={COLORS.attention} />
                    <Text style={styles.latestValue}>{latest.waist} cm</Text>
                    <Text style={styles.latestLabel}>Cintura</Text>
                  </View>
                )}
                {latest.body_fat && (
                  <View style={styles.latestItem}>
                    <Ionicons name="water" size={20} color={COLORS.info} />
                    <Text style={styles.latestValue}>{latest.body_fat}%</Text>
                    <Text style={styles.latestLabel}>Gordura</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Chart selector */}
          <View style={styles.chartSelector}>
            {['weight', 'chest', 'waist', 'hips'].map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.chartBtn, selectedChart === key && styles.chartBtnActive]}
                onPress={() => setSelectedChart(key)}
              >
                <Text style={[styles.chartBtnText, selectedChart === key && styles.chartBtnTextActive]}>
                  {key === 'weight' ? 'Peso' : key === 'chest' ? 'Peito' : key === 'waist' ? 'Cintura' : 'Quadril'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* History */}
          {history.length > 0 ? (
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Historico</Text>
              {history.slice(0, 5).map((item, i) => (
                <View key={item.id || i} style={[styles.historyItem, { opacity: Math.min(1, 0.5 + i * 0.1) }]}>
                  <View style={styles.historyDate}>
                    <Ionicons name="calendar" size={16} color={COLORS.textMuted} />
                    <Text style={styles.historyDateText}>
                      {new Date(item.recorded_at).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View style={styles.historyValues}>
                    {item.weight && <Text style={styles.historyValue}>{item.weight} kg</Text>}
                    {item.chest && <Text style={styles.historyValue}>{item.chest} cm</Text>}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="body-outline"
              title="Nenhuma medida"
              message="Adicione sua primeira medida corporal."
            />
          )}
        </Animated.View>
      </ScrollView>

      {/* Form modal */}
      {showForm && (
        <MeasurementForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          saving={saving}
          onClose={() => setShowForm(false)}
        />
      )}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // BMI
  bmiCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  bmiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  bmiTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  bmiValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  bmiBar: { height: 8, backgroundColor: COLORS.surfaceElevated, borderRadius: 4, overflow: 'hidden' },
  bmiFill: { height: '100%', borderRadius: 4 },

  // Latest
  latestCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  latestTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  latestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  latestItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  latestValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  latestLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },

  // Chart selector
  chartSelector: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  chartBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chartBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chartBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  chartBtnTextActive: { color: COLORS.background },

  // History
  historySection: { marginTop: SPACING.md },
  historyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  historyDate: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  historyDateText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  historyValues: { flexDirection: 'row', gap: SPACING.md },
  historyValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
});
