// src/services/paymentSecurity.ts
// Tokenizacao segura de cartao - Regras 106-110 - NOVAIX FITNESS
// Os dados do cartao NUNCA entram no backend (PCI-DSS compliance)

import { tryIf } from '../../utils/tryIf';

interface CardData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
}

interface PaymentToken {
  token: string;
  cardBrand: string;
  lastFourDigits: string;
  expiresAt: number;
  fingerprint: string;
}

interface TokenValidationResult {
  valid: boolean;
  reason?: string;
  customerId?: string;
}

const TOKEN_EXPIRY_MS = 30 * 60 * 1000;
const ASAAS_TOKENIZATION_URL =
  process.env.ASAAS_ENV === 'sandbox'
    ? 'https://sandbox.asaas.com/v2/paymentMethods'
    : 'https://api.asaas.com/v2/paymentMethods';

// Regra 106: Tokenizacao via SDK Asaas - cartao NUNCA toca o backend
// O frontend envia cardData direto para Asaas, recebe token, e so o token vai ao backend
export async function tokenizeCard(cardData: CardData): Promise<PaymentToken | null> {
  const result = await tryIf(async () => {
    const response = await fetch(ASAAS_TOKENIZATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ASAAS_API_KEY}`,
      },
      body: JSON.stringify({
        creditCard: {
          number: cardData.cardNumber,
          holderName: cardData.cardHolderName,
          expiryMonth: cardData.expirationMonth,
          expiryYear: cardData.expirationYear,
          ccv: cardData.cvv,
        },
      }),
    });

    if (!response.ok) throw new Error('Falha na tokenizacao');

    const data = await response.json();
    return {
      token: data.creditCardToken || data.id || '',
      cardBrand: data.creditCard?.brand || 'UNKNOWN',
      lastFourDigits: cardData.cardNumber.slice(-4),
      expiresAt: Date.now() + TOKEN_EXPIRY_MS,
      fingerprint: data.creditCard?.fingerprint || '',
    };
  }, { retries: 1, baseDelay: 1000 });

  return result.ok ? result.data! : null;
}

// Regra 107: Validacao cega - verifica se o token pertence ao customer
export async function validatePaymentToken(
  token: string,
  customerId: string
): Promise<TokenValidationResult> {
  const result = await tryIf(async () => {
    const response = await fetch(
      `${ASAAS_TOKENIZATION_URL}/creditCards/${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASAAS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return { valid: false, reason: 'Token invalido ou expirado' };
    }

    const data = await response.json();
    const tokenCustomerId = data.customerId || data.customer?.id;
    if (tokenCustomerId && tokenCustomerId !== customerId) {
      return { valid: false, reason: 'Token nao pertence ao cliente', customerId: tokenCustomerId };
    }

    return { valid: true, customerId };
  }, { retries: 1, baseDelay: 500 });

  return result.ok ? result.data! : { valid: false, reason: 'Erro na validacao' };
}

// Verifica se o token ainda e valido (nao expirou)
export function isTokenValid(token: PaymentToken): boolean {
  return Date.now() < token.expiresAt;
}

// Formata dados do token para envio ao backend (sem dados sensiveis)
export function sanitizeTokenForBackend(token: PaymentToken): {
  creditCardToken: string;
  lastFour: string;
  brand: string;
} {
  return {
    creditCardToken: token.token,
    lastFour: token.lastFourDigits,
    brand: token.cardBrand,
  };
}
