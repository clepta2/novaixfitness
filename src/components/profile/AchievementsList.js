// src/components/profile/AchievementsList.js
// Lista de conquistas - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function AchievementsList({ achievements = [], totalAchievements = 25 }) {
  const unlockedIds = new Set(achievements.map(a => a.id));

  const allAchievements = [
    ...achievements,
  ];

  return (
    <View>
      <View style={styles.counter}>
        <Text style={styles.counterText}>{achievements.length}/{totalAchievements} desbloqueadas</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allAchievements.map((achievement) => (
          <View key={achievement.id} style={[styles.card, !unlockedIds.has(achievement.id) && styles.locked]}>
            <View style={[styles.icon, { backgroundColor: (achievement.color || COLORS.textMuted) + '20' }]}>
              <Ionicons
                name={unlockedIds.has(achievement.id) ? achievement.icon : 'lock-closed'}
                size={24}
                color={unlockedIds.has(achievement.id) ? achievement.color : COLORS.textMuted}
              />
            </View>
            <Text style={[styles.name, !unlockedIds.has(achievement.id) && styles.lockedText]} numberOfLines={1}>
              {achievement.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(AchievementsList);

const styles = StyleSheet.create({
  counter: { marginBottom: SPACING.md },
  counterText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  card: { width: 90, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  locked: { opacity: 0.5 },
  icon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  name: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textTitle, textAlign: 'center' },
  lockedText: { color: COLORS.textMuted },
});
