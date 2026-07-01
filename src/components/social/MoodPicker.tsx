import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Mood {
  emoji: string;
  label: string;
}

interface MoodPickerProps {
  onSelect: (mood: string) => void;
  selected?: string;
}

const MOODS: Mood[] = [
  { emoji: '💪', label: 'Motivado' },
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😴', label: 'Cansado' },
  { emoji: '😰', label: 'Ansioso' },
  { emoji: '🏆', label: 'Orgulhoso' },
  { emoji: '🔥', label: 'Determinado' },
];

export default function MoodPicker({ onSelect, selected }: MoodPickerProps) {
  return (
    <View style={styles.container}>
      {MOODS.map((mood) => {
        const isActive = selected === mood.label;
        return (
          <TouchableOpacity
            key={mood.label}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(mood.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textTitle,
  },
  labelActive: {
    color: COLORS.background,
    fontFamily: 'Inter_600SemiBold',
  },
});
