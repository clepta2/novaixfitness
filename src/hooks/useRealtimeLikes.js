// src/hooks/useRealtimeLikes.js
// Realtime subscription para likes de um post - NOVAIX FITNESS

import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';

export function useRealtimeLikes(postId, { onLikeAdded, onLikeRemoved, currentUserId }) {
  const callbacksRef = useRef({ onLikeAdded, onLikeRemoved, currentUserId });
  callbacksRef.current = { onLikeAdded, onLikeRemoved, currentUserId };

  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`likes-${postId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'post_likes',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        const isOwn = payload.new.user_id === callbacksRef.current.currentUserId;
        callbacksRef.current.onLikeAdded?.(postId, isOwn);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'post_likes',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        callbacksRef.current.onLikeRemoved?.(postId);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);
}
