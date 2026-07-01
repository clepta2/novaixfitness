// src/components/social/ForumPost.js
// Card de post do forum - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ForumPost({ post, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(post)} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.author?.charAt(0) || '?'}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.time}>{formatTime(post.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={2}>{post.content}</Text>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.statText}>{post.likes || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.statText}>{post.replies || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'agora';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default memo(ForumPost);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  authorInfo: { flex: 1 },
  author: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: COLORS.textTitle,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.textTitle,
    marginBottom: SPACING.xs,
  },
  content: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textDescription,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
