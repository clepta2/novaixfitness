
import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { ErrorBoundary, DeviceCard, HeartRateWidget, ActivitySummary } from '../src/components';
import { checkWatchAvailability, connectWatch, isWatchConnected, getWatchHeartRate } from '../src/services/appleWatch';
import { checkHealthAvailability, requestHealthPermissions, getHealthStats, getStepsToday, getCaloriesBurnedToday } from '../src/services/healthConnect';
import { checkStravaAvailability, connectStrava, isStravaConnected, syncRunningActivities, disconnectStrava } from '../src/services/strava';
import { useAuth } from '../src/context/AuthContext';
import { useI18n } from '../src/i18n';

const STRIDE_LENGTH_CM = 0.415;

export default function WearablesScreen() {
  const router = useRouter();
  const { t } = useI18n();
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

  const handleSync = useCallback(async (type) => {
    setSyncing(type);
    if (type === 'strava') await syncRunningActivities();
    if (type === 'watch') await getWatchHeartRate();
    if (type === 'health') await init();
    const timeout = setTimeout(() => setSyncing(null), 1500);
    return () => clearTimeout(timeout);
  }, [init]);

  const devices = [
    { name: t('wearables.appleWatch'), type: 'watch', connected: wConn, battery: wConn ? 85 : null, lastSync: wConn ? new Date().toISOString() : null, subtitle: wAvail ? (Platform.OS === 'ios' ? t('wearables.appleWatchAvailable') : t('wearables.notAvailable')) : t('wearables.notAvailable') },
    { name: t('wearables.healthConnect'), type: 'health', connected: hConn, lastSync: hConn ? new Date().toISOString() : null, subtitle: hAvail ? (Platform.OS === 'android' ? t('wearables.healthConnect') : t('wearables.appleHealth')) : t('wearables.notAvailable') },
    { name: t('wearables.strava'), type: 'strava', connected: sConn, lastSync: sConn ? new Date().toISOString() : null, subtitle: sAvail ? t('wearables.runningAndActivities') : t('wearables.notAvailable') },
  ];

  return (
    <ErrorBoundary screenName="Wearables">
      <View style={s.screen}>
        <View style={s.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} onPress={() => router.back()} accessibilityLabel={t('common.back')} />
          <Text style={s.headerTitle}>{t('wearables.title')}</Text>
        </View>
        {loading ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={s.loadingText}>{t('wearables.loadingDevices')}</Text>
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
