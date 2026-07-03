// src/services/algorithm.ts
// Serviço de algoritmo do feed — com error handling

import { supabase } from '../config/supabase';
import { tryIf } from '../utils/tryIf';

export async function trackInteraction(userId: string, postId: string, type: string) {
  await tryIf(async () => {
    const { error } = await supabase.from('user_interactions').insert({
      user_id: userId,
      post_id: postId,
      interaction_type: type,
    });
    if (error) throw error;
  }, { retries: 1, baseDelay: 500 });
}

export async function getRankedFeed(userId: string, page = 0, limit = 20) {
  const result = await tryIf(async () => {
    const offset = page * limit;
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();

    const { data: following, error: followError } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId);
    if (followError) throw followError;

    const followingIds = (following || []).map(f => f.following_id);

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*, profiles:user_id(name, avatar_url)')
      .gte('created_at', twoDaysAgo)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (postsError) throw postsError;

    if (!posts) return [];

    const scored = posts.map(post => {
      let score = 0;
      const ageHours = (Date.now() - new Date(post.created_at).getTime()) / 3600000;
      score += Math.max(0, 100 - ageHours * 2);
      if (followingIds.includes(post.user_id)) score += 50;
      score += (post.likes_count || 0) * 3;
      score += (post.comments_count || 0) * 5;
      score += (post.reactions_count || 0) * 2;
      return { ...post, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : [];
}
