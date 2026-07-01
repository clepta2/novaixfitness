// src/services/virtualGifting.js
// Sistema de Virtual Gifting: moeda interna, presentes, ranking

import { supabase } from '../config/supabase';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'virtualGifting' });

// ============================================
// CARTEIRA
// ============================================

export async function getWallet(userId: string): Promise<Record<string, unknown>> {
  const { data } = await supabase
    .from('wallet')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data || { balance: 0, total_earned: 0, total_spent: 0 };
}

// ============================================
// CATÁLOGO DE PRESENTES
// ============================================

export async function getGiftCatalog(): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from('gift_catalog')
    .select('*')
    .eq('is_active', true)
    .order('coin_value', { ascending: true });

  return data || [];
}

// ============================================
// ENVIAR PRESENTE
// ============================================

export async function sendGift(senderId: string, receiverId: string, giftId: string, liveId: string | null = null, message: string | null = null): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('send_gift', {
    p_sender_id: senderId,
    p_receiver_id: receiverId,
    p_gift_id: giftId,
    p_live_id: liveId,
    p_message: message,
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

// ============================================
// COMPRAR COINS
// ============================================

export async function getCoinPackages(): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from('coin_packages')
    .select('*')
    .eq('is_active', true)
    .order('price_brl', { ascending: true });

  return data || [];
}

export async function buyCoins(userId: string, packageId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('buy_coins', {
    p_user_id: userId,
    p_package_id: packageId,
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

// ============================================
// HISTÓRICO DE PRESENTES
// ============================================

export async function getGiftHistory(userId: string, type: string = 'sent', limit: number = 20): Promise<Record<string, unknown>[]> {
  const column = type === 'sent' ? 'sender_id' : 'receiver_id';
  const { data } = await supabase
    .from('gift_transactions')
    .select('*, gift_catalog(name, emoji, coin_value), profiles:sender_id(name, avatar_url), profiles:receiver_id(name, avatar_url)')
    .eq(column, userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

// ============================================
// RANKING
// ============================================

export async function getTopGifters(limit: number = 10): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from('gift_rankings')
    .select('*, profiles:user_id(name, avatar_url)')
    .order('total_coins_sent', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getTopReceivers(limit: number = 10): Promise<Record<string, unknown>[]> {
  const { data } = await supabase
    .from('gift_rankings')
    .select('*, profiles:user_id(name, avatar_url)')
    .order('total_coins_received', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getUserRanking(userId: string): Promise<{ rank: number; coinsSent: number }> {
  const { data: senderRank } = await supabase
    .from('gift_rankings')
    .select('total_coins_sent')
    .eq('user_id', userId)
    .single();

  const { count } = await supabase
    .from('gift_rankings')
    .select('id', { count: 'exact', head: true })
    .gt('total_coins_sent', senderRank?.total_coins_sent || 0);

  return { rank: (count || 0) + 1, coinsSent: senderRank?.total_coins_sent || 0 };
}

// ============================================
// REALTIME (Presentes em live)
// ============================================

export function subscribeToGifts(liveId: string, onGift: (gift: Record<string, unknown>) => void): () => Promise<string> {
  const channel = supabase
    .channel(`gifts-${liveId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'gift_transactions',
      filter: `live_id=eq.${liveId}`,
    }, (payload) => {
      onGift(payload.new);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}
