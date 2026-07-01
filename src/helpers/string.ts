// src/helpers/string.ts
// Auxiliares de strings - NOVAIX FITNESS

export const normalizeText = (text: string): string => {
  return text
    ? text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : '';
};
