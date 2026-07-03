// src/ml/models-config.ts
// Configuração dos modelos de tradução MarianMT
// Modelos pré-quantizados INT8 do HuggingFace

export interface ModelConfig {
  id: string;
  from: string;
  to: string;
  encoderUrl: string;
  decoderUrl: string;
  tokenizerUrl: string;
  encoderSize: number;
  decoderSize: number;
  version: string;
}

// URLs base - Cloudflare R2 Public Development URL
const BASE_URL = 'https://pub-1fb26dadb55c4712a62e72f06218c04d.r2.dev/TRADUTOR';

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'pt-en': {
    id: 'pt-en',
    from: 'pt',
    to: 'en',
    encoderUrl: `${BASE_URL}/pt-en/encoder_model_quantized.onnx`,
    decoderUrl: `${BASE_URL}/pt-en/decoder_model_quantized.onnx`,
    tokenizerUrl: `${BASE_URL}/pt-en/tokenizer.json`,
    encoderSize: 52_736_580,
    decoderSize: 92_874_934,
    version: '1.0.0',
  },
  'en-pt': {
    id: 'en-pt',
    from: 'en',
    to: 'pt',
    encoderUrl: `${BASE_URL}/en-pt/encoder_model_quantized.onnx`,
    decoderUrl: `${BASE_URL}/en-pt/decoder_model_quantized.onnx`,
    tokenizerUrl: `${BASE_URL}/en-pt/tokenizer.json`,
    encoderSize: 133_114_658,
    decoderSize: 214_969_894,
    version: '1.0.0',
  },
  'ca-pt': {
    id: 'ca-pt',
    from: 'ca',
    to: 'pt',
    encoderUrl: `${BASE_URL}/ca-pt/encoder_model_quantized.onnx`,
    decoderUrl: `${BASE_URL}/ca-pt/decoder_model_quantized.onnx`,
    tokenizerUrl: `${BASE_URL}/ca-pt/tokenizer.json`,
    encoderSize: 31_565_875,
    decoderSize: 49_788_570,
    version: '1.0.0',
  },
};

export function getModelConfig(from: string, to: string): ModelConfig | undefined {
  return MODEL_CONFIGS[`${from}-${to}`];
}

export function isModelAvailable(from: string, to: string): boolean {
  return getModelConfig(from, to) !== undefined;
}

export function getDownloadSize(config: ModelConfig): number {
  return config.encoderSize + config.decoderSize;
}
