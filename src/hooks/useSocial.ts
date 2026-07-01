// src/hooks/useSocial.ts
// Hook de features sociais - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Post, PostComment } from '../types';
import {
  getFeed,
  createPost,
  deletePost,
  toggleLike,
  getComments,
  addComment,
} from '../services/socialFeed';
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  shareWorkout,
  getTrendingPosts,
  searchUsers,
} from '../services/socialFollow';

interface UserSearchResult {
  id: string;
  name: string;
  avatar_url: string | null;
  level: number;
}

export function useSocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      const data = await getFeed(user?.id, pageNum);
      if (append) {
        setPosts(prev => [...prev, ...data]);
      } else {
        setPosts(data);
      }
      setHasMore(data.length === 20);
    } catch (err) {
      if (__DEV__) console.warn('Erro ao buscar feed:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    fetchPosts(0).finally(() => setLoading(false));
  }, [fetchPosts]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    await fetchPosts(0);
    setRefreshing(false);
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts(nextPage, true);
  }, [page, hasMore, loading, fetchPosts]);

  const handlePost = useCallback(async (content: string, imageUrl: string | null) => {
    const newPost = await createPost(user.id, content, imageUrl);
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, [user?.id]);

  const handleDelete = useCallback(async (postId: string) => {
    await deletePost(postId, user.id);
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, [user?.id]);

  const handleLike = useCallback(async (postId: string) => {
    const isLiked = await toggleLike(postId, user.id);
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, isLiked, likesCount: (p.likesCount || 0) + (isLiked ? 1 : -1) }
        : p
    ));
    return isLiked;
  }, [user?.id]);

  return {
    posts,
    loading,
    refreshing,
    refresh,
    loadMore,
    hasMore,
    handlePost,
    handleDelete,
    handleLike,
  };
}

export function usePostComments(postId: string | null) {
  const { user } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    getComments(postId)
      .then(setComments)
      .catch((err) => { if (__DEV__) console.error('Erro ao carregar comentários:', err); })
      .finally(() => setLoading(false));
  }, [postId]);

  const handleAddComment = useCallback(async (content: string) => {
    const newComment = await addComment(postId!, user.id, content);
    setComments(prev => [...prev, newComment]);
    return newComment;
  }, [postId, user?.id]);

  return { comments, loading, handleAddComment };
}

export function useFollow(userId: string | null) {
  const { user } = useAuth();
  const [isFollowingUser, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (!user?.id || !userId) return;
    isFollowing(user.id, userId).then(setIsFollowing);
    getFollowers(userId).then(f => setFollowersCount(f.length));
  }, [user?.id, userId]);

  const toggleFollow = useCallback(async () => {
    if (isFollowingUser) {
      await unfollowUser(user.id, userId);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      await followUser(user.id, userId);
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  }, [isFollowingUser, user?.id, userId]);

  return { isFollowing: isFollowingUser, followersCount, toggleFollow };
}

export function useUserSearch() {
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchUsers(query);
      setResults(data);
    } catch (e) { if (__DEV__) console.warn('useUserSearch:', e); }
    setLoading(false);
  }, []);

  return { results, loading, search };
}
