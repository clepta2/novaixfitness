// src/types/creator.ts - Tipos de criadores de conteudo

export type CreatorStatus = 'active' | 'pending' | 'rejected';

export type CreatorProfile = {
  user_id: string; display_name: string; bio: string; category: string;
  status: CreatorStatus; total_earned: number; subscriber_count: number;
  profiles?: { name: string; avatar_url: string | null };
};

export type ContentType = 'workout' | 'tip' | 'routine' | 'video';

export type CreatorContent = {
  id: string; creator_id: string; title: string; description: string;
  content_type: ContentType; media_url: string | null;
  is_premium: boolean; price_coins: number; created_at: string;
  creator_profiles?: CreatorProfile;
};

export type CreatorSubscription = {
  id: string; creator_id: string; user_id: string; status: string;
  price_brl: number; created_at: string;
};

export type CreatorRevenue = {
  id: string; creator_id: string; amount: number;
  type: string; created_at: string;
};

export type CreatorStats = {
  activeSubscribers: number; totalContent: number;
  totalEarned: number; subscriberCount: number;
};
