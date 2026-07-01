// src/hooks/useReelsFeed.ts
// Hook para buscar reels reais do Supabase

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  views: string;
  likes: number;
  userName: string;
  userAvatar: string;
}

function formatViews(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function mapRow(row: any): Reel {
  return {
    id: row.id,
    title: row.title || row.content || '',
    videoUrl: row.video_url || row.media_url || '',
    thumbnail: row.thumbnail_url || row.image_url || '',
    views: formatViews(row.views_count || 0),
    likes: row.likes_count || 0,
    userName: row.profiles?.name || 'Atleta',
    userAvatar: row.profiles?.avatar_url || '',
  };
}

export function useReelsFeed(limit = 20) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReels = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('posts')
        .select('*, profiles:user_id(name, avatar_url)')
        .eq('type', 'video')
        .order('created_at', { ascending: false })
        .limit(limit);
      setReels((data || []).map(mapRow));
    } catch {
      setReels([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchReels(); }, [fetchReels]);

  return { reels, loading, refresh: fetchReels };
}
