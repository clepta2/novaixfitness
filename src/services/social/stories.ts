// src/services/stories.js
// Serviço de stories efêmeros (24h)

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'stories' });

export async function getActiveStories(userId: string): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from(TABLES.STORIES)
    .select('*, profiles:user_id(name, avatar_url)')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  return data || [];
}

export async function createStory(userId: string, content: string, imageUrl?: string) {
  const result = await guard.guard(async () => {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
    const { data, error } = await supabase
      .from(TABLES.STORIES)
      .insert({ user_id: userId, content, image_url: imageUrl, expires_at: expiresAt })
      .select('*, profiles:user_id(name, avatar_url)')
      .single();
    if (error) throw error;
    return data;
  });
  return result.ok ? result.data : null;
}

export async function viewStory(storyId: string, userId: string): Promise<void> {
  await supabase.from(TABLES.STORY_VIEWS).upsert({
    story_id: storyId,
    user_id: userId,
  }, { onConflict: 'story_id,user_id' });
}

export async function deleteStory(storyId: string, userId: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase
      .from(TABLES.STORIES)
      .delete()
      .eq('id', storyId)
      .eq('user_id', userId);
    if (error) throw error;
  });
}

export async function getStoryViewers(storyId: string): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from(TABLES.STORY_VIEWS)
    .select('profiles:user_id(name, avatar_url), viewed_at')
    .eq('story_id', storyId);

  return data || [];
}

export async function cleanupExpiredStories(): Promise<void> {
  await supabase
    .from(TABLES.STORIES)
    .delete()
    .lt('expires_at', new Date().toISOString());
}
