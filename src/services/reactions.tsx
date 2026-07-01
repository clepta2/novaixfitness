// src/services/reactions.ts
// Serviço de reações para posts

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import type { ReactionType } from '../types';

interface ReactionResult {
  action: 'added' | 'removed' | 'changed';
  type: ReactionType;
}

interface PostReactions {
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType | null;
}

export async function toggleReaction(postId: string, userId: string, type: ReactionType): Promise<ReactionResult> {
  const { data: existing } = await supabase
    .from(TABLES.POST_REACTIONS)
    .select('id, type')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    if (existing.type === type) {
      await supabase.from('post_reactions').delete().eq('id', existing.id);
      return { action: 'removed', type };
    }
    await supabase.from('post_reactions').update({ type }).eq('id', existing.id);
    return { action: 'changed', type };
  }

  await supabase.from('post_reactions').insert({ post_id: postId, user_id: userId, type });
  return { action: 'added', type };
}

export async function getPostReactions(postId: string): Promise<PostReactions> {
  const { data } = await supabase
    .from(TABLES.POST_REACTIONS)
    .select('type, user_id')
    .eq('post_id', postId);

  if (!data) return { reactions: {} as Record<ReactionType, number>, userReaction: null };

  const reactions = {} as Record<ReactionType, number>;
  data.forEach(r => {
    const reactionType = r.type as ReactionType;
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
  });

  return { reactions };
}

export async function getUserReaction(postId: string, userId: string): Promise<ReactionType | null> {
  const { data } = await supabase
    .from(TABLES.POST_REACTIONS)
    .select('type')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return (data?.type as ReactionType) || null;
}
