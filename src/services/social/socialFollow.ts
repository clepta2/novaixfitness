// src/services/socialFollow.ts
// Seguir/deixar de seguir

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'socialFollow' });

export interface User {
  id: string;
  name: string;
  avatar_url: string;
  level: number;
  total_workouts?: number;
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) throw new Error('Cannot follow yourself');
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.USER_FOLLOWS)
      .insert({ follower_id: followerId, following_id: followingId });
    if (error) throw error;
    await supabase.from(TABLES.NOTIFICATIONS).insert({
      user_id: followingId, type: 'new_follower', title: 'Novo seguidor',
      body: 'Alguem comecou a seguir voce!', data: { follower_id: followerId },
    });
  });
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.USER_FOLLOWS)
      .delete().eq('follower_id', followerId).eq('following_id', followingId);
    if (error) throw error;
  });
}

export async function getFollowers(userId: string): Promise<User[]> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase.from(TABLES.USER_FOLLOWS)
      .select('profiles:follower_id (id, name, avatar_url, level)')
      .eq('following_id', userId);
    if (error) throw error;
    return (data || []).map((f: { profiles: unknown }) => f.profiles as User);
  });
  return result.ok ? result.data : [];
}

export async function getFollowing(userId: string): Promise<User[]> {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase.from(TABLES.USER_FOLLOWS)
      .select('profiles:following_id (id, name, avatar_url, level)')
      .eq('follower_id', userId);
    if (error) throw error;
    return (data || []).map((f: { profiles: unknown }) => f.profiles as User);
  });
  return result.ok ? result.data : [];
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const result = await guard.guard(async () => {
    const { data } = await supabase.from(TABLES.USER_FOLLOWS)
      .select('id').eq('follower_id', followerId).eq('following_id', followingId).single();
    return !!data;
  });
  return result.ok ? result.data : false;
}

export async function shareWorkout(userId: string, workoutId: string, message?: string) {
  const result = await guard.guard(async () => {
    const { data: workout } = await supabase.from(TABLES.WORKOUTS)
      .select('name, category, duration_minutes').eq('id', workoutId).single();
    const content = message || `Acabei de completar ${workout?.name || 'um treino'}!`;
    const { createPost } = await import('./socialFeed');
    return createPost(userId, content, null, workoutId);
  });
  return result.ok ? result.data : null;
}

export async function getTrendingPosts(limit: number = 10) {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase.from(TABLES.POSTS)
      .select('*, profiles:user_id (name, avatar_url, level)')
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
      .order('likes_count', { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  });
  return result.ok ? result.data : [];
}

export async function searchUsers(query: string, limit: number = 20): Promise<User[]> {
  const result = await guard.guard(async () => {
    const safeQuery = query.replace(/[%_]/g, '\\$&');
    const { data, error } = await supabase.from(TABLES.PROFILES)
      .select('id, name, avatar_url, level, total_workouts')
      .ilike('name', `%${safeQuery}%`).limit(limit);
    if (error) throw error;
    return (data || []) as User[];
  });
  return result.ok ? result.data : [];
}
