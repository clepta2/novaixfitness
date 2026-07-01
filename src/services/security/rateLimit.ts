// src/services/security/rateLimit.js
// Rate limiting por usuário

import { supabase } from '../../config/supabase';

interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
}

export async function checkRateLimit(userId: string, actionType: string, maxCount = 30, windowMinutes = 60): Promise<RateLimitResult> {
  try {
    const { data } = await supabase.rpc('check_user_rate_limit', {
      p_user_id: userId,
      p_action_type: actionType,
      p_max_count: maxCount,
      p_window_minutes: windowMinutes,
    });
    return data;
  } catch (err) {
    if (__DEV__) console.error('Erro ao verificar rate limit:', err);
    return { allowed: true, count: 0, limit: maxCount };
  }
}
