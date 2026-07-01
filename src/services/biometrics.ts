// src/services/biometrics.js
// Autenticacao biometrica (Face ID, impressao digital)

import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricsAvailable() {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return { available: compatible && enrolled, compatible, enrolled };
  } catch (err) {
    return { available: false, error: (err as Error).message };
  }
}

export async function authenticateWithBiometrics(reason = 'Autentique-se para continuar') {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
      fallbackLabel: 'Usar senha',
    });
    return { success: result.success, error: (result as any).error, biometricType: (result as any).authenticationType };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function requireBiometricsForAction(action: string, reason?: string) {
  const { available } = await isBiometricsAvailable();
  if (!available) return { required: false, available: false };
  const result = await authenticateWithBiometrics(reason || `Confirme para ${action}`);
  return { required: true, ...result };
}
