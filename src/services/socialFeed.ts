// src/services/socialFeed.ts
// Feed, posts e comentarios

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';
import { trackEvent, EVENT_TYPES } from './analytics/eventTracker';
import type { Post as PostType, PostComment } from '../types';

const guard = createServiceGuard({ serviceName: 'socialFeed' });

export type Post = PostType;

export type Comment = PostComment;

export async function getFeed(userId: string, page: number = 0, limit: number = 20): Promise<Post[]> {
  const result = await guard.guard(async () => {
    const offset = page * limit;
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .select(`*, profiles:user_id (name, avatar_url, level), post_likes!left (user_id), post_comments (id)`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return (data || []).map(post => ({
      ...post,
      isLiked: post.post_likes?.some((like: { user_id: string }) => like.user_id === userId) || false,
      likesCount: post.post_likes?.length || 0,
      commentsCount: post.post_comments?.length || 0,
    })) as Post[];
  });
  return result.ok ? result.data : [];
}

export async function createPost(userId: string, content: string, imageUrl: string | null = null, workoutId: string | null = null): Promise<Post | null> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .insert({ user_id: userId, content, image_url: imageUrl, workout_id: workoutId })
      .select('*, profiles:user_id (name, avatar_url, level)')
      .single();
    if (error) throw error;
    trackEvent(EVENT_TYPES.SHARE_CLICKED, { type: 'post' }, userId);
    return data as Post;
  });
  return result.ok ? result.data : null;
}

export async function deletePost(postId: string, userId: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.POSTS).delete().eq('id', postId).eq('user_id', userId);
    if (error) throw error;
  });
}

export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const result = await guard.guard(async () => {
    const { data: existing } = await supabase.from(TABLES.POST_LIKES)
      .select('id').eq('post_id', postId).eq('user_id', userId).single();
    if (existing) {
      await supabase.from(TABLES.POST_LIKES).delete().eq('id', existing.id);
      await supabase.rpc('decrement_likes', { post_id: postId });
      return false;
    } else {
      await supabase.from(TABLES.POST_LIKES).insert({ post_id: postId, user_id: userId });
      await supabase.rpc('increment_likes', { post_id: postId });
      return true;
    }
  });
  return result.ok ? result.data : false;
}

export async function getComments(postId: string, page: number = 0, limit: number = 20): Promise<Comment[]> {
  const result = await guard.guard(async () => {
    const offset = page * limit;
    const { data, error } = await supabase
      .from(TABLES.POST_COMMENTS)
      .select('*, profiles:user_id (name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return (data || []) as Comment[];
  });
  return result.ok ? result.data : [];
}

export async function addComment(postId: string, userId: string, content: string): Promise<Comment | null> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from(TABLES.POST_COMMENTS)
      .insert({ post_id: postId, user_id: userId, content })
      .select('*, profiles:user_id (name, avatar_url)')
      .single();
    if (error) throw error;
    await supabase.rpc('increment_comments', { post_id: postId });
    return data as Comment;
  });
  return result.ok ? result.data : null;
}

export async function deleteComment(commentId: string, userId: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.POST_COMMENTS).delete().eq('id', commentId).eq('user_id', userId);
    if (error) throw error;
  });
}
