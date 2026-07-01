// src/services/moderationIntegration.ts
// Serviço unificado: orquestra wordFilter + moderationFilters + shadowBan + alertas

import { WordFilter } from './wordFilter';
import { moderateText } from './moderationFilters';
import { checkAndShadowBan, isShadowBanned } from './shadowBan';
import { alertModerationTeam } from './moderationAlert';
import { reportContent } from './moderation';
import { logAction, ACTIONS } from './security/audit';

// ── Tipos ───────────────────────────────────────────────────────────

export interface ModerationResult {
  allowed: boolean;
  blocked: boolean;
  masked: string;
  violations: string[];
  severity: 'clean' | 'moderate' | 'severe';
  shadowBanned: boolean;
  warning?: boolean;
  message?: string;
}

export interface ReportResult {
  contentModerated: ModerationResult;
  reportCreated: boolean;
  actionLogged: boolean;
  alertSent: boolean;
}

// ── moderateContent ─────────────────────────────────────────────────

export async function moderateContent(
  content: string,
  userId: string,
): Promise<ModerationResult> {
  const filterResult = WordFilter.check(content);
  const modResult = moderateText(content, userId);
  const shadowBanned = await isShadowBanned(userId);

  const severity: ModerationResult['severity'] =
    modResult.blocked ? 'severe'
    : modResult.warning ? 'moderate'
    : !filterResult.clean ? 'moderate'
    : 'clean';

  const blocked = modResult.blocked || false;
  const allowed = modResult.allowed !== false && !shadowBanned;

  return {
    allowed,
    blocked,
    masked: filterResult.masked,
    violations: filterResult.violations,
    severity,
    shadowBanned,
    warning: modResult.warning,
    message: modResult.message,
  };
}

// ── reportAndModerate ───────────────────────────────────────────────

export async function reportAndModerate(
  content: string,
  reporterId: string,
  targetId: string,
): Promise<ReportResult> {
  const moderationResult = await moderateContent(content, reporterId);
  let reportCreated = false;
  let actionLogged = false;
  let alertSent = false;

  if (moderationResult.blocked || !moderationResult.allowed) {
    reportCreated = await reportContent(reporterId, {
      reason: `Conteúdo viola diretrizes: ${moderationResult.violations.join(', ') || 'palavras proibidas'}`,
      details: `Texto mascarado: ${moderationResult.masked}`,
      targetUser: { id: targetId },
    });

    await logAction(targetId, ACTIONS.CONTENT_FLAGGED, 'content', null, {
      reporter_id: reporterId,
      violations: moderationResult.violations,
      severity: moderationResult.severity,
      text_preview: content.substring(0, 100),
    });
    actionLogged = true;

    const shouldShadowBan = await checkAndShadowBan(targetId);
    if (shouldShadowBan) {
      await logAction(targetId, 'shadow_ban_applied', 'user', targetId, {
        reason: 'violações repetidas',
      });
    }

    if (moderationResult.severity === 'severe') {
      await alertModerationTeam(targetId, content, moderationResult.violations);
      alertSent = true;
    }
  } else if (moderationResult.warning) {
    await logAction(targetId, ACTIONS.CONTENT_FLAGGED, 'content', null, {
      reporter_id: reporterId,
      violations: moderationResult.violations,
      severity: 'moderate',
      text_preview: content.substring(0, 100),
    });
    actionLogged = true;
  }

  return { contentModerated: moderationResult, reportCreated, actionLogged, alertSent };
}
