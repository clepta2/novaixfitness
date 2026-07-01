// src/services/security/audit.js
// Audit log - registrar todas as ações

import { supabase } from '../../config/supabase';

export async function logAction(userId: string, action: string, entityType: string, entityId: string | null = null, details: Record<string, unknown> = {}) {
  try {
    await supabase.rpc('log_user_action', {
      p_user_id: userId,
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_details: details,
    });
  } catch (err) {
    if (__DEV__) console.error('Erro ao registrar ação:', err);
  }
}

export const ACTIONS = {
  POST_CREATED: 'post_created',
  POST_DELETED: 'post_deleted',
  POST_REPORTED: 'post_reported',
  COMMENT_MADE: 'comment_made',
  COMMENT_DELETED: 'comment_deleted',
  REACTION_MADE: 'reaction_made',
  REACTION_REMOVED: 'reaction_removed',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_EDITED: 'message_edited',
  MESSAGE_DELETED: 'message_deleted',
  STORY_CREATED: 'story_created',
  STORY_VIEWED: 'story_viewed',
  LIVE_CREATED: 'live_created',
  LIVE_JOINED: 'live_joined',
  LIVE_MESSAGE: 'live_message',
  CHECK_IN: 'check_in',
  GROUP_JOINED: 'group_joined',
  GROUP_LEFT: 'group_left',
  GROUP_POST: 'group_post',
  REFERRAL_SENT: 'referral_sent',
  REFERRAL_SUCCESS: 'referral_success',
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  SIGNUP: 'signup',
  PASSWORD_RESET: 'password_reset',
  USER_BLOCKED: 'user_blocked',
  USER_UNBLOCKED: 'user_unblocked',
  BLOCK_APPLIED: 'block_applied',
  CONTENT_FLAGGED: 'content_flagged',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
};
