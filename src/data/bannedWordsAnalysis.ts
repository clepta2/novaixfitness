// src/data/bannedWordsAnalysis.ts
// Funcoes de analise de texto e imagem

import { BANNED_WORDS, ALLOWED_WORDS, SPAM_PATTERNS, TOXICITY_PATTERNS, IMAGE_RULES } from './bannedWordsData';

export function analyzeText(text: string) {
  if (!text || typeof text !== 'string') return { clean: true, flags: [], severity: 'clean', suggestion: null };

  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[0-9]/g, '').replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const flags: { type: string; category?: string; word?: string; pattern?: string; severity: string }[] = [];

  for (const [category, words] of Object.entries(BANNED_WORDS)) {
    for (const word of words) {
      if (normalized.includes(word.toLowerCase())) {
        const isAllowed = ALLOWED_WORDS.some(a => normalized.includes(a.toLowerCase()) && Math.abs(normalized.indexOf(a.toLowerCase()) - normalized.indexOf(word.toLowerCase())) < 15);
        if (!isAllowed) flags.push({ type: 'banned_word', category, word, severity: category === 'severe' ? 'severe' : 'moderate' });
      }
    }
  }

  for (const { pattern, type, severity } of SPAM_PATTERNS) {
    if (pattern.test(text)) flags.push({ type: 'spam_pattern', pattern: type, severity });
  }

  for (const { pattern, type, severity } of TOXICITY_PATTERNS) {
    if (pattern.test(text)) flags.push({ type: 'toxicity', pattern: type, severity });
  }

  if (text.trim().length < 2) flags.push({ type: 'too_short', severity: 'low' });

  const hasBlockable = flags.some(f => f.severity === 'severe');
  const hasWarning = flags.some(f => f.severity === 'moderate');
  return {
    clean: flags.length === 0, flags,
    severity: hasBlockable ? 'severe' : hasWarning ? 'moderate' : 'clean',
    suggestion: hasBlockable ? 'Seu texto contem palavras proibidas.' : hasWarning ? 'Seu texto pode ser considerado inadequado.' : null,
  };
}

export function analyzeImage(file: { size?: number; name?: string }) {
  if (!file) return { clean: true, flags: [], severity: 'clean' };
  const flags: { type: string; severity: string; message: string }[] = [];

  if (file.size && file.size > IMAGE_RULES.maxSizeKB * 1024) flags.push({ type: 'too_large', severity: 'low', message: 'Imagem muito grande' });
  const ext = file.name?.split('.').pop()?.toLowerCase();
  if (ext && !IMAGE_RULES.allowedExtensions.includes(ext)) flags.push({ type: 'invalid_format', severity: 'moderate', message: 'Formato nao permitido' });
  if (file.name) {
    for (const pattern of IMAGE_RULES.suspiciousPatterns) {
      if (pattern.test(file.name)) flags.push({ type: 'suspicious_filename', severity: 'moderate', message: 'Nome de arquivo suspeito' });
    }
  }
  return { clean: flags.length === 0, flags, severity: flags.some(f => f.severity === 'severe') ? 'severe' : 'clean' };
}

export function censorText(text: string): string {
  let censored = text;
  for (const words of Object.values(BANNED_WORDS)) {
    for (const word of words) {
      censored = censored.replace(new RegExp(`\\b${word}\\b`, 'gi'), '*'.repeat(word.length));
    }
  }
  return censored;
}
