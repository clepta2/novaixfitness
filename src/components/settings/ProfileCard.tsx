import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function ProfileCard({ profile, onPress }) {
  const initials = (profile?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={typography.h5}>{profile?.name || 'Usuario'}</Text>
        <Text style={typography.caption}>{profile?.email || ''}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  avatar: { width: 52, height: 52, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  initials: typography.h4,
  info: { flex: 1 },
});
