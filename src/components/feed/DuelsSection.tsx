// src/components/feed/DuelsSection.tsx - Secao de duelos de treino

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { ActiveDuelCard } from '../../components';
import { MOCK_DUELS } from '../../data/duels';
import { SOCIAL_FEED } from '../../data/socialTexts';

export default function DuelsSection() {
  return (
    <View style={styles.duelsSection}>
      <Text style={styles.duelsSectionTitle}>{SOCIAL_FEED.duelsSectionTitle}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.duelsScroll}>
        {MOCK_DUELS.map((duel) => (
          <View key={duel.id} style={{ width: 285 }}>
            <ActiveDuelCard duel={duel} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  duelsSection: { marginBottom: SPACING.md },
  duelsSectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.sm },
  duelsScroll: { gap: SPACING.sm, paddingRight: SPACING.lg },
});
