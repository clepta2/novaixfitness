// src/services/creatorContent.ts
// Conteudo exclusivo de criadores

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';
import { isSubscribedTo } from './creatorSubscription';

const guard = createServiceGuard({ serviceName: 'creatorContent' });

export async function createContent(creatorId, { title, description, contentType, mediaUrl, isPremium, priceCoins }) {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase.from(TABLES.CREATOR_CONTENT)
      .insert({
        creator_id: creatorId, title, description, content_type: contentType || 'workout',
        media_url: mediaUrl, is_premium: isPremium !== false, price_coins: priceCoins || 0,
      }).select().single();
    if (error) throw error;
    return data;
  });
  return result.ok ? result.data : null;
}

export async function getCreatorContent(creatorId, limit = 20) {
  const { data } = await supabase.from(TABLES.CREATOR_CONTENT)
    .select('*').eq('creator_id', creatorId).order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

export async function getFreeContent(limit = 20) {
  const { data } = await supabase.from(TABLES.CREATOR_CONTENT)
    .select('*, creator_profiles:creator_id(display_name, profiles:user_id(name, avatar_url))')
    .eq('is_premium', false).order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

export async function accessPremiumContent(contentId, userId) {
  const result = await guard.guard(async () => {
    const { data: content } = await supabase.from(TABLES.CREATOR_CONTENT).select('creator_id').eq('id', contentId).single();
    if (!content) throw new Error('Conteudo nao encontrado');
    const subscribed = await isSubscribedTo(content.creator_id, userId);
    if (!subscribed) throw new Error('Voce precisa assinar este criador');
    return true;
  });
  return result.ok ? result.data : false;
}
