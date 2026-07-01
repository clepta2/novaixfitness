// src/middleware/communityGuard.ts
// Validação de conteúdo antes de salvar no Supabase

import { WordFilter, FilterResult } from '../services/wordFilter';

export function validateContent(text: string): FilterResult {
  if (!text || !text.trim()) {
    return { clean: true, masked: '', violations: [] };
  }
  return WordFilter.check(text);
}

export function shouldBlock(violations: string[], severity = 'moderate'): boolean {
  if (violations.length === 0) return false;
  if (severity === 'severe') return true;
  return violations.length >= 3;
}
