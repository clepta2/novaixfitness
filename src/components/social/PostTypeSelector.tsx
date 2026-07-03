// src/components/social/PostTypeSelector.tsx
// Seletor de tipo de post: Texto / Foto Progresso / Antes/Depois

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const POST_TYPES = [
  { id: 'text', label: 'Post', icon: 'chatbubble-ellipses-outline' as const },
  { id: 'progress', label: 'Foto Progresso', icon: 'camera-outline' as const },
  { id: 'before_after', label: 'Antes/Depois', icon: 'swap-horizontal-outline' as const },
];

interface PostTypeSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PostTypeSelector({ selected, onSelect }: PostTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {POST_TYPES.map(type => (
        <TouchableOpacity
          key={type.id}
          style={[styles.chip, selected === type.id && styles.chipActive]}
          onPress={() => onSelect(type.id)}
        >
          <Ionicons
            name={type.icon}
            size={16}
            color={selected === type.id ? COLORS.background : COLORS.textMuted}
          />
          <Text style={[styles.label, selected === type.id && styles.labelActive]}>
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  labelActive: { color: COLORS.background },
});
