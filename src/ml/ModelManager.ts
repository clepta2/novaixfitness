// src/ml/ModelManager.ts
// Download, cache, persistência e integridade de modelos MarianMT ONNX

import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModelConfig } from './models-config';

const META_KEY_PREFIX = '@novaix:model_meta:';
const CACHE_DIR = (FileSystem as any).documentDirectory + 'models/';

export interface ModelMeta {
  id: string;
  version: string;
  downloadedAt: string;
}

export interface CachedPaths {
  encoder: string;
  decoder: string;
  tokenizer: string;
}

async function ensureDirectory(path: string): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(path);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true } as any);
  }
}

function getPairDir(pairId: string): string {
  return `${CACHE_DIR}${pairId}/`;
}

function getFilePath(pairId: string, filename: string): string {
  return `${CACHE_DIR}${pairId}/${filename}`;
}

// Valida se arquivo existe e não está vazio
async function validateFile(path: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) return false;
  if (info.size === 0) {
    await FileSystem.deleteAsync(path, { idempotent: true });
    return false;
  }
  return true;
}

// Salva metadados
async function saveMeta(pairId: string, meta: ModelMeta): Promise<void> {
  await AsyncStorage.setItem(`${META_KEY_PREFIX}${pairId}`, JSON.stringify(meta));
}

// Verifica se todos os arquivos do par estão cacheados
export async function isModelCached(config: ModelConfig): Promise<boolean> {
  const encoderValid = await validateFile(getFilePath(config.id, 'encoder_model_quantized.onnx'));
  const decoderValid = await validateFile(getFilePath(config.id, 'decoder_model_quantized.onnx'));
  const tokenizerValid = await validateFile(getFilePath(config.id, 'tokenizer.json'));
  return encoderValid && decoderValid && tokenizerValid;
}

// Retorna caminhos dos arquivos cacheados
export function getCachedPaths(config: ModelConfig): CachedPaths {
  return {
    encoder: getFilePath(config.id, 'encoder_model_quantized.onnx'),
    decoder: getFilePath(config.id, 'decoder_model_quantized.onnx'),
    tokenizer: getFilePath(config.id, 'tokenizer.json'),
  };
}

// Baixa um arquivo com progresso
async function downloadFile(
  url: string,
  destPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const resumable = FileSystem.createDownloadResumable(
    url,
    destPath,
    {},
    (downloadProgress) => {
      if (onProgress) {
        onProgress(downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite);
      }
    }
  );
  const result = await resumable.downloadAsync();
  if (!result || result.status !== 200) {
    throw new Error(`Download falhou: ${result?.status}`);
  }
}

// Baixa modelo completo (encoder + decoder + tokenizer)
export async function ensureModel(
  config: ModelConfig,
  onProgress?: (progress: number) => void
): Promise<CachedPaths> {
  const pairDir = getPairDir(config.id);
  await ensureDirectory(pairDir);

  // Verificar se já está tudo baixado
  if (await isModelCached(config)) {
    if (__DEV__) console.log(`[ML] Modelo ${config.id} já cacheado`);
    return getCachedPaths(config);
  }

  const totalSize = config.encoderSize + config.decoderSize;
  let downloaded = 0;

  const updateProgress = (fileProgress: number) => {
    if (onProgress) {
      onProgress((downloaded + fileProgress) / totalSize);
    }
  };

  try {
    // Baixar encoder
    if (__DEV__) console.log(`[ML] Baixando encoder ${config.id}...`);
    const encoderPath = getFilePath(config.id, 'encoder_model_quantized.onnx');
    if (!(await validateFile(encoderPath))) {
      await downloadFile(config.encoderUrl, encoderPath, updateProgress);
    }
    downloaded += config.encoderSize;

    // Baixar decoder
    if (__DEV__) console.log(`[ML] Baixando decoder ${config.id}...`);
    const decoderPath = getFilePath(config.id, 'decoder_model_quantized.onnx');
    if (!(await validateFile(decoderPath))) {
      await downloadFile(config.decoderUrl, decoderPath, updateProgress);
    }
    downloaded += config.decoderSize;

    // Baixar tokenizer
    if (__DEV__) console.log(`[ML] Baixando tokenizer ${config.id}...`);
    const tokenizerPath = getFilePath(config.id, 'tokenizer.json');
    if (!(await validateFile(tokenizerPath))) {
      await downloadFile(config.tokenizerUrl, tokenizerPath);
    }

    // Salvar metadados
    await saveMeta(config.id, {
      id: config.id,
      version: config.version,
      downloadedAt: new Date().toISOString(),
    });

    if (__DEV__) console.log(`[ML] Modelo ${config.id} baixado com sucesso`);
    return getCachedPaths(config);
  } catch (error) {
    // Limpar arquivos incompletos
    await FileSystem.deleteAsync(pairDir, { idempotent: true });
    throw error;
  }
}

// Remove modelo do cache
export async function removeModel(pairId: string): Promise<void> {
  const pairDir = getPairDir(pairId);
  await FileSystem.deleteAsync(pairDir, { idempotent: true });
  await AsyncStorage.removeItem(`${META_KEY_PREFIX}${pairId}`);
  if (__DEV__) console.log(`[ML] Modelo ${pairId} removido`);
}

// Coletor de lixo
export async function cleanupOldModels(activePairIds: string[]): Promise<void> {
  try {
    await ensureDirectory(CACHE_DIR);
    const dirs = await FileSystem.readDirectoryAsync(CACHE_DIR);

    for (const dir of dirs) {
      if (!activePairIds.includes(dir)) {
        if (__DEV__) console.log(`[ML] Removendo modelo inativo: ${dir}`);
        await removeModel(dir);
      }
    }
  } catch (e) {
    if (__DEV__) console.error('[ML] Erro no coletor de lixo:', e);
  }
}
