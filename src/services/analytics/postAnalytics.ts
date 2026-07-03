// src/services/postAnalytics.ts
// Analytics e insights de posts

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'postAnalytics' });

export interface PostInsight {
  postId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  topReactions: { type: string; count: number }[];
}

export async function getPostInsights(postId: string): Promise<PostInsight | null> {
  const result = await guard.guard(async () => {
    const [postRes, likesRes, commentsRes, viewsRes] = await Promise.all([
      supabase.from(TABLES.POSTS).select('likes_count').eq('id', postId).single(),
      supabase.from(TABLES.POST_LIKES).select('type', { count: 'exact' }).eq('post_id', postId),
      supabase.from(TABLES.POST_COMMENTS).select('id', { count: 'exact' }).eq('post_id', postId),
      supabase.from('post_views').select('id', { count: 'exact' }).eq('post_id', postId),
    ]);

    const views = viewsRes.count || 0;
    const likes = likesRes.count || 0;
    const comments = commentsRes.count || 0;
    const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

    const { data: reactions } = await supabase
      .from(TABLES.POST_REACTIONS)
      .select('type')
      .eq('post_id', postId);

    const reactionMap = new Map<string, number>();
    (reactions || []).forEach((r: { type: string }) => {
      reactionMap.set(r.type, (reactionMap.get(r.type) || 0) + 1);
    });

    const topReactions = Array.from(reactionMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      postId,
      views,
      likes,
      comments,
      shares: 0,
      engagementRate: Math.round(engagementRate * 10) / 10,
      topReactions,
    };
  });

  return result.ok ? result.data : null;
}

export async function incrementViews(postId: string, userId?: string): Promise<void> {
  await guard.guard(async () => {
    await supabase.from('post_views').insert({
      post_id: postId,
      user_id: userId || null,
    });
  });
}

export async function getTopPosts(
  userId: string,
  limit: number = 10
): Promise<{ id: string; content: string; image_url: string | null; likes_count: number; created_at: string }[]> {
  const result = await guard.guard(async () => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .select('id, content, image_url, likes_count, created_at')
      .eq('user_id', userId)
      .gte('created_at', weekAgo)
      .order('likes_count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  });
  return result.ok ? result.data : [];
}
