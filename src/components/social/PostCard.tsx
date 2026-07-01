// @ts-nocheck
// src/components/social/PostCard.js
// Card de post no feed com suporte a reações e fotos de progresso

import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Share, Pressable, Animated, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { COLORS } from '../../constants/colors';
import { Avatar } from '../ui/Avatar';
import { styles } from './postCardStyles';
import { supabase } from '../../config/supabase';
import { useRealtimeComments } from '../../hooks/useRealtimeComments';
import { useRealtimeLikes } from '../../hooks/useRealtimeLikes';
import { useMountedRef } from '../../hooks/useMountedRef';
import { useI18n } from '../../i18n';
import CommentSection from './CommentSection';
import PostActions from './PostActions';
import ReactionBar from './ReactionBar';
import ReactionPicker from './ReactionPicker';
import BeforeAfterSlider from './BeforeAfterSlider';
import DirectChatDrawer from './DirectChatDrawer';
import { toggleReaction, getPostReactions } from '../../services/reactions';

function PostCard({ post, onLike, onComment, currentUserId, shouldAutoplay }: { post: any; onLike?: any; onComment?: any; currentUserId: any; shouldAutoplay?: boolean }) {
  const router = useRouter();
  const { t } = useI18n();
  const mounted = useMountedRef();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [reactions, setReactions] = useState<any>({ count: 0, byType: {}, userReaction: null });
  const [showPicker, setShowPicker] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [showLeftSkip, setShowLeftSkip] = useState(false);
  const [showRightSkip, setShowRightSkip] = useState(false);
  const [lastLeftTap, setLastLeftTap] = useState(0);
  const [lastRightTap, setLastRightTap] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (shouldAutoplay) {
        videoRef.current.playAsync().catch(() => {});
      } else {
        videoRef.current.pauseAsync().catch(() => {});
      }
    }
  }, [shouldAutoplay]);

  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikes(post.likes);
  }, [post.isLiked, post.likes]);

  useEffect(() => {
    if (showComments && comments.length === 0) loadComments();
  }, [showComments]);

  useEffect(() => {
    if (post.id) loadReactions();
  }, [post.id]);

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
    onLikeRemoved: () => setLikes(prev => Math.max(0, prev - 1)),
  });

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data } = await supabase
        .from('post_comments')
        .select('*, profiles:user_id(name, avatar_url)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      if (!mounted.current) return;
      setComments(data || []);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar comentários:', err);
    } finally {
      if (!mounted.current) return;
      setLoadingComments(false);
    }
  };

  const loadReactions = async () => {
    try {
      const { reactions: r } = await getPostReactions(post.id);
      if (mounted.current) setReactions(r);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar reações:', err);
    }
  };

  const handleLike = useCallback(() => {
    setIsLiked(prev => {
      setLikes(l => (prev ? l - 1 : l + 1));
      return !prev;
    });
    onLike?.(post.id);
  }, [onLike, post.id]);

  const handleReaction = useCallback(async (type) => {
    if (!currentUserId) return;
    try {
      await toggleReaction(post.id, currentUserId, type);
      setUserReaction(type);
      loadReactions();
    } catch (err) {
      if (__DEV__) console.error('Erro ao reagir:', err);
    }
  }, [post.id, currentUserId]);

  const handleLongPressLike = useCallback(() => setShowReactionPicker(true), []);

  const handleComment = useCallback((textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : commentText;
    if (textToSend.trim()) {
      onComment?.(post.id, textToSend);
      setComments(prev => [...prev, {
        id: Date.now(),
        content: textToSend,
        profiles: { name: 'Você', avatar_url: null },
        created_at: new Date().toISOString(),
      }]);
      setCommentText('');
    }
  }, [commentText, onComment, post.id]);

  const toggleComments = useCallback(() => setShowComments(prev => !prev), []);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const [lastTap, setLastTap] = useState<number | null>(null);
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      if (!isLiked) {
        handleLike();
      }
      triggerHeartAnimation();
    } else {
      setLastTap(now);
    }
  };

  const triggerHeartAnimation = () => {
    setShowHeart(true);
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowHeart(false);
    });
  };

  const renderImage = () => {
    let mediaEl = null;
    if (post.postType === 'before_after' && post.image && post.secondImage) {
      mediaEl = <BeforeAfterSlider beforeUri={post.image} afterUri={post.secondImage} />;
    } else if (post.postType === 'video' || post.image?.endsWith('.mp4') || post.image?.endsWith('.mov')) {
      const progress = status.durationMillis ? (status.positionMillis / status.durationMillis) * 100 : 0;
      
      const handleVideoPress = () => {
        if (status.isPlaying) {
          videoRef.current?.pauseAsync();
        } else {
          videoRef.current?.playAsync();
        }
      };

      const handleLeftDoubleTap = () => {
        if (status.positionMillis !== undefined) {
          videoRef.current?.setStatusAsync({ positionMillis: Math.max(0, status.positionMillis - 10000) });
          setShowLeftSkip(true);
          setTimeout(() => setShowLeftSkip(false), 600);
        }
      };

      const handleRightDoubleTap = () => {
        if (status.positionMillis !== undefined) {
          videoRef.current?.setStatusAsync({ positionMillis: Math.min(status.durationMillis || 0, status.positionMillis + 10000) });
          setShowRightSkip(true);
          setTimeout(() => setShowRightSkip(false), 600);
        }
      };

      const onVideoHalfTap = (side: 'left' | 'right') => {
        const now = Date.now();
        const lastHalfTap = side === 'left' ? lastLeftTap : lastRightTap;
        if (lastHalfTap && (now - lastHalfTap) < 300) {
          if (side === 'left') handleLeftDoubleTap();
          else handleRightDoubleTap();
        } else {
          if (side === 'left') setLastLeftTap(now);
          else setLastRightTap(now);
          setTimeout(() => {
            const doubleTapped = (Date.now() - now) > 300;
            if (!doubleTapped) handleVideoPress();
          }, 320);
        }
      };

      mediaEl = (
        <View style={{ position: 'relative', width: '100%', height: 220, backgroundColor: 'black', borderRadius: 8, overflow: 'hidden' }}>
          <Video
            ref={videoRef}
            source={{ uri: post.image }}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            isLooping
            style={{ width: '100%', height: '100%' }}
            onPlaybackStatusUpdate={(s) => setStatus(() => s)}
          />

          {/* Left half touch trigger */}
          <TouchableOpacity 
            activeOpacity={1} 
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', justifyContent: 'center', alignItems: 'center', zIndex: 5 }}
            onPress={() => onVideoHalfTap('left')}
          >
            {showLeftSkip && (
              <View style={styles.skipIndicator}>
                <Ionicons name="play-back" size={24} color="white" />
                <Text style={styles.skipText}>-10s</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Right half touch trigger */}
          <TouchableOpacity 
            activeOpacity={1} 
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', justifyContent: 'center', alignItems: 'center', zIndex: 5 }}
            onPress={() => onVideoHalfTap('right')}
          >
            {showRightSkip && (
              <View style={styles.skipIndicator}>
                <Ionicons name="play-forward" size={24} color="white" />
                <Text style={styles.skipText}>+10s</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Center Play/Pause Indicator Splash */}
          {!status.isPlaying && (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
              <Ionicons name="play" size={40} color="rgba(255, 255, 255, 0.7)" />
            </View>
          )}

          {/* Custom progress scrubber track at bottom */}
          <View style={styles.customScrubber}>
            <View style={[styles.scrubberProgress, { width: `${progress}%` }]} />
          </View>
        </View>
      );
    } else if (post.image) {
      mediaEl = <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />;
    }

    if (!mediaEl) return null;

    return (
      <Pressable onPress={handleDoubleTap} style={{ position: 'relative' }}>
        {mediaEl}
        {showHeart && (
          <Animated.View style={[styles.heartOverlay, { transform: [{ scale: heartScale }] }]}>
            <Ionicons name="heart" size={80} color="#FF2D55" />
          </Animated.View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar name={post.user.name} size="md" />
        <View style={styles.userInfo}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <Text style={styles.userName}>{post.user.name}</Text>
            {post.feeling && (
              <Text style={styles.headerStatusText}>
                {' '}está se sentindo <Text style={styles.headerStatusBold}>{post.feeling}</Text>
              </Text>
            )}
          </View>

          {(post.location || post.workout) && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 2 }}>
              {post.workout && (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>🏃 {post.workout}</Text>
                </View>
              )}
              {post.location && (
                <View style={[styles.metaBadge, { backgroundColor: COLORS.success + '15' }]}>
                  <Text style={[styles.metaBadgeText, { color: COLORS.success }]}>📍 {post.location}</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.time}>{post.createdAt}</Text>
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.menuBtn}>
          <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {renderImage()}

      {post.postType && post.postType !== 'text' && (
        <View style={styles.typeBadge}>
          <Ionicons name={post.postType === 'before_after' ? 'swap-horizontal' : 'camera'} size={12} color={COLORS.primary} />
          <Text style={styles.typeText}>{post.postType === 'before_after' ? t('social.beforeAfter') : t('social.progressPhoto')}</Text>
        </View>
      )}

      <ReactionBar reactions={reactions} onToggle={handleReaction} currentUserId={currentUserId} userReaction={reactions.userReaction} />

      <Pressable onLongPress={handleLongPressLike} delayLongPress={300}>
        <PostActions
          isLiked={isLiked}
          likes={likes}
          commentsCount={comments.length || post.comments}
          onLike={handleLike}
          onComment={toggleComments}
          onShare={handleShare}
        />
      </Pressable>

      {showComments && (
        <CommentSection
          comments={comments}
          loading={loadingComments}
          onSubmit={handleComment}
          commentText={commentText}
          onCommentTextChange={setCommentText}
        />
      )}

      {showPicker && (
        <ReactionPicker
          visible={showPicker}
          onSelect={handleReaction}
          onClose={() => setShowReactionPicker(false)}
        />
      )}

      {showShareModal && (
        <Modal visible={showShareModal} animationType="slide" transparent>
          <Pressable style={styles.modalOverlay} onPress={() => setShowShareModal(false)}>
            <View style={styles.shareMenu}>
              <Text style={styles.shareMenuTitle}>Compartilhar publicação</Text>
              
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => {
                  setShowShareModal(false);
                  Alert.alert('Sucesso', 'Publicação compartilhada no seu feed!');
                }}
              >
                <View style={[styles.shareIconBg, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="repeat-outline" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.shareOptionText}>Compartilhar agora (no Feed)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => {
                  setShowShareModal(false);
                  setShowChatDrawer(true);
                }}
              >
                <View style={[styles.shareIconBg, { backgroundColor: COLORS.success + '15' }]}>
                  <Ionicons name="chatbubble-outline" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.shareOptionText}>Enviar via Direct</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => {
                  setShowShareModal(false);
                  Alert.alert('Sucesso', 'Link copiado para a área de transferência!');
                }}
              >
                <View style={[styles.shareIconBg, { backgroundColor: COLORS.info + '15' }]}>
                  <Ionicons name="link-outline" size={20} color={COLORS.info} />
                </View>
                <Text style={styles.shareOptionText}>Copiar link</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareCancelBtn} onPress={() => setShowShareModal(false)}>
                <Text style={styles.shareCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      <DirectChatDrawer
        visible={showChatDrawer}
        onClose={() => setShowChatDrawer(false)}
        userName={post.user.name}
        userAvatar={post.user.avatar_url}
      />
    </View>
  );
}

export default memo(PostCard);


