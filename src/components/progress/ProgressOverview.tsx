import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import ProgressHero from '../progress/ProgressHero';
import ProgressStats from '../progress/ProgressStats';
import MeasurementTrends from '../progress/MeasurementTrends';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_THUMB = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.sm * 4) / 5;

interface Photo {
  id: string;
  image_url: string;
  recorded_at: string;
}

interface Measurement {
  recorded_at: string;
  [key: string]: any;
}

interface ProgressOverviewProps {
  photos: Photo[];
  measurements: Measurement[];
  latest?: Measurement | null;
  previous?: Measurement | null;
  onNavigate: (tab: string) => void;
}

export default function ProgressOverview({ photos, measurements, latest, previous, onNavigate }: ProgressOverviewProps): React.JSX.Element {
  const weightChange = latest?.weight && previous?.weight ? latest.weight - previous.weight : null;
  const firstPhoto = photos.length > 0 ? photos[photos.length - 1] : null;
  const lastPhoto = photos.length > 0 ? photos[0] : null;
  const now = Date.now();
  const daysTracked = measurements.length > 0 ? Math.ceil((now - new Date(measurements[measurements.length - 1]?.recorded_at).getTime()) / 86400000) + 1 : 0;
  const recentPhotos = photos.slice(0, 5);

  return (
    <View>
      <ProgressHero beforePhoto={firstPhoto} afterPhoto={lastPhoto} weightChange={weightChange} />
      <ProgressStats weightChange={weightChange} measurementsCount={measurements.length} photosCount={photos.length} daysTracked={daysTracked} />

      <View style={styles.section}>
        <Text style={typography.label}>FOTOS RECENTES</Text>
        {recentPhotos.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
            {recentPhotos.map((photo: Photo) => (
              <TouchableOpacity key={photo.id} onPress={() => onNavigate('photos')}>
                <Image source={{ uri: photo.image_url }} style={styles.photoThumb} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity style={styles.emptyPhotos} onPress={() => onNavigate('photos')}>
            <Ionicons name="camera-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyPhotosText}>Nenhuma foto ainda</Text>
            <Text style={styles.emptyPhotosCta}>Adicione sua primeira foto de progresso</Text>
          </TouchableOpacity>
        )}
      </View>

      <MeasurementTrends latest={latest} previous={previous} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  photosScroll: { marginTop: SPACING.md },
  photoThumb: { width: PHOTO_THUMB, height: PHOTO_THUMB * 1.33, borderRadius: 8, marginRight: SPACING.sm, backgroundColor: COLORS.surfaceOverlay },
  emptyPhotos: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', marginTop: SPACING.md, gap: SPACING.xs },
  emptyPhotosText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  emptyPhotosCta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
});
