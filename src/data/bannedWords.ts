// src/data/bannedWords.ts
// Palavras bloqueadas - re-exportacao

export { BANNED_WORDS, ALLOWED_WORDS, SPAM_PATTERNS, TOXICITY_PATTERNS, IMAGE_RULES, USERNAME_BLACKLIST } from './bannedWordsData';
export { analyzeText, analyzeImage, censorText } from './bannedWordsAnalysis';
