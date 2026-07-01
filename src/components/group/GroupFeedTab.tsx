// src/components/group/GroupFeedTab.tsx
// Aba de discussao do grupo

import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../../components';

interface GroupPost {
  id: string; content: string; created_at: string; image_url?: string;
  profiles?: { name?: string }; [key: string]: unknown;
}

interface Props {
  posts: GroupPost[];
  isMember: boolean;
  newPost: string;
  onChangePost: (text: string) => void;
  onSendPost: () => void;
}

export default function GroupFeedTab({ posts, isMember, newPost, onChangePost, onSendPost }: Props) {
  return (
    <View>
      {isMember && (
        <View style={styles.postInput}>
          <TextInput style={styles.input} placeholder="Compartilhe com o grupo..." placeholderTextColor={COLORS.textMuted}
            value={newPost} onChangeText={onChangePost} multiline />
          <TouchableOpacity style={styles.sendBtn} onPress={onSendPost} disabled={!newPost.trim()}>
            <Ionicons name="send" size={18} color={newPost.trim() ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.sectionTitle}>Discussao</Text>
      {posts.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="chatbubbles-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Nenhum post ainda</Text>
        </View>
      ) : (
        posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Avatar name={post.profiles?.name} size="sm" />
              <View style={styles.postInfo}>
                <Text style={styles.postAuthor}>{post.profiles?.name || 'Membro'}</Text>
                <Text style={styles.postTime}>{new Date(post.created_at).toLocaleDateString('pt-BR')}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            {post.image_url && <Image source={{ uri: post.image_url }} style={styles.postImage} resizeMode="cover" />}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postInput: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, marginBottom: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, minHeight: 40, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, maxHeight: 100 },
  sendBtn: { padding: SPACING.xs },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
  postCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  postInfo: { flex: 1 },
  postAuthor: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  postTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  postContent: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20 },
  postImage: { width: '100%', height: 150, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.sm, backgroundColor: COLORS.surfaceElevated },
});
