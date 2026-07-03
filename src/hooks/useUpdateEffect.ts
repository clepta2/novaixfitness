// src/hooks/useUpdateEffect.ts
// Hook para efeito que executa apenas em updates - NOVAIX FITNESS

import { useEffect, useRef } from 'react';

/**
 * Hook que executa o efeito apenas em updates (não na montagem)
 * Útil para efeitos que não devem rodar na primeira renderização
 */
export function useUpdateEffect(
  effect: () => void | (() => void),
  deps: any[]
): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    return effect();
  }, deps);
}

export default useUpdateEffect;
