// src/components/social/PostCard.js
// Card de post no feed - NOVAIX FITNESS

import React, { memo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../index';

function PostCard({ post, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  }, [isLiked, onLike, post.id]);

  const handleComment = useCallback(() => {
    if (commentText.trim()) {
      onComment?.(post.id, commentText);
      setCommentText('');
    }
  }, [commentText, onComment, post.id]);

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar name={post.user.name} size="md" />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.time}>{post.createdAt}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22} color={isLiked ? COLORS.error : COLORS.textMuted} />
          <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={toggleComments}>
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentField}
              placeholder="Comentário..."
              placeholderTextColor={COLORS.textMuted}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity style={styles.commentBtn} onPress={handleComment}>
              <Ionicons name="send" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default memo(PostCard);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  userInfo: { flex: 1, marginLeft: SPACING.md },
  userName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  content: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20, marginBottom: SPACING.md },
  image: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md, backgroundColor: COLORS.background },
  actions: { flexDirection: 'row', gap: SPACING.xl, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  actionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  actionTextActive: { color: COLORS.error },
  commentsSection: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  commentField: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  commentBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
});
