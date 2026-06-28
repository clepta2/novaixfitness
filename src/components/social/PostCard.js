// src/components/social/PostCard.js
// Card de post no feed - NOVAIX FITNESS

import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { supabase } from '../../config/supabase';
import { useRealtimeComments } from '../../hooks/useRealtimeComments';
import { useRealtimeLikes } from '../../hooks/useRealtimeLikes';

function PostCard({ post, onLike, onComment, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikes(post.likes);
  }, [post.isLiked, post.likes]);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  useRealtimeComments(post.id, (newComment) => {
    setComments(prev => {
      if (prev.some(c => c.id === newComment.id)) return prev;
      return [...prev, newComment];
    });
  });

  useRealtimeLikes(post.id, {
    currentUserId,
    onLikeAdded: (postId, isOwn) => {
      if (!isOwn) setLikes(prev => prev + 1);
    },
    onLikeRemoved: () => {
      setLikes(prev => Math.max(0, prev - 1));
    },
  });

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data } = await supabase
        .from('post_comments')
        .select('*, profiles:user_id(name, avatar_url)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      setComments(data || []);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = useCallback(() => {
    setIsLiked((prev) => {
      setLikes((l) => (prev ? l - 1 : l + 1));
      return !prev;
    });
    onLike?.(post.id);
  }, [onLike, post.id]);

  const handleComment = useCallback(() => {
    if (commentText.trim()) {
      onComment?.(post.id, commentText);
      setComments(prev => [...prev, {
        id: Date.now(),
        content: commentText,
        profiles: { name: 'Você', avatar_url: null },
        created_at: new Date().toISOString(),
      }]);
      setCommentText('');
    }
  }, [commentText, onComment, post.id]);

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${post.user.name}: ${post.content}`,
      });
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  }, [post]);

  const isOwner = currentUserId && post.userId === currentUserId;

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
          <Text style={styles.actionText}>{comments.length || post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          {loadingComments ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : comments.length > 0 ? (
            <View style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Avatar name={comment.profiles?.name || 'Anônimo'} size="sm" />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{comment.profiles?.name || 'Anônimo'}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noComments}>Nenhum comentário ainda</Text>
          )}

          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentField}
              placeholder="Comentário..."
              placeholderTextColor={COLORS.textMuted}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity style={[styles.commentBtn, !commentText.trim() && styles.commentBtnDisabled]} onPress={handleComment} disabled={!commentText.trim()}>
              <Ionicons name="send" size={18} color={commentText.trim() ? COLORS.primary : COLORS.textMuted} />
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
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  commentsList: { gap: SPACING.md, marginBottom: SPACING.md },
  commentItem: { flexDirection: 'row', gap: SPACING.sm },
  commentContent: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm },
  commentAuthor: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: 2 },
  commentText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },
  noComments: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  commentField: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  commentBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  commentBtnDisabled: { backgroundColor: COLORS.surfaceOverlay },
});
