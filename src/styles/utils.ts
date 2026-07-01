// src/styles/utils.ts - Re-exports centralizados de estilos
// Subcategorias: cards.ts, buttons.ts, display.ts

export { cardStyles, containerStyles, overlayStyles, statCardStyles } from './cards';
export { buttonStyles, inputStyles, badgeStyles, chipStyles } from './buttons';
export {
  dividerStyles, avatarSizes, gradientPresets,
  listStyles, progressBarStyles, skeletonStyles,
} from './display';

// ─── Helper: merge styles safely ────────────────────────────
export function mergeStyles<T>(base: T, ...overrides: Partial<T>[]): T {
  return Object.assign({}, base, ...overrides) as T;
}
