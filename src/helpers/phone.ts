// src/helpers/phone.ts
// Validação e formatação de telefone - NOVAIX FITNESS

export function formatPhone(v: string): string {
  const c = v.replace(/\D/g, '').slice(0, 11);
  if (c.length <= 2) return c;
  if (c.length <= 7) return `(${c.slice(0, 2)}) ${c.slice(2)}`;
  return `(${c.slice(0, 2)}) ${c.slice(2, 7)}-${c.slice(7)}`;
}

export function validatePhone(p: string): boolean {
  const c = p.replace(/\D/g, '');
  return c.length === 10 || c.length === 11;
}
