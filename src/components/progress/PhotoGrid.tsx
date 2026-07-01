// src/components/progress/PhotoGrid.tsx
// Grid de fotos animado - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.sm * 2) / 3;

interface Photo {
  id: string;
  image_url: string;
  recorded_at: string;
}

interface PhotoItemProps {
  photo: Photo;
  selected: boolean;
  onPress: (photo: Photo) => void;
  onLongPress?: (photo: Photo) => void;
  index: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function PhotoItem({ photo, selected, onPress, onLongPress, index }: PhotoItemProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.item, selected && styles.itemSelected]}
        onPress={() => onPress(photo)}
        onLongPress={() => onLongPress?.(photo)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: photo.image_url }} style={styles.thumb} />
        <View style={styles.dateOverlay}>
          <Text style={styles.dateText}>{formatDate(photo.recorded_at)}</Text>
        </View>
        {selected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface PhotoGridProps {
  photos: Photo[];
  selectedIds?: Photo[];
  onSelect: (photo: Photo) => void;
  onLongPress?: (photo: Photo) => void;
  compareMode?: boolean;
}

function PhotoGrid({ photos, selectedIds, onSelect, onLongPress, compareMode }: PhotoGridProps): React.JSX.Element {
  if (photos.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="camera-outline" size={40} color={COLORS.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Nenhuma foto</Text>
        <Text style={styles.emptyText}>Adicione fotos para acompanhar seu progresso</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {photos.map((photo: Photo, i: number) => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          selected={selectedIds?.some((p: Photo) => p.id === photo.id) || false}
          onPress={onSelect}
          onLongPress={onLongPress}
          index={i}
        />
      ))}
    </View>
  );
}

export default memo(PhotoGrid);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  emptyTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  item: { width: PHOTO_SIZE, borderRadius: 8, overflow: 'hidden' },
  itemSelected: { borderWidth: 2, borderColor: COLORS.primary },
  thumb: { width: PHOTO_SIZE, height: PHOTO_SIZE * 1.33, backgroundColor: COLORS.surface },
  dateOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 4, paddingHorizontal: SPACING.xs },
  dateText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.background, textAlign: 'center' },
  checkBadge: { position: 'absolute', top: SPACING.xs, right: SPACING.xs },
});
