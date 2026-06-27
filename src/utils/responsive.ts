// src/utils/responsive.ts
// Utilitários de responsividade para escalonamento dinâmico em múltiplos dispositivos

import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 375px é a largura de design de referência (ex: iPhone 11/12/13/14 base)
const BASE_WIDTH = 375;

const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
// Clampa o fator de escala para evitar layouts absurdamente gigantes em tablets
// ou minúsculos em aparelhos de tela muito pequena (ex: iPhone SE)
const clampedScaleFactor = Math.min(Math.max(scaleFactor, 0.85), 1.2);

/**
 * Escala um tamanho com base na largura da tela atual
 * @param size Tamanho original de design
 */
export function scale(size: number): number {
  return Math.round(size * clampedScaleFactor);
}
