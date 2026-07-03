// src/ml/TranslationEngine.ts
// Motor de tradução MarianMT via ONNX Runtime
// Encoder + Decoder separados, quantizados INT8

import { Platform } from 'react-native';
import {
  shouldBypass,
  splitSentences,
  loadTokenizer,
  tokenize,
  detokenize,
  MarianMTTokenizer,
} from './Tokenizer';
import { ModelConfig } from './models-config';
import { CachedPaths } from './ModelManager';

let ort: any = null;

async function getOnnxRuntime() {
  if (ort) return ort;
  try {
    ort = require('onnxruntime-react-native');
    return ort;
  } catch (e) {
    console.warn('[ML] ONNX Runtime não disponível:', e);
    return null;
  }
}

function getSessionOptions() {
  return {
    intraOpNumThreads: 2,
    interOpNumThreads: 1,
    executionProviders: [
      Platform.OS === 'ios' ? 'coreml' : 'nnapi',
      'cpu',
    ],
    enableMemPattern: true,
    enableCpuMemArena: false,
  };
}

export class TranslationEngine {
  private encoderSession: any = null;
  private decoderSession: any = null;
  private tokenizer: MarianMTTokenizer | null = null;
  private config: ModelConfig | null = null;
  private isWarmedUp = false;
  private abortController: AbortController | null = null;

  async initialize(
    paths: CachedPaths,
    config: ModelConfig
  ): Promise<void> {
    this.config = config;

    // Carregar tokenizer
    try {
      this.tokenizer = await loadTokenizer(paths.tokenizer);
      if (__DEV__) console.log('[ML] Tokenizer carregado');
    } catch (e) {
      console.warn('[ML] Erro ao carregar tokenizer:', e);
    }

    // Criar sessões ONNX
    const ort = await getOnnxRuntime();
    if (!ort) {
      throw new Error('ONNX Runtime não disponível');
    }

    try {
      this.encoderSession = await ort.InferenceSession.create(
        paths.encoder,
        getSessionOptions()
      );
      this.decoderSession = await ort.InferenceSession.create(
        paths.decoder,
        getSessionOptions()
      );
      if (__DEV__) console.log('[ML] Sessões ONNX criadas (encoder + decoder)');
    } catch (error) {
      // Fallback CPU
      console.warn('[ML] Fallback para CPU:', error);
      const cpuOptions = { intraOpNumThreads: 2, executionProviders: ['cpu'] };
      this.encoderSession = await ort.InferenceSession.create(paths.encoder, cpuOptions);
      this.decoderSession = await ort.InferenceSession.create(paths.decoder, cpuOptions);
    }

    await this.warmUp();
  }

  private async warmUp(): Promise<void> {
    if (this.isWarmedUp || !this.encoderSession || !this.tokenizer) return;

    try {
      const warmupTokens = tokenize('Olá', this.tokenizer);
      const inputIds = new BigInt64Array(warmupTokens.map(t => BigInt(t)));
      const attentionMask = new BigInt64Array(warmupTokens.map(() => BigInt(1)));

      const encoderOutput = await this.encoderSession.run({
        input_ids: inputIds,
        attention_mask: attentionMask,
      });

      const encoderHidden = encoderOutput.last_hidden_state;
      if (encoderHidden) {
        const decoderInput = new BigInt64Array([BigInt(2)]); // </s> token
        await this.decoderSession.run({
          input_ids: decoderInput,
          encoder_hidden_states: encoderHidden,
        });
      }

      this.isWarmedUp = true;
      if (__DEV__) console.log('[ML] Warm-up concluído');
    } catch (e) {
      console.warn('[ML] Warm-up falhou (não crítico):', e);
    }
  }

  async translate(text: string, from: string = 'pt', to: string = 'en'): Promise<string> {
    if (shouldBypass(text)) return text;
    if (!this.encoderSession || !this.decoderSession) {
      throw new Error('Sessões ONNX não inicializadas');
    }
    if (!this.tokenizer || !this.config) {
      throw new Error('Tokenizer não inicializado');
    }

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const chunks = splitSentences(text);
      const results: string[] = [];

      for (const chunk of chunks) {
        if (signal.aborted) throw new Error('Abortado');
        const translated = await this.translateChunk(chunk);
        results.push(translated);
      }

      return results.join(' ');
    } catch (error: any) {
      if (error.message === 'Abortado') {
        if (__DEV__) console.log('[ML] Tradução cancelada');
        return text;
      }
      throw error;
    }
  }

  private async translateChunk(text: string): Promise<string> {
    if (!this.encoderSession || !this.decoderSession || !this.tokenizer) {
      return text;
    }

    // Tokenizar texto de entrada
    const inputTokenIds = tokenize(text, this.tokenizer);

    const inputIds = new BigInt64Array(inputTokenIds.map(t => BigInt(t)));
    const attentionMask = new BigInt64Array(inputTokenIds.map(() => BigInt(1)));

    // 1. Encoder
    const encoderOutput = await this.encoderSession.run({
      input_ids: inputIds,
      attention_mask: attentionMask,
    });

    const encoderHidden = encoderOutput.last_hidden_state;
    if (!encoderHidden) {
      console.warn('[ML] Encoder não retornou hidden states');
      return text;
    }

    // 2. Decoder (greedy autoregressive)
    const outputIds: number[] = [];
    let decoderInputIds = new BigInt64Array([BigInt(2)]); // </s> token

    const maxLen = 128;
    for (let i = 0; i < maxLen; i++) {
      const decoderOutput = await this.decoderSession.run({
        input_ids: decoderInputIds,
        encoder_hidden_states: encoderHidden,
      });

      const logits = decoderOutput.logits?.data;
      if (!logits) break;

      // Pegar último token
      const vocabSize = logits.length / decoderInputIds.length;
      const lastTokenOffset = (decoderInputIds.length - 1) * vocabSize;

      let maxLogit = -Infinity;
      let maxId = 0;
      for (let j = 0; j < vocabSize; j++) {
        if (logits[lastTokenOffset + j] > maxLogit) {
          maxLogit = logits[lastTokenOffset + j];
          maxId = j;
        }
      }

      // Parar em </s> ou <pad>
      if (maxId === 2 || maxId === 0) break;

      outputIds.push(maxId);

      // Preparar próximo input
      decoderInputIds = new BigInt64Array([...decoderInputIds, BigInt(maxId)]);
    }

    return detokenize(outputIds, this.tokenizer);
  }

  async translateBatch(texts: string[], from: string = 'pt', to: string = 'en'): Promise<string[]> {
    const results: string[] = [];
    for (const text of texts) {
      results.push(await this.translate(text, from, to));
    }
    return results;
  }

  dispose(): void {
    this.encoderSession?.release();
    this.decoderSession?.release();
    this.encoderSession = null;
    this.decoderSession = null;
    this.tokenizer = null;
    this.config = null;
    this.isWarmedUp = false;
  }
}
