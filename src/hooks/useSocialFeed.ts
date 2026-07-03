// src/hooks/useSocialFeed.ts
// Hook para dados do feed social - NOVAIX FITNESS

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { tryIf } from '../utils/tryIf';
import { useSupabaseData } from './useSupabaseData';
import { useRealtimePosts } from './useRealtimePosts';
import { getUnreadCount } from '../services/notifications';
import { getActiveStories } from '../services/social';
import { getRecentCheckIns } from '../services/gymCheckIn';
import { useServiceCall } from './useServiceCall';
import { formatRelativeDate } from '../helpers/dates';

export function useSocialFeed(userId: string | undefined) {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stories, setStories] = useState<any[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const processingLikes = useRef(new Set<string>());
  const { call: serviceCall } = useServiceCall<number>();

  const { data: dbPosts, refetch, loading } = useSupabaseData('posts', {
    select: '*, profiles:user_id(name, avatar_url)',
    orderBy: { column: 'created_at', ascending: false },
    mockData: [],
  });

  useEffect(() => {
    if (!userId) return;
    serviceCall(() => getUnreadCount(userId)).then(r => { if (r.ok) setUnreadCount(r.data); });
    loadStories();
    loadCheckIns();
    loadUserLikes();
  }, [userId]);

  const loadUserLikes = async () => {
    if (!userId) return;
    try {
      const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', userId);
      if (data) {
        const likedIds = new Set(data.map((l: { post_id: string }) => l.post_id));
        setPosts(prev => prev.map(p => ({ ...p, isLiked: likedIds.has(p.id) })));
      }
    } catch {}
  };

  useEffect(() => {
    if (dbPosts) {
      setPosts(dbPosts.map((p: any) => ({
        id: p.id, userId: p.user_id,
        user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
        content: p.content, image: p.image_url, postType: p.post_type || 'text', secondImage: p.second_image_url,
        createdAt: formatRelativeDate(p.created_at), likes: p.likes_count || 0, comments: p.comments_count || 0, isLiked: false,
      })));
    }
  }, [dbPosts]);

  const onInsert = useCallback((p: any) => setPosts(prev => prev.some((x: any) => x.id === p.id) ? prev : [p, ...prev]), []);
  const onUpdate = useCallback((u: any) => setPosts(prev => prev.map((p: any) => p.id === u.id ? { ...p, likes: u.likes, comments: u.comments } : p)), []);
  const onDelete = useCallback((id: string) => setPosts(prev => prev.filter((p: any) => p.id !== id)), []);
  useRealtimePosts(onInsert, onUpdate, onDelete);

  const loadStories = async () => {
    const data = await getActiveStories(userId);
    const grouped = data.reduce((acc: any, s: any) => {
      if (!acc[s.user_id]) acc[s.user_id] = [];
      acc[s.user_id].push(s);
      return acc;
    }, {});
    setStories(Object.entries(grouped).map(([userId, userStories]: [string, any]) => ({
      userId, name: userStories[0].profiles?.name || 'User', avatar: userStories[0].profiles?.avatar_url, stories: userStories, seen: false,
    })));
  };

  const loadCheckIns = async () => {
    const data = await getRecentCheckIns(undefined, 5);
    setRecentCheckIns(data);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    if (userId) {
      const result = await serviceCall(() => getUnreadCount(userId));
      if (result.ok) setUnreadCount(result.data);
    }
    loadStories();
    loadCheckIns();
    setRefreshing(false);
  }, [refetch, userId]);

  const handleLike = async (postId: string) => {
    if (!userId || processingLikes.current.has(postId)) return;
    processingLikes.current.add(postId);
    const likeResult = await tryIf(async () => {
      const { data: ext } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', userId).single();
      if (ext) {
        await supabase.from('post_likes').delete().eq('id', ext.id);
        return { liked: false };
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
        return { liked: true };
      }
    }, { retries: 1, baseDelay: 500 });
    if (likeResult.ok) {
      setPosts(prev => prev.map((p: any) => {
        if (p.id !== postId) return p;
        return likeResult.data.liked
          ? { ...p, isLiked: true, likes: p.likes + 1 }
          : { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) };
      }));
    }
    processingLikes.current.delete(postId);
  };

  const handleComment = async (postId: string, text: string) => {
    if (!userId) return;
    const result = await tryIf(async () => {
      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: userId, content: text });
      if (error) throw error;
    }, { retries: 1, baseDelay: 500 });
    if (result.ok) {
      setPosts(prev => prev.map((p: any) => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    }
  };

  return {
    posts, refreshing, unreadCount, stories, recentCheckIns, loading,
    onRefresh, handleLike, handleComment,
  };
}
