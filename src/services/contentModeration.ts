// src/services/contentModeration.ts
// Servico de moderacao de conteudo - re-exportacao

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { moderateText, moderateImage, moderateUsername } from './moderationFilters';
export { moderateText, moderateImage, moderateUsername };

export { getCustomBannedWords, addCustomBannedWord, removeCustomBannedWord } from './moderationAdmin';
export { getUserViolationPattern, getModerationStats, getRecentViolations } from './moderationAdmin';

interface ModerationResult {
  allowed: boolean;
  blocked?: boolean;
  message?: string;
}

interface ContentInput {
  uri?: string;
}

export async function preModerateContent(
  userId: string,
  contentType: 'post' | 'message' | 'story',
  content: string | ContentInput,
): Promise<ModerationResult> {
  const { data: blockStatus } = await supabase.rpc('is_user_blocked', {
    p_user_id: userId,
    p_block_type: contentType === 'post' ? 'post' : contentType === 'message' ? 'chat' : 'all',
  });
  if (blockStatus?.blocked) return { allowed: false, blocked: true, message: `Sua conta esta bloqueada: ${blockStatus.reason}` };

  const { data: trust } = await supabase.from(TABLES.USER_TRUST).select('trust_score').eq('user_id', userId).single();
  if (trust && trust.trust_score < 20) return { allowed: false, blocked: true, message: 'Sua conta esta restrita devido a violacoes repetidas.' };

  if (typeof content === 'string') return moderateText(content, userId);
  if ((content as ContentInput)?.uri) return moderateImage(content as ContentInput, userId);
  return { allowed: true };
}
