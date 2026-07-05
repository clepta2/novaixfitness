import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { CompareView, PhotoGrid, PhotoModal, PhotoPicker } from '../index';
import { pickImage, takePhoto, uploadProgressPhoto, getProgressPhotos, deleteProgressPhoto, PHOTO_LABELS } from '../../services/progress-photos';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Photo {
  id: string;
  label: string;
  image_url: string;
  recorded_at: string;
  storage_path?: string;
  notes?: string;
}

interface ProgressPhotosProps {
  userId?: string;
}

export default function ProgressPhotos({ userId }: ProgressPhotosProps): React.JSX.Element {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('Frente');
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [comparePhotos, setComparePhotos] = useState<Photo[]>([]);

  const loadPhotos = async (): Promise<void> => {
    if (!userId) return;
    try {
      const data = await getProgressPhotos(userId);
      setPhotos(data);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPhotos(); }, [userId]);

  const handlePickImage = async (useCamera: boolean): Promise<void> => {
    try {
      const image = useCamera ? await takePhoto() : await pickImage();
      if (!image) return;
      await uploadProgressPhoto(userId, image.uri, selectedLabel);
      Alert.alert('Sucesso', 'Foto salva!');
      await loadPhotos();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Nao foi possivel salvar a foto.');
    } finally {
      setShowPicker(false);
    }
  };

  const handleDelete = (photo: Photo): void => {
    Alert.alert('Deletar foto', 'Remover esta foto permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: async () => {
        await deleteProgressPhoto(photo.id, userId, photo.storage_path);
        await loadPhotos();
      }},
    ]);
  };

  const toggleCompare = (photo: Photo): void => {
    if (!compareMode) {
      setCompareMode(true);
      setComparePhotos([photo]);
    } else {
      setComparePhotos(comparePhotos.length >= 2 ? [photo] : [...comparePhotos, photo]);
    }
  };

  const filteredPhotos = photos.filter((p: Photo) => p.label === selectedLabel);
  const labels = [...new Set(photos.map((p: Photo) => p.label))];
  const allLabels = [...new Set([...PHOTO_LABELS, ...labels])];

  return (
    <View>
      <View style={styles.header}>
        <Text style={typography.label}>FOTOS DE PROGRESSO</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Ionicons name="camera" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelsScroll}>
        <View style={styles.labelsRow}>
          {allLabels.map((label: string) => (
            <TouchableOpacity
              key={label}
              style={[styles.labelChip, selectedLabel === label && styles.labelActive]}
              onPress={() => setSelectedLabel(label)}
            >
              <Text style={[styles.labelText, selectedLabel === label && styles.labelTextActive]}>{label}</Text>
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
        onSelect={(p: any) => compareMode ? toggleCompare(p) : setSelectedPhoto(p)}
        onLongPress={handleDelete as any}
        compareMode={compareMode}
      />

      {filteredPhotos.length >= 2 && !compareMode && (
        <TouchableOpacity style={styles.compareBtn} onPress={() => setCompareMode(true)}>
          <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
          <Text style={styles.compareText}>Comparar fotos</Text>
        </TouchableOpacity>
      )}

      <PhotoModal photo={selectedPhoto} onCompare={toggleCompare as any} onDelete={handleDelete as any} onClose={() => setSelectedPhoto(null)} />
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
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  labelsScroll: { marginBottom: SPACING.xl },
  labelsRow: { flexDirection: 'row', gap: SPACING.xs },
  labelChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  labelActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  labelTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
  compareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.lg },
  compareText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.primary },
});
