// @ts-nocheck
// src/components/social/ReactionBar.js
// Barra de contagem de reações

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { REACTION_MAP } from '../../constants/reactions';

export default function ReactionBar({ reactions = {}, onToggle, currentUserId, userReaction }) {
  const entries = Object.entries(reactions).filter(([, count]) => count > 0);

  if (entries.length === 0) return null;

  return (
    <View style={styles.container}>
      {entries.map(([type, count]) => {
        const reaction = REACTION_MAP[type];
        if (!reaction) return null;
        const isActive = userReaction === type;

        return (
          <TouchableOpacity
            key={type}
            style={[styles.badge, isActive && styles.badgeActive]}
            onPress={() => onToggle(type)}
          >
            <Text style={styles.emoji}>{reaction.emoji}</Text>
            <Text style={[styles.count, isActive && styles.countActive]}>{count}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.sm },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1, borderColor: COLORS.border,
  },
  badgeActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  emoji: { fontSize: 14 },
  count: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  countActive: { color: COLORS.primary },
});
