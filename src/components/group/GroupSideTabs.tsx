// src/components/group/GroupSideTabs.tsx
// Abas de membros e sobre do grupo

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../../components';

interface GroupData {
  name: string; description?: string; member_count?: number; [key: string]: unknown;
}

interface Props {
  group: GroupData;
  onChatUser: (user: { name: string }) => void;
}

export function MembersTab({ group, onChatUser }: Props) {
  const members = ['Voce', 'Jeferson Henrique', 'Alex Silva', 'Bruno Souza'];
  return (
    <View style={styles.tabContentCard}>
      <Text style={styles.tabContentTitle}>Membros ({group.member_count || 1})</Text>
      {members.map((name, index) => (
        <View key={index} style={styles.memberRow}>
          <Avatar name={name} size="sm" />
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>{name}</Text>
            <Text style={styles.memberRole}>{index === 1 ? 'Administrador' : 'Membro'}</Text>
          </View>
          <TouchableOpacity onPress={() => onChatUser({ name })}>
            <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export function AboutTab({ group }: { group: GroupData }) {
  return (
    <View style={styles.tabContentCard}>
      <Text style={styles.tabContentTitle}>Sobre o Grupo</Text>
      <Text style={styles.tabContentDesc}>{group.description || 'Grupo focado em compartilhar treinos, metas de peso e dicas de fitness.'}</Text>
      <View style={styles.ruleItem}>
        <Text style={styles.ruleTitle}>1. Respeito Mutuo</Text>
        <Text style={styles.ruleDesc}>Sem posts ofensivos ou julgamento. Todos estao aqui para evoluir.</Text>
      </View>
      <View style={styles.ruleItem}>
        <Text style={styles.ruleTitle}>2. Foco em Fitness</Text>
        <Text style={styles.ruleDesc}>Compartilhe fotos de progresso, rotinas de musculacao e cardio.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContentCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tabContentTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, marginBottom: SPACING.md },
  tabContentDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 20, marginBottom: SPACING.lg },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  memberName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  memberRole: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  ruleItem: { marginTop: SPACING.md },
  ruleTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, marginBottom: 2 },
  ruleDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, lineHeight: 18 },
});
