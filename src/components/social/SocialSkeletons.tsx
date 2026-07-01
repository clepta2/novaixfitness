// src/components/social/SocialSkeletons.js
// Skeletons e empty states para features sociais

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function PulseView({ style }) {
  return <View style={[styles.pulse, style]} />;
}

export function StorySkeleton() {
  return (
    <View style={styles.storyRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={styles.storyItem}>
          <PulseView style={styles.storyCircle} />
          <PulseView style={styles.storyName} />
        </View>
      ))}
    </View>
  );
}

export function LiveCardSkeleton() {
  return (
    <View style={styles.card}>
      <PulseView style={styles.liveBadgeSkeleton} />
      <View style={styles.cardHeader}>
        <PulseView style={styles.avatarSm} />
        <View style={{ flex: 1 }}>
          <PulseView style={styles.textSm} />
          <PulseView style={styles.textXs} />
        </View>
      </View>
      <PulseView style={styles.textLg} />
      <PulseView style={styles.textMd} />
      <View style={styles.cardFooter}>
        <PulseView style={styles.textXs} />
        <PulseView style={styles.badgeSkeleton} />
      </View>
    </View>
  );
}

export function ChatListSkeleton() {
  return (
    <View>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.chatItem}>
          <PulseView style={styles.avatarMd} />
          <View style={styles.chatInfo}>
            <PulseView style={styles.textSm} />
            <PulseView style={styles.textXs} />
          </View>
          <PulseView style={styles.textXs} />
        </View>
      ))}
    </View>
  );
}

export function GroupCardSkeleton() {
  return (
    <View style={styles.groupCard}>
      <PulseView style={styles.groupIcon} />
      <PulseView style={styles.textSm} />
      <PulseView style={styles.textXs} />
      <PulseView style={styles.btnSkeleton} />
    </View>
  );
}

export function SocialEmptyState({ icon, title, description, actionLabel, onAction }: any) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon || 'folder-open-outline'} size={48} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>{title || 'Nada por aqui'}</Text>
      {description && <Text style={styles.emptyDesc}>{description}</Text>}
      {actionLabel && onAction && (
        <View style={styles.emptyAction}>
          <Text style={styles.emptyActionText}>{actionLabel}</Text>
        </View>
      )}
    </View>
  );
}

export function EmptyLive() {
  return (
    <SocialEmptyState
      icon="videocam-outline"
      title="Nenhuma live agora"
      description="Seja o primeiro a iniciar uma live de treino!"
    />
  );
}

export function EmptyChat() {
  return (
    <SocialEmptyState
      icon="chatbubbles-outline"
      title="Nenhuma conversa"
      description="Inicie uma conversa com seus amigos"
    />
  );
}

export function EmptyGroup() {
  return (
    <SocialEmptyState
      icon="people-outline"
      title="Nenhum grupo"
      description="Crie ou entre em um grupo de treino"
    />
  );
}

export function EmptySavedPosts() {
  return (
    <SocialEmptyState
      icon="bookmark-outline"
      title="Nenhum post salvo"
      description="Salve posts interessantes para ver depois"
    />
  );
}

export function EmptySearch() {
  return (
    <SocialEmptyState
      icon="search-outline"
      title="Nenhum resultado"
      description="Tente buscar com outros termos"
    />
  );
}

const styles = StyleSheet.create({
  pulse: { backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm },
  storyRow: { flexDirection: 'row', gap: SPACING.md, paddingVertical: SPACING.sm },
  storyItem: { alignItems: 'center', width: 64 },
  storyCircle: { width: 56, height: 56, borderRadius: 28 },
  storyName: { width: 40, height: 10, borderRadius: 5, marginTop: SPACING.xs },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  liveBadgeSkeleton: { width: 70, height: 20, borderRadius: 10, marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  avatarSm: { width: 32, height: 32, borderRadius: 16 },
  avatarMd: { width: 44, height: 44, borderRadius: 22 },
  textLg: { width: '80%', height: 18, borderRadius: 9, marginBottom: SPACING.sm },
  textMd: { width: '60%', height: 14, borderRadius: 7, marginBottom: SPACING.sm },
  textSm: { width: 80, height: 12, borderRadius: 6, marginBottom: 4 },
  textXs: { width: 50, height: 10, borderRadius: 5 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md },
  badgeSkeleton: { width: 60, height: 24, borderRadius: 12 },
  chatItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chatInfo: { flex: 1, gap: 4 },
  groupCard: { width: 160, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginRight: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  groupIcon: { width: 40, height: 40, borderRadius: 20, marginBottom: SPACING.md },
  btnSkeleton: { width: 80, height: 28, borderRadius: 14, marginTop: SPACING.sm },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.massive, gap: SPACING.md },
  emptyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  emptyDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.xl },
  emptyAction: { marginTop: SPACING.md, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full },
  emptyActionText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.background },
});
