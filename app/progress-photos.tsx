// @ts-nocheck
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useProgressPhotos } from '../src/hooks/useProgressPhotos';
import { layout, typography } from '../src/styles';
import { CompareView, PhotoGrid, PhotoModal, PhotoPicker, ErrorBoundary } from '../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const {
    selectedLabel, setSelectedLabel, showPicker, setShowPicker,
    selectedPhoto, setSelectedPhoto, compareMode, comparePhotos,
    filteredPhotos, allLabels, photos,
    handlePickImage, handleDelete, toggleCompare, cancelCompare,
  } = useProgressPhotos();

  return (
    <ErrorBoundary screenName="ProgressPhotos">
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity accessibilityLabel="Voltar" accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Fotos de Progresso</Text>
          <TouchableOpacity accessibilityLabel="Adicionar foto" accessibilityRole="button" onPress={() => setShowPicker(true)}>
            <Ionicons name="camera" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelsScroll}>
          <View style={styles.labelsRow}>
            {allLabels.map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.labelChip, selectedLabel === label && styles.labelActive]}
                accessibilityLabel={`Filtrar ${label}`}
                accessibilityRole="button"
                onPress={() => setSelectedLabel(label)}
              >
                <Text style={[typography.bodySmall, selectedLabel === label && styles.labelTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {compareMode && comparePhotos.length >= 2 && (
          <CompareView photos={comparePhotos} onCancel={cancelCompare} />
        )}

        <PhotoGrid
          photos={filteredPhotos}
          selectedIds={comparePhotos}
          onSelect={(p) => compareMode ? toggleCompare(p) : setSelectedPhoto(p)}
          onLongPress={handleDelete}
          compareMode={compareMode}
        />

        {filteredPhotos.length >= 2 && !compareMode && (
          <TouchableOpacity style={styles.compareBtn} accessibilityLabel="Comparar fotos" accessibilityRole="button" onPress={() => toggleCompare(filteredPhotos[0])}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={typography.h5}>Comparar fotos</Text>
          </TouchableOpacity>
        )}

        <Text style={[typography.label, { marginTop: SPACING.xl }]}>TODAS AS FOTOS</Text>
        <View style={styles.allGrid}>
          {photos.slice(0, 12).map((photo) => (
            <TouchableOpacity key={photo.id} style={styles.allItem} accessibilityLabel={`Ver foto ${photo.id}`} accessibilityRole="button" onPress={() => setSelectedPhoto(photo)}>
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
