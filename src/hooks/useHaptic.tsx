// src/hooks/useHaptic.ts
// ============================================================
// HOOK: useHaptic
// TIPO: Haptic feedback padronizado
// USO: Adicionar feedback tatico em acoes importantes
// REGRAS: Usar em completar treino, salvar, deletar, favoritar
// ============================================================

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { tryIf } from '../utils/tryIf';

/**
 * Hook para haptic feedback padronizado.
 *
 * Tipos de feedback:
 * - `light` - Selecao simples (toque em card, toggle)
 * - `medium` - Acao confirmada (completar treino, salvar)
 * - `heavy` - Acao importante (deletar, erro)
 * - `success` - Operacao bem sucedida
 * - `warning` - Aviso
 * - `error` - Erro
 *
 * @example
 * ```tsx
 * const { trigger } = useHaptic();
 *
 * <TouchableOpacity onPress={() => {
 *   completeExercise();
 *   trigger('success');
 * }}>
 * ```
 *
 * @example
 * ```tsx
 * // Com verificacao de plataforma
 * const { trigger } = useHaptic();
 * // Automaticamente ignora no web
 * ```
 */
export function useHaptic() {
  const trigger = useCallback(async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (Platform.OS === 'web') return;

    await tryIf(async () => {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    }, { retries: 1, baseDelay: 500 });
    // Haptic feedback e opcional - nao falhar se dispositivo nao suportar
  }, []);

  return { trigger };
}
