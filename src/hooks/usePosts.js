// src/hooks/usePosts.js
// Hook para buscar posts da comunidade - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:user_id(name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (content, imageUrl = null) => {
    if (!user?.id || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl,
        });

      if (error) throw error;
      fetchPosts();
    } catch (err) {
      console.error('Erro ao criar post:', err);
    }
  };

  const toggleLike = async (postId) => {
    if (!user?.id) return;

    try {
      const { data: existing } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existing.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      fetchPosts();
    } catch (err) {
      console.error('Erro ao curtir:', err);
    }
  };

  return { posts, loading, createPost, toggleLike, refetch: fetchPosts };
}

export function usePostComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, profiles:user_id(name)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content) => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          content: content.trim(),
        });

      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  return { comments, loading, addComment, refetch: fetchComments };
}
