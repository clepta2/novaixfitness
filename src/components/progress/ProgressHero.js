import { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function ProgressHero({ beforePhoto, afterPhoto, weightChange }) {
  const router = useRouter();
  const hasPhotos = beforePhoto || afterPhoto;

  if (!hasPhotos) {
    return (
      <TouchableOpacity style={styles.emptyCard} onPress={() => router.push('/progress/initialPhoto')} accessibilityLabel="Adicionar foto inicial">
        <View style={styles.emptyIcon}>
          <Ionicons name="camera-outline" size={32} color={COLORS.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Adicione sua foto inicial</Text>
        <Text style={styles.emptySubtitle}>Compare sua evolução</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.photoCol}>
          <Image source={{ uri: beforePhoto?.image_url }} style={styles.photo} />
          <Text style={styles.dateLabel}>{formatDate(beforePhoto?.recorded_at)}</Text>
        </View>
        <View style={styles.arrowCol}>
          <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.photoCol}>
          <Image source={{ uri: afterPhoto?.image_url }} style={styles.photo} />
          <Text style={styles.dateLabel}>{formatDate(afterPhoto?.recorded_at)}</Text>
        </View>
      </View>
      {weightChange !== null && weightChange !== undefined && (
        <View style={styles.changeRow}>
          <Ionicons
            name={weightChange <= 0 ? 'trending-down' : 'trending-up'}
            size={16}
            color={weightChange <= 0 ? COLORS.success : COLORS.secondary}
          />
          <Text style={[styles.changeText, { color: weightChange <= 0 ? COLORS.success : COLORS.secondary }]}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
          </Text>
        </View>
      )}
    </View>
  );
}

export default memo(ProgressHero);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  photoCol: { alignItems: 'center', flex: 1 },
  photo: { width: 100, height: 133, borderRadius: 8, backgroundColor: COLORS.surfaceOverlay },
  dateLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  arrowCol: { paddingHorizontal: SPACING.md },
  changeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, marginTop: SPACING.md },
  changeText: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  emptyTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  emptySubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
});
