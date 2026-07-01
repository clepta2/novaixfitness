// src/components/social/PostCard.tsx
// Card de post no feed - NOVAIX FITNESS

import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { supabase } from '../../config/supabase';
import { COMPOSER } from '../../data/socialTexts';
import { useRealtimeComments } from '../../hooks/useRealtimeComments';
import { useRealtimeLikes } from '../../hooks/useRealtimeLikes';
import CommentSection from './CommentSection';
import PostActions from './PostActions';
import { MediaCarousel, VideoPost, PostInsights } from '../exports/social';

interface CommentData {
  id: string | number;
  content: string;
  profiles?: { name: string; avatar_url: string | null };
  created_at: string;
}

interface PostData {
  id: string | number;
  isLiked: boolean;
  likes: number;
  user: { name: string };
  content: string;
  createdAt: string;
  videoUrl?: string;
  image_urls?: string[];
  image?: string;
  comments?: number;
  userId?: string;
}

interface PostCardProps {
  post: PostData;
  onLike?: (postId: string | number) => void;
  onComment?: (postId: string | number, text: string) => void;
  currentUserId?: string;
}

function PostCard({ post, onLike, onComment, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState<CommentData[]>([]);
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

  useRealtimeComments(post.id, (newComment: CommentData) => {
    setComments(prev => {
      if (prev.some(c => c.id === newComment.id)) return prev;
      return [...prev, newComment];
    });
  });

  useRealtimeLikes(post.id, {
    currentUserId,
    onLikeAdded: (postId: string | number, isOwn: boolean) => {
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
        profiles: { name: COMPOSER.selfName, avatar_url: null },
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

      {post.videoUrl ? (
        <VideoPost videoUrl={post.videoUrl} />
      ) : post.image_urls && post.image_urls.length > 0 ? (
        <MediaCarousel images={post.image_urls} />
      ) : post.image ? (
        <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />
      ) : null}

      <PostActions isLiked={isLiked} likes={likes} commentsCount={comments.length || post.comments || 0} onLike={handleLike} onComment={toggleComments} onShare={handleShare} />
      {isOwner && <PostInsights postId={post.id} />}

      {showComments && (
        <CommentSection comments={comments} loading={loadingComments} onSubmit={handleComment} commentText={commentText} onCommentTextChange={setCommentText} />
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
});
