import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import {
  pickImage, takePhoto, uploadProgressPhoto,
  getProgressPhotos, deleteProgressPhoto, PHOTO_LABELS,
} from '../src/services/progress-photos';
import { layout, typography } from '../src/styles';
import { CompareView, PhotoGrid, PhotoModal, PhotoPicker, ErrorBoundary } from '../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('Frente');
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState([]);

  const loadPhotos = async () => {
    if (!user?.id) return;
    try {
      const data = await getProgressPhotos(user.id);
      setPhotos(data);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPhotos(); }, [user?.id]);

  const handlePickImage = async (useCamera) => {
    try {
      const image = useCamera ? await takePhoto() : await pickImage();
      if (!image) return;
      await uploadProgressPhoto(user.id, image.uri, selectedLabel);
      Alert.alert('Sucesso', 'Foto salva!');
      await loadPhotos();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Nao foi possivel salvar a foto.');
    } finally {
      setShowPicker(false);
    }
  };

  const handleDelete = (photo) => {
    Alert.alert('Deletar foto', 'Remover esta foto permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar', style: 'destructive',
        onPress: async () => {
          await deleteProgressPhoto(photo.id, user.id, photo.storage_path);
          await loadPhotos();
        },
      },
    ]);
  };

  const toggleCompare = (photo) => {
    if (!compareMode) {
      setCompareMode(true);
      setComparePhotos([photo]);
    } else {
      setComparePhotos(comparePhotos.length >= 2 ? [photo] : [...comparePhotos, photo]);
    }
  };

  const filteredPhotos = photos.filter(p => p.label === selectedLabel);
  const labels = [...new Set(photos.map(p => p.label))];
  const allLabels = [...new Set([...PHOTO_LABELS, ...labels])];

  return (
    <ErrorBoundary screenName="ProgressPhotos">
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Fotos de Progresso</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Ionicons name="camera" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelsScroll}>
          <View style={styles.labelsRow}>
            {allLabels.map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.labelChip, selectedLabel === label && styles.labelActive]}
                onPress={() => setSelectedLabel(label)}
              >
                <Text style={[typography.bodySmall, selectedLabel === label && styles.labelTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {compareMode && comparePhotos.length >= 2 && (
          <CompareView photos={comparePhotos} onCancel={() => { setCompareMode(false); setComparePhotos([]); }} />
        )}

        <PhotoGrid
          photos={filteredPhotos}
          selectedIds={comparePhotos}
          onSelect={(p) => compareMode ? toggleCompare(p) : setSelectedPhoto(p)}
          onLongPress={handleDelete}
          compareMode={compareMode}
        />

        {filteredPhotos.length >= 2 && !compareMode && (
          <TouchableOpacity style={styles.compareBtn} onPress={() => setCompareMode(true)}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={typography.h5}>Comparar fotos</Text>
          </TouchableOpacity>
        )}

        <Text style={[typography.label, { marginTop: SPACING.xl }]}>TODAS AS FOTOS</Text>
        <View style={styles.allGrid}>
          {photos.slice(0, 12).map((photo) => (
            <TouchableOpacity key={photo.id} style={styles.allItem} onPress={() => setSelectedPhoto(photo)}>
              <Image source={{ uri: photo.image_url }} style={styles.allThumb} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <PhotoModal photo={selectedPhoto} onCompare={toggleCompare} onDelete={handleDelete} onClose={() => setSelectedPhoto(null)} />
      {showPicker && (
        <PhotoPicker
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
          onCamera={() => handlePickImage(true)}
          onGallery={() => handlePickImage(false)}
          onClose={() => setShowPicker(false)}
        />
      )}
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  labelsScroll: { marginBottom: SPACING.xl },
  labelsRow: { flexDirection: 'row', gap: SPACING.xs },
  labelChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  labelActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelTextActive: typography.chipActive,
  compareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.lg },
  allGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  allItem: { width: (SCREEN_WIDTH - SPACING.xl * 2 - 8) / 4, height: (SCREEN_WIDTH - SPACING.xl * 2 - 8) / 4 },
  allThumb: { width: '100%', height: '100%', borderRadius: 4 },
});
