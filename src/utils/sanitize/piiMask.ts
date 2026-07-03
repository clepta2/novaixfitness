// src/utils/piiMask.ts
// Utilitários para mascaramento de dados pessoais (PII)

/**
 * Mascara CPF: 123.456.789-00 → 123.***.***-00
 */
export function maskCPF(cpf: string): string {
  if (!cpf || cpf.length < 11) return cpf;
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return `${clean.slice(0, 3)}.***.***-${clean.slice(9)}`;
}

/**
 * Mascara email: joao@exemplo.com → j***@exemplo.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `***@${domain}`;
  return `${local[0]}***@${domain}`;
}

/**
 * Mascara telefone: (11) 99999-9999 → (11) 9****-9999
 */
export function maskPhone(phone: string): string {
  if (!phone) return phone;
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 10) return phone;

  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean[2]}****-${clean.slice(7)}`;
  }
  return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
}

/**
 * Mascara nome completo: João Silva → João S.
 */
export function maskName(name: string): string {
  if (!name) return name;
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

/**
 * Mascara cartão de crédito: 4111111111111111 → **** **** **** 1111
 */
export function maskCreditCard(card: string): string {
  if (!card) return card;
  const clean = card.replace(/\D/g, '');
  if (clean.length < 13) return card;
  return `**** **** **** ${clean.slice(-4)}`;
}

/**
 * Mascara PIX: qualquer valor → ****...***
 */
export function maskPIX(pix: string): string {
  if (!pix) return pix;
  if (pix.length <= 8) return '****';
  return `${pix.slice(0, 4)}...${pix.slice(-4)}`;
}

/**
 * Mascara endereço parcial: Rua Exemplo, 123 → Rua E***, ***
 */
export function maskAddress(address: string): string {
  if (!address) return address;
  const parts = address.split(',');
  if (parts.length < 2) {
    if (address.length > 8) return `${address.slice(0, 6)}***`;
    return address;
  }
  const street = parts[0].trim();
  const maskedStreet = street.length > 6 ? `${street.slice(0, 6)}***` : street;
  return `${maskedStreet}, ***`;
}

/**
 * Detecta e mascara automaticamente o tipo de PII
 */
export function autoMaskPII(value: string, type?: 'cpf' | 'email' | 'phone' | 'name' | 'card' | 'pix' | 'address'): string {
  if (!value) return value;

  if (type) {
    switch (type) {
      case 'cpf': return maskCPF(value);
      case 'email': return maskEmail(value);
      case 'phone': return maskPhone(value);
      case 'name': return maskName(value);
      case 'card': return maskCreditCard(value);
      case 'pix': return maskPIX(value);
      case 'address': return maskAddress(value);
    }
  }

  // Auto-detecção
  if (/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value.replace(/\D/g, ''))) {
    return maskCPF(value);
  }
  if (value.includes('@') && value.includes('.')) {
    return maskEmail(value);
  }
  if (/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(value.replace(/\D/g, ''))) {
    return maskPhone(value);
  }

  return value;
}