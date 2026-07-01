// src/services/stories.js
// Serviço de stories efêmeros (24h)

import { supabase } from '../config/supabase';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'stories' });

export async function getActiveStories(userId: string): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from('stories')
    .select('*, profiles:user_id(name, avatar_url)')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  return data || [];
}

export async function viewStory(storyId: string, userId: string): Promise<void> {
  await supabase.from('story_views').upsert({
    story_id: storyId,
    user_id: userId,
  }, { onConflict: 'story_id,user_id' });
}

export async function deleteStory(storyId: string, userId: string): Promise<void> {
  await guard.guard(async () => {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', userId);
    if (error) throw error;
  });
}

export async function getStoryViewers(storyId: string): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from('story_views')
    .select('profiles:user_id(name, avatar_url), viewed_at')
    .eq('story_id', storyId);

  return data || [];
}

export async function cleanupExpiredStories(): Promise<void> {
  await supabase
    .from('stories')
    .delete()
    .lt('expires_at', new Date().toISOString());
}
