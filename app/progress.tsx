
// app/progress.tsx
// Progresso com timeline animado - NOVAIX FITNESS

import { useState, useEffect, useCallback, useMemo , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { useAuth } from '../src/context/AuthContext';
import { getProgressPhotos } from '../src/services/progress-photos';
import { getMeasurements } from '../src/services/body-measurements';
import { layout, typography } from '../src/styles';
import { ErrorBoundary, BottomTabBar, ProgressTabs, ProgressOverview, ProgressMeasurements, ProgressWeekly, Loading, EmptyState, StatsCard } from '../src/components';

const ProgressPhotosTab = ({ userId }: { userId?: string }) => null;
import { useResponsive } from '../src/hooks/useResponsive';

export default function ProgressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [latest, setLatest] = useState(null);
  const [previous, setPrevious] = useState(null);

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [photosData, measurementsData] = await Promise.all([
        getProgressPhotos(user.id),
        getMeasurements(user.id),
      ]);
      setPhotos(photosData);
      setMeasurements(measurementsData);
      setLatest(measurementsData[0] || null);
      setPrevious(measurementsData[1] || null);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar progresso:', err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  return (
    <ErrorBoundary screenName="Progress">
      <View style={layout.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 20 : 24 }]}>Meu Progresso</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {[
            { key: 'overview', label: 'Visao Geral', icon: 'stats-chart' },
            { key: 'measurements', label: 'Medidas', icon: 'body' },
            { key: 'photos', label: 'Fotos', icon: 'camera' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.key ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {activeTab === 'overview' && (
              <View>
                {/* Stats resumidos */}
                {latest && (
                  <View style={styles.statsRow}>
                    <StatsCard icon="scale" value={latest.weight || '--'} label="Peso" color={COLORS.primary} suffix="kg" />
                    <StatsCard icon="body" value={latest.chest || '--'} label="Peito" color={COLORS.success} suffix="cm" />
                    <StatsCard icon="resize" value={latest.waist || '--'} label="Cintura" color={COLORS.attention} suffix="cm" />
                  </View>
                )}
                <ProgressOverview photos={photos as any} measurements={measurements as any} latest={latest} previous={previous} onNavigate={(tab: string) => setActiveTab(tab)} />
              </View>
            )}

            {activeTab === 'measurements' && (
              <ProgressMeasurements userId={user?.id} />
            )}

            {activeTab === 'photos' && (
              <ProgressPhotosTab userId={user?.id} />
            )}
          </Animated.View>
        </ScrollView>

        <BottomTabBar activeTab="progress" />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  tabActive: { backgroundColor: COLORS.primary + '15' },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  scroll: { flexGrow: 1, padding: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
});
