// src/security/encryptionAnon.ts
// Anonimizacao de dados

export function anonymizeEmail(email: string): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`;
}

export function anonymizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\d(?=\d{4})/g, '*');
}

export function anonymizeName(name: string): string {
  if (!name) return '';
  return name.charAt(0) + '*'.repeat(name.length - 1);
}

export function anonymizeCPF(cpf: string): string {
  if (!cpf) return '';
  return cpf.replace(/\d(?=\d{4})/g, '*');
}

export function anonymizeData(data: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  const anonymized = { ...data };
  for (const field of fields) {
    if (anonymized[field]) {
      const value = anonymized[field] as string;
      if (field.includes('email')) anonymized[field] = anonymizeEmail(value);
      else if (field.includes('phone')) anonymized[field] = anonymizePhone(value);
      else if (field.includes('name')) anonymized[field] = anonymizeName(value);
      else if (field.includes('cpf') || field.includes('ssn')) anonymized[field] = anonymizeCPF(value);
      else anonymized[field] = '***';
    }
  }
  return anonymized;
}
