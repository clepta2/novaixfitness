// src/hooks/useSocialFeed.ts
// Hook para dados do feed social — posts, stories, check-ins, likes — NOVAIX FITNESS

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getActiveStories } from '../services/stories';
import { checkIn, getRecentCheckIns } from '../services/gymCheckIn';
import { getUnreadCount } from '../services/notifications';
import { useRealtimePosts } from './useRealtimePosts';
import { formatRelativeDate } from '../helpers/dates';
import { useServiceCall } from './useServiceCall';
import type { User } from '@supabase/supabase-js';

type Post = {
  id: string; userId: string; user: { name: string; avatar: string | null };
  content: string; image?: string; postType: string; secondImage?: string;
  createdAt: string; likes: number; comments: number; isLiked: boolean;
};

type StoryGroup = {
  userId: string; name: string; avatar: string | null; stories: any[]; seen: boolean;
};

export function useSocialFeed(user: User | null | undefined, t: (key: string) => string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const processingLikes = useRef(new Set<string>());
  const { call: serviceCall } = useServiceCall();
  const { checkAndPerform, ACTIONS } = useSecurityLazy();

  const loadUserLikes = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id);
      if (data) {
        const likedIds = new Set(data.map((l: { post_id: string }) => l.post_id));
        setPosts(prev => prev.map(p => ({ ...p, isLiked: likedIds.has(p.id) })));
      }
    } catch {}
  }, [user?.id]);

  const loadStories = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getActiveStories(user.id) as any[];
      const grouped = data.reduce((acc: any, s: any) => {
        if (!acc[s.user_id]) acc[s.user_id] = [];
        acc[s.user_id].push(s);
        return acc;
      }, {});
      setStories(Object.entries(grouped).map(([userId, userStories]: [string, any]) => ({
        userId, name: userStories[0].profiles?.name || 'User',
        avatar: userStories[0].profiles?.avatar_url || null,
        stories: userStories, seen: false,
      })));
    } catch {}
  }, [user?.id]);

  const loadCheckIns = useCallback(async () => {
    try {
      const data = await getRecentCheckIns(5);
      setRecentCheckIns(data);
    } catch {}
  }, []);

  const loadInitial = useCallback(async () => {
    if (!user?.id) return;
    serviceCall(() => getUnreadCount(user.id)).then(r => { if (r.ok) setUnreadCount(Number(r.data) || 0); }).catch(() => {});
    await loadStories();
    await loadCheckIns();
  }, [user?.id, loadStories, loadCheckIns, serviceCall]);

  const onRefresh = useCallback(async (refetch: () => Promise<void>) => {
    setRefreshing(true);
    try {
      await refetch();
      await loadInitial();
      await loadUserLikes();
    } finally {
      setRefreshing(false);
    }
  }, [loadInitial, loadUserLikes]);

  const handleLike = useCallback(async (postId: string) => {
    if (!user?.id || processingLikes.current.has(postId)) return;
    processingLikes.current.add(postId);
    let snapshot: { isLiked: boolean; likes: number } | null = null;
    setPosts(prev => {
      const post = prev.find(p => p.id === postId);
      snapshot = { isLiked: post?.isLiked || false, likes: post?.likes || 0 };
      return prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p);
    });
    try {
      const { data: ext } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
      if (ext) {
        await supabase.from('post_likes').delete().eq('id', ext.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
    } catch {
      if (snapshot) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: snapshot!.isLiked, likes: snapshot!.likes } : p));
      }
    } finally {
      processingLikes.current.delete(postId);
    }
  }, [user?.id]);

  const handleComment = useCallback(async (postId: string, text: string) => {
    if (!user?.id || !text?.trim()) return;
    let snapshot: number | null = null;
    setPosts(prev => {
      const post = prev.find(p => p.id === postId);
      snapshot = post?.comments || 0;
      return prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p);
    });
    try {
      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content: text });
      if (error) throw error;
    } catch {
      if (snapshot !== null) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: snapshot! } : p));
      }
    }
  }, [user?.id]);

  const handleNewPost = useCallback(async (postData: any) => {
    if (!user?.id) return;
    const { data, error } = await supabase.from('posts').insert({
      user_id: user.id, content: postData.content, image_url: postData.image,
      post_type: postData.postType || 'text', second_image_url: postData.secondImage || null,
    }).select('*, profiles:user_id(name, avatar_url)').single();
    if (error) throw error;
    setPosts(prev => [{
      id: data.id, userId: data.user_id,
      user: { name: data.profiles?.name || 'Você', avatar: data.profiles?.avatar_url || null },
      content: data.content, image: data.image_url, postType: data.post_type, secondImage: data.second_image_url,
      createdAt: t('social.justNow'), likes: 0, comments: 0, isLiked: false,
    }, ...prev]);
  }, [user?.id, t]);

  const handleGymCheckIn = useCallback(async (gymName: string) => {
    if (!user?.id) return;
    await checkIn(user.id, gymName);
    await loadCheckIns();
  }, [user?.id, loadCheckIns]);

  const setPostsFromDb = useCallback((dbPosts: any[]) => {
    setPosts(dbPosts.map(p => ({
      id: p.id, userId: p.user_id,
      user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
      content: p.content, image: p.image_url, postType: p.post_type || 'text',
      secondImage: p.second_image_url,
      createdAt: formatRelativeDate(p.created_at), likes: p.likes_count || 0,
      comments: p.comments_count || 0, isLiked: false,
    })));
    loadUserLikes();
  }, [loadUserLikes]);

  return {
    posts, refreshing, unreadCount, stories, recentCheckIns,
    loadInitial, onRefresh, handleLike, handleComment, handleNewPost,
    handleGymCheckIn, setPostsFromDb,
  };
}

// Lazy import to avoid circular deps
let _useSecurity: (() => any) | null = null;
function useSecurityLazy() {
  if (!_useSecurity) {
    try { _useSecurity = require('./useSecurity').useSecurity; } catch { _useSecurity = () => ({ checkAndPerform: async (_: any, __: any, fn: () => Promise<void>) => fn(), log: () => {}, ACTIONS: {} }); }
  }
  return _useSecurity!();
}
