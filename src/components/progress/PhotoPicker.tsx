import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { PHOTO_LABELS } from '../../services/progress-photos';

interface PhotoPickerProps {
  selectedLabel: string;
  onSelectLabel: (label: string) => void;
  onCamera: () => void;
  onGallery: () => void;
  onClose: () => void;
}

export default function PhotoPicker({ selectedLabel, onSelectLabel, onCamera, onGallery, onClose }: PhotoPickerProps): React.JSX.Element {
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={typography.h5}>Adicionar Foto</Text>
        <Text style={typography.bodyMuted}>Label: {selectedLabel}</Text>
        <View style={styles.options}>
          <TouchableOpacity style={styles.option} onPress={onCamera}>
            <Ionicons name="camera" size={32} color={COLORS.primary} />
            <Text style={typography.bodySmall}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onGallery}>
            <Ionicons name="images" size={32} color={COLORS.primary} />
            <Text style={typography.bodySmall}>Galeria</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.labels}>
          {PHOTO_LABELS.map((label: string) => (
            <TouchableOpacity
              key={label}
              style={[styles.labelBtn, selectedLabel === label && styles.labelActive]}
              onPress={() => onSelectLabel(label)}
            >
              <Text style={[typography.bodySmall, selectedLabel === label && styles.labelText]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text style={[typography.h5, { color: COLORS.textMuted }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, width: '80%', alignItems: 'center', gap: SPACING.lg },
  options: { flexDirection: 'row', gap: SPACING.xl },
  option: { alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, padding: SPACING.xl, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  labels: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, justifyContent: 'center' },
  labelBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  labelActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelText: { color: COLORS.background },
  cancel: { paddingVertical: SPACING.sm },
});
