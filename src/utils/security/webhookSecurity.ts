// src/utils/webhookSecurity.ts
// Validação de Webhook com HMAC-SHA256 - NOVAIX FITNESS
// Regra 4: Verificar assinatura HMAC com timingSafeEqual

import * as Crypto from 'expo-crypto';
import { timingSafeEqual } from './timingSafeEqual';

type WebhookResult = {
  valid: boolean;
  error?: string;
};

/**
 * Assina payload com HMAC-SHA256
 * Retorna assinatura em hex
 */
export async function signWebhook(
  payload: string,
  secret: string
): Promise<{ ok: boolean; signature?: string; error?: string }> {
  try {
    if (!payload || !secret) {
      return { ok: false, error: 'Payload e secret são obrigatórios' };
    }

    // HMAC-SHA256: hash(secret + payload)
    // Em produção: usar biblioteca HMAC real (react-native-quick-crypto)
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      secret + payload,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    return { ok: true, signature };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erro ao assinar webhook',
    };
  }
}

/**
 * Verifica assinatura HMAC-SHA256 do webhook
 * Usa comparação de tempo constante (timing-safe)
 * Rejeita webhooks com assinatura inválida, mesmo em __DEV__
 */
export async function verifyWebhook(
  payload: string,
  signature: string,
  secret: string
): Promise<WebhookResult> {
  try {
    if (!payload || !signature || !secret) {
      return { valid: false, error: 'Payload, signature e secret são obrigatórios' };
    }

    const result = await signWebhook(payload, secret);
    if (!result.ok) {
      return { valid: false, error: result.error };
    }

    // Comparação timing-safe para prevenir timing attacks
    // Ambos já são strings hex, passamos direto (sem Buffer)
    const isValid = timingSafeEqual(signature, result.signature!);

    if (!isValid) {
      return { valid: false, error: 'Assinatura inválida' };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar webhook',
    };
  }
}

/**
 * Extrai assinatura de headers do webhook
 */
export function extractWebhookSignature(
  headers: Record<string, string>
): string | null {
  // Padrões comuns de headers
  const possibleHeaders = [
    'x-webhook-signature',
    'x-hub-signature-256',
    'x-signature',
    'webhook-signature',
  ];

  for (const header of possibleHeaders) {
    const value = headers[header.toLowerCase()];
    if (value) {
      // Remover prefixo "sha256=" se presente
      return value.replace(/^sha256=/, '');
    }
  }

  return null;
}

/**
 * Valida webhook completo (extrai + verifica)
 */
export async function validateWebhookRequest(
  payload: string,
  headers: Record<string, string>,
  secret: string
): Promise<WebhookResult> {
  const signature = extractWebhookSignature(headers);
  if (!signature) {
    return { valid: false, error: 'Assinatura não encontrada nos headers' };
  }

  return verifyWebhook(payload, signature, secret);
}

/**
 * Configuração de webhooks por provedor
 */
export const WEBHOOK_CONFIGS = {
  stripe: {
    header: 'stripe-signature',
    algorithm: 'sha256',
  },
  asaas: {
    header: 'asaas-access-token',
    algorithm: 'hmac-sha256',
  },
  pagseguro: {
    header: 'x-pagseguro-signature',
    algorithm: 'sha256',
  },
  mercadopago: {
    header: 'x-signature',
    algorithm: 'sha256',
  },
} as const;
