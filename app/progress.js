import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { getProgressPhotos } from '../src/services/progress-photos';
import { getMeasurements, getLatestMeasurement, calculateBMI } from '../src/services/body-measurements';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import { ErrorBoundary } from '../src/components';
import ProgressHero from '../src/components/progress/ProgressHero';
import ProgressStats from '../src/components/progress/ProgressStats';
import QuickActionsGrid from '../src/components/progress/QuickActionsGrid';
import MeasurementTrends from '../src/components/progress/MeasurementTrends';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_THUMB = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.sm * 4) / 5;

export default function ProgressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [latest, setLatest] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [physicalData, setPhysicalData] = useState({});

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [photosData, measurementsData, profileRes] = await Promise.all([
        getProgressPhotos(user.id),
        getMeasurements(user.id),
        supabase.from('profiles').select('physical_data, onboarding').eq('id', user.id).single(),
      ]);
      setPhotos(photosData);
      setMeasurements(measurementsData);
      setLatest(measurementsData[0] || null);
      setPrevious(measurementsData[1] || null);
      setPhysicalData(profileRes.data?.physical_data || profileRes.data?.onboarding || {});
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar progresso:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const weightChange = latest?.weight && previous?.weight ? latest.weight - previous.weight : null;
  const firstPhoto = photos.length > 0 ? photos[photos.length - 1] : null;
  const lastPhoto = photos.length > 0 ? photos[0] : null;
  const daysTracked = measurements.length > 0 ? Math.ceil((Date.now() - new Date(measurements[measurements.length - 1]?.recorded_at).getTime()) / 86400000) + 1 : 0;
  const recentPhotos = photos.slice(0, 5);

  return (
    <ErrorBoundary screenName="Progress">
      <View style={layout.screen}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        >
          <View style={layout.header}>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar">
              <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
            </TouchableOpacity>
            <Text style={typography.h2}>MEU PROGRESSO</Text>
            <View style={{ width: 24 }} />
          </View>

          <ProgressHero beforePhoto={firstPhoto} afterPhoto={lastPhoto} weightChange={weightChange} />

          <ProgressStats
            weightChange={weightChange}
            measurementsCount={measurements.length}
            photosCount={photos.length}
            daysTracked={daysTracked}
          />

          <QuickActionsGrid />

          {recentPhotos.length > 0 && (
            <View style={styles.section}>
              <Text style={typography.label}>FOTOS RECENTES</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                {recentPhotos.map((photo) => (
                  <TouchableOpacity key={photo.id} onPress={() => router.push('/progress-photos')} accessibilityLabel="Ver fotos">
                    <Image source={{ uri: photo.image_url }} style={styles.photoThumb} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <MeasurementTrends latest={latest} previous={previous} />
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  section: { marginBottom: SPACING.xl },
  photosScroll: { marginTop: SPACING.md },
  photoThumb: { width: PHOTO_THUMB, height: PHOTO_THUMB * 1.33, borderRadius: 8, marginRight: SPACING.sm, backgroundColor: COLORS.surfaceOverlay },
});
