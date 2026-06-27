import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.sm * 2) / 3;

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function PhotoGrid({ photos, selectedIds, onSelect, onLongPress, compareMode }) {
  if (photos.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="camera-outline" size={48} color={COLORS.textMuted} />
        <Text style={typography.h5}>Nenhuma foto</Text>
        <Text style={typography.bodyMuted}>Adicione fotos para acompanhar seu progresso</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {photos.map((photo) => (
        <TouchableOpacity
          key={photo.id}
          style={[styles.item, selectedIds?.some(p => p.id === photo.id) && styles.itemSelected]}
          onPress={() => onSelect(photo)}
          onLongPress={() => onLongPress?.(photo)}
        >
          <Image source={{ uri: photo.image_url }} style={styles.thumb} />
          <Text style={styles.date}>{formatDate(photo.recorded_at)}</Text>
          {selectedIds?.some(p => p.id === photo.id) && (
            <View style={styles.check}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  empty: { alignItems: 'center', paddingVertical: SPACING.massive, gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  item: { width: PHOTO_SIZE, marginBottom: SPACING.sm },
  itemSelected: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 8 },
  thumb: { width: PHOTO_SIZE, height: PHOTO_SIZE * 1.33, borderRadius: 8, backgroundColor: COLORS.surface },
  date: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },
  check: { position: 'absolute', top: 4, right: 4 },
});
