// src/ml/Tokenizer.ts
// Tokenizer para MarianMT (SentencePiece-based)
// Carrega tokenizer.json do modelo baixado

import * as FileSystem from 'expo-file-system';

// Cache do tokenizer carregado
let cachedTokenizer: MarianMTTokenizer | null = null;
let cachedTokenizerPath: string | null = null;

interface TokenizerVocab {
  model: {
    vocab: Record<string, number>;
    merges: string[];
  };
}

export interface MarianMTTokenizer {
  vocab: Record<string, number>;
  reverseVocab: Record<number, string>;
  merges: string[];
}

// Regex para filtro de emojis
const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
const TEXT_ONLY_REGEX = /^[a-zA-ZÀ-ÿ0-9\s.,!?;:'"()\[\]{}\-]+$/;

// Verifica se texto deve bypass do ONNX
export function shouldBypass(text: string): boolean {
  if (!text || text.trim().length === 0) return true;
  const stripped = text.replace(/\s/g, '');
  if (stripped.length === 0) return true;
  if (EMOJI_REGEX.test(stripped) && !TEXT_ONLY_REGEX.test(stripped)) return true;
  return false;
}

// Carrega tokenizer de um arquivo JSON
export async function loadTokenizer(tokenizerPath: string): Promise<MarianMTTokenizer> {
  if (cachedTokenizer && cachedTokenizerPath === tokenizerPath) {
    return cachedTokenizer;
  }

  try {
    const content = await FileSystem.readAsStringAsync(tokenizerPath);
    const data: TokenizerVocab = JSON.parse(content);

    const vocab = data.model.vocab;
    const reverseVocab: Record<number, string> = {};

    for (const [token, id] of Object.entries(vocab)) {
      reverseVocab[id] = token;
    }

    cachedTokenizer = {
      vocab,
      reverseVocab,
      merges: data.model.merges || [],
    };
    cachedTokenizerPath = tokenizerPath;

    if (__DEV__) console.log(`[ML] Tokenizer carregado: ${Object.keys(vocab).length} tokens`);
    return cachedTokenizer;
  } catch (error) {
    console.error('[ML] Erro ao carregar tokenizer:', error);
    throw error;
  }
}

// Tokeniza texto com tokenizer MarianMT
export function tokenize(text: string, tokenizer: MarianMTTokenizer): number[] {
  const tokenIds: number[] = [];

  // Tokenizar cada palavra
  const words = text.split(/\s+/);
  for (const word of words) {
    const id = tokenizer.vocab[word];
    if (id !== undefined) {
      tokenIds.push(id);
    } else {
      const lowerId = tokenizer.vocab[word.toLowerCase()];
      tokenIds.push(lowerId !== undefined ? lowerId : (tokenizer.vocab['<unk>'] || 1));
    }
  }

  return tokenIds;
}

// Detokeniza IDs para texto
export function detokenize(ids: number[], tokenizer: MarianMTTokenizer): string {
  const tokens: string[] = [];

  for (const id of ids) {
    const token = tokenizer.reverseVocab[id];
    if (token && !token.startsWith('>>') && token !== '<unk>' && token !== '</s>' && token !== '<pad>') {
      tokens.push(token);
    }
  }

  return tokens.join(' ');
}

// Quebra texto longo em sentenças (Sliding Window)
export function splitSentences(text: string, maxChars: number = 500): string[] {
  if (text.length <= maxChars) return [text];

  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence + ' ';
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}
