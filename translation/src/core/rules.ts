import type { GrammarRule, Language } from './types';

interface ArticleRule {
  pt: RegExp;
  en: string;
  es: string;
}

// ── Artigos PT→EN/ES (pré-compilados) ─────────────────────
const ARTICLES_PT_EN: ArticleRule[] = [
  { pt: /\bo\b/gi, en: 'the', es: 'el' },
  { pt: /\ba\b/gi, en: 'the', es: 'la' },
  { pt: /\bum\b/gi, en: 'a', es: 'un' },
  { pt: /\buma\b/gi, en: 'a', es: 'una' },
  { pt: /\bos\b/gi, en: 'the', es: 'los' },
  { pt: /\bas\b/gi, en: 'the', es: 'las' },
  { pt: /\bums\b/gi, en: 'some', es: 'unos' },
  { pt: /\bumas\b/gi, en: 'some', es: 'unas' },
];

// ── Possessivos (pré-compilados como RegExp) ───────────────
const POSSESSIVES: Record<string, Record<Language, string>> = {
  meu: { pt: 'meu', en: 'my', es: 'mi' },
  minha: { pt: 'minha', en: 'my', es: 'mi' },
  teu: { pt: 'teu', en: 'your', es: 'tu' },
  tua: { pt: 'tua', en: 'your', es: 'tu' },
  seu: { pt: 'seu', en: 'your', es: 'su' },
  sua: { pt: 'sua', en: 'your', es: 'su' },
  nosso: { pt: 'nosso', en: 'our', es: 'nuestro' },
  nossa: { pt: 'nossa', en: 'our', es: 'nuestra' },
  deles: { pt: 'deles', en: 'their', es: 'su' },
  delas: { pt: 'delas', en: 'their', es: 'su' },
};

// ── Negação (pré-compilada como RegExp) ─────────────────────
const NEGATION: Record<string, Record<Language, string>> = {
  nenhum: { pt: 'nenhum', en: 'no', es: 'ningún' },
  nenhuma: { pt: 'nenhuma', en: 'no', es: 'ninguna' },
  ningueem: { pt: 'ninguém', en: 'nobody', es: 'nadie' },
  nada: { pt: 'nada', en: 'nothing', es: 'nada' },
  nunca: { pt: 'nunca', en: 'never', es: 'nunca' },
  nem: { pt: 'nem', en: 'neither', es: 'ni' },
};

// ── RegExp pré-compilados (uma vez no init) ─────────────────
const POSSESSIVE_EN_REGEXES = Object.entries(POSSESSIVES).map(([pt, m]) => ({
  regex: new RegExp(`\\b${pt}\\b`, 'gi'),
  replacement: m.en,
}));

const POSSESSIVE_ES_REGEXES = Object.entries(POSSESSIVES).map(([pt, m]) => ({
  regex: new RegExp(`\\b${pt}\\b`, 'gi'),
  replacement: m.es,
}));

const NEGATION_EN_REGEXES = Object.entries(NEGATION).map(([pt, m]) => ({
  regex: new RegExp(`\\b${pt}\\b`, 'gi'),
  replacement: m.en,
}));

const NEGATION_ES_REGEXES = Object.entries(NEGATION).map(([pt, m]) => ({
  regex: new RegExp(`\\b${pt}\\b`, 'gi'),
  replacement: m.es,
}));

// ── Regras de gramática (pré-compiladas) ───────────────────
export const GRAMMAR_RULES: GrammarRule[] = [
  ...ARTICLES_PT_EN.map((a, i) => ({
    id: `article-${i}`,
    source: 'pt' as Language,
    target: 'en' as Language,
    match: a.pt,
    replace: () => a.en,
    description: `PT article → EN ${a.en}`,
  })),
  ...ARTICLES_PT_EN.map((a, i) => ({
    id: `article-es-${i}`,
    source: 'pt' as Language,
    target: 'es' as Language,
    match: a.pt,
    replace: () => a.es,
    description: `PT article → ES ${a.es}`,
  })),
];

// ── Formatação de números ──────────────────────────────────
const NUMBER_FORMATS: Record<Language, { decimal: string; thousands: string; currency: string }> = {
  pt: { decimal: ',', thousands: '.', currency: 'R$ ' },
  en: { decimal: '.', thousands: ',', currency: '$' },
  es: { decimal: ',', thousands: '.', currency: '$' },
};

// ── Mapa de gêneros (memoizado) ────────────────────────────
const GENDER_MAP: Record<string, Record<Language, string>> = {
  masculino: { pt: 'masculino', en: 'male', es: 'masculino' },
  feminino: { pt: 'feminino', en: 'female', es: 'femenino' },
  forte: { pt: 'forte', en: 'strong', es: 'fuerte' },
  rapido: { pt: 'rápido', en: 'fast', es: 'rápido' },
  alta: { pt: 'alta', en: 'high', es: 'alta' },
  baixa: { pt: 'baixa', en: 'low', es: 'baja' },
  bom: { pt: 'bom', en: 'good', es: 'bueno' },
  boa: { pt: 'boa', en: 'good', es: 'buena' },
  otimo: { pt: 'ótimo', en: 'great', es: 'genial' },
  otima: { pt: 'ótima', en: 'great', es: 'genial' },
};

// ── Aplicação de regras (com regex pré-compilados) ──────────
export function applyRules(text: string, source: Language, target: Language): string {
  if (source === 'pt' && target === 'en') {
    let result = text;
    for (const { regex, replacement } of POSSESSIVE_EN_REGEXES) {
      result = result.replace(regex, replacement);
    }
    for (const { regex, replacement } of NEGATION_EN_REGEXES) {
      result = result.replace(regex, replacement);
    }
    return result;
  }

  if (source === 'pt' && target === 'es') {
    let result = text;
    for (const { regex, replacement } of POSSESSIVE_ES_REGEXES) {
      result = result.replace(regex, replacement);
    }
    for (const { regex, replacement } of NEGATION_ES_REGEXES) {
      result = result.replace(regex, replacement);
    }
    return result;
  }

  return text;
}

export function formatNumber(value: number, target: Language, decimals = 0): string {
  const fmt = NUMBER_FORMATS[target];
  const parts = value.toFixed(decimals).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, fmt.thousands);
  const decPart = parts[1];
  return decPart ? intPart + fmt.decimal + decPart : intPart;
}

export function formatCurrency(value: number, target: Language, decimals = 2): string {
  const fmt = NUMBER_FORMATS[target];
  return fmt.currency + formatNumber(value, target, decimals);
}

export function getGenderMap(): Record<string, Record<Language, string>> {
  return GENDER_MAP;
}
