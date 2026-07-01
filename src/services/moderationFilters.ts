// src/services/moderationFilters.js
// Filtros de moderacao para texto, imagem e username

import { analyzeText, analyzeImage, censorText, USERNAME_BLACKLIST } from '../data/bannedWords';
import { logAction, ACTIONS } from './security/audit';

export function moderateText(text, userId = null) {
  const analysis = analyzeText(text);
  if (!analysis.clean) {
    if (userId) {
      logAction(userId, ACTIONS.CONTENT_FLAGGED, 'text', null, {
        flags: analysis.flags, text_preview: text.substring(0, 100), severity: analysis.severity,
      });
    }
    if (analysis.severity === 'severe') {
      return { allowed: false, blocked: true, message: 'Seu texto contem palavras proibidas.', censored: censorText(text), flags: analysis.flags };
    }
    if (analysis.severity === 'moderate') {
      return { allowed: true, warning: true, message: analysis.suggestion || 'Atencao: seu texto pode ser inadequado.', censored: censorText(text), flags: analysis.flags };
    }
  }
  return { allowed: true, clean: true };
}

export function moderateImage(file, userId = null) {
  const analysis = analyzeImage(file);
  if (!analysis.clean) {
    if (userId) {
      logAction(userId, ACTIONS.CONTENT_FLAGGED, 'image', null, { flags: analysis.flags, filename: file.name, size: file.size });
    }
    if (analysis.severity === 'severe') {
      return { allowed: false, blocked: true, message: 'Esta imagem nao pode ser publicada.', flags: analysis.flags };
    }
  }
  return { allowed: true, clean: true };
}

export function moderateUsername(username) {
  const normalized = username.toLowerCase().trim();
  for (const blocked of USERNAME_BLACKLIST) {
    if (normalized === blocked || normalized.includes(blocked)) {
      return { allowed: false, message: 'Este nome de usuario nao e permitido.' };
    }
  }
  const textAnalysis = analyzeText(normalized);
  if (textAnalysis.severity === 'severe') {
    return { allowed: false, message: 'Este nome de usuario contem palavras proibidas.' };
  }
  if (normalized.length < 2) return { allowed: false, message: 'Nome muito curto.' };
  if (normalized.length > 30) return { allowed: false, message: 'Nome muito longo.' };
  return { allowed: true };
}
