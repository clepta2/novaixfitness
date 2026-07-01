// src/components/group/GroupHeaderCard.tsx
// Card de cabecalho do grupo (cover, stats, join)

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface GroupData {
  id: string; name: string; description?: string; member_count?: number; [key: string]: unknown;
}

interface Props {
  group: GroupData;
  postCount: number;
  isMember: boolean;
  onJoinToggle: () => void;
}

export default function GroupHeaderCard({ group, postCount, isMember, onJoinToggle }: Props) {
  return (
    <View style={styles.groupInfo}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600' }} style={styles.coverImage} resizeMode="cover" />
      </View>
      <View style={styles.groupHeaderContent}>
        <Text style={styles.groupName}>{group.name}</Text>
        {group.description && <Text style={styles.groupDesc} numberOfLines={2}>{group.description}</Text>}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{group.member_count || 0}</Text>
            <Text style={styles.statLabel}>Membros</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{postCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.joinBtn, isMember && styles.leaveBtn]} onPress={onJoinToggle}>
          <Text style={[styles.joinText, isMember && styles.leaveText]}>
            {isMember ? 'SAIR DO GRUPO' : 'ENTRAR NO GRUPO'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupInfo: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.xl },
  coverContainer: { width: '100%', height: 120, backgroundColor: COLORS.surfaceElevated },
  coverImage: { width: '100%', height: '100%' },
  groupHeaderContent: { padding: SPACING.lg, alignItems: 'center' },
  groupName: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  groupDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.md, paddingHorizontal: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.xxl, marginBottom: SPACING.md },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  joinBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full },
  joinText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
  leaveBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.error },
  leaveText: { color: COLORS.error },
});
