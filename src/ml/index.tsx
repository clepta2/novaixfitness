// src/ml/index.tsx
// Exportações centralizadas do sistema de tradução ONNX

export { TranslationProvider, useTranslationContext } from './TranslationContext';
export { useTranslation } from './useTranslation';
export { useDebouncedTranslate } from './useDebouncedTranslate';
export { TranslationEngine } from './TranslationEngine';
export {
  isModelCached,
  getCachedPaths,
  ensureModel,
  removeModel,
  cleanupOldModels,
} from './ModelManager';
export { getModelConfig, MODEL_CONFIGS } from './models-config';
export { SUPPORTED_LANGUAGES, getLanguageByCode } from './languages';
export {
  isLowPowerMode,
  getDebounceDelay,
  startBatteryMonitoring,
} from './batteryAware';
export { shouldBypass, splitSentences } from './Tokenizer';
