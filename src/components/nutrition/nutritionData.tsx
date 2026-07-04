import { COLORS } from '../../constants/colors';
import { ICON_MAP, COLOR_MAP, DIFF_COLOR, FALLBACK_CHALLENGES } from '../../data/nutritionChallenges';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export { ICON_MAP, COLOR_MAP, DIFF_COLOR, FALLBACK_CHALLENGES };

export function resolveChallengeMeta(item) {
  return {
    icon: ICON_MAP[item.category] || 'fitness',
    color: COLOR_MAP[item.category] || COLORS.primary,
    diffColor: DIFF_COLOR[item.difficulty] || COLORS.attention,
  };
}

export function ChallengeMeta({ item }) {
  const { icon, color, diffColor } = resolveChallengeMeta(item);
  return (
    <>
      <View style={[metaStyles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={metaStyles.info}>
        <Text style={metaStyles.title}>{item.title}</Text>
        <Text style={metaStyles.desc}>{item.desc}</Text>
      </View>
    </>
  );
}

export function DifficultyBadge({ difficulty }) {
  const diffColor = DIFF_COLOR[difficulty] || COLORS.attention;
  return (
    <View style={[metaStyles.diffBadge, { backgroundColor: diffColor + '20' }]}>
      <Text style={[metaStyles.diffText, { color: diffColor }]}>{difficulty}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: 2 },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  diffBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  diffText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
});
