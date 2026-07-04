import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

interface Photo {
  image_url: string;
  label: string;
  recorded_at: string;
  notes?: string;
}

interface PhotoModalProps {
  photo: Photo | null;
  onCompare: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
  onClose: () => void;
}

export default function PhotoModal({ photo, onCompare, onDelete, onClose }: PhotoModalProps): React.JSX.Element | null {
  if (!photo) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={28} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Image source={{ uri: photo.image_url }} style={styles.image} />
        <View style={styles.info}>
          <Text style={typography.h5}>{photo.label}</Text>
          <Text style={typography.bodySmall}>{formatDate(photo.recorded_at)}</Text>
          {photo.notes && <Text style={typography.caption}>{photo.notes}</Text>}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={() => { onCompare(photo); onClose(); }}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Comparar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => { onDelete(photo); onClose(); }}>
            <Ionicons name="trash" size={20} color={COLORS.error} />
            <Text style={[typography.bodySmall, { color: COLORS.error }]}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  close: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  image: { width: '80%', height: '60%', borderRadius: 12, resizeMode: 'contain' },
  info: { alignItems: 'center', marginTop: SPACING.lg, gap: 4 },
  actions: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.xl },
  action: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: 8 },
});
