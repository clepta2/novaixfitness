// src/types/social.ts - Tipos de feed, posts, stories, chat

export type Post = {
  id: string; user_id: string; content: string; image_url: string | null;
  workout_id: string | null; likes_count: number; created_at: string;
  profiles?: { name: string; avatar_url: string | null; level: number };
  isLiked?: boolean; likesCount?: number; commentsCount?: number;
};

export type PostComment = {
  id: string; post_id: string; user_id: string; content: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type ReactionType = 'like' | 'fire' | 'strong' | 'clap' | 'muscle';
export type PostReaction = { id: string; post_id: string; user_id: string; type: ReactionType };

export type Story = {
  id: string; user_id: string; content: string; expires_at: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type UserFollow = { id: string; follower_id: string; following_id: string; created_at: string };
export type FollowProfile = { id: string; name: string; avatar_url: string | null; level: number };

export type ConversationType = 'direct' | 'group';

export type Conversation = {
  id: string; type: ConversationType; name: string | null; updated_at: string;
  members?: ConversationMember[]; lastMessage?: ChatMessage | null; unreadCount?: number;
};

export type ConversationMember = {
  user_id: string; conversation_id: string; last_read_at?: string; role?: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type MessageType = 'text' | 'image' | 'workout_share';

export type ChatMessage = {
  id: string; conversation_id: string; user_id: string; content: string;
  type: MessageType; reply_to: string | null; edited: boolean;
  deleted: boolean; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type Comment = {
  id: string; post_id: string; user_id: string; content: string;
  created_at: string; user?: { name: string; avatar_url: string | null };
};

export type Challenge = {
  id: string; challenger_id: string; challenged_id: string;
  type: 'reps' | 'duration' | 'distance';
  duration: '1day' | '3days' | '1week';
  stake: number; status: 'pending' | 'active' | 'completed' | 'cancelled';
  challenger_progress?: number; challenged_progress?: number;
  created_at: string; expires_at: string;
};
