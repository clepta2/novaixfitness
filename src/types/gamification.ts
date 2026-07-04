// src/types/gamification.ts - Tipos de conquistas, niveis e desafios

export type AchievementCategory = 'streak' | 'workout' | 'time' | 'social' | 'level' | 'special';

export type Achievement = {
  id: string; name: string; description: string; icon: string; color?: string;
  category: AchievementCategory; requirement: number; xpReward: number;
  unlocked?: boolean; unlocked_at?: string;
};

export type LevelInfo = {
  level: number; name: string; xpRequired: number; color: string; icon: string; rewards: string[];
};

export type Level = {
  level: number; minXp: number; maxXp: number; title: string;
};

export type ChallengeType = 'streak_30' | 'workout_count' | 'minutes';

export type FriendChallenge = {
  id: string; challenger_id: string; challenged_id: string;
  challenge_type: ChallengeType; title: string; description: string;
  target_value: number; status: string; winner_id?: string;
  start_date?: string; end_date: string; stake_coins: number;
  created_at: string;
};

export type ChallengeProgress = {
  id: string; challenge_id: string; user_id: string;
  current_value: number; last_updated: string;
};

export type Referral = {
  id: string; user_id: string; code: string;
  referral_count: number; created_at: string;
};

export type ReferralReward = {
  id: string; user_id: string; referred_user_id: string;
  reward_type: string; reward_value: number; created_at: string;
};
