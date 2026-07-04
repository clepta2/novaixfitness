// src/hooks/useRealtimePosts.ts
// Realtime subscription para tabela posts - NOVAIX FITNESS

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../config/supabase';

const SELECT = '*, profiles:user_id(name, avatar_url)';

interface FormattedPost {
  id: string;
  userId: string;
  user: { name: string; avatar: string | null };
  content: string;
  image: string | null;
  postType: string;
  secondImage: string | null;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

function formatPost(p: Record<string, unknown>): FormattedPost {
  const profiles = p.profiles as Record<string, unknown> | undefined;
  return {
    id: p.id as string,
    userId: p.user_id as string,
    user: { name: (profiles?.name as string) || 'Atleta', avatar: (profiles?.avatar_url as string) || null },
    content: p.content as string,
    image: p.image_url as string | null,
    postType: (p.post_type as string) || 'text',
    secondImage: (p.second_image_url as string) || null,
    createdAt: 'Agora',
    likes: (p.likes_count as number) || 0,
    comments: (p.comments_count as number) || 0,
    isLiked: false,
  };
}

export function useRealtimePosts(
  onInsert?: (post: FormattedPost) => void,
  onUpdate?: (data: { id: string; likes: number; comments: number }) => void,
  onDelete?: (id: string) => void
) {
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete });
  callbacksRef.current = { onInsert, onUpdate, onDelete };

  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const { data } = await supabase.from('posts').select(SELECT).eq('id', payload.new.id).maybeSingle();
        if (data) callbacksRef.current.onInsert?.(formatPost(data));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        callbacksRef.current.onUpdate?.({
          id: payload.new.id as string,
          likes: (payload.new.likes_count as number) || 0,
          comments: (payload.new.comments_count as number) || 0,
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        callbacksRef.current.onDelete?.(payload.old.id as string);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { refreshPost: useCallback(async (postId: string): Promise<FormattedPost | null> => {
    const { data } = await supabase.from('posts').select(SELECT).eq('id', postId).maybeSingle();
    return data ? formatPost(data) : null;
  }, []) };
}
