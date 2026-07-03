// src/utils/timingSafeEqual.ts
// Comparação de tempo constante (timing-safe) - NOVAIX FITNESS
// Previne timing attacks em comparações de strings sensíveis

/**
 * Converte hex string para array de bytes
 */
function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  return bytes;
}

/**
 * Compara duas strings hex de forma segura contra timing attacks
 * Tempo de execução é constante, independente de onde diferem
 * Usa apenas operações em strings (sem Buffer - compatível React Native)
 */
export function timingSafeEqual(
  a: string,
  b: string
): boolean {
  // Normalizar ambos para hex lowercase
  const normalizedA = a.toLowerCase();
  const normalizedB = b.toLowerCase();

  if (normalizedA.length !== normalizedB.length) {
    // Percorrer toda a string para manter tempo constante
    let result = 0;
    for (let i = 0; i < normalizedA.length; i++) {
      const charA = normalizedA.charCodeAt(i);
      const charB = normalizedB.charCodeAt(i % normalizedB.length);
      result |= charA ^ charB;
    }
    return false;
  }

  let result = 0;
  for (let i = 0; i < normalizedA.length; i++) {
    result |= normalizedA.charCodeAt(i) ^ normalizedB.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Compara strings de forma segura contra timing attacks
 */
export function timingSafeStringEqual(
  a: string,
  b: string
): boolean {
  return timingSafeEqual(a, b);
}

export { hexToBytes };
