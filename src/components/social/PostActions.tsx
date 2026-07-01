import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface PostActionsProps {
  isLiked: boolean;
  likes: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export default function PostActions({ isLiked, likes, commentsCount, onLike, onComment, onShare }: PostActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22} color={isLiked ? COLORS.error : COLORS.textMuted} />
        <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>{likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onComment}>
        <Ionicons name="chatbubble-outline" size={20} color={COLORS.textMuted} />
        <Text style={styles.actionText}>{commentsCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
        <Ionicons name="share-outline" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.xl, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  actionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  actionTextActive: { color: COLORS.error },
});
