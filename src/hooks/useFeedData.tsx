// Hook de gerenciamento de dados e interações do Feed - NOVAIX FITNESS

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useRealtimePosts } from './useRealtimePosts';
import { formatRelativeDate } from '../helpers/dates';
import { mapDbPostToFeed, buildNewPostEntry, computePopularThreshold, filterFeedPosts } from './helpers/feedHelpers';

const PAGE_SIZE = 10;

export interface FeedPost {
  id: string;
  userId: string;
  user: { name: string; avatar: string | null };
  content: string;
  image: string | null;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  [key: string]: unknown;
}

interface NewPostData {
  content: string;
  image?: string;
}

interface UseFeedDataReturn {
  user: ReturnType<typeof useAuth>['user'];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  showCreatePost: boolean;
  setShowCreatePost: (val: boolean) => void;
  hasNotif: boolean;
  setHasNotif: (val: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (val: boolean) => void;
  filteredPosts: FeedPost[];
  showEmpty: boolean;
  handleLike: (postId: string) => Promise<void>;
  handleNewPost: (postData: NewPostData) => Promise<void>;
  handleComment: (postId: string, text: string) => Promise<void>;
}

export function useFeedData(): UseFeedDataReturn {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [hasNotif, setHasNotif] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const fetchPosts = useCallback(async (pageNum: number = 0, append: boolean = false): Promise<void> => {
    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:user_id(name, avatar_url)')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const mapped: FeedPost[] = (data || []).map((p: Record<string, unknown>) => ({
        ...mapDbPostToFeed(p as any, likedPostIds),
        createdAt: formatRelativeDate(p.created_at as string),
      })) as FeedPost[];

      if (append) {
        setPosts(prev => [...prev, ...mapped]);
      } else {
        setPosts(mapped);
      }

      setHasMore(data?.length === PAGE_SIZE);
    } catch (err) {
      if (__DEV__) console.error('Erro ao buscar posts:', err);
    }
  }, []);

  useEffect(() => {
    async function loadInitialPosts() {
      setLoading(true);
      try {
        await fetchPosts(0, false);
      } catch {}
      setLoading(false);
    }
    loadInitialPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!user?.id) return;
    async function loadLikes() {
      try {
        const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', user!.id);
        if (data) {
          const likedIds = new Set(data.map((l: { post_id: string }) => l.post_id));
          setLikedPostIds(likedIds);
          setPosts(prev => prev.map(p => ({ ...p, isLiked: likedIds.has(p.id) })));
        }
      } catch {}
    }
    loadLikes();
  }, [user?.id]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts(nextPage, true);
    setLoadingMore(false);
  }, [page, loadingMore, hasMore, fetchPosts]);

  const handleRealtimeInsert = useCallback((newPost: { id: string; userId: string; user: { name: string; avatar: string | null }; content: string; image: string | null; postType: string; secondImage: string | null; createdAt: string; likes: number; comments: number; isLiked: boolean }): void => {
    setPosts(prev => prev.some(p => p.id === newPost.id) ? prev : [newPost as FeedPost, ...prev]);
  }, []);
  const handleRealtimeUpdate = useCallback((update: { id: string; likes: number; comments: number }): void => {
    setPosts(prev => prev.map(p => p.id === update.id ? { ...p, likes: update.likes, comments: update.comments } : p));
  }, []);
  const handleRealtimeDelete = useCallback((postId: string): void => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);
  useRealtimePosts(handleRealtimeInsert, handleRealtimeUpdate, handleRealtimeDelete);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    setPage(0);
    await fetchPosts(0, false);
    setRefreshing(false);
  };

  const handleLike = async (postId: string): Promise<void> => {
    if (!user) return;
    try {
      const { data: ext } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
      if (ext) {
        await supabase.from('post_likes').delete().eq('id', ext.id);
        setLikedPostIds(prev => { const s = new Set(prev); s.delete(postId); return s; });
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) } : p));
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        setLikedPostIds(prev => new Set([...prev, postId]));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
      }
    } catch (err) { if (__DEV__) console.error(err); }
  };

  const handleNewPost = async (postData: any): Promise<void> => {
    if (!user) return;
    try {
      const dbContent = (postData.feeling || postData.location || postData.workout)
        ? JSON.stringify({ text: postData.content, feeling: postData.feeling, location: postData.location, workout: postData.workout })
        : postData.content;
      const { data, error } = await supabase.from('posts')
        .insert({ user_id: user.id, content: dbContent, image_url: postData.image })
        .select('*, profiles:user_id(name, avatar_url)').maybeSingle();
      if (error) throw error;
      setPosts(prev => [buildNewPostEntry(data) as any, ...prev]);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível publicar seu post: ' + (err as Error).message);
    }
  };

  const handleComment = async (postId: string, text: string): Promise<void> => {
    if (!user) return;
    try {
      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content: text });
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário: ' + (err as Error).message);
    }
  };

  const popularThreshold: number = useMemo(() => computePopularThreshold(posts), [posts]);
  const filteredPosts: FeedPost[] = useMemo(() => filterFeedPosts(posts, selectedFilter, popularThreshold, user?.id as string) as FeedPost[], [posts, selectedFilter, popularThreshold, user?.id]);
  const showEmpty: boolean = !loading && filteredPosts.length === 0;

  return {
    user, loading, loadingMore, refreshing, onRefresh, loadMore, hasMore,
    selectedFilter, setSelectedFilter,
    showCreatePost, setShowCreatePost,
    hasNotif, setHasNotif,
    showNotifications, setShowNotifications,
    filteredPosts, showEmpty,
    handleLike, handleNewPost, handleComment,
  };
}
