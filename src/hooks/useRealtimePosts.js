// src/hooks/useRealtimePosts.js
// Realtime subscription para tabela posts - NOVAIX FITNESS

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../config/supabase';

const SELECT = '*, profiles:user_id(name, avatar_url)';

function formatPost(p) {
  return {
    id: p.id,
    userId: p.user_id,
    user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
    content: p.content,
    image: p.image_url,
    createdAt: 'Agora',
    likes: p.likes_count || 0,
    comments: p.comments_count || 0,
    isLiked: false,
  };
}

export function useRealtimePosts(onInsert, onUpdate, onDelete) {
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete });
  callbacksRef.current = { onInsert, onUpdate, onDelete };

  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const { data } = await supabase.from('posts').select(SELECT).eq('id', payload.new.id).single();
        if (data) callbacksRef.current.onInsert?.(formatPost(data));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        callbacksRef.current.onUpdate?.({
          id: payload.new.id,
          likes: payload.new.likes_count || 0,
          comments: payload.new.comments_count || 0,
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        callbacksRef.current.onDelete?.(payload.old.id);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { refreshPost: useCallback(async (postId) => {
    const { data } = await supabase.from('posts').select(SELECT).eq('id', postId).single();
    return data ? formatPost(data) : null;
  }, []) };
}
