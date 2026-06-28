import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { ErrorBoundary, DeviceCard, HeartRateWidget, ActivitySummary } from '../src/components';
import { checkWatchAvailability, connectWatch, isWatchConnected, getWatchHeartRate } from '../src/services/appleWatch';
import { checkHealthAvailability, requestHealthPermissions, getHealthStats, getStepsToday, getCaloriesBurnedToday } from '../src/services/healthConnect';
import { checkStravaAvailability, connectStrava, isStravaConnected, syncRunningActivities, disconnectStrava } from '../src/services/strava';
import { useAuth } from '../src/context/AuthContext';

const WATCH_SUB = Platform.OS === 'ios' ? 'Apple Watch disponível' : 'Não disponível';
const HEALTH_SUB = Platform.OS === 'android' ? 'Health Connect' : Platform.OS === 'ios' ? 'Apple Health' : 'Não disponível';
const STRIDE_LENGTH_CM = 0.415;

export default function WearablesScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(null);
  const [wAvail, setWAvail] = useState(false);
  const [hAvail, setHAvail] = useState(false);
  const [sAvail, setSAvail] = useState(false);
  const [wConn, setWConn] = useState(false);
  const [hConn, setHConn] = useState(false);
  const [sConn, setSConn] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const [restingHR, setRestingHR] = useState(null);
  const [maxHR, setMaxHR] = useState(null);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);

  const init = useCallback(async () => {
    try {
      const [w, h, s] = await Promise.allSettled([checkWatchAvailability(), checkHealthAvailability(), checkStravaAvailability()]);
      setWAvail(w.status === 'fulfilled' && w.value.available);
      setHAvail(h.status === 'fulfilled' && h.value.available);
      setSAvail(s.status === 'fulfilled' && s.value.available);
      setWConn(isWatchConnected()); setSConn(isStravaConnected());
      if (h.status === 'fulfilled' && h.value.available) {
        const p = await requestHealthPermissions();
        setHConn(p.granted);
      }
      const [hr, st, cal] = await Promise.allSettled([getWatchHeartRate(), getStepsToday(), getCaloriesBurnedToday()]);
      if (hr.status === 'fulfilled' && hr.value) { setHeartRate(hr.value); setRestingHR(62); setMaxHR(185); }
      setSteps(st.status === 'fulfilled' ? st.value : 0);
      setCalories(cal.status === 'fulfilled' ? cal.value : 0);
      const stepsCount = st.status === 'fulfilled' ? st.value : 0;
      const height = profile?.physical_data?.height || 0;
      setDistance(height > 0 ? stepsCount * (height * STRIDE_LENGTH_CM / 100000) : 0);
      const stats = await getHealthStats();
      if (stats?.heartRate) setHeartRate(stats.heartRate);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar wearables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { init(); }, [init]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await init();
    setRefreshing(false);
  }, [init]);

  const handleToggle = async (type) => {
    if (type === 'watch') { const r = await connectWatch(); setWConn(r.connected); }
    else if (type === 'strava') { if (sConn) { await disconnectStrava(); setSConn(false); } else { const r = await connectStrava(); if (r.started) setSConn(true); } }
    else if (type === 'health') { if (hConn) { setHConn(false); } else { const p = await requestHealthPermissions(); setHConn(p.granted); } }
  };

  const handleSync = async (type) => {
    setSyncing(type);
    if (type === 'strava') await syncRunningActivities();
    if (type === 'watch') await getWatchHeartRate();
    if (type === 'health') await init();
    setTimeout(() => setSyncing(null), 1500);
  };

  const devices = [
    { name: 'Apple Watch', type: 'watch', connected: wConn, battery: wConn ? 85 : null, lastSync: wConn ? new Date().toISOString() : null, subtitle: wAvail ? WATCH_SUB : 'Não disponível' },
    { name: 'Health Connect', type: 'health', connected: hConn, lastSync: hConn ? new Date().toISOString() : null, subtitle: hAvail ? HEALTH_SUB : 'Não disponível' },
    { name: 'Strava', type: 'strava', connected: sConn, lastSync: sConn ? new Date().toISOString() : null, subtitle: sAvail ? 'Corridas e atividades' : 'Não disponível' },
  ];

  return (
    <ErrorBoundary screenName="Wearables">
      <View style={s.screen}>
        <View style={s.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} onPress={() => router.back()} accessibilityLabel="Voltar" />
          <Text style={s.headerTitle}>WEARABLES E DISPOSITIVOS</Text>
        </View>
        {loading ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={s.loadingText}>Carregando dispositivos...</Text>
          </View>
        ) : (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>
            {devices.map((d) => (<DeviceCard key={d.type} device={d} onToggle={handleToggle} onSync={handleSync} syncing={syncing} />))}
            <HeartRateWidget bpm={heartRate} restingHR={restingHR} maxHR={maxHR} />
            <ActivitySummary steps={steps} stepsGoal={profile?.physical_data?.daily_steps_goal || 8000} calories={calories} caloriesGoal={profile?.physical_data?.daily_calories_goal || 500} distance={distance} />
          </ScrollView>
        )}
      </View>
    </ErrorBoundary>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxxl + SPACING.lg, paddingBottom: SPACING.md, gap: SPACING.md },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.massive },
});
