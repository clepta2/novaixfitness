import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ACTIONS = [
  { id: 'post', icon: 'create-outline', label: 'Criar Post', color: COLORS.primary },
  { id: 'workout', icon: 'barbell-outline', label: 'Compartilhar Treino', color: COLORS.success },
  { id: 'invite', icon: 'people-outline', label: 'Convidar Amigos', color: COLORS.info },
];

function QuickSocialActions({ onPress, badgeCounts = {} }) {
  return (
    <View style={styles.container}>
      {ACTIONS.map((a) => (
        <TouchableOpacity key={a.id} style={styles.card} onPress={() => onPress(a.id)} activeOpacity={0.7} accessibilityLabel={a.label} accessibilityRole="button">
          <View style={[styles.iconCircle, { backgroundColor: a.color + '20' }]}>
            <Ionicons name={a.icon as any} size={22} color={a.color} />
            {badgeCounts[a.id] > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{badgeCounts[a.id]}</Text></View>
            )}
          </View>
          <Text style={styles.label}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default memo(QuickSocialActions);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  card: { flex: 1, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.error, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textDescription, textAlign: 'center' },
});
