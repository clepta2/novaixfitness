// src/ml/batteryAware.ts
// Detector de bateria para modo econômico

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

interface BatteryState {
  level: number; // 0-1
  isLowPowerMode: boolean;
}

let batteryState: BatteryState = { level: 1, isLowPowerMode: false };
let listeners: Array<(state: BatteryState) => void> = [];

// Verifica se está em modo econômico
export function isLowPowerMode(): boolean {
  return batteryState.isLowPowerMode || batteryState.level < 0.05;
}

// Retorna debounce delay baseado no estado da bateria
export function getDebounceDelay(): number {
  return isLowPowerMode() ? 500 : 250;
}

// Observa mudanças na bateria (plataforma específica)
export function startBatteryMonitoring(callback: (state: BatteryState) => void): () => void {
  listeners.push(callback);

  // Em produção, usar expo-battery ou módulo nativo
  // Por agora, simular com Battery API se disponível
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      batteryState = {
        level: battery.level,
        isLowPowerMode: battery.charging === false && battery.level < 0.2,
      };
      callback(batteryState);

      battery.addEventListener('levelchange', () => {
        batteryState.level = battery.level;
        batteryState.isLowPowerMode = battery.charging === false && battery.level < 0.2;
        listeners.forEach(l => l(batteryState));
      });
    });
  }

  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

// Estado atual da bateria
export function getBatteryState(): BatteryState {
  return batteryState;
}
