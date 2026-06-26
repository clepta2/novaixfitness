// app/progress-photos.js
// Tela de Fotos de Progresso - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import {
  pickImage, takePhoto, uploadProgressPhoto,
  getProgressPhotos, deleteProgressPhoto, getProgressLabels,
  PHOTO_LABELS,
} from '../src/services/progress-photos';
import { layout, typography } from '../src/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.sm * 2) / 3;

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('Frente');
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState([]);

  useEffect(() => {
    loadPhotos();
  }, [user?.id]);

  const loadPhotos = async () => {
    if (!user?.id) return;
    try {
      const data = await getProgressPhotos(user.id);
      setPhotos(data);
    } catch (err) {
      console.error('Erro ao carregar fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async (useCamera) => {
    try {
      const image = useCamera ? await takePhoto() : await pickImage();
      if (!image) return;

      setUploading(true);
      await uploadProgressPhoto(user.id, image.uri, selectedLabel);
      Alert.alert('Sucesso', 'Foto salva!');
      await loadPhotos();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Nao foi possivel salvar a foto.');
    } finally {
      setUploading(false);
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
      if (comparePhotos.length >= 2) {
        setComparePhotos([photo]);
      } else {
        setComparePhotos([...comparePhotos, photo]);
      }
    }
  };

  const filteredPhotos = photos.filter(p => p.label === selectedLabel);
  const labels = [...new Set(photos.map(p => p.label))];
  const allLabels = [...new Set([...PHOTO_LABELS, ...labels])];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
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
          <View style={styles.compareContainer}>
            <Text style={typography.label}>COMPARACAO</Text>
            <View style={styles.compareRow}>
              <View style={styles.compareItem}>
                <Image source={{ uri: comparePhotos[0].image_url }} style={styles.compareImage} />
                <Text style={styles.compareDate}>{formatDate(comparePhotos[0].recorded_at)}</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
              <View style={styles.compareItem}>
                <Image source={{ uri: comparePhotos[1].image_url }} style={styles.compareImage} />
                <Text style={styles.compareDate}>{formatDate(comparePhotos[1].recorded_at)}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.compareCancel} onPress={() => { setCompareMode(false); setComparePhotos([]); }}>
              <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Cancelar comparacao</Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredPhotos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="camera-outline" size={48} color={COLORS.textMuted} />
            <Text style={typography.h5}>Nenhuma foto {selectedLabel.toLowerCase()}</Text>
            <Text style={typography.bodyMuted}>Adicione fotos para acompanhar seu progresso</Text>
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {filteredPhotos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                style={[styles.photoItem, comparePhotos.some(p => p.id === photo.id) && styles.photoSelected]}
                onPress={() => compareMode ? toggleCompare(photo) : setSelectedPhoto(photo)}
                onLongPress={() => handleDelete(photo)}
              >
                <Image source={{ uri: photo.image_url }} style={styles.photoThumb} />
                <Text style={styles.photoDate}>{formatDate(photo.recorded_at)}</Text>
                {comparePhotos.some(p => p.id === photo.id) && (
                  <View style={styles.photoCheck}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filteredPhotos.length >= 2 && !compareMode && (
          <TouchableOpacity style={styles.compareBtn} onPress={() => setCompareMode(true)}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={typography.h5}>Comparar fotos</Text>
          </TouchableOpacity>
        )}

        <Text style={[typography.label, { marginTop: SPACING.xl }]}>TODAS AS FOTOS</Text>
        <View style={styles.allPhotosGrid}>
          {photos.slice(0, 12).map((photo) => (
            <TouchableOpacity key={photo.id} style={styles.allPhotoItem} onPress={() => setSelectedPhoto(photo)}>
              <Image source={{ uri: photo.image_url }} style={styles.allPhotoThumb} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedPhoto && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedPhoto(null)}>
              <Ionicons name="close" size={28} color={COLORS.textTitle} />
            </TouchableOpacity>
            <Image source={{ uri: selectedPhoto.image_url }} style={styles.modalImage} />
            <View style={styles.modalInfo}>
              <Text style={typography.h5}>{selectedPhoto.label}</Text>
              <Text style={typography.bodySmall}>{formatDate(selectedPhoto.recorded_at)}</Text>
              {selectedPhoto.notes && <Text style={typography.caption}>{selectedPhoto.notes}</Text>}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalAction} onPress={() => { toggleCompare(selectedPhoto); setSelectedPhoto(null); }}>
                <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
                <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Comparar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAction} onPress={() => { handleDelete(selectedPhoto); setSelectedPhoto(null); }}>
                <Ionicons name="trash" size={20} color={COLORS.error} />
                <Text style={[typography.bodySmall, { color: COLORS.error }]}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showPicker && (
        <View style={styles.modal}>
          <View style={styles.pickerContent}>
            <Text style={typography.h5}>Adicionar Foto</Text>
            <Text style={typography.bodyMuted}>Label: {selectedLabel}</Text>
            <View style={styles.pickerOptions}>
              <TouchableOpacity style={styles.pickerOption} onPress={() => handlePickImage(true)}>
                <Ionicons name="camera" size={32} color={COLORS.primary} />
                <Text style={typography.bodySmall}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerOption} onPress={() => handlePickImage(false)}>
                <Ionicons name="images" size={32} color={COLORS.primary} />
                <Text style={typography.bodySmall}>Galeria</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.labelSelector}>
              {PHOTO_LABELS.map((label) => (
                <TouchableOpacity
                  key={label}
                  style={[styles.labelOption, selectedLabel === label && styles.labelOptionActive]}
                  onPress={() => setSelectedLabel(label)}
                >
                  <Text style={[typography.bodySmall, selectedLabel === label && styles.labelOptionText]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPicker(false)}>
              <Text style={[typography.h5, { color: COLORS.textMuted }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  labelsScroll: { marginBottom: SPACING.xl },
  labelsRow: { flexDirection: 'row', gap: SPACING.xs },
  labelChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  labelActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
  emptyCard: { alignItems: 'center', paddingVertical: SPACING.massive, gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  photoItem: { width: PHOTO_SIZE, marginBottom: SPACING.sm },
  photoSelected: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 8 },
  photoThumb: { width: PHOTO_SIZE, height: PHOTO_SIZE * 1.33, borderRadius: 8, backgroundColor: COLORS.surface },
  photoDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },
  photoCheck: { position: 'absolute', top: 4, right: 4 },
  compareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.lg },
  compareContainer: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary },
  compareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.md },
  compareItem: { alignItems: 'center' },
  compareImage: { width: (SCREEN_WIDTH - 160) / 2, height: ((SCREEN_WIDTH - 160) / 2) * 1.33, borderRadius: 8 },
  compareDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  compareCancel: { alignItems: 'center', marginTop: SPACING.md },
  allPhotosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  allPhotoItem: { width: (SCREEN_WIDTH - SPACING.xl * 2 - 8) / 4, height: (SCREEN_WIDTH - SPACING.xl * 2 - 8) / 4 },
  allPhotoThumb: { width: '100%', height: '100%', borderRadius: 4 },
  modal: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  modalImage: { width: '80%', height: '60%', borderRadius: 12, resizeMode: 'contain' },
  modalInfo: { alignItems: 'center', marginTop: SPACING.lg, gap: 4 },
  modalActions: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.xl },
  modalAction: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: 8 },
  pickerContent: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, width: '80%', alignItems: 'center', gap: SPACING.lg },
  pickerOptions: { flexDirection: 'row', gap: SPACING.xl },
  pickerOption: { alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, padding: SPACING.xl, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  labelSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, justifyContent: 'center' },
  labelOption: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  labelOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelOptionText: { color: COLORS.background },
  cancelBtn: { paddingVertical: SPACING.sm },
});
