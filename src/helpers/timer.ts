// src/helpers/timer.ts
// Funções de formatação de timer - NOVAIX FITNESS

export function formatTime(seconds: number): string {
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatTimeShort(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface CircleConstants {
  SIZE: number;
  STROKE: number;
  RADIUS: number;
  CIRCUMFERENCE: number;
}

export const CIRCLE_CONSTANTS: CircleConstants = {
  SIZE: 200,
  STROKE: 8,
  get RADIUS() { return (this.SIZE - this.STROKE) / 2; },
  get CIRCUMFERENCE() { return 2 * Math.PI * this.RADIUS; },
};
