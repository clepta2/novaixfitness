// src/services/wordFilter.ts
// Filtro de palavras banidas com normalização, fuzzy matching e shadow mask

import bannedWordsData from '../data/bannedWords.json';

const LEET_MAP: Record<string, string> = {
  '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't',
  '@': 'a', '$': 's', '!': 'i', '+': 't',
};

export interface FilterResult {
  clean: boolean;
  masked: string;
  violations: string[];
}

export class WordFilter {
  private static bannedWords: Set<string> = new Set();
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;
    const allWords: string[] = [
      ...bannedWordsData.severe,
      ...bannedWordsData.moderate,
      ...bannedWordsData.drugs,
      ...bannedWordsData.violence,
      ...bannedWordsData.spam,
      ...bannedWordsData.fallback,
    ];
    this.bannedWords = new Set(
      allWords.map(w => this.normalizeText(w)).filter(Boolean)
    );
    this.initialized = true;
  }

  static normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>\[\]\\|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static decodeLeetSpeak(text: string): string {
    let result = text;
    for (const [char, letter] of Object.entries(LEET_MAP)) {
      result = result.split(char).join(letter);
    }
    return result;
  }

  static levenshteinDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  static checkFuzzyBypass(word: string): boolean {
    const normalized = this.normalizeText(word);
    if (this.bannedWords.has(normalized)) return false;

    for (const banned of this.bannedWords) {
      if (banned.length < 3) continue;
      if (normalized.includes(banned)) return false;
      if (normalized.length >= 4) {
        const distance = this.levenshteinDistance(normalized, banned);
        if (distance <= 2) return false;
      }
    }
    return true;
  }

  static isClean(text: string): boolean {
    if (!text) return true;
    this.initialize();

    const decoded = this.decodeLeetSpeak(text);
    const normalized = this.normalizeText(decoded);
    const words = normalized.split(/\s+/).filter(Boolean);

    for (const word of words) {
      if (this.bannedWords.has(word)) return false;
      if (!this.checkFuzzyBypass(word)) return false;
    }
    return true;
  }

  static maskText(text: string): string {
    if (!text) return text;
    this.initialize();

    let masked = text;
    const decoded = this.decodeLeetSpeak(text);
    const normalized = this.normalizeText(decoded);
    const words = normalized.split(/\s+/).filter(Boolean);

    for (const word of words) {
      if (!this.bannedWords.has(word) && this.checkFuzzyBypass(word)) continue;
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      masked = masked.replace(regex, '*'.repeat(word.length));
    }
    return masked;
  }

  static getViolations(text: string): string[] {
    if (!text) return [];
    this.initialize();

    const decoded = this.decodeLeetSpeak(text);
    const normalized = this.normalizeText(decoded);
    const words = normalized.split(/\s+/).filter(Boolean);
    const violations: string[] = [];

    for (const word of words) {
      if (this.bannedWords.has(word) || !this.checkFuzzyBypass(word)) {
        if (!violations.includes(word)) violations.push(word);
      }
    }
    return violations;
  }

  static check(text: string): FilterResult {
    return {
      clean: this.isClean(text),
      masked: this.maskText(text),
      violations: this.getViolations(text),
    };
  }
}
