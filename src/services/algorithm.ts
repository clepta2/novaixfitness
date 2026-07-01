// src/services/algorithm.js
// Serviço de algoritmo do feed

import { supabase } from '../config/supabase';

export async function trackInteraction(userId: string, postId: string, type: string) {
  await supabase.from('user_interactions').insert({
    user_id: userId,
    post_id: postId,
    interaction_type: type,
  });
}

export async function getRankedFeed(userId: string, page = 0, limit = 20) {
  const offset = page * limit;
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();

  const { data: following } = await supabase
    .from('user_follows')
    .select('following_id')
    .eq('follower_id', userId);

  const followingIds = (following || []).map(f => f.following_id);

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles:user_id(name, avatar_url)')
    .gte('created_at', twoDaysAgo)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

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
}
