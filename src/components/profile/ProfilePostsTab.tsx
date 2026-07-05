// src/components/profile/ProfilePostsTab.tsx
// Aba de posts do perfil do usuario

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { PostCard, Avatar } from '../../components';
import { SECTION_TITLES } from '../../data/profileTexts';

interface PostData {
  id: string;
  [key: string]: unknown;
}

interface Props {
  userName: string;
  userAvatar?: string | null;
  posts: PostData[];
  loadingPosts: boolean;
  userId?: string;
  onOpenComposer: () => void;
}

export default function ProfilePostsTab({ userName, userAvatar, posts, loadingPosts, userId, onOpenComposer }: Props) {
  return (
    <View>
      <View style={styles.composerCard}>
        <View style={styles.composerRow}>
          <Avatar name={userName} uri={userAvatar ?? undefined} size="md" />
          <TouchableOpacity style={styles.composerInputMock} onPress={onOpenComposer}>
            <Text style={styles.composerInputText}>{SECTION_TITLES.composerPlaceholder.replace('{name}', userName?.split(' ')[0] || '')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loadingPosts ? (
        <Text style={styles.centerText}>{SECTION_TITLES.loadingPosts}</Text>
      ) : posts.length === 0 ? (
        <View style={styles.emptyFeed}>
          <Ionicons name="chatbox-ellipses-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyFeedText}>{SECTION_TITLES.emptyPosts}</Text>
        </View>
      ) : (
        posts.map((p: any) => (
          <PostCard key={p.id} post={p} currentUserId={userId} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  composerCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  composerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  composerInputMock: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  composerInputText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  centerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.xl },
  emptyFeed: { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.xl },
  emptyFeedText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
});
