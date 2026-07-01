// src/constants/reactions.ts
// Tipos de reação para posts da comunidade

export interface ReactionType {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export const REACTION_TYPES: ReactionType[] = [
  { id: 'heart', emoji: '❤️', label: 'Curtir', color: '#FF1744' },
  { id: 'muscle', emoji: '💪', label: 'Força', color: '#FF6B35' },
  { id: 'fire', emoji: '🔥', label: 'Fogo', color: '#FF6B35' },
  { id: 'clap', emoji: '👏', label: 'Parabéns', color: '#FFD600' },
  { id: 'love', emoji: '😍', label: 'Amei', color: '#EC4899' },
  { id: 'mindblown', emoji: '🤯', label: 'Incrível', color: '#6366F1' },
];

export const REACTION_MAP: Record<string, ReactionType> = Object.fromEntries(
  REACTION_TYPES.map(r => [r.id, r])
) as Record<string, ReactionType>;
