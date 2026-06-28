// src/hooks/useRealtimeComments.js
// Realtime subscription para comentarios de um post - NOVAIX FITNESS

import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';

export function useRealtimeComments(postId, onNewComment) {
  const callbackRef = useRef(onNewComment);
  callbackRef.current = onNewComment;

  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`comments-${postId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'post_comments',
        filter: `post_id=eq.${postId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('post_comments')
          .select('*, profiles:user_id(name, avatar_url)')
          .eq('id', payload.new.id)
          .single();
        if (data) callbackRef.current?.(data);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);
}
