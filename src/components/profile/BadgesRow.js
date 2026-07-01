// src/components/profile/BadgesRow.js
// Linha de conquistas - NOVAIX FITNESS

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function BadgesRow({ badges }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {badges.map((badge) => (
        <View key={badge.id} style={styles.card}>
          <View style={[styles.icon, { backgroundColor: badge.color + '20' }]}>
            <Ionicons name={badge.icon} size={24} color={badge.color} />
          </View>
          <Text style={styles.name}>{badge.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { width: 100, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginRight: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  icon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  name: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textTitle, textAlign: 'center' },
});
