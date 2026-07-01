// src/hooks/useTrendingContent.ts
// Hook para conteudo trending - posts, hashtags, sugestoes

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';

export interface TrendingPost extends Post {
  commentsCount: number;
  totalEngagement: number;
}

export interface TrendingHashtag {
  tag: string;
  count: number;
}

export interface SuggestedUser {
  id: string;
  name: string;
  avatar_url: string | null;
  level: number;
  mutualFollowers: number;
  workoutPattern: string;
}

interface UseTrendingContentReturn {
  trendingPosts: TrendingPost[];
  hashtags: TrendingHashtag[];
  suggestedUsers: SuggestedUser[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

export function useTrendingContent(): UseTrendingContentReturn {
  const { user } = useAuth();
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrendingPosts = useCallback(async () => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data } = await supabase
      .from(TABLES.POSTS)
      .select('*, profiles:user_id (name, avatar_url, level), post_likes (id), post_comments (id)')
      .gte('created_at', weekAgo)
      .eq('archived', false)
      .order('likes_count', { ascending: false })
      .limit(30);

    if (!data) return [];
    return data.map((p: Record<string, unknown>) => {
      const likesCount = (p.post_likes as unknown[])?.length || 0;
      const commentsCount = (p.post_comments as unknown[])?.length || 0;
      return {
        ...p,
        isLiked: false,
        likesCount,
        commentsCount,
        totalEngagement: likesCount + commentsCount,
      } as TrendingPost;
    });
  }, []);

  const fetchHashtags = useCallback(async () => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data } = await supabase
      .from(TABLES.POSTS)
      .select('content')
      .gte('created_at', weekAgo)
      .eq('archived', false);

    if (!data) return [];
    const tagMap = new Map<string, number>();
    const hashtagRegex = /#(\w+)/g;
    (data as { content: string }[]).forEach(({ content }) => {
      let match;
      while ((match = hashtagRegex.exec(content)) !== null) {
        const tag = match[1].toLowerCase();
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    });
    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, []);

  const fetchSuggestedUsers = useCallback(async () => {
    if (!user?.id) return [];
    const { data: following } = await supabase
      .from(TABLES.USER_FOLLOWS)
      .select('following_id')
      .eq('follower_id', user.id);
    const followingIds = (following || []).map((f: { following_id: string }) => f.following_id);
    followingIds.push(user.id);

    const { data } = await supabase
      .from(TABLES.PROFILES)
      .select('id, name, avatar_url, level, total_workouts')
      .not('id', 'in', `(${followingIds.join(',')})`)
      .order('total_workouts', { ascending: false })
      .limit(10);

    return (data || []).map((u: Record<string, unknown>) => ({
      id: u.id as string,
      name: u.name as string,
      avatar_url: u.avatar_url as string | null,
      level: (u.level as number) || 1,
      mutualFollowers: 0,
      workoutPattern: u.total_workouts ? `${u.total_workouts} treinos` : 'Novo',
    }));
  }, [user?.id]);

  const fetchAll = useCallback(async () => {
    const [posts, tags, users] = await Promise.all([
      fetchTrendingPosts(),
      fetchHashtags(),
      fetchSuggestedUsers(),
    ]);
    setTrendingPosts(posts);
    setHashtags(tags);
    setSuggestedUsers(users);
  }, [fetchTrendingPosts, fetchHashtags, fetchSuggestedUsers]);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  return { trendingPosts, hashtags, suggestedUsers, loading, refreshing, onRefresh };
}
