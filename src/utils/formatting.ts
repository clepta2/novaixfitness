// src/utils/formatting.ts
// Funções de formatação - NOVAIX FITNESS

/**
 * Formata número com separadores de milhar
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formata moeda brasileira
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formata peso
 */
export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'kg'): string {
  return `${weight.toFixed(1)} ${unit}`;
}

/**
 * Formata altura
 */
export function formatHeight(heightCm: number): string {
  const meters = Math.floor(heightCm / 100);
  const cm = heightCm % 100;
  return `${meters},${cm.toString().padStart(2, '0')}m`;
}

/**
 * Formata tempo em segundos para MM:SS ou HH:MM:SS
 */
export function formatTimer(seconds: number): string {
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formata duração em minutos para texto legível
 */
export function formatDurationText(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

/**
 * Trunca texto com reticências
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Gera iniciais de um nome
 */
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * Formata data relativa (há X minutos, ontem, etc.)
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
  return `${Math.floor(diffDays / 30)}m`;
}
