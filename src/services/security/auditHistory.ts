// src/services/security/auditHistory.js
// Histórico de auditoria

import { supabase } from '../../config/supabase';

export async function getUserAuditHistory(userId: string, limit = 100, offset = 0) {
  try {
    const { data } = await supabase.rpc('get_user_audit_history', {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    });
    return data;
  } catch (err) {
    if (__DEV__) console.error('Erro ao buscar audit history:', err);
    return null;
  }
}

interface AuditSearchParams {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export async function searchAuditLogs({ userId, action, entityType, startDate, endDate, limit = 100 }: AuditSearchParams) {
  let query = supabase
    .from('audit_log')
    .select('*, profiles:user_id(name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (userId) query = query.eq('user_id', userId);
  if (action) query = query.eq('action', action);
  if (entityType) query = query.eq('entity_type', entityType);
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data } = await query;
  return data || [];
}
