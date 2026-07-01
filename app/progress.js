import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { getProgressPhotos } from '../src/services/progress-photos';
import { getMeasurements } from '../src/services/body-measurements';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import { ErrorBoundary } from '../src/components';
import BottomTabBar from '../src/components/ui/BottomTabBar';
import ProgressTabs from '../src/components/progress/ProgressTabs';
import ProgressOverview from '../src/components/progress/ProgressOverview';
import ProgressMeasurements from '../src/components/progress/ProgressMeasurements';
import ProgressPhotosTab from '../src/components/progress/ProgressPhotos';
import ProgressWeekly from '../src/components/progress/ProgressWeekly';

export default function ProgressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [latest, setLatest] = useState(null);
  const [previous, setPrevious] = useState(null);

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

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ErrorBoundary screenName="Progress">
      <View style={layout.screen}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        >
          <View style={layout.header}>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
              <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
            </TouchableOpacity>
            <Text style={typography.h2}>MEU PROGRESSO</Text>
            <View style={{ width: 24 }} />
          </View>

          <ProgressTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'overview' && (
            <ProgressOverview photos={photos} measurements={measurements} latest={latest} previous={previous} onNavigate={handleNavigate} />
          )}

          {activeTab === 'measurements' && (
            <ProgressMeasurements userId={user?.id} />
          )}

          {activeTab === 'photos' && (
            <ProgressPhotosTab userId={user?.id} />
          )}

          {activeTab === 'weekly' && (
            <ProgressWeekly userId={user?.id} />
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
        <BottomTabBar activeTab="perfil" />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
});
